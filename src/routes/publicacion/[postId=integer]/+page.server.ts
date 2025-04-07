import { getData } from '$lib/server/utils/dataFetcher';
import { getOnePost } from '$lib/server/utils/postsUtils';

import type { ListingStates } from '$lib/utils/postConstants';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, setHeaders, url }) => {
	const { db, cache } = locals;
	const { postId } = params;

	const post = await getData(url.pathname, () => getOnePost(db, parseInt(postId)), cache);

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

	setHeaders({ 'Cache-Control': 'public, max-age=300, s-maxage=300' });

	return {
		post
	};
};
