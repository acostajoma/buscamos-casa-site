import { getOAuthToken, setSessionIfUserExists } from '$lib/server/auth';
import { decodeIdToken } from 'arctic';

import { createUserAndSession } from '$lib/server/auth';
import { error, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const stateCookieName = 'google_oauth_state';
	const codeVerifierCookieName = 'google_code_verifier';
	const tokens = await getOAuthToken(event, 'Google', stateCookieName, codeVerifierCookieName);

	if (!tokens) {
		return new Response(null, {
			status: 400
		});
	}

	const claims = decodeIdToken(tokens.idToken()) as Auth.GoogleIdTokenPayload;
	const { sub: googleUserId, email } = claims;

	const { db } = event.locals;
	const { userExist } = await setSessionIfUserExists(event, db, 'Google', googleUserId);

	if (userExist) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}

	const session = await createUserAndSession(event, db, 'Google', googleUserId, email);

	if (session) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}
	error(500, 'An error has occurred');
}
