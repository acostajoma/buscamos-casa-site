import { property, sellerInformation, user as userTable } from '$lib/server/db/schema';
import {
	getPropertyPostOwnerId,
	updateListingStatus,
	validatePropertyOwnerAccess
} from '$lib/server/utils/postsUtils';
import { contactDataSchema } from '$lib/validation/post';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { parsePhoneNumberWithError } from 'svelte-tel-input';
import type { CountryCode } from 'svelte-tel-input/types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params, locals: { user, db } }) => {
	if (!user) {
		redirect(302, '/inicia-sesion');
	}

	const [propertyData, userContactData] = await db.batch([
		db.query.property.findFirst({
			where: eq(property.id, Number(params.publicacion)),
			with: {
				sellerInformation: true
			},
			columns: {
				id: true,
				postOwnerId: true
			}
		}),
		db.query.user.findFirst({
			where: eq(userTable.id, user.id),
			with: {
				userData: true
			}
		})
	]);

	validatePropertyOwnerAccess(user, propertyData);

	const userDataObj: {
		email?: string;
		phone?: string;
		countryCode?: string;
		name?: string;
	} = {};

	if (propertyData?.sellerInformation) {
		const { name, phone, countryCode, email } = propertyData.sellerInformation;
		userDataObj.name = name ?? undefined;
		userDataObj.email = email ?? undefined;
		userDataObj.phone = phone ?? undefined;
		userDataObj.countryCode = countryCode ?? undefined;
	} else if (userContactData) {
		const { userData, email } = userContactData;
		userDataObj.email = email;
		userDataObj.name = userData?.name ?? undefined;
		userDataObj.phone = userData?.phoneNumber ?? undefined;
		userDataObj.countryCode = userData?.countryCode ?? undefined;
	}

	const form = await superValidate(userDataObj, zod(contactDataSchema), { errors: false });

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals, params }) => {
		const { user, db } = locals;
		const postOwnerData = await getPropertyPostOwnerId(locals, params, true);
		const propertyId = Number(params.publicacion);
		validatePropertyOwnerAccess(user, {
			postOwnerId: postOwnerData.ownerId,
			id: propertyId
		});
		const form = await superValidate(request, zod(contactDataSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { countryCode, phone, name, email } = form.data;
		const composedPhoneNumber = parsePhoneNumberWithError(phone, countryCode as CountryCode);
		const isValidPhone = composedPhoneNumber.isValid();
		if (!isValidPhone) {
			setError(form, 'phone', 'Número de teléfono inválido');
			return fail(400, { form });
		}

		const contactData = {
			propertyId,
			name,
			countryCode,
			email,
			phone
		};
		const insertQueryResult: D1Response = await db
			.insert(sellerInformation)
			.values(contactData)
			.onConflictDoUpdate({
				target: [sellerInformation.propertyId],
				set: contactData
			});
		if (!insertQueryResult.success || insertQueryResult?.error) {
			return fail(500, { error: 'Ha ocurrido un error' });
		}

		await updateListingStatus(propertyId, locals, 'En Revision', {
			postOwnerId: postOwnerData.ownerId,
			id: propertyId,
			listingStatus: postOwnerData.listingStatus
		});

		redirect(302, `/crear-publicacion/${propertyId}/publicacion-en-revision`);
	}
} satisfies Actions;
