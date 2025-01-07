import { currencies, propertyTypes, saleTypes } from '$lib/utils/postConstants';
import { required_error } from '$lib/utils/zodErrorMessages';
import { z } from 'zod';
import { booleanField, customEnum, numeric, text } from './generalZodTypes';

export const postSchema = z.object({
	title: text(5, 50),
	description: text(5, 500),
	propertyType: customEnum(propertyTypes).default(propertyTypes[0]),
	price: numeric(0, 10000000000, 0.01, true),
	currency: customEnum(currencies),
	size: numeric(0, 1000000000, 0.01, true),
	waterAvailability: booleanField.default(true),
	electricityAvailability: booleanField.default(true),
	saleType: customEnum(saleTypes)
		.array()
		.nonempty({ message: required_error })
		.default([saleTypes[0]])
});
