import { getDataWithCloudflareCache } from '$lib/server/utils/dataFetcher';
import { getOnePost } from '$lib/server/utils/postsUtils';

import type { ListingStates } from '$lib/utils/postConstants';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, setHeaders, url, platform }) => {
	const { db } = locals;
	const { postId } = params;

	const { postData: post } = await getDataWithCloudflareCache(
		url,
		{ postData: () => getOnePost(db, parseInt(postId)) },
		platform
	);

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

	setHeaders({ 'Cache-Control': 'private, max-age=300' });

	return {
		post
	};
};
