import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { photo } from '$lib/server/db/schema';
import { getProperty } from '../../pageUtils.server';

export const POST: RequestHandler = async ({ request, locals }) => {
	const requestData: {imageData: Cloudinary.Asset, params: { publicacion: string }, order: number} = await request.json();
	const {user, db} = locals;

	const property = await getProperty(locals, requestData.params);
	const {  public_id, delete_token } = requestData.imageData;

	if (!user) {
		error(401, 'No se ha iniciado sesión');
	}

	if (!property) {
		error(404, 'Publicación no encontrada');
	}

	if (user.id !== property.postOwnerId) {
		await fetch('https://api.cloudinary.com/v1_1/demo/delete_by_token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({ token: delete_token })
		});
		error(403, 'No tienes permisos para editar esta publicación');
	}

	const uploadImage = await db.insert(photo).values({id: public_id, propertyId: property.id, order: requestData.order});
	if (uploadImage?.error){
		error(500, 'Error al subir la imagen');
	}
	return json({success: true});
};
