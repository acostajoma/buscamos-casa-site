import { getCloudinarySignature } from '$lib/server/utils';
import { allowedImageTypes, uploadPreset } from '$lib/utils/constants';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getProperty } from '../../pageUtils.server';
import { eq, asc } from 'drizzle-orm';
import { photo } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals, params }) => {
	const {user, db} = locals
	if (!user) {
		redirect(302, '/login');
	}
	const property = await getProperty(locals, params);
	if(!property)	{
		error(404, 'Publicación no encontrada');
	}
	if (property.postOwnerId !== user.id) {
		error(403, 'No tienes permisos para editar esta publicación');
	}
	const photos = await db.query.photo.findMany({
		where: eq(photo.propertyId, property.id),
		orderBy: asc(photo.order)
	});
	const timestamp = Math.floor(Date.now() / 1000).toString();
	const context = `user=${user.id}|post=${params.publicacion}`;
	const signature = getCloudinarySignature({
		context,
		timestamp,
		upload_preset: uploadPreset,
		allowed_formats: allowedImageTypes.join(',')
	});

	return { signature, timestamp, context, photos: photos.map(photo => ({key: photo.id, data: photo, state:'posted'})) };
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData);
	}
} satisfies Actions;
