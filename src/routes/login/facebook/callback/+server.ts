import {
	createSession,
	generateSessionToken,
	facebook,
	setSessionTokenCookie,
	generateUserId
} from '$lib/server/auth';
import * as table from '$lib/server/db/schema';

import { error, type RequestEvent } from '@sveltejs/kit';
import { type OAuth2Tokens, OAuth2RequestError, ArcticFetchError  } from 'arctic';
import { eq } from 'drizzle-orm';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('facebook_oauth_state') ?? null;
	if (code === null || state === null || storedState === null) {
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
		tokens = await facebook.validateAuthorizationCode(code);
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
		return new Response(null, {
			status: 400
		});
	}
	
	let user;
	try {
		const accessToken = tokens.accessToken()
		const url = new URL("https://graph.facebook.com/me");
		url.searchParams.set("access_token", accessToken);
		url.searchParams.set("fields", ["id", "name", "picture", "email"].join(","));
		const response = await fetch(url);
		user = await response.json() as Auth.FacebookUserPayload;
	} catch (e) {
		console.error(e)
		return new Response(null, {
			status: 400
		});
	}

	const {id: facebookUserId, email} = user
	const { db } = event.locals;
	try {
		const existingUser = await db
			.select()
			.from(table.user)
			.where(eq(table.user.facebookId, facebookUserId));
		
		
		if (existingUser && existingUser.length > 0) {
			const {id : existingUserId } = existingUser[0]
			const sessionToken = generateSessionToken();
			const session = await createSession(db, sessionToken, existingUserId);
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
			.values({ id: newUserId, facebookId: facebookUserId, email })
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