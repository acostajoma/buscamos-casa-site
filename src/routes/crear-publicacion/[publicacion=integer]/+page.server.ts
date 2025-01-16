import { createProperty, validatePropertyForm } from '../pageUtils.server';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	return await validatePropertyForm(locals, undefined, params);
}) satisfies PageServerLoad;

export const actions = {
	default: createProperty
} satisfies Actions;
