import { propertyTypes, saleTypes } from '$lib/utils/postConstants';
import { required_error } from '$lib/utils/zodErrorMessages';
import { z } from 'zod';
import { customEnum, text } from './generalZodTypes';

export const searchSchema = z.object({
	salePrice: z.object({
		min: z.number().int().min(0).nullish().default(null),
		max: z.number().int().min(0).nullish().default(null)
	}),
	rentPrice: z.object({
		min: z.number().int().min(0).nullish().default(null),
		max: z.number().int().min(0).nullish().default(null)
	}),
	city: text(1, 200).nullish().default(null),
	state: text(1, 200).nullish().default(null),
	district: text(1, 200).nullish().default(null),
	propertyType: customEnum(propertyTypes)
		.array()
		.nonempty({ message: required_error })
		.default(propertyTypes),
	saleType: customEnum(saleTypes).array().nonempty({ message: required_error }).default(saleTypes)
});
