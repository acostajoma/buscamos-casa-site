import { getCloudinarySignature } from '$lib/server/utils';
import { allowedImageTypes, uploadPreset } from '$lib/utils/constants';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user }, params }) => {
	if (!user) {
		redirect(302, '/login');
	}
	const timestamp = Math.floor(Date.now() / 1000).toString();
	const context = `user=${user.id}|post=${params.publicacion}`;
	const signature = getCloudinarySignature({
		context,
		timestamp,
		upload_preset: uploadPreset,
		allowed_formats: allowedImageTypes.join(',')
	});
	return { signature, timestamp, context };
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData);
	}
} satisfies Actions;
