import { getPosts } from '$lib/server/utils';
import type { PageServerLoad } from './$types';

/*
 * This is a protected route, only users with the 'admin' role can access it
 * Validation is performed in the layout load function, so no need to check it here
 */
export const load: PageServerLoad = async ({ locals }) => {
	const { db } = locals;

	const posts = await getPosts({ db, pageNumber: 1, role: 'admin' });
	return { ...posts };
};
