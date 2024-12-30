import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } from '$env/static/private';
import * as table from '$lib/server/db/schema';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase, encodeBase32LowerCase } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import { Google, Facebook,OAuth2RequestError, ArcticFetchError , type OAuth2Tokens } from 'arctic';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const DEV_GOOGLE_CALLBACK = 'http://localhost:5173/login/google/callback';
const DEV_FACEBOOK_CALLBACK = 'http://localhost:5173/login/facebook/callback';

export const sessionCookieName = 'auth-session';

export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, DEV_GOOGLE_CALLBACK);

export const facebook = new Facebook(FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, DEV_FACEBOOK_CALLBACK);

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(20));
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(db: DrizzleD1Database, token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(table.session).values(session);
	return session;
}

export async function validateSessionToken(db: DrizzleD1Database, token: string) {
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

export async function invalidateSession(db: DrizzleD1Database, sessionId: string) {
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

export async function validateOAuthParams(
	event: RequestEvent,
	stateCookieName: string,
	client: Facebook | Google, 
	codeVerifierCookieName?: string
) : Promise<OAuth2Tokens | null >{
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.url.searchParams.get(stateCookieName);
	let codeVerifier;

	if (codeVerifierCookieName)
	{
		codeVerifier = event.url.searchParams.get(codeVerifierCookieName);
	}	

	if ( !code  || !state || !storedState || (codeVerifierCookieName && !codeVerifier) ) {
		return null
	}

	try {
		if(client instanceof Google && codeVerifier){
			return await client.validateAuthorizationCode(code, codeVerifier);
		} else if(client instanceof Facebook ){
			return await client.validateAuthorizationCode(code);
		}

	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			// Invalid authorization code, credentials, or redirect URI
			const code = e.code;
			console.error('Invalid authorization code, credentials, or redirect URI', 'code: ', code)
		}
		
		if (e instanceof ArcticFetchError) {
			// Failed to call `fetch()`
			const cause = e.cause;
			console.error('Failed to call fetch()', cause)

		}
		console.error(e);
		}
		
		return null

}