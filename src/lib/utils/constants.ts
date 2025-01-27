export const imageCdnUrl = 'https://imagedelivery.net/FclsSzNEDEoQxelQsCA3Iw';

// Routes that are only accessible to logged in users
export const onlyLoggedIn = new Set([
	'/crear-publicacion',
	'/crear-publicacion/[publicacion=integer]',
	'/crear-publicacion/[publicacion=integer]/detalles-financieros',
	'/crear-publicacion/[publicacion=integer]/ubicacion',
	'/crear-publicacion/[publicacion=integer]/fotos',
	'/cerrar-sesion'
]);

// Routes that are only accessible to logged out users
export const onlyLoggedOut = new Set(['/inicia-sesion']);

export const allowedImageTypes = ['jpeg', 'jpg', 'png', 'avif', 'tiff', 'webp', 'heic'];
export const acceptedImageTypes = allowedImageTypes.map((type) => `image/${type}`).join(',');

export const uploadPreset = 'iod3ewpvyes';
