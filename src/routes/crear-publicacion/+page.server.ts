import type { Actions, PageServerLoad } from './$types';
import { createProperty, validatePropertyForm } from './pageUtils.server';

export const load = (async ({ locals }) => {
	return await validatePropertyForm(locals);
}) satisfies PageServerLoad;

export const actions = {
	default: createProperty
} satisfies Actions;
