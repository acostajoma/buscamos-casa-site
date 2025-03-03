import { getPosts } from '$lib/server/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, setHeaders }) => {
	const { db, cache } = locals;
	const cachedPosts = await cache.get(url.pathname, 'json');

	setHeaders({ 'Cache-Control': 'public, max-age=300' });
	if (cachedPosts) {
		return cachedPosts as Awaited<ReturnType<typeof getPosts>>;
	}
	const { postCount, posts } = await getPosts({ db });
	await cache.put(url.pathname, JSON.stringify({ postCount, posts }), { expirationTtl: 300 });
	return { postCount, posts };
};
