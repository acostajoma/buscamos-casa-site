export type PropertyTypes = 'Casa' | 'Apartamento' | 'Lote' | 'Oficina' | 'Bodega' | 'Finca';
export const propertyTypes: [PropertyTypes, ...PropertyTypes[]] = [
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

export type Currencies = 'Colón' | 'Dólar';
export const currencies: [Currencies, ...Currencies[]] = ['Colón', 'Dólar'];
