import { dev } from '$app/environment';
import { ENVIRONMENT } from '$env/static/private';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import * as auth from '$lib/server/auth.js';
import { getDB } from '$lib/server/db';
import { handleErrorWithSentry, initCloudflareSentryHandle, sentryHandle } from '@sentry/sveltekit';
import { error, redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
	if (dev) {
		const { getPlatformProxy } = await import('wrangler');
		const proxiedPlatform = await getPlatformProxy({ persist: true });
		const mockedPlatform = { ...proxiedPlatform, context: proxiedPlatform.ctx, ctx: undefined };
		event.platform = mockedPlatform as unknown as App.Platform;
	}
	const { platform } = event;
	if (!platform) {
		error(500, { message: 'Ha ocurrido un error interno.' });
	}
	// Setting DB
	const { env } = platform as App.Platform;
	const db = getDB(env);
	event.locals.db = db;
	event.locals.cache = env.CACHE_KV;

	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(db, sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

const routeGuard: Handle = async ({ event, resolve }) => {
	const { route } = event;
	const { user } = event.locals;
	const isAuthenticatedRoute = route.id?.startsWith('/(authenticated-users)');
	const isNonAuthenticatedRoute = route.id?.startsWith('/(non-authenticated-users)');
	if (isAuthenticatedRoute && !user) {
		redirect(302, '/inicia-sesion');
	}
	if (isNonAuthenticatedRoute && user) {
		redirect(302, '/');
	}

	return resolve(event);
};

export const handle: Handle = sequence(
	initCloudflareSentryHandle({
		dsn: PUBLIC_SENTRY_DSN,
		tracesSampleRate: dev ? 0 : 0.2,
		environment: ENVIRONMENT,
		beforeSend(event, hint) {
			// Check if it's a 404 error.  We look at the exception and the request.
			const exception = event.exception?.values?.[0];

			if (
				exception &&
				exception.type === 'NotFoundError' && // Check for SvelteKit's NotFoundError
				event.request?.url
			) {
				// Check the response status code in the original request.  We do BOTH
				// checks because the way 404s are handled can differ slightly.
				if (hint?.originalException instanceof Response && hint.originalException.status === 404) {
					return null; // Drop the event
				}

				// Check if the exception message indicates a 404.
				//  We do this because sometimes originalException is not a Response.
				if (exception.value?.includes('404')) {
					return null;
				}
			}

			return event; // Send the event
		}
	}),
	sentryHandle(),
	handleAuth,
	routeGuard
);

export const handleError = handleErrorWithSentry(console.error);
