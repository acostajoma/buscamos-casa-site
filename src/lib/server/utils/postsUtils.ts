import type { Feature, Location } from '$lib/server/db/schema';
import {
	photo,
	property,
	propertyFinancialDetails,
	userRoles,
	type Property
} from '$lib/server/db/schema';
import { getPropertyForm } from '$lib/utils/forms';
import { type Currencies, type ListingStates, type PropertyTypes } from '$lib/utils/postConstants';
import { createFeaturesSchema, locationSchema, propertySchema } from '$lib/validation/post';
import { error, fail, redirect, type Action } from '@sveltejs/kit';
import { and, asc, eq, gt, lt, or } from 'drizzle-orm';
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

type GetPropertyPostOwnerIdReturnType<T extends true | false> = T extends false
	? string
	: { ownerId: string; listingStatus: ListingStates };

export async function getPropertyPostOwnerId<T extends true | false>(
	locals: App.Locals,
	params: { publicacion: string },
	requireListingStatus: T = false as T
): Promise<GetPropertyPostOwnerIdReturnType<T>> {
	let ownerId: string | null | undefined = await locals.cache.get(
		`property:${params.publicacion}-ownerId`
	);
	if (ownerId && requireListingStatus === false) {
		return ownerId as GetPropertyPostOwnerIdReturnType<T>;
	}

	const postData = await locals.db.query.property.findFirst({
		where: eq(property.id, Number(params.publicacion)),
		columns: { postOwnerId: true, listingStatus: true }
	});

	ownerId = postData?.postOwnerId;

	if (!ownerId) {
		error(404, 'Publicación no encontrada');
	}
	await locals.cache.put(`property:${params.publicacion}-ownerId`, ownerId, {
		expirationTtl: 3600
	});

	if (requireListingStatus) {
		return {
			ownerId,
			listingStatus: postData?.listingStatus
		} as GetPropertyPostOwnerIdReturnType<T>;
	}
	return ownerId as GetPropertyPostOwnerIdReturnType<T>;
}

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
			isForSale: newProperty?.isForSale,
			isForRent: newProperty?.isForRent,
			isRentToBuy: newProperty?.isRentToBuy
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

	const values: Partial<Property> = {
		title: data.title,
		description: data.description,
		propertyType: data.propertyType as PropertyTypes,
		postOwnerId: user?.id as string, // user is guaranteed to be defined as per validatePropertyForm function checks if user exists
		listingStatus: 'Borrador' as ListingStates,
		size: data.size,
		id: params?.publicacion ? Number(params.publicacion) : undefined,
		isForRent: data.isForRent,
		isForSale: data.isForSale,
		isRentToBuy: data.isRentToBuy
	};
	const [newProperty] = await db
		.insert(property)
		.values(values as Property)
		.onConflictDoUpdate({
			target: [property.id],
			set: {
				title: data.title,
				description: data.description,
				propertyType: data.propertyType as PropertyTypes,
				size: data.size,
				listingStatus: 'Borrador',
				isForRent: data.isForRent,
				isForSale: data.isForSale,
				isRentToBuy: data.isRentToBuy
			}
		})
		.returning();

	const errorMessage = `Error al ${params?.publicacion ? 'actualizar' : 'crear'} la publicación`;

	if (!newProperty) {
		error(500, errorMessage);
	}

	redirect(302, `/crear-publicacion/${newProperty.id}/detalles-adicionales`);
};

export const updateListingStatus = async (
	id: number,
	locals: App.Locals,
	listingStatus: ListingStates,
	prop: GetPropertyReturnedType | Property | Pick<Property, 'id' | 'listingStatus' | 'postOwnerId'>
) => {
	const { db } = locals;

	if (
		listingStatus === prop.listingStatus &&
		(prop.listingStatus === 'Borrador' || prop.listingStatus === 'En Revision')
	) {
		return;
	}

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

export async function getOnePost(db: App.Locals['db'], postId: number) {
	return await db.query.property.findFirst({
		where: eq(property.id, postId),
		with: {
			sellerInformation: {
				with: {
					agentOrBroker: {
						columns: {
							imageAlt: true,
							imageId: true,
							instagramUserName: true
						}
					}
				}
			},
			location: true,
			photos: {
				orderBy: asc(photo.order),
				columns: {
					order: true,
					id: true
				}
			},
			propertiesWithConstruction: true,
			propertyFeatures: {
				columns: {
					featureId: false,
					propertyId: false
				},
				with: {
					feature: {
						columns: {
							name: true
						}
					}
				}
			},
			propertyFinancialDetails: true
		}
	});
}
export type PropertyWithAllData = Awaited<ReturnType<typeof getOnePost>>;

export async function isAdmin(locals: App.Locals) {
	const { user, db } = locals;
	if (!user) {
		return false;
	}

	const userRole = await db.query.userRoles.findFirst({
		where: eq(userRoles.userId, user.id)
	});

	if (!userRole || userRole.role !== 'admin') {
		return false;
	}

	return true;
}

export function getTypeAndPriceFilters(
	currency: Currencies,
	range: { min: number; max: number },
	dollarToColon: number,
	saleType: 'Sale' | 'Rent' // | 'RentToBuy' wiil be the same value as Rent
) {
	const financialPrice = saleType === 'Sale' ? 'salePrice' : 'rentPrice';

	const isColon = currency === 'Colón';
	const colonMin = isColon ? range.min : range.min * dollarToColon;
	const colonMax = isColon ? range.max : range.max * dollarToColon;
	const dollarMin = isColon ? range.min / dollarToColon : range.min;
	const dollarMax = isColon ? range.max / dollarToColon : range.max;

	return or(
		and(
			gt(propertyFinancialDetails[financialPrice], colonMin),
			lt(propertyFinancialDetails[financialPrice], colonMax),
			eq(propertyFinancialDetails.currency, 'Colón')
		),
		and(
			gt(propertyFinancialDetails[financialPrice], dollarMin),
			lt(propertyFinancialDetails[financialPrice], dollarMax),
			eq(propertyFinancialDetails.currency, 'Dólar')
		)
	);
}
