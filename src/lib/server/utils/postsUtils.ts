import type { Feature } from '$lib/server/db/schema';
import { createFeaturesSchema } from '$lib/validation/post';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const getFeatures = async (locals: App.Locals) => {
	const { cache, db } = locals;
	let allFeatures: Feature[];
	const cacheKey = 'crear-publicacion:all-property-features';
	const cachedFeatures = await cache.get(cacheKey);
	if (cachedFeatures) {
		allFeatures = JSON.parse(cachedFeatures);
	} else {
		allFeatures = await db.query.feature.findMany({});
		if (!allFeatures || allFeatures.length === 0) {
			error(500, 'Error al obtener las características de la propiedad');
		}
		await cache.put(cacheKey, JSON.stringify(allFeatures), { expirationTtl: 36000 });
	}

	return allFeatures;
};

export const getSuperFormFeatureSchema = async (featureData: {
	allFeatures: string[];
	request?: Request;
	data?: string[];
}) => {
	const { allFeatures, request, data } = featureData;
	return await superValidate(
		data ? { features: data } : request,
		zod(createFeaturesSchema(allFeatures))
	);
};
