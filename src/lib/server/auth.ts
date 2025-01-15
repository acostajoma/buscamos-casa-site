import {
	FACEBOOK_CLIENT_ID,
	FACEBOOK_CLIENT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET
} from '$env/static/private';
import * as table from '$lib/server/db/schema';
import { sha256 } from '@oslojs/crypto/sha2';
import {
	encodeBase32LowerCase,
	encodeBase32LowerCaseNoPadding,
	encodeHexLowerCase
} from '@oslojs/encoding';
import { error, type RequestEvent } from '@sveltejs/kit';
import { ArcticFetchError, Facebook, Google, OAuth2RequestError, OAuth2Tokens } from 'arctic';
import { eq } from 'drizzle-orm';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const DEV_GOOGLE_CALLBACK = 'http://localhost:5173/inicia-sesion/google/callback';
const DEV_FACEBOOK_CALLBACK = 'http://localhost:5173/inicia-sesion/facebook/callback';

export const sessionCookieName = 'auth-session';

export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, DEV_GOOGLE_CALLBACK);

export const facebook = new Facebook(
	FACEBOOK_CLIENT_ID,
	FACEBOOK_CLIENT_SECRET,
	DEV_FACEBOOK_CALLBACK
);

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(20));
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(db: App.Locals['db'], token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(table.session).values(session);
	return session;
}

export async function validateSessionToken(db: App.Locals['db'], token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: { id: table.user.id },
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(db: App.Locals['db'], sessionId: string) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}

export function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

export async function getOAuthToken(
	event: RequestEvent,
	client: Auth.ClientNames,
	stateCookieName: string,
	codeVerifierCookieName?: string
): Promise<OAuth2Tokens | null> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get(stateCookieName) ?? null;
	let codeVerifier;

	if (codeVerifierCookieName) {
		codeVerifier = event.cookies.get(codeVerifierCookieName) ?? null;
	}

	if (!code || !state || !storedState || (codeVerifierCookieName && !codeVerifier)) {
		return null;
	}

	try {
		if (client === 'Google' && codeVerifier) {
			return await google.validateAuthorizationCode(code, codeVerifier);
		} else if (client === 'Facebook') {
			return await facebook.validateAuthorizationCode(code);
		}
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			// Invalid authorization code, credentials, or redirect URI
			const code = e.code;
			console.error(`Invalid authorization code, credentials, or redirect URI. Code: ${code}`);
		}

		if (e instanceof ArcticFetchError) {
			// Failed to call `fetch()`
			const cause = e.cause;
			console.error('Failed to call fetch()', cause);
		}
		console.error('Error', e);
		error(500, 'Ha ocurrido un error interno.');
	}
	return null;
}

export async function setSessionIfUserExists(
	event: RequestEvent,
	db: App.Locals['db'],
	client: Auth.ClientNames,
	clientUserId: string,
	email: string
): Promise<{ userExist: boolean }> {
	try {
		const existingUser = await db.select().from(table.user).where(eq(table.user.email, email));

		if (existingUser && existingUser.length > 0) {
			const { id: existingUserId, facebookId, googleId } = existingUser[0];

			if (client === 'Google' && !googleId) {
				await db
					.update(table.user)
					.set({ googleId: clientUserId })
					.where(eq(table.user.email, email));
			}
			if (client === 'Facebook' && !facebookId) {
				await db
					.update(table.user)
					.set({ facebookId: clientUserId })
					.where(eq(table.user.email, email));
			}
			if (
				(client === 'Facebook' && facebookId && clientUserId !== facebookId) ||
				(client === 'Google' && googleId && clientUserId !== googleId)
			) {
				throw new Error('El id del proveedor no coincide con el registrado.');
			}

			const sessionToken = generateSessionToken();
			const session = await createSession(db, sessionToken, existingUserId);
			setSessionTokenCookie(event, sessionToken, session.expiresAt);
			return { userExist: true };
		}
	} catch (e) {
		console.error(e);
		error(500, { message: 'An error has occurred' });
	}
	return { userExist: false };
}

export async function createUserAndSession(
	event: RequestEvent,
	db: App.Locals['db'],
	client: Auth.ClientNames,
	userClientId: string,
	email: string
): Promise<App.Locals['session'] | null> {
	try {
		const newUserId = generateUserId();
		const values = {
			id: newUserId,
			email,
			facebookId: client === 'Facebook' ? userClientId : null,
			googleId: client === 'Google' ? userClientId : null
		};
		const [user] = await db.insert(table.user).values(values).returning({ id: table.user.id });

		const sessionToken = generateSessionToken();
		const session = await createSession(db, sessionToken, user.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return session;
	} catch (e) {
		console.error(e);
		error(500, { message: 'An error has occurred' });
	}
}
