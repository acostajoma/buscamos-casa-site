import { facebook } from '$lib/server/auth';
import { generateState } from 'arctic';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const scopes = ['email', 'public_profile'];
	const url = facebook.createAuthorizationURL(state, scopes);

	event.cookies.set('facebook_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: 'lax'
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}
