import { acceptedImageTypes, allowedImageTypes } from '$lib/utils/constants';
import { locationMap } from '$lib/utils/location/costaRicaData';
import { currencies, propertyTypes, saleTypes } from '$lib/utils/postConstants';
import { required_error } from '$lib/utils/zodErrorMessages';
import { z } from 'zod';
import { customEnum, numeric, text } from './generalZodTypes';

export const propertySchema = z.object({
	title: text(5, 50),
	description: text(5, 500),
	propertyType: customEnum(propertyTypes).default(propertyTypes[0]),
	saleType: customEnum(saleTypes)
		.array()
		.nonempty({ message: required_error })
		.default([saleTypes[0]]),
	size: numeric(0, 1000000000, 0.01, true)
});

export const propertyDetailsSchema = z.object({
	salePrice: numeric(0, 10000000000, 0.01, true).nullish(),
	rentPrice: numeric(0, 10000000000, 0.01, true).nullish(),
	currency: customEnum(currencies)
});

export const validateSaleTypePrice = (
	saleType: { type: 'Venta' | 'Alquiler' | 'Alquiler con opción a compra' | null }[],
	data: { salePrice?: number | null; rentPrice?: number | null; [key: string]: unknown },
	ctx: z.RefinementCtx
) => {
	if (saleType.some((type) => type.type === 'Venta' && !data.salePrice)) {
		ctx.addIssue({
			path: ['salePrice'],
			code: z.ZodIssueCode.custom,
			message: 'Debe ingresar un precio de venta'
		});
	}
	if (
		saleType.some(
			(type) =>
				(type.type === 'Alquiler' || type.type === 'Alquiler con opción a compra') &&
				!data.rentPrice
		)
	) {
		ctx.addIssue({
			path: ['rentPrice'],
			code: z.ZodIssueCode.custom,
			message: 'Debe ingresar un precio de alquiler'
		});
	}
};

export const createPropertyDetailsSchema = (
	saleType: { type: 'Venta' | 'Alquiler' | 'Alquiler con opción a compra' | null }[]
) =>
	propertyDetailsSchema.superRefine((data, ctx) => {
		validateSaleTypePrice(saleType, data, ctx);
	});

export const createPropertyWithConstructionSchema = (
	saleType: { type: 'Venta' | 'Alquiler' | 'Alquiler con opción a compra' | null }[]
) =>
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
			validateSaleTypePrice(saleType, data, ctx);

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
				path: ['canton'],
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
