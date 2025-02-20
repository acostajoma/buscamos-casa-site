import { building, dev } from '$app/environment';
import * as auth from '$lib/server/auth.js';
import { getDB } from '$lib/server/db';
import { error, redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
	if (dev) {
		const { getPlatformProxy } = await import('wrangler');
		event.platform = (await getPlatformProxy()) as unknown as App.Platform;
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

export const handle: Handle = sequence(handleAuth, routeGuard);

export const handleError: HandleServerError = async ({ event, error, status, message }) => {
	if (!building) {
		const { platform, url, getClientAddress } = event;
		const {
			env: { LOGS_BUCKET: loggingBucket }
		} = platform as App.Platform;
		const errorId = crypto.randomUUID();
		const loggingData: Logging.Error = {
			error,
			status,
			message,
			url,
			clientAddress: await getClientAddress(),
			extra: {
				request: event.request,
				cf: event.platform?.cf,
				user: event.locals.user,
				userSession: event.locals.session
			}
		};
		await loggingBucket.put(`${errorId}`, JSON.stringify(loggingData));
		return { message };
	}
};
