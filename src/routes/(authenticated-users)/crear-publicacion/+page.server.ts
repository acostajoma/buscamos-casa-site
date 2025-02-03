import { createProperty, validatePropertyForm } from '$lib/server/utils/postsUtils';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	return await validatePropertyForm(locals);
}) satisfies PageServerLoad;

export const actions = {
	default: createProperty
} satisfies Actions;
