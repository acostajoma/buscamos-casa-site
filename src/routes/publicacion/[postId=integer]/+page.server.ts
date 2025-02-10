import { property } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { db } = locals;
	const post = await db.query.property.findFirst({
		where: eq(property.id, Number(params.postId)),
		with: {
			sellerInformation: true,
			location: true,
			photos: true,
			propertiesWithConstruction: true,
			propertyFeatures: true,
			propertyFinancialDetails: true,
			saleType: true
		}
	});
	if (!post) {
		error(404, 'Publicación no encontrada');
	}
	return {
		post
	};
};

// export const actions = {
// 	default: async ({  }) => {

// 	}
// } satisfies Actions;
