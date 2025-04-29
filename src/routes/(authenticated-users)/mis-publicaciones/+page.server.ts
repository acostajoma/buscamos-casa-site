import { getPosts } from '$lib/server/utils';
import { deleteProperty } from '$lib/server/utils/postsUtils';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { db } = locals;
	const posts = await getPosts({
		db,
		pageNumber: 1,
		role: 'owner',
		userId: locals.user?.id as string, // Guaranteed to be defined
		providedFilters: undefined
	});
	return { ...posts };
}) satisfies PageServerLoad;

export const actions: Actions = {
	delete: deleteProperty
};
