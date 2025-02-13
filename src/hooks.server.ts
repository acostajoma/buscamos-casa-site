import { dev } from '$app/environment';
import * as auth from '$lib/server/auth.js';
import { getDB } from '$lib/server/db';
import * as Sentry from '@sentry/cloudflare';
import { error, redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleInitSentry: Handle = async ({ event, resolve }) => {
	if (dev) {
		const { getPlatformProxy } = await import('wrangler');
		event.platform = (await getPlatformProxy()) as unknown as App.Platform;
	}
	const { platform } = event;

	if (!platform) {
		error(500, { message: 'Ha ocurrido un error interno.' });
	}
	return event.platform
		? Sentry.wrapRequestHandler(
				{
					options: {
						dsn: 'https://91e99e7f2e932483e521c8aa159affb3@o4508807636123648.ingest.us.sentry.io/4508807637696512',
						tracesSampleRate: 1.0
					},
					request: event.request as Request<unknown, IncomingRequestCfProperties<unknown>>,
					context: event.platform.ctx
				},
				() => resolve(event)
			)
		: resolve(event);
};

const handleAuth: Handle = async ({ event, resolve }) => {
	const { platform } = event;
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

export const handle: Handle = sequence(handleInitSentry, handleAuth, routeGuard);

export const handleError: HandleServerError = async ({ event, error, status, message }) => {
	const errorId = crypto.randomUUID();
	Sentry.captureException(error, {
		extra: { event, errorId, status }
	});
	return { message };
};
