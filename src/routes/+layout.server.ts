import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals: { session } }) => {
	return { loggedUser: session !== null };
}) satisfies LayoutServerLoad;
