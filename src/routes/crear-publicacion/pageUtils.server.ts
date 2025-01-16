import { property, saleType } from '$lib/server/db/schema';
import { propertySchema } from '$lib/validation/post';
import { error, fail, redirect, type Action } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const validatePropertyForm = async (
	locals: App.Locals,
	request?: Request,
	params?: { publicacion: string }
) => {
	const { db } = locals;

	if (params?.publicacion) {
		const newProperty = await db.query.property.findFirst({
			where: eq(property.id, Number(params.publicacion)),
			with: {
				saleType: { columns: { type: true } },
				propertiesWithConstruction: true,
				propertyFinancialDetails: true
			}
		});
		if (!newProperty) {
			error(404, 'Publicación no encontrada');
		}
		if (newProperty.postOwnerId !== locals.user?.id) {
			error(403, 'No tienes permisos para editar esta publicación');
		}

		if (request) {
			const form = await superValidate(request, zod(propertySchema));
			if (!form.valid) {
				fail(400, { form });
			}
			return { form };
		}

		const formData = {
			title: newProperty?.title,
			description: newProperty?.description,
			propertyType: newProperty?.propertyType || undefined,
			size: newProperty?.size,
			saleType: newProperty?.saleType.map((st) => st.type) as [string, ...string[]]
		};

		return { form: await superValidate(formData, zod(propertySchema)) };
	}

	if (!params?.publicacion && !request) {
		return { form: await superValidate(zod(propertySchema)) };
	}
	// For !params?.publicacion && request
	const form = await superValidate(request, zod(propertySchema));
	if (!form.valid) {
		fail(400, { form });
	}
	return { form };
};

export const createProperty: Action = async ({ locals, request, params }) => {
	const { form } = await validatePropertyForm(locals, request);
	const { data } = form;
	const { db, user } = locals;

	if (!user) {
		error(401, 'No se ha iniciado sesión');
	}

	const values = {
		title: data.title,
		description: data.description,
		propertyType: data.propertyType,
		postOwnerId: user.id,
		listingStatus: 'Borrador',
		size: data.size,
		id: params?.publicacion ? Number(params.publicacion) : undefined
	};
	const [newProperty] = await db
		.insert(property)
		.values(values)
		.onConflictDoUpdate({
			target: [property.id],
			set: {
				title: data.title,
				description: data.description,
				propertyType: data.propertyType,
				size: data.size
			}
		})
		.returning();

	const errorMessage = `Error al ${params?.publicacion ? 'actualizar' : 'crear'} la publicación`;

	if (!newProperty) {
		error(500, errorMessage);
	}

	const result = await db.insert(saleType).values(
		data.saleType.map((type) => ({
			propertyId: newProperty.id,
			type: type
		}))
	);

	if (!result.success || result?.error) {
		error(500, errorMessage);
	}

	redirect(302, `/crear-publicacion/${newProperty.id}/detalles-financieros`);
};
