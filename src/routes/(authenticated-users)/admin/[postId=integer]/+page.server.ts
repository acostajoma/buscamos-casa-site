import { property } from '$lib/server/db/schema';
import { getOnePost, isAdmin } from '$lib/server/utils/postsUtils';
import type { ListingStates } from '$lib/utils/postConstants';
import { error, redirect } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad, RequestEvent } from './$types';

/*
 * This is a protected route, only users with the 'admin' role can access it
 * Validation is performed in the layout load function, so no need to check it here
 */
export const load: PageServerLoad = async ({ params, locals }) => {
	const { db } = locals;
	const { postId } = params;
	const post = await getOnePost(db, parseInt(postId));
	// We don't want to see post on states: 'Borrador', 'Publicado','Vendido','Alquilado'
	// const deniedAccessStates: ListingStates[] = ['Borrador', 'Publicado', 'Vendido', 'Alquilado'];

	if (!post) {
		error(404, 'Publicación no encontrada');
	}

	return {
		post
	};
};

const postAction = async ({ locals, params }: RequestEvent, listingStatus: ListingStates) => {
	/**
	 * Validate if the user is an admin
	 * If the user is not an admin, the function will throw an error page
	 */
	if (!(await isAdmin(locals))) {
		error(404, 'La Página no existe');
	}

	const { db } = locals;
	const { postId } = params;

	const response: D1Response = await db
		.update(property)
		.set({
			listingStatus,
			updatedAt: sql`(current_timestamp)`
		})
		.where(eq(property.id, parseInt(postId)));

	if (response.error || !response.success) {
		error(500, 'Error al aceptar la publicación');
	}

	redirect(301, '/admin');
};

export const actions: Actions = {
	accept: async (event) => await postAction(event, 'Publicado'),
	reject: async (event) => await postAction(event, 'Denegado')
} satisfies Actions;
