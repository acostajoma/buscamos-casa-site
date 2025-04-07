import { parsePhoneNumberWithError } from 'svelte-tel-input';
import type { CountryCode } from 'svelte-tel-input/types';

export function createWhatsAppLink(message: string, phoneNumber: string = '') {
	const encodedMessage = encodeURIComponent(message);
	return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

export function getFormattedPhoneNumber(phoneNumber?: string | null, countryCode?: string | null) {
	if (!phoneNumber || !countryCode) return null;
	const parsedPhoneNumber = parsePhoneNumberWithError(phoneNumber, countryCode as CountryCode);
	if (!parsedPhoneNumber.isValid) {
		return null;
	}
	return parsedPhoneNumber.countryCallingCode + parsedPhoneNumber.nationalNumber;
}
