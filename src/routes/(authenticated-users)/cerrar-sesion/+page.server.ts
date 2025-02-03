// routes/+page.server.ts
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth';
import { error, fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

// This route is only for the logout action
export const load: PageServerLoad = async () => {
	return error(404, 'La página no existe');
};

export const actions: Actions = {
	default: async (event) => {
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
