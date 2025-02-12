import { getPosts } from '$lib/server/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const { db } = locals;
	const { searchParams } = url;
	const pageNumber = searchParams.get('page');
	const { postCount, posts } = await getPosts(db, pageNumber);
	return { postCount, posts };
};
