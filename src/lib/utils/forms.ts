import {
	createPropertyDetailsSchema,
	createPropertyWithConstructionSchema
} from '$lib/validation/post';
import { zod } from 'sveltekit-superforms/adapters';

/**
 * Returns the appropriate form schema based on the property type.
 * If the property is not a 'Lote' or 'Finca', returns a schema that includes construction details.
 * Otherwise returns a basic property details schema.
 */
export function getPropertyForm(newProperty: {
	propertyType: string | null;
	isForSale: boolean;
	isForRent: boolean;
	isRentToBuy: boolean;
}) {
	const listingOptions = {
		isForRent: newProperty.isForRent,
		isForSale: newProperty.isForSale,
		isRentToBuy: newProperty.isRentToBuy
	};

	if (newProperty.propertyType !== 'Lote' && newProperty.propertyType !== 'Finca') {
		return zod(createPropertyWithConstructionSchema(listingOptions));
	}

	return zod(createPropertyDetailsSchema(listingOptions));
}
