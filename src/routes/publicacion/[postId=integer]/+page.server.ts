import { property } from '$lib/server/db/schema';
import type { ListingStates } from '$lib/utils/postConstants';
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

	// Quick trick to set listing status to 'Publicado' for testing purposes
	// await db
	// 	.update(property)
	// 	.set({
	// 		listingStatus: 'Publicado'
	// 	})
	// 	.where(eq(property.id, Number(params.postId)));

	const deniedAccessStates: ListingStates[] = [
		'Borrador',
		'Denegado',
		'En Revision',
		'Requiere Correcciones',
		'Retirado',
		'Suspendido',
		'Expirado'
	];

	if (!post || (post && deniedAccessStates.includes(post.listingStatus))) {
		error(404, 'Publicación no encontrada');
	}

	if (post.listingStatus === 'Alquilado' || post.listingStatus === 'Vendido') {
		error(406, 'Esta propiedad ha sido marcada como vendida o alquilada.');
	}

	return {
		post
	};
};
