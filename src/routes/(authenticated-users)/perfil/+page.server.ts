import { userData, user as userTable } from '$lib/server/db/schema';
import { contactDataSchema } from '$lib/validation/post';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { parsePhoneNumberWithError } from 'svelte-tel-input';
import type { CountryCode } from 'svelte-tel-input/types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals: { user, db } }) => {
	if (!user) {
		redirect(302, '/inicia-sesion');
	}

	const userInformation = await db.query.user.findFirst({
		where: eq(userTable.id, user.id),
		columns: {
			id: true,
			email: true
		},
		with: {
			userData: true
		}
	});

	if (!userInformation) {
		redirect(302, '/inicia-sesion');
	}
	const userData: {
		email: string;
		phone?: string;
		countryCode?: string;
		name?: string;
	} = {
		email: userInformation.email
	};

	if (userInformation?.userData) {
		userData.phone = userInformation.userData.phoneNumber ?? undefined;
		userData.countryCode = userInformation.userData.countryCode ?? undefined;
		userData.name = userInformation.userData.name ?? undefined;
	}

	const form = await superValidate(userData, zod(contactDataSchema), { errors: false });

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		const { user, db } = locals;
		if (!user) {
			redirect(302, '/inicia-sesion');
		}
		const form = await superValidate(request, zod(contactDataSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { countryCode, phone, name } = form.data;
		const composedPhoneNumber = parsePhoneNumberWithError(phone, countryCode as CountryCode);
		const isValidPhone = composedPhoneNumber.isValid();
		if (!isValidPhone) {
			setError(form, 'phone', 'Número de teléfono inválido');
			return fail(400, { form });
		}
		const newUserData = {
			id: user.id,
			name,
			phoneNumber: phone,
			countryCode
		};
		const insertQueryResult: D1Response = await db
			.insert(userData)
			.values(newUserData)
			.onConflictDoUpdate({
				target: [userData.id],
				set: {
					name: newUserData.name,
					phoneNumber: newUserData.phoneNumber,
					countryCode: newUserData.countryCode
				}
			});
		if (!insertQueryResult.success || insertQueryResult?.error) {
			return fail(500, { error: 'Ha ocurrido un error' });
		}
		redirect(302, '/perfil/informacion-actualizada');
	}
} satisfies Actions;
