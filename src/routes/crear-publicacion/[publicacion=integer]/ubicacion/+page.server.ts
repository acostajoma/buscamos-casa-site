import { location, property } from '$lib/server/db/schema';
import { locationSchema } from '$lib/validation/post';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

async function validateLocation(
	locals: App.Locals,
	params: { publicacion: string },
	request?: Request
) {
	const { db, user } = locals;
	const [propertyLocation, propertyId] = await db.batch([
		db.query.location.findFirst({
			where: eq(location.propertyId, Number(params.publicacion))
		}),
		db.query.property.findFirst({
			where: eq(property.id, Number(params.publicacion)),
			columns: {
				id: true,
				postOwnerId: true
			}
		})
	]);
	if (!propertyId) {
		error(404, 'Publicación no encontrada');
	}

	if (propertyId.postOwnerId !== user?.id) {
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
				propertyId: Number(publicacion),
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
		redirect(302, `/crear-publicacion/${publicacion}/fotos`);
	}
};
