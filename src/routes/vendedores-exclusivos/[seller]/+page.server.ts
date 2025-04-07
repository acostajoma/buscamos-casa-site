import { property } from '$lib/server/db/schema';
import { getPosts } from '$lib/server/utils';
import { getData } from '$lib/server/utils/dataFetcher';
import { getVendorId } from '$lib/server/utils/vendors';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { db, cache }, url, params }) => {
	const { seller } = params;
	const vendorId = await getData(url.pathname + ':vendor', () => getVendorId(db, seller), cache);
	if (!vendorId) error(404, 'Vendedor no encontrado');
	const posts = await getData(
		url.pathname,
		() =>
			getPosts({
				db,
				pageNumber: 1,
				providedFilters: [eq(property.postOwnerId, vendorId.userId)]
			}),
		cache
	);
	return { ...posts };
};
