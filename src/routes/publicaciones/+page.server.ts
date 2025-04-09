import { location, property, propertyFinancialDetails } from '$lib/server/db/schema';
import { getPosts } from '$lib/server/utils';
import { getData } from '$lib/server/utils/dataFetcher';
import { getVendorId } from '$lib/server/utils/vendors';
import { maxNumberValue } from '$lib/utils/constants';
import type { Currencies } from '$lib/utils/postConstants';
import { searchSchema } from '$lib/validation/search';
import { error } from '@sveltejs/kit';
import { and, eq, gt, lt, or } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, setHeaders }) => {
	const { db, cache } = locals;
	const { searchParams } = url;
	const cacheKey = url.pathname + url.search;

	// const dollarToColon = 516;

	// Pagination
	const currentPage = searchParams.get('pag');

	//Exclusive Seller
	const exclusiveSellerName = searchParams.get('vendedor');

	let exclusiveSellerId: string | undefined;
	if (exclusiveSellerName) {
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
	const parsedMaxPrice = maxPrice ? Number(maxPrice) : maxNumberValue;

	const currency = searchParams.get('currency');

	// Location details
	const state = searchParams.get('state');
	const city = searchParams.get('city');
	const district = searchParams.get('district');

	// Property details
	const searchedSaleTypes = searchParams.getAll('saleType');
	// const propertyTypesParam = searchParams.get('tipos');
	// const parsedPropertyTypes = propertyTypesParam ? propertyTypesParam?.split(',') : propertyTypes;

	const search = searchSchema.safeParse({
		minPrice: parsedMinPrice,
		maxPrice: parsedMaxPrice,
		// propertyType: parsedPropertyTypes,
		saleType: searchedSaleTypes,
		currency,
		city,
		state,
		district,
		exclusiveSeller: exclusiveSellerId
	});

	if (!search.success) {
		let message = 'Error en la búsqueda.';
		for (const issue of search.error?.issues || []) {
			message = message + ' ' + issue.message + '.';
		}
		error(400, message);
	}

	const form = await superValidate(
		{
			state,
			district,
			city,
			minPrice: parsedMinPrice,
			maxPrice: parsedMaxPrice,
			currency
		},
		zod(searchSchema)
	);

	const filters = [
		or(
			and(
				gt(propertyFinancialDetails.salePrice, form.data.minPrice),
				lt(propertyFinancialDetails.salePrice, form.data.maxPrice)
			),
			and(
				gt(propertyFinancialDetails.rentPrice, form.data.minPrice),
				lt(propertyFinancialDetails.rentPrice, form.data.maxPrice)
			)
		)
	];

	if (currency) {
		filters.push(eq(propertyFinancialDetails.currency, currency as Currencies));
	}
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
