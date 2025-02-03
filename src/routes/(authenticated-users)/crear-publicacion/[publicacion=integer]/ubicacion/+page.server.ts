import { location } from '$lib/server/db/schema';
import { getProperty, updateListingStatus, validateLocation } from '$lib/server/utils/postsUtils';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	return validateLocation(locals, params);
};

export const actions = {
	default: async ({ request, locals, params }) => {
		const { form } = await validateLocation(locals, params, request);
		if (!form.valid) {
			return form;
		}

		const { db } = locals;
		const { publicacion } = params;
		const propertyId = Number(publicacion);
		const { state, city, district, address, latitude, longitude } = form.data;

		const newLocation = await db
			.insert(location)
			.values({
				state,
				city,
				district,
				address,
				latitude,
				longitude,
				propertyId,
				country: 'Costa Rica'
			})
			.onConflictDoUpdate({
				target: [location.propertyId],
				set: {
					state,
					city,
					district,
					address,
					latitude,
					longitude
				}
			});

		if (!newLocation.success || newLocation.error) {
			error(500, 'Error al crear la ubicación');
		}
		const property = await getProperty(locals, params);
		await updateListingStatus(propertyId, locals, 'Borrador', property);
		redirect(302, `/crear-publicacion/${publicacion}/fotos`);
	}
};
