import { isAdmin } from '$lib/server/utils/postsUtils';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!(await isAdmin(locals))) {
		error(404, 'La Página no existe');
	}
};
