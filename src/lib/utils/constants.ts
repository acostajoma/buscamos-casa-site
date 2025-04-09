import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

export const imageCdnUrl = `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}`;

export const allowedImageTypes = ['jpeg', 'jpg', 'png', 'avif', 'tiff', 'webp', 'heic'];
export const acceptedImageTypes = allowedImageTypes.map((type) => `image/${type}`).join(',');

export const cloudinaryUrl = 'https://res.cloudinary.com/dldnvubae';

export const companyPhoneNumber = '50664674972';

export const companyMail = 'info@buscamos.casa';

export const maxNumberValue = 1000000000;
export const maxAmountInColones = 500000000;
export const maxAmountInDollars = 49999999;
