import { getPosts } from '$lib/server/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const { db, cache } = locals;
	const cachedPosts = await cache.get(url.pathname, 'json');

	if (cachedPosts) {
		return cachedPosts;
	}
	const { postCount, posts } = await getPosts(db);
	await cache.put(url.pathname, JSON.stringify({ postCount, posts }), { expirationTtl: 60 });
	return { postCount, posts };
};
