import { photo } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import type { BatchItem } from 'drizzle-orm/batch';
import { getProperty, updateListingStatus } from '../../pageUtils.server';
import type { Actions, PageServerLoad } from './$types';

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

export const actions = {
	updatePhotoOrder: async ({ request, locals, params }) => {
		const { user, db } = locals;
		if (!user) {
			redirect(302, '/login');
		}
		const propertyData = await getProperty(locals, params);
		const postOwnerId = propertyData.postOwnerId;
		if (user.id !== postOwnerId) {
			error(403, 'No tienes permisos para editar esta publicación');
		}
		const formData = await request.formData();
		const photoString = formData.get('photos')?.toString();

		if (typeof photoString !== 'string') {
			return fail(400, { error: 'Fotografías inválidas' });
		}
		let photos: {
			key: string;
			order: number;
		}[];
		try {
			photos = JSON.parse(photoString);
		} catch (err) {
			console.error(err);
			error(400, 'Ha ocurrido un error con las fotografías');
		}

		const batchItems = photos.map((p) =>
			db.update(photo).set({ order: p.order }).where(eq(photo.id, p.key))
		) as unknown as [BatchItem<'sqlite'>, ...BatchItem<'sqlite'>[]];

		if (batchItems.length === 0) {
			return { message: 'Nothing to update.' };
		}
		const batchResponse: readonly D1Response[] = await db.batch(batchItems);

		if (batchResponse.some((item) => item?.error !== undefined)) {
			error(500, 'Ha ocurrido un error');
		}
		const postId = Number(params.publicacion);
		await updateListingStatus(postId, locals, 'En Revision', propertyData);
		return redirect(302, `/crear-publicacion/${postId}/publicacion-en-revision`);
	}
} satisfies Actions;
