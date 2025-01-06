import { postSchema } from '$lib/validation/post';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const form = await superValidate(zod(postSchema));
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	}
} satisfies Actions;
