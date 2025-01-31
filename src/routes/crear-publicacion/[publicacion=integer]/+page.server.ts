import { createProperty, validatePropertyForm } from '$lib/server/utils/postsUtils';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	const propertyFormData = await validatePropertyForm(locals, undefined, params);
	if (!propertyFormData.form.valid) {
		return fail(400, propertyFormData);
	}
	return propertyFormData;
}) satisfies PageServerLoad;

export const actions = {
	default: createProperty
} satisfies Actions;
