import {
	createSession,
	generateSessionToken,
	google,
	setSessionTokenCookie
} from '$lib/server/auth';
import * as table from '$lib/server/db/schema';
import { decodeIdToken } from 'arctic';

import { encodeBase32LowerCase } from '@oslojs/encoding';
import { error, type RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { eq } from 'drizzle-orm';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		// Invalid code or client credentials
		console.error(e);
		return new Response(null, {
			status: 400
		});
	}
	const claims = decodeIdToken(tokens.idToken());
	const googleUserId = claims.sub;
	console.log(claims);
	// const username = claims.name;

	const { db } = event.locals;
	try {
		const [existingUser] = await db
			.select({
				user: table.user
			})
			.from(table.user)
			.where(eq(table.user.googleId, googleUserId));

		if (existingUser !== null) {
			const sessionToken = generateSessionToken();
			const session = await createSession(db, sessionToken, existingUser.user.id);
			setSessionTokenCookie(event, sessionToken, session.expiresAt);
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/'
				}
			});
		}
	} catch (e) {
		console.error(e);
		return error(500, { message: 'An error has occurred' });
	}

	const newUserId = generateUserId();

	try {
		const [user] = await db
			.insert(table.user)
			.values({ id: newUserId, googleId: googleUserId })
			.returning({ id: table.user.id });

		const sessionToken = generateSessionToken();
		const session = await createSession(db, sessionToken, user.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		console.error(e);
		return error(500, { message: 'An error has occurred' });
	}
}

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}
