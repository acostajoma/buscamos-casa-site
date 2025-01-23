import { CLOUDINARY_API_SECRET } from '$env/dynamic/private';
import { sha1 } from '@oslojs/crypto/sha1';

export const getCloudinarySignature = (paramsToSign: Cloudinary.ParamsToSign) => {
	const paramString = Object.keys(paramsToSign)
		.sort()
		.map((key) => `${key}=${paramsToSign[key as keyof Cloudinary.ParamsToSign]}`)
		.join('&');

	const stringToSign = `${paramString}${CLOUDINARY_API_SECRET}`;
	const hashedString = sha1(new TextEncoder().encode(stringToSign));
	const signature = Array.from(new Uint8Array(hashedString))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	return signature;
};
