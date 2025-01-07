import { property, saleType } from '$lib/server/db/schema';
import { propertySchema } from '$lib/validation/post';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const form = await superValidate(zod(propertySchema));
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(propertySchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { user, db } = locals;
		if (!user) {
			return error(401, 'No se ha iniciado sesión');
		}

		const { data } = form;
		const [newProperty] = await db
			.insert(property)
			.values({
				title: form.data.title,
				description: form.data.description,
				propertyType: form.data.propertyType,
				postOwnerId: user.id,
				listingStatus: 'Borrador'
			})
			.returning({ id: property.id });

		await db.insert(saleType).values(
			data.saleType.map((type) => ({
				propertyId: newProperty.id,
				type: type
			}))
		);

		redirect(302, `/crear-publicacion/${newProperty.id}`);
	}
} satisfies Actions;
