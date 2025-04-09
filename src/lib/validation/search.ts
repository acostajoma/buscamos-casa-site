import { maxAmountInColones, maxNumberValue } from '$lib/utils/constants';
import { locationMap } from '$lib/utils/location/costaRicaData';
import { currencies } from '$lib/utils/postConstants';
import { greater_or_equal_than, less_or_equal_than } from '$lib/utils/zodErrorMessages';
import { z } from 'zod';
import { customEnum, text } from './generalZodTypes';

const numberSchema = (defaultValue: number = 0, maxValue: number = maxNumberValue) =>
	z
		.number()
		.min(0, { message: greater_or_equal_than(0, true) })
		.max(maxValue, less_or_equal_than(maxValue, true))
		.default(defaultValue);

export const searchSchema = z
	.object({
		minPrice: numberSchema(0),
		maxPrice: numberSchema(maxAmountInColones),
		isForSale: z.boolean().nullish().default(null),
		isForRent: z.boolean().nullish().default(null),
		isRentToBuy: z.boolean().nullish().default(null),
		currency: customEnum(currencies).nullish().default('Dólar'),
		city: text(1, 200).nullish().default(null),
		state: text(1, 200).nullish().default(null),
		district: text(1, 200).nullish().default(null),
		exclusiveSeller: text(1, 200).nullish().default(null)
	})
	.superRefine((data, ctx) => {
		if (data.state && !locationMap.has(data.state)) {
			if (!locationMap.has(data.state)) {
				ctx.addIssue({
					path: ['state'],
					code: z.ZodIssueCode.custom,
					message: 'La provincia no es válida'
				});
				return z.NEVER;
			}

			if (data.city) {
				if (!locationMap.get(data.state)?.has(data.city)) {
					ctx.addIssue({
						path: ['canton'],
						code: z.ZodIssueCode.custom,
						message: 'El cantón no es válido'
					});
					return z.NEVER;
				}
				if (data.district && !locationMap.get(data.state)?.get(data.city)?.has(data.district)) {
					ctx.addIssue({
						path: ['district'],
						code: z.ZodIssueCode.custom,
						message: 'El distrito no es válido'
					});
					return z.NEVER;
				}
			}
		}

		if (data.minPrice > data.maxPrice) {
			ctx.addIssue({
				path: ['minPrice'],
				code: z.ZodIssueCode.custom,
				message: 'El precio mínimo no puede ser mayor que el precio máximo'
			});
		}

		if (data.isForSale && (data.isForRent || data.isRentToBuy)) {
			ctx.addIssue({
				path: ['isForRent'],
				code: z.ZodIssueCode.custom,
				message: 'No puedes seleccionar alquileres y venta a la vez'
			});
		}
	});

export type SearchSchema = typeof searchSchema;
