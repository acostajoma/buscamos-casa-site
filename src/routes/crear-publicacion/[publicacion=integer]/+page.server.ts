import { property } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const newProperty = await locals.db
		.select({
			propertyType: property.propertyType
		})
		.from(property)
		.where(eq(property.id, Number(params.publicacion)));
	console.log(newProperty);
	return {};
}) satisfies PageServerLoad;
