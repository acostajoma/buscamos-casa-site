import { env } from '$env/dynamic/public';
import { photo } from '$lib/server/db/schema';
import { getCloudinarySignature } from '$lib/server/utils';
import { allowedImageTypes, uploadPreset } from '$lib/utils/constants';
import { error, redirect } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import { getProperty } from '../../pageUtils.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { user, db } = locals;
	if (!user) {
		redirect(302, '/login');
	}
	const property = await getProperty(locals, params);
	if (!property) {
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

	return {
		signature,
		timestamp,
		context,
		photos: photos.map((photo) => ({ key: photo.id, data: photo, state: 'posted' }))
	};
};

export const actions = {
	nose: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData);
	},
	delete: async ({ request, locals: { user, db } }): Promise<{ publicId: string }> => {
		const requestData = await request.formData();
		const publicId = requestData.get('publicId')?.toString();

		if (!publicId) {
			error(400, 'Ha ocurrido un error al borrar tu imagen');
		}

		const photoData = await db.query.photo.findFirst({
			where: eq(photo.id, publicId),
			with: {
				property: { columns: { postOwnerId: true } }
			}
		});

		if (photoData?.property?.postOwnerId !== user?.id) {
			error(403, 'No tienes permisos para borrar esta imagen');
		}

		const timestamp = Math.floor(Date.now() / 1000).toString();
		const signature = getCloudinarySignature({ timestamp, public_id: publicId });
		const formData = new FormData();
		formData.set('api_key', env.PUBLIC_CLOUDINARY_API_KEY);
		formData.set('timestamp', timestamp);
		formData.set('signature', signature);
		formData.set('public_id', publicId);
		const cloudinaryDeletePromise = fetch(
			`https://api.cloudinary.com/v1_1/${env.PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
			{
				method: 'POST',
				body: formData
			}
		);
		const dbDeletePromise = db.delete(photo).where(eq(photo.id, publicId));
		const [cloudinaryResponse, dbDeleteResponse] = await Promise.all([
			cloudinaryDeletePromise,
			dbDeletePromise
		]);

		if (!cloudinaryResponse.ok || !dbDeleteResponse?.success) {
			error(500, 'Error al borrar la imagen');
		}

		return { publicId };
	}
} satisfies Actions;
