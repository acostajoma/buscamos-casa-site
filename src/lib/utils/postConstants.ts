export const propertyTypes: readonly [string, ...string[]] = [
	'Casa',
	'Apartamento',
	'Lote',
	'Oficina',
	'Bodega',
	'Finca'
];

export type ListingStates =
	| 'En Revision'
	| 'Publicado'
	| 'Denegado'
	| 'Vendido'
	| 'Alquilado'
	| 'Retirado'
	| 'Borrador'
	| 'Expirado'
	| 'Suspendido'
	| 'Requiere Correcciones';

export const listingStates: readonly [ListingStates, ...ListingStates[]] = [
	'En Revision',
	'Publicado',
	'Denegado',
	'Vendido',
	'Alquilado',
	'Retirado',
	'Borrador',
	'Expirado',
	'Suspendido',
	'Requiere Correcciones'
];

export const saleTypes: [string, ...string[]] = [
	'Venta',
	'Alquiler',
	'Alquiler con opción a compra'
];

export const currencies: [string, ...string[]] = ['Colon', 'Dólar'];
