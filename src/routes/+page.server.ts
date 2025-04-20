import { getPosts } from '$lib/server/utils';
import { getDataWithCloudflareCache } from '$lib/server/utils/dataFetcher';
import { getExclusiveVendors } from '$lib/server/utils/vendors';
import { searchSchema } from '$lib/validation/search';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, platform, setHeaders }) => {
	const { db } = locals;
	const form = await superValidate(zod(searchSchema));
	const getDataFunctions = {
		postsData: () => getPosts({ db }),
		exclusiveVendorsData: () => getExclusiveVendors(db)
	};
	const result = await getDataWithCloudflareCache(url, getDataFunctions, platform);
	const {
		exclusiveVendorsData,
		postsData: { postCount, posts }
	} = result;
	setHeaders({ 'Cache-Control': 'private, max-age=300' });
	return { postCount, posts, form, exclusiveVendors: exclusiveVendorsData };
};
