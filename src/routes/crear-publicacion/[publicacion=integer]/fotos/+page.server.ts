import { photo, property, type Photo, type Property } from '$lib/server/db/schema';
import { updateListingStatus, validatePropertyOwnerAccess } from '$lib/server/utils/postsUtils';
import { error, fail, redirect } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import type { BatchItem } from 'drizzle-orm/batch';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad<{ photos: Cloudinary.Image[] }> = async ({ locals, params }) => {
	const { user, db } = locals;
	const propertyData = await db.query.property.findFirst({
		where: eq(property.id, Number(params.publicacion)),
		columns: { id: true, postOwnerId: true },
		with: {
			photos: {
				orderBy: asc(photo.order)
			}
		}
	});
	validatePropertyOwnerAccess(user, propertyData);

	const { photos } = propertyData as Pick<Property, 'postOwnerId' | 'id'> & { photos: Photo[] };

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
		const propertyData = await db.query.property.findFirst({
			where: eq(property.id, Number(params.publicacion)),
			columns: { id: true, postOwnerId: true, listingStatus: true }
		});
		validatePropertyOwnerAccess(user, propertyData);

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
			return fail(400, { error: 'Debes subir al menos una foto.' });
		}
		const postId = Number(params.publicacion);

		const [batchResponse]: [readonly D1Response[], void] = await Promise.all([
			db.batch(batchItems),
			updateListingStatus(
				postId,
				locals,
				'Borrador',
				propertyData as Pick<Property, 'id' | 'listingStatus' | 'postOwnerId'>
			)
		]);

		if (batchResponse.some((item) => item?.error !== undefined)) {
			error(500, 'Ha ocurrido un error');
		}

		return redirect(302, `/crear-publicacion/${postId}/caracteristicas`);
	}
} satisfies Actions;
