import type { ListingOptions } from '$lib/types';
import { acceptedImageTypes, allowedImageTypes } from '$lib/utils/constants';
import { locationMap } from '$lib/utils/location/costaRicaData';
import { currencies, propertyTypes } from '$lib/utils/postConstants';
import { required_error } from '$lib/utils/zodErrorMessages';
import { z } from 'zod';
import { customEnum, numeric, text } from './generalZodTypes';

export const propertySchema = z.object({
	title: text(5, 100),
	description: text(5, 1000),
	propertyType: customEnum(propertyTypes).default(propertyTypes[0]),
	isForSale: z.boolean({ required_error }).default(false),
	isForRent: z.boolean({ required_error }).default(false),
	isRentToBuy: z.boolean({ required_error }).default(false),
	size: numeric(0, 1000000000, 0.01, true)
});

export const propertyDetailsSchema = z.object({
	salePrice: numeric(0, 10000000000, 0.01, true).nullish(),
	rentPrice: numeric(0, 10000000000, 0.01, true).nullish(),
	currency: customEnum(currencies),
	maintenanceCost: numeric(0, 10000000000, 0.01, true).nullish()
});

export const validateSaleTypePrice = (
	listingOptions: ListingOptions,
	data: { salePrice?: number | null; rentPrice?: number | null; [key: string]: unknown },
	ctx: z.RefinementCtx
) => {
	if (listingOptions.isForSale && !data.salePrice) {
		ctx.addIssue({
			path: ['salePrice'],
			code: z.ZodIssueCode.custom,
			message: 'Debe ingresar un precio de venta'
		});
	}
	if ((listingOptions.isForRent || listingOptions.isRentToBuy) && !data.rentPrice) {
		ctx.addIssue({
			path: ['rentPrice'],
			code: z.ZodIssueCode.custom,
			message: 'Debe ingresar un precio de alquiler'
		});
	}
};

export const createPropertyDetailsSchema = (listingOptions: ListingOptions) =>
	propertyDetailsSchema.superRefine((data, ctx) => {
		validateSaleTypePrice(listingOptions, data, ctx);
	});

export const createPropertyWithConstructionSchema = (listingOptions: ListingOptions) =>
	z
		.object({
			numBedrooms: numeric(0, 100, 1, true),
			numBathrooms: numeric(0, 100, 0.5, true),
			constructionSize: numeric(0, 1000000000, 0.01, true),
			yearBuilt: numeric(1900, 2025, 1, true).default(new Date().getFullYear()),
			garageSpace: numeric(0, 100, 1, true).default(0)
		})
		.merge(propertyDetailsSchema)
		.superRefine((data, ctx) => {
			validateSaleTypePrice(listingOptions, data, ctx);

			if (data.yearBuilt > new Date().getFullYear()) {
				ctx.addIssue({
					path: ['yearBuilt'],
					code: z.ZodIssueCode.custom,
					message: 'El año de construcción no puede ser mayor que el año actual'
				});
			}
			if (data.yearBuilt < 1900) {
				ctx.addIssue({
					path: ['yearBuilt'],
					code: z.ZodIssueCode.custom,
					message: 'El año de construcción no puede ser menor que 1900'
				});
			}
		});

export const locationSchema = z
	.object({
		address: text(10, 200),
		city: text(1, 200).default('Acosta'),
		state: text(1, 200).default('San José'),
		district: text(1, 200).default('Cangrejal'),
		country: text(1, 200).default('Costa Rica'),
		mapUrl: text(1, 200).nullable().optional(),
		longitude: numeric(-180, 180, 0.000001, true).nullable().optional(),
		latitude: numeric(-90, 90, 0.000001, true).nullable().optional()
	})
	.superRefine((data, ctx) => {
		if (!locationMap.has(data.state)) {
			ctx.addIssue({
				path: ['state'],
				code: z.ZodIssueCode.custom,
				message: 'La provincia no es válida'
			});
		}
		if (!locationMap.get(data.state)?.has(data.city)) {
			ctx.addIssue({
				path: ['city'],
				code: z.ZodIssueCode.custom,
				message: 'El cantón no es válido'
			});
		}
		if (!locationMap.get(data.state)?.get(data.city)?.has(data.district)) {
			ctx.addIssue({
				path: ['district'],
				code: z.ZodIssueCode.custom,
				message: 'El distrito no es válido'
			});
		}
	});

export type Location = z.infer<typeof locationSchema>;

const MAX_FILE_SIZE = 10000000;

export const imageSchema = z.object({
	image: z
		.instanceof(File, { message: 'Debe seleccionar una imagen' })
		.refine((file) => file?.size <= MAX_FILE_SIZE, `El tamaño máximo permitido son 10mb.`)
		.refine(
			(file) => acceptedImageTypes.includes(file?.type),
			`Solo se permite los formatos: ${allowedImageTypes.join(', ')}.`
		),
	order: numeric(0, 20, 1)
});

export const createFeaturesSchema = (featuresArray: string[]) =>
	z
		.object({
			features: z.string().array()
		})
		.superRefine((data, ctx) => {
			if (!data?.features?.every((feature) => featuresArray.includes(feature))) {
				ctx.addIssue({
					path: ['features'],
					code: z.ZodIssueCode.custom,
					message: 'Una o más características no son válidas'
				});
			}
		});

export const contactDataSchema = z
	.object({
		name: text(3, 50),
		phone: text(8, 20),
		email: text(4, 50).email({ message: 'Correo electrónico inválido' }),
		countryCode: text(2, 2).default('CR')
	})
	.superRefine((data, ctx) => {
		const phoneRegex = /^\d{8,20}$/;
		const phoneMatch = phoneRegex.test(data.phone);
		if (!phoneMatch) {
			ctx.addIssue({
				path: ['phone'],
				code: z.ZodIssueCode.custom,
				message: 'Número de teléfono inválido.'
			});
		}
	});
