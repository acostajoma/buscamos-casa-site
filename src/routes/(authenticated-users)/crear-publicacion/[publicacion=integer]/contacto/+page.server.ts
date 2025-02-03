import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	return {};
};

export const actions = {
	default: async ({}) => {}
} satisfies Actions;
