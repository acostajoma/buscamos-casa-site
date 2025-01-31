import {
	property,
	propertyFeature,
	type Property,
	type PropertyFeature
} from '$lib/server/db/schema.js';
import {
	getAllFeatures,
	getSuperFormFeatureSchema,
	updateListingStatus,
	validatePropertyOwnerAccess
} from '$lib/server/utils/postsUtils';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { and, eq, inArray } from 'drizzle-orm';

export const load = async ({ locals, params }) => {
	const { user, db } = locals;
	const [propertyIdAndFeatures, allPropertyFeatures] = await Promise.all([
		db.query.property.findFirst({
			where: eq(property.id, Number(params.publicacion)),
			with: {
				propertyFeatures: {
					columns: { featureId: true },
					with: { feature: { columns: { name: true } } }
				}
			},
			columns: { id: true, postOwnerId: true }
		}),
		getAllFeatures(locals)
	]);

	validatePropertyOwnerAccess(user, propertyIdAndFeatures);

	const { propertyFeatures } = propertyIdAndFeatures as PropertyIdAndFeatures;

	const propertyFeaturesNames = propertyFeatures.map((item) => item.feature.name);
	const allFeaturesNames = allPropertyFeatures.map((feature) => feature.name);

	const form = await getSuperFormFeatureSchema({
		allFeatures: propertyFeaturesNames,
		data: propertyFeaturesNames.length > 0 ? propertyFeaturesNames : undefined
	});
	return { form, allFeatures: allFeaturesNames };
};

export const actions: Actions = {
	/**
	 * Actions object containing form submission handler for property features.
	 * 1. Fetching the property data and all available features in parallel
	 * 2. Validating that the current user owns the property and has access to edit it, plus
	 * that the form is valid.
	 * 3. Processing form data to update property features:
	 *    - Creates a map of feature names to IDs
	 *    - Validates form input against schema
	 *    - Converts selected features to property-feature relationships
	 * 4. Performs database operations:
	 *    - Inserts new feature relationships
	 *    - Removes unselected feature relationships
	 * 5. Redirects to review page on success
	 */
	default: async ({ locals, request, params }) => {
		const { db, user } = locals;

		const [propertyData, allFeaturesData] = await Promise.all([
			db.query.property.findFirst({
				where: eq(property.id, Number(params.publicacion)),
				with: { propertyFeatures: true },
				columns: { id: true, postOwnerId: true, listingStatus: true }
			}),
			getAllFeatures(locals)
		]);

		validatePropertyOwnerAccess(user, propertyData);

		type PropertyData = Pick<Property, 'id' | 'postOwnerId' | 'listingStatus'> & {
			propertyFeatures: PropertyFeature[];
		};

		const { id: propertyId, propertyFeatures = [] } = propertyData as PropertyData;

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

		const featureItems = features?.reduce<PropertyFeature[]>((acc, feat) => {
			const id = featuresMap.get(feat);
			if (id !== undefined) {
				acc.push({ featureId: id, propertyId });
			}
			return acc;
		}, []);

		const promises: Promise<D1Result<unknown>>[] = [];
		let newFeatureIds: Set<number>;
		if (featureItems && featureItems.length > 0) {
			promises.push(locals.db.insert(propertyFeature).values(featureItems).onConflictDoNothing());
			newFeatureIds = new Set(featureItems.map((item) => item.featureId));
		}

		// Delete features that are not in the new selection
		if (propertyFeatures.length > 0) {
			const featureIdsToDelete = propertyFeatures.reduce<number[]>((acc, feat) => {
				if (!newFeatureIds?.has(feat.featureId)) {
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
								eq(propertyFeature.propertyId, propertyId),
								inArray(propertyFeature.featureId, featureIdsToDelete)
							)
						)
				);
			}
		}

		const dbPromises = await Promise.all(promises);
		const insertData = dbPromises[0];
		const deleteData = dbPromises[1];

		if (
			(insertData && (insertData?.error || !insertData.success)) ||
			(deleteData && (deleteData?.error || !deleteData.success))
		) {
			return fail(500, { error: 'Error al insertar las características de la propiedad' });
		}

		await updateListingStatus(propertyId, locals, 'En Revision', propertyData as PropertyData);
		redirect(302, `/crear-publicacion/${propertyId}/publicacion-en-revision`);
	}
};
