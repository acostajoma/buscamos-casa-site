import { getPosts } from '$lib/server/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const { db, cache } = locals;
	const { searchParams } = url;
	const pageNumber = searchParams.get('page');
	const cacheKey = url.pathname + url.search;
	const cachedPosts = await cache.get(cacheKey, 'json');
	if (cachedPosts) {
		return cachedPosts as { postCount: number; posts: Awaited<ReturnType<typeof getPosts>> };
	}
	const { postCount, posts } = await getPosts(db, pageNumber);
	await cache.put(cacheKey, JSON.stringify({ postCount, posts }), { expirationTtl: 60 });

	return { postCount, posts };
};
