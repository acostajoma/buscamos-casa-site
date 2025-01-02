// routes/+page.server.ts
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

// export const load: PageServerLoad = async ({ }) => {
// 	// ...
// };

export const actions: Actions = {
	logout: async (event) => {
		const {
			locals: { session, db }
		} = event;
		if (session === null) {
			return fail(401);
		}
		await invalidateSession(db, session.id);
		deleteSessionTokenCookie(event);
		redirect(302, '/inicia-sesion');
	}
};
