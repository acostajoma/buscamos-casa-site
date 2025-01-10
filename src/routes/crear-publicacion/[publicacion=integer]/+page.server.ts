import { property } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const { db, cache } = locals;

	const cachedProperty = await cache.get(`crear-publicacion:${params.publicacion}`);

	if (cachedProperty) {
		return { property: JSON.parse(cachedProperty) };
	}
	const newProperty = await db
		.select({
			propertyType: property.propertyType
		})
		.from(property)
		.where(eq(property.id, Number(params.publicacion)));
	console.log(newProperty);
	return { newProperty };
}) satisfies PageServerLoad;
