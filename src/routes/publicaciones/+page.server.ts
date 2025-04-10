import { location, property } from '$lib/server/db/schema';
import { getPosts } from '$lib/server/utils';
import { getData } from '$lib/server/utils/dataFetcher';
import { getTypeAndPriceFilters } from '$lib/server/utils/postsUtils';
import { getVendorId } from '$lib/server/utils/vendors';
import { maxAmountInDollars } from '$lib/utils/constants';
import type { Currencies } from '$lib/utils/postConstants';
import { searchSchema } from '$lib/validation/search';
import { error } from '@sveltejs/kit';
import type { SQL } from 'drizzle-orm';
import { eq, or } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, setHeaders }) => {
	const { db, cache } = locals;
	const { searchParams } = url;
	const cacheKey = url.pathname + url.search;

	const dollarToColon = 516;

	// Pagination
	const currentPage = searchParams.get('pag');

	//Exclusive Seller
	const exclusiveSellerName = searchParams.get('exclusiveSeller') || 'Todos';

	let exclusiveSellerId: string | undefined;

	if (exclusiveSellerName && exclusiveSellerName !== 'Todos') {
		const sellerData = await getData(
			cacheKey + ':vendor',
			() => getVendorId(db, exclusiveSellerName),
			cache
		);
		exclusiveSellerId = sellerData?.userId;
		if (!exclusiveSellerId) error(404, 'Vendedor no encontrado');
	}

	// Price range and currency
	const maxPrice = searchParams.get('maxPrice');
	const minPrice = searchParams.get('minPrice');
	const parsedMinPrice = minPrice ? Number(minPrice) : 0;
	const parsedMaxPrice = maxPrice ? Number(maxPrice) : maxAmountInDollars;

	const currency = searchParams.get('currency') || 'Dólar';

	// Location details
	const state = searchParams.get('state');
	const city = searchParams.get('city');
	const district = searchParams.get('district');

	// Property details
	const isForRent = searchParams.get('isForRent') === 'true';
	const isForSale = searchParams.get('isForSale') === 'true';
	const isRentToBuy = searchParams.get('isRentToBuy') === 'true';

	// const propertyTypesParam = searchParams.get('tipos');
	// const parsedPropertyTypes = propertyTypesParam ? propertyTypesParam?.split(',') : propertyTypes;

	const search = searchSchema.safeParse({
		minPrice: parsedMinPrice,
		maxPrice: parsedMaxPrice,
		currency,
		city,
		state,
		district,
		exclusiveSeller: exclusiveSellerName,
		isForRent,
		isForSale,
		isRentToBuy
	});

	if (!search.success) {
		let message = 'Error en la búsqueda.';
		for (const issue of search.error?.issues || []) {
			message = message + ' ' + issue.message + '.';
		}
		error(400, message);
	}

	const form = await superValidate(search.data, zod(searchSchema));

	const saleTypeFilter: (SQL<unknown> | undefined)[] = [];
	// if (isForSale) {
	// 	saleTypeFilter.push(eq(property.isForSale, true));
	// }
	if (isForRent) {
		saleTypeFilter.push(eq(property.isForRent, true));
	}
	if (isRentToBuy) {
		saleTypeFilter.push(eq(property.isRentToBuy, true));
	}

	const priceFilter: (SQL<unknown> | undefined)[] = [];
	if (isForSale) {
		saleTypeFilter.push(eq(property.isForSale, true));
		priceFilter.push(
			getTypeAndPriceFilters(
				(currency || 'Dólar') as Currencies,
				{ min: search.data.minPrice, max: search.data.maxPrice },
				dollarToColon,
				'Sale'
			)
		);
	} else if (isForRent || isRentToBuy) {
		priceFilter.push(
			getTypeAndPriceFilters(
				(currency || 'Dólar') as Currencies,
				{ min: search.data.minPrice, max: search.data.maxPrice },
				dollarToColon,
				'Rent'
			)
		);
		if (isRentToBuy) {
			saleTypeFilter.push(eq(property.isRentToBuy, true));
		}
		if (isForRent) {
			saleTypeFilter.push(eq(property.isForRent, true));
		}
	}

	const filters: (SQL<unknown> | undefined)[] = [
		saleTypeFilter.length > 0 ? or(...saleTypeFilter) : undefined,
		priceFilter.length > 0 ? or(...priceFilter) : undefined
	];

	if (state) {
		filters.push(eq(location.state, state));
	}

	if (city) {
		filters.push(eq(location.city, city));
	}

	if (district) {
		filters.push(eq(location.district, district));
	}

	if (exclusiveSellerId) {
		filters.push(eq(property.postOwnerId, exclusiveSellerId));
	}

	const postsData = await getData(
		cacheKey,
		() => getPosts({ db, pageNumber: currentPage, providedFilters: filters }),
		cache
	);
	const { postCount, posts, pageQuantity, currentPageNumber, limit: resultsPerPage } = postsData;
	setHeaders({ 'Cache-Control': 'public, max-age=300, s-maxage=300' });

	return { postCount, posts, form, pageQuantity, currentPageNumber, resultsPerPage };
};
