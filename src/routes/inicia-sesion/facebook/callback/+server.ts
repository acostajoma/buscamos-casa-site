import { createUserAndSession, getOAuthToken, setSessionIfUserExists } from '$lib/server/auth';

import { error, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const stateCookieName = 'facebook_oauth_state';

	const tokens = await getOAuthToken(event, 'Facebook', stateCookieName);

	if (!tokens) {
		return new Response(null, {
			status: 400
		});
	}

	let user;
	try {
		const accessToken = tokens.accessToken();
		const url = new URL('https://graph.facebook.com/me');
		url.searchParams.set('access_token', accessToken);
		url.searchParams.set('fields', ['id', 'name', 'picture', 'email'].join(','));
		const response = await fetch(url);
		user = (await response.json()) as Auth.FacebookUserPayload;
	} catch (e) {
		console.error(e);
		return new Response(null, {
			status: 400
		});
	}

	const { id: facebookUserId, email } = user;
	const { db } = event.locals;
	const { userExist } = await setSessionIfUserExists(event, db, 'Facebook', facebookUserId, email);

	if (userExist) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}

	const session = await createUserAndSession(event, db, 'Facebook', facebookUserId, email);

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
