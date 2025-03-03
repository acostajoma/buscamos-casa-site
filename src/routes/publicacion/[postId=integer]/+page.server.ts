import { getOnePost } from '$lib/server/utils/postsUtils';
import type { ListingStates } from '$lib/utils/postConstants';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, setHeaders, url }) => {
	const { db, cache } = locals;
	const { postId } = params;

	const cacheKey = url.pathname;
	const cachedPost = await cache.get(cacheKey, 'json');
	let post: Awaited<ReturnType<typeof getOnePost>>;

	if (cachedPost) {
		post = cachedPost as Awaited<ReturnType<typeof getOnePost>>;
	} else {
		post = await getOnePost(db, parseInt(postId));
		await cache.put(cacheKey, JSON.stringify(post), { expirationTtl: 300 });
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

	setHeaders({ 'Cache-Control': 'public, max-age=300' });

	return {
		post
	};
};
