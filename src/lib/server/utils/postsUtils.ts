import type { Feature, Location } from '$lib/server/db/schema';
import { property, saleType, type Property } from '$lib/server/db/schema';
import { getPropertyForm } from '$lib/utils/forms';
import { type ListingStates } from '$lib/utils/postConstants';
import { createFeaturesSchema, locationSchema, propertySchema } from '$lib/validation/post';
import { error, fail, redirect, type Action } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const getAllFeatures = async (locals: App.Locals) => {
	const { cache, db } = locals;
	let allFeatures: Feature[];
	const cacheKey = 'crear-publicacion:all-property-features';
	const cachedFeatures = await cache.get(cacheKey);
	if (cachedFeatures) {
		allFeatures = JSON.parse(cachedFeatures);
	} else {
		allFeatures = await db.query.feature.findMany({});
		if (!allFeatures || allFeatures.length === 0) {
			error(500, 'Error al obtener las características de la propiedad');
		}
		await cache.put(cacheKey, JSON.stringify(allFeatures), { expirationTtl: 36000 });
	}

	return allFeatures;
};

export const getSuperFormFeatureSchema = async (featureData: {
	allFeatures: string[];
	request?: Request;
	data?: string[];
}) => {
	const { allFeatures, request, data } = featureData;
	return await superValidate(
		data ? { features: data } : request,
		zod(createFeaturesSchema(allFeatures))
	);
};

const getPropertyData = async (locals: App.Locals, params: { publicacion: string }) => {
	const { db } = locals;
	return await db.query.property.findFirst({
		where: eq(property.id, Number(params.publicacion)),
		with: {
			saleType: { columns: { type: true } },
			propertiesWithConstruction: true,
			propertyFinancialDetails: true
		}
	});
};

export const getProperty = async (locals: App.Locals, params: { publicacion: string }) => {
	const newProperty = await getPropertyData(locals, params);

	if (!newProperty) {
		error(404, 'Publicación no encontrada');
	}
	if (newProperty.postOwnerId !== locals.user?.id) {
		error(403, 'No tienes permisos para editar esta publicación');
	}

	return newProperty;
};

type GetPropertyReturnedType = Awaited<ReturnType<typeof getProperty>>;

export const getPropertyPostOwnerId = async (
	locals: App.Locals,
	params: { publicacion: string }
) => {
	let ownerId: string | null | undefined = await locals.cache.get(
		`property:${params.publicacion}-ownerId`
	);
	if (ownerId) return ownerId;

	const postData = await locals.db.query.property.findFirst({
		where: eq(property.id, Number(params.publicacion)),
		columns: { postOwnerId: true }
	});

	ownerId = postData?.postOwnerId;

	if (!ownerId) {
		error(404, 'Publicación no encontrada');
	}
	await locals.cache.put(`property:${params.publicacion}-ownerId`, ownerId, {
		expirationTtl: 3600
	});
	return ownerId;
};

export const validatePropertyForm = async (
	locals: App.Locals,
	request?: Request,
	params?: { publicacion: string }
) => {
	const { user } = locals;
	if (params?.publicacion) {
		const newProperty = await getPropertyData(locals, params);
		validatePropertyOwnerAccess(user, newProperty);

		if (request) {
			const form = await superValidate(request, zod(propertySchema));
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

	return { form };
};

export const createProperty: Action = async ({ locals, request, params }) => {
	const { form } = await validatePropertyForm(locals, request);
	const { data } = form;
	const { db, user } = locals;

	if (!form.valid) {
		return fail(400, { form });
	}

	const values = {
		title: data.title,
		description: data.description,
		propertyType: data.propertyType,
		postOwnerId: user?.id as string, // user is guaranteed to be defined as per validatePropertyForm function checks if user exists
		listingStatus: 'Borrador' as ListingStates,
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
				size: data.size,
				listingStatus: 'Borrador'
			}
		})
		.returning();

	const errorMessage = `Error al ${params?.publicacion ? 'actualizar' : 'crear'} la publicación`;

	if (!newProperty) {
		error(500, errorMessage);
	}

	const saleTypes = data.saleType.map((type) => ({
		propertyId: newProperty.id,
		type: type
	}));

	/**
	 * Deletes sale types associated with the property.
	 * Note: Using individual delete instead of batch/transaction because:
	 * 1. Transactions are not supported by Cloudflare D1 yet
	 * 2. Avoiding batch operations to prevent race conditions where multiple
	 *    operations could interfere with each other
	 */
	const deleteSaleTypes = await db.delete(saleType).where(eq(saleType.propertyId, newProperty.id));
	const result = await db.insert(saleType).values(saleTypes);

	if (!result.success || result?.error || !deleteSaleTypes.success || deleteSaleTypes?.error) {
		error(500, errorMessage);
	}

	redirect(302, `/crear-publicacion/${newProperty.id}/detalles-financieros`);
};

export const updateListingStatus = async (
	id: number,
	locals: App.Locals,
	listingStatus: ListingStates,
	prop: GetPropertyReturnedType | Property | Pick<Property, 'id' | 'listingStatus' | 'postOwnerId'>
) => {
	const { db } = locals;

	if (prop.listingStatus === 'Borrador' || prop.listingStatus === 'En Revision') return;

	const data = await db.update(property).set({ listingStatus }).where(eq(property.id, id));

	if (data?.error) {
		console.error(data.error);
		error(500, 'Ha ocurrido un error');
	}
};

/**
 * Validates if the current user has access to modify a property post.
 * This function performs three checks:
 * 1. If user is not logged in, redirects to login page
 * 2. If property data doesn't exist, throws 404 error
 * 3. If user is not the owner of the post, throws 403 error
 *
 * Note: When redirect() or error() is called, the execution stops and is handled by SvelteKit's error/redirect hooks
 */
export const validatePropertyOwnerAccess = (
	user: App.Locals['user'],
	propertyData?: { id: number; postOwnerId: string; [key: string]: unknown }
) => {
	if (!user) {
		redirect(302, '/inicia-sesion');
	}
	if (!propertyData) {
		error(404, 'Publicación no encontrada');
	}
	if (user.id !== propertyData.postOwnerId) {
		error(403, 'No tienes permisos para editar esta publicación');
	}
};

/**
 * Validates and processes a financial property form, handling both new submissions and existing property data.
 * @description
 * This function performs several operations:
 * 1. Retrieves the property using the provided parameters
 * 2. Validates if the current user has access to the property
 * 3. Generates a Zod schema based on the property type
 * 4. If a request is provided, validates the incoming form data
 * 5. If no request but existing property data exists, populates the form with stored data
 * 6. Returns an empty validated form if no existing data is found
 */
export async function validateFinancialPropertyForm(
	locals: App.Locals,
	params: { publicacion: string },
	request?: Request
) {
	const newProperty = await getProperty(locals, params);
	validatePropertyOwnerAccess(locals.user, newProperty);

	const zodSchema = getPropertyForm(newProperty);
	if (request) {
		return { property: newProperty, form: await superValidate(request, zodSchema) };
	}
	if (newProperty.propertiesWithConstruction || newProperty.propertyFinancialDetails) {
		const populateForm = {
			...newProperty.propertyFinancialDetails,
			// conditionally spread propertiesWithConstruction if it exists and the property is not a 'Lote' or 'Finca'
			...(newProperty.propertiesWithConstruction && // must exist
				newProperty.propertyType !== 'Lote' && // not a 'Lote'
				newProperty.propertyType !== 'Finca' && // nor 'Finca'
				newProperty.propertiesWithConstruction) // value to spread
		};
		const form = await superValidate(populateForm, zodSchema);
		return { property: newProperty, form };
	}

	return { property: newProperty, form: await superValidate(zodSchema) };
}

export async function validateLocation(
	locals: App.Locals,
	params: { publicacion: string },
	request?: Request
) {
	const { db, user } = locals;

	const propertyData = await db.query.property.findFirst({
		where: eq(property.id, Number(params.publicacion)),
		columns: { id: true, postOwnerId: true },
		with: {
			location: true
		}
	});

	validatePropertyOwnerAccess(user, propertyData);
	const { location: propertyLocation } = propertyData as Pick<Property, 'postOwnerId' | 'id'> & {
		location: Location;
	};

	if (request) {
		return { form: await superValidate(request, zod(locationSchema)) };
	}
	if (propertyLocation) {
		return { form: await superValidate(propertyLocation, zod(locationSchema)) };
	}

	return { form: await superValidate(zod(locationSchema)) };
}
