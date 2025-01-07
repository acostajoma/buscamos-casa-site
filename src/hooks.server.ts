import { dev } from '$app/environment';
import * as auth from '$lib/server/auth.js';
import { getDB } from '$lib/server/db';
import { onlyLoggedIn, onlyLoggedOut } from '$lib/utils/constants';
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

const urlGuard: Handle = async ({ event, resolve }) => {
	const {
		url: { pathname }
	} = event;
	const { user } = event.locals;
	if (onlyLoggedIn.has(pathname) && !user) {
		redirect(302, '/inicia-sesion');
	}
	if (onlyLoggedOut.has(pathname) && user) {
		redirect(302, '/');
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleAuth, urlGuard);
