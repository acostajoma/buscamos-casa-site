import { getDataWithCloudflareCache } from '$lib/server/utils/dataFetcher';
import { getExclusiveVendors } from '$lib/server/utils/vendors';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { db }, url, platform, setHeaders }) => {
	const { exclusiveVendors } = await getDataWithCloudflareCache(
		url,
		{ exclusiveVendors: () => getExclusiveVendors(db) },
		platform
	);
	if (!exclusiveVendors) {
		error(500, 'Error al obtener los vendedores exclusivos');
	}
	setHeaders({ 'Cache-Control': 'public, max-age=300, s-maxage=300' });

	return { exclusiveVendors };
};
