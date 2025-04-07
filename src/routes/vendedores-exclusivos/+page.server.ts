import { getData } from '$lib/server/utils/dataFetcher';
import { getExclusiveVendors } from '$lib/server/utils/vendors';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { db, cache }, url }) => {
	const exclusiveVendors = await getData(url.pathname, () => getExclusiveVendors(db), cache);
	if (!exclusiveVendors) {
		error(500, 'Error al obtener los vendedores exclusivos');
	}
	return { exclusiveVendors };
};
