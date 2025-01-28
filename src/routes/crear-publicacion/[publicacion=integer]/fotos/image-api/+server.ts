import { env } from '$env/dynamic/public';
import { photo } from '$lib/server/db/schema';
import { getCloudinarySignature } from '$lib/server/utils';
import { uploadPreset } from '$lib/utils/constants';
import { imageSchema } from '$lib/validation/post';
import { error, json } from '@sveltejs/kit';
import { count, eq } from 'drizzle-orm';
import { getPropertyPostOwnerId } from '../../../pageUtils.server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, params }) => {
	const { user, db } = locals;
	if (!user) {
		error(401, 'No se ha iniciado sesión');
	}
	const postOwnerId = await getPropertyPostOwnerId(locals, params);

	if (user.id !== postOwnerId) {
		error(403, 'No tienes permisos para editar esta publicación');
	}
	const requestData = await request.formData();
	const image = requestData.get('file');
	const order = requestData.get('order')?.toString();

	if (!image || !order) {
		return json({ state: 'error', data: 'Faltan datos' }, { status: 400 });
	}
	if (order && Number.isNaN(order)) {
		return json({ state: 'error', data: 'Orden inválido' }, { status: 400 });
	}
	const parsedOrder = parseInt(order);
	const imageData = { image, order: parsedOrder };
	const form = imageSchema.safeParse(imageData);
	if (!form.success) {
		return json({ state: 'error', data: 'Error al subir la imagen' }, { status: 400 });
	}
	const propertyId = parseInt(params.publicacion);
	const [propertyPhotos] = await db
		.select({ count: count() })
		.from(photo)
		.where(eq(photo.propertyId, propertyId));

	if (propertyPhotos.count >= 20) {
		return json({ state: 'error', data: 'No puedes subir más de 20 imágenes' }, { status: 400 });
	}

	const timestamp = Math.floor(Date.now() / 1000).toString();
	const context = `user=${user.id}|post=${propertyId}`;

	const signature = getCloudinarySignature({
		context,
		timestamp,
		upload_preset: uploadPreset
	});

	const formData = new FormData();
	formData.set('file', image);
	formData.set('api_key', env.PUBLIC_CLOUDINARY_API_KEY);
	formData.set('timestamp', timestamp);
	formData.set('context', context);
	formData.set('upload_preset', uploadPreset);
	formData.set('signature', signature);

	const response = await fetch(
		'https://api.cloudinary.com/v1_1/' + env.PUBLIC_CLOUDINARY_CLOUD_NAME + '/image/upload',
		{ method: 'POST', body: formData }
	);
	if (!response.ok) {
		console.error('Error al subir la imagen', response);
		return json({ state: 'error', data: 'Error al subir la imagen' }, { status: 500 });
	}

	const data: Cloudinary.AssetError | Cloudinary.Asset = await response.json();

	if ((data as Cloudinary.AssetError)?.error) {
		console.error('Error al subir la imagen', data);

		return json({ state: 'error', data: 'Error al subir la imagen' }, { status: 500 });
	}

	const photoData = {
		id: (data as Cloudinary.Asset).public_id,
		propertyId,
		order: parsedOrder
	};

	const uploadedImage = await db.insert(photo).values(photoData);

	if (uploadedImage?.error || !uploadedImage) {
		console.error('Error al subir la imagen', uploadedImage);
		const deleteToken = (data as Cloudinary.Asset).delete_token;
		const cloudinaryDelete = await fetch(
			`https://api.cloudinary.com/v1_1/${env.PUBLIC_CLOUDINARY_CLOUD_NAME}/delete_by_token`,
			{
				method: 'POST',
				body: new URLSearchParams({ token: deleteToken })
			}
		);
		if (!cloudinaryDelete.ok) {
			console.error('Error al borrar la imagen de Cloudinary');
		}
		return json({ state: 'error', data: 'Error al subir la imagen' }, { status: 500 });
	}

	return json({ state: 'successful', data: photoData });
};

export const DELETE: RequestHandler = async ({ request, locals, params }) => {
	const { user, db } = locals;

	if (!user) {
		return json({ state: 'error', data: 'No se ha iniciado sesión' }, { status: 401 });
	}
	const postOwnerId = await getPropertyPostOwnerId(locals, params);

	if (user.id !== postOwnerId) {
		return json(
			{ state: 'error', data: 'No tienes permisos para editar esta publicación' },
			{ status: 403 }
		);
	}
	const requestData: { publicId: string } = await request.json();
	const publicId = requestData?.publicId;

	if (!publicId) {
		return json({ state: 'error', data: 'Faltan datos para borrar la imagen' }, { status: 400 });
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
		return json({ state: 'error', data: 'Error al borrar la imagen' }, { status: 500 });
	}

	return json({ publicId }, { status: 200 });
};
