import { photo } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import { getProperty } from '../../pageUtils.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ photos: Cloudinary.Image[] }> = async ({ locals, params }) => {
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

	return {
		photos: photos.map((photo) => ({
			key: photo.id,
			data: photo,
			state: 'successful' as const
		}))
	};
};
