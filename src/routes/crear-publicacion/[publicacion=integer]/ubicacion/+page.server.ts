import { location } from '$lib/server/db/schema';
import { locationSchema } from '$lib/validation/post';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getProperty, updateListingStatus } from '../../pageUtils.server';
import type { PageServerLoad } from './$types';

async function validateLocation(
	locals: App.Locals,
	params: { publicacion: string },
	request?: Request
) {
	const { db, user } = locals;

	const locationPromise = db.query.location.findFirst({
		where: eq(location.propertyId, Number(params.publicacion))
	});
	const [property, propertyLocation] = await Promise.all([
		getProperty(locals, params),
		locationPromise
	]);

	if (!property) {
		error(404, 'Publicación no encontrada');
	}

	if (property.postOwnerId !== user?.id) {
		error(403, 'No tienes permisos para editar esta publicación');
	}

	if (request) {
		const form = await superValidate(request, zod(locationSchema));
		if (!form.valid) {
			fail(400, { form });
		}
		return { form };
	}
	if (propertyLocation) {
		return { form: await superValidate(propertyLocation, zod(locationSchema)) };
	}

	return { form: await superValidate(zod(locationSchema)) };
}

export const load: PageServerLoad = async ({ locals, params }) => {
	return validateLocation(locals, params);
};

export const actions = {
	default: async ({ request, locals, params }) => {
		const { form } = await validateLocation(locals, params, request);
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
