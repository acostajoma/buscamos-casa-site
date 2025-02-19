import { getPosts } from '$lib/server/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, setHeaders }) => {
	const { db, cache } = locals;
	const { searchParams } = url;
	const pageNumber = searchParams.get('page');
	const cacheKey = url.pathname + url.search;
	const cachedPosts = await cache.get(cacheKey, 'json');
	setHeaders({ 'Cache-Control': 'public, max-age=300' });
	if (cachedPosts) {
		return cachedPosts as { postCount: number; posts: Awaited<ReturnType<typeof getPosts>> };
	}
	const { postCount, posts } = await getPosts(db, pageNumber);
	await cache.put(cacheKey, JSON.stringify({ postCount, posts }), { expirationTtl: 300 });

	return { postCount, posts };
};
