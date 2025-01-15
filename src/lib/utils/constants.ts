export const imageCdnUrl = 'https://imagedelivery.net/FclsSzNEDEoQxelQsCA3Iw';

// Routes that are only accessible to logged in users
export const onlyLoggedIn = new Set([
	'/crear-publicacion',
	'/crear-publicacion/[publicacion=integer]'
]);

// Routes that are only accessible to logged out users
export const onlyLoggedOut = new Set(['/inicia-sesion']);
