import { getPosts } from '$lib/server/utils';
import { getData } from '$lib/server/utils/postsUtils';
import { searchSchema } from '$lib/validation/search';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, setHeaders }) => {
	const { db, cache } = locals;
	const form = await superValidate(zod(searchSchema));

	const postsData = await getData(url.pathname, () => getPosts({ db }), cache);

	const { postCount, posts } = postsData;
	setHeaders({ 'Cache-Control': 'public, max-age=300, s-maxage=300' });
	return { postCount, posts, form };
};
