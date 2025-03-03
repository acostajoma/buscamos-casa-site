import { getPosts } from '$lib/server/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { db } = locals;
	const posts = await getPosts({
		db,
		pageNumber: 1,
		role: 'owner',
		userId: locals.user?.id as string // Guaranteed to be defined
	});
	return { ...posts };
}) satisfies PageServerLoad;
