import { currencies, propertyTypes, saleTypes } from '$lib/utils/postConstants';
import { required_error } from '$lib/utils/zodErrorMessages';
import { z } from 'zod';
import { booleanField, customEnum, numeric, text } from './generalZodTypes';

export const propertySchema = z.object({
	title: text(5, 50),
	description: text(5, 500),
	propertyType: customEnum(propertyTypes).default(propertyTypes[0]),
	saleType: customEnum(saleTypes)
		.array()
		.nonempty({ message: required_error })
		.default([saleTypes[0]])
});

export const propertyDetailsSchema = z.object({
	salePrice: numeric(0, 10000000000, 0.01, true),
	currency: customEnum(currencies),
	size: numeric(0, 1000000000, 0.01, true),
	waterAvailability: booleanField.default(true),
	electricityAvailability: booleanField.default(true)
});
