import {
	createPropertyDetailsSchema,
	createPropertyWithConstructionSchema
} from '$lib/validation/post';
import { zod } from 'sveltekit-superforms/adapters';

type SaleType = { type: 'Venta' | 'Alquiler' | 'Alquiler con opción a compra' }[];

/**
 * Returns the appropriate form schema based on the property type.
 * If the property is not a 'Lote' or 'Finca', returns a schema that includes construction details.
 * Otherwise returns a basic property details schema.
 */
export function getPropertyForm(newProperty: {
	propertyType: string | null;
	saleType: { type: string | null }[];
}) {
	if (newProperty.propertyType !== 'Lote' && newProperty.propertyType !== 'Finca') {
		return zod(createPropertyWithConstructionSchema(newProperty.saleType as SaleType));
	}

	return zod(createPropertyDetailsSchema(newProperty.saleType as SaleType));
}
