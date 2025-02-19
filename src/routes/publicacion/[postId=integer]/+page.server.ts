import { dev } from '$app/environment';
import { photo, property } from '$lib/server/db/schema';
import type { ListingStates } from '$lib/utils/postConstants';
import { error } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import type { PageServerLoad, RouteParams } from './$types';

async function getPosts(db: App.Locals['db'], params: RouteParams) {
	return await db.query.property.findFirst({
		where: eq(property.id, Number(params.postId)),
		with: {
			sellerInformation: true,
			location: true,
			photos: { orderBy: asc(photo.order) },
			propertiesWithConstruction: true,
			propertyFeatures: {
				with: {
					feature: true
				}
			},
			propertyFinancialDetails: true,
			saleType: true
		}
	});
}

export const load: PageServerLoad = async ({ params, locals, setHeaders, url }) => {
	const { db, cache } = locals;

	const cacheKey = url.pathname;
	const cachedPost = await cache.get(cacheKey, 'json');
	setHeaders({ 'Cache-Control': 'public, max-age=300' });
	if (cachedPost) {
		return cachedPost as Awaited<ReturnType<typeof getPosts>>;
	}

	const post = await getPosts(db, params);
	await cache.put(cacheKey, JSON.stringify(post), { expirationTtl: 300 });

	// Quick trick to set listing status to 'Publicado' for testing purposes
	if (dev) {
		await db
			.update(property)
			.set({
				listingStatus: 'Publicado'
			})
			.where(eq(property.id, Number(params.postId)));
	}

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
