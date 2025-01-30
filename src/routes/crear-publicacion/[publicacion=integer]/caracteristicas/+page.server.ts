import { property, propertyFeature, type PropertyFeature } from '$lib/server/db/schema.js';
import { getFeatures, getSuperFormFeatureSchema } from '$lib/server/utils/postsUtils';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { and, eq, inArray } from 'drizzle-orm';
import { getProperty } from '../../pageUtils.server';

export const load = async ({ locals, params }) => {
	const { user } = locals;
	if (!user) {
		redirect(302, '/login');
	}
	const property = await getProperty(locals, { publicacion: params.publicacion });
	if (!property) {
		error(404, 'Publicación no encontrada');
	}
	if (property.postOwnerId !== user.id) {
		error(403, 'No tienes permisos para editar esta publicación');
	}

	const propertyFeatures = await locals.db.query.propertyFeature.findMany({
		where: eq(propertyFeature.propertyId, property.id),
		with: { feature: { columns: { name: true } } },
		columns: { featureId: true }
	});

	const propertyFeaturesNames = propertyFeatures.map((feat) => feat.feature.name);

	const allFeaturesData = await getFeatures(locals);
	const allFeaturesName = allFeaturesData.map((feature) => feature.name);
	const form = await getSuperFormFeatureSchema({
		allFeatures: allFeaturesName,
		data: propertyFeaturesNames.length > 0 ? propertyFeaturesNames : undefined
	});
	return { form, allFeatures: allFeaturesName };
};

export const actions: Actions = {
	default: async ({ locals, request, params }) => {
		const { db, user } = locals;
		if (!user) {
			redirect(302, '/login');
		}
		const [propertyData, allFeaturesData] = await Promise.all([
			db.query.property.findFirst({
				where: eq(property.id, Number(params.publicacion)),
				with: { propertyFeatures: true },
				columns: { id: true, postOwnerId: true }
			}),
			getFeatures(locals)
		]);

		if (!propertyData) {
			error(404, 'Publicación no encontrada');
		}
		if (propertyData.postOwnerId !== user.id) {
			error(403, 'No tienes permisos para editar esta publicación');
		}
		const allFeaturesName: string[] = [];
		const featuresMap = new Map<string, number>();

		for (const feature of allFeaturesData) {
			allFeaturesName.push(feature.name);
			featuresMap.set(feature.name, feature.id);
		}

		const form = await getSuperFormFeatureSchema({ allFeatures: allFeaturesName, request });

		if (!form.valid) {
			return fail(400, { form });
		}

		const {
			data: { features }
		} = form;

		const featureItems = features.reduce<PropertyFeature[]>((acc, feat) => {
			const id = featuresMap.get(feat);
			if (id !== undefined) {
				acc.push({ featureId: id, propertyId: propertyData.id });
			}
			return acc;
		}, []);

		const promises: Promise<D1Result<unknown>>[] = [
			locals.db.insert(propertyFeature).values(featureItems).onConflictDoNothing()
		];

		const newFeatureIds = new Set(featureItems.map((item) => item.featureId));

		// Delete features that are not in the new selection
		const featureIdsToDelete = propertyData.propertyFeatures.reduce<number[]>((acc, feat) => {
			if (!newFeatureIds.has(feat.featureId)) {
				acc.push(feat.featureId);
			}
			return acc;
		}, []);

		if (featureIdsToDelete.length > 0) {
			promises.push(
				locals.db
					.delete(propertyFeature)
					.where(
						and(
							eq(propertyFeature.propertyId, propertyData.id),
							inArray(propertyFeature.featureId, featureIdsToDelete)
						)
					)
			);
		}

		const dbPromises = await Promise.all(promises);
		const insertData = dbPromises[0];
		const deleteData = dbPromises[1];

		if (
			insertData?.error ||
			!insertData.success ||
			(deleteData && (deleteData?.error || !deleteData.success))
		) {
			return fail(500, { error: 'Error al insertar las características de la propiedad' });
		}

		redirect(302, `/crear-publicacion/${propertyData.id}/publicacion-en-revision`);
	}
};
