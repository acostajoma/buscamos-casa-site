import { propertiesWithConstruction, propertyFinancialDetails } from '$lib/server/db/schema';
import { updateListingStatus, validateFinancialPropertyForm } from '$lib/server/utils/postsUtils';
import { createPropertyWithConstructionSchema } from '$lib/validation/post';
import { error, fail, redirect } from '@sveltejs/kit';
import type { BatchItem, BatchResponse } from 'drizzle-orm/batch';
import { type SuperValidated } from 'sveltekit-superforms';
import type { z } from 'zod';
import type { Actions, PageServerLoad } from '../$types';

type FormData = z.infer<ReturnType<typeof createPropertyWithConstructionSchema>>;

export const load = (async ({ params, locals }) => {
	return await validateFinancialPropertyForm(locals, params);
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, params, locals }) => {
		const { db } = locals;
		const { property, form } = await validateFinancialPropertyForm(locals, params, request);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form as SuperValidated<FormData>;

		const financialDetailsValues = {
			salePrice: data.salePrice,
			rentPrice: data.rentPrice,
			maintenanceCost: data.maintenanceCost,
			currency: data.currency
		};
		const propertyId = Number(params.publicacion);
		const batch: [BatchItem<'sqlite'>, ...BatchItem<'sqlite'>[]] = [
			db
				.insert(propertyFinancialDetails)
				.values({
					propertyId,
					...financialDetailsValues
				})
				.onConflictDoUpdate({
					target: [propertyFinancialDetails.propertyId],
					set: financialDetailsValues
				})
		];
		if (property.propertyType !== 'Lote' && property.propertyType !== 'Finca') {
			const constructionValues = {
				numBedrooms: data.numBedrooms,
				numBathrooms: data.numBathrooms,
				constructionSize: data.constructionSize,
				yearBuilt: data.yearBuilt,
				garageSpace: data.garageSpace
			};
			batch.push(
				db
					.insert(propertiesWithConstruction)
					.values({
						propertyId: Number(params.publicacion),
						...constructionValues
					})
					.onConflictDoUpdate({
						target: [propertiesWithConstruction.propertyId],
						set: constructionValues
					})
			);
		}
		const result: BatchResponse<BatchItem<'sqlite'>[]> = await db.batch(batch);

		if (result.length > 0 && result.some((r) => !r.success)) {
			console.error('ERROR: ', result);
			return error(500, 'Error al crear la publicación');
		}

		await updateListingStatus(propertyId, locals, 'Borrador', property);

		redirect(302, `/crear-publicacion/${params.publicacion}/ubicacion`);
	}
} satisfies Actions;
