import { dev } from '$app/environment';
import * as auth from '$lib/server/auth.js';
import { getDB } from '$lib/server/db';
import { error, redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
	if (dev) {
		const { getPlatformProxy } = await import('wrangler');
		event.platform = await getPlatformProxy();
	}
	const { platform } = event;

	if (!platform) {
		error(500, 'Ha ocurrido un error interno.');
	}

	// Setting DB
	const db = getDB(platform.env);
	event.locals.db = db;
	event.locals.cache = platform.env.CACHE_KV;

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
