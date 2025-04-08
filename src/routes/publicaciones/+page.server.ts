import { location } from '$lib/server/db/schema';
import { getPosts } from '$lib/server/utils';
import { getData } from '$lib/server/utils/dataFetcher';
import { searchSchema } from '$lib/validation/search';
import { error } from '@sveltejs/kit';
import type { SQL } from 'drizzle-orm';
import { eq } from 'drizzle-orm/mysql-core/expressions';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, setHeaders }) => {
	const { db, cache } = locals;
	const { searchParams } = url;

	// Pagination
	const currentPage = searchParams.get('pag');

	// Price range and currency
	// const maxPrice = searchParams.get('pmax');
	// const minPrice = searchParams.get('pmin');
	// const currency = searchParams.get('moneda');

	// Location details
	const state = searchParams.get('state');
	const city = searchParams.get('city');
	const district = searchParams.get('district');

	// Property details
	// const saleType = searchParams.get('t');
	// const propertyTypesParam = searchParams.get('tipos');
	// const parsedPropertyTypes = propertyTypesParam ? propertyTypesParam?.split(',') : propertyTypes;

	const search = searchSchema.safeParse({
		// price: { min: minPrice || 0, max: maxPrice || maxNumberValue },
		// propertyType: parsedPropertyTypes,
		// saleType,
		// currency,
		city,
		state,
		district
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
			city
		},
		zod(searchSchema)
	);

	const filters: SQL<unknown>[] = [];
	if (state) {
		filters.push(eq(location.state, state));
	}

	if (city) {
		filters.push(eq(location.city, city));
	}

	if (district) {
		filters.push(eq(location.district, district));
	}

	const cacheKey = url.pathname + url.search;
	const postsData = await getData(
		cacheKey,
		() => getPosts({ db, pageNumber: currentPage, providedFilters: filters }),
		cache
	);
	const { postCount, posts, pageQuantity, currentPageNumber, limit: resultsPerPage } = postsData;
	setHeaders({ 'Cache-Control': 'public, max-age=300, s-maxage=300' });

	return { postCount, posts, form, pageQuantity, currentPageNumber, resultsPerPage };
};
