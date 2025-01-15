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
	size: number,
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

			if (data.constructionSize > size) {
				ctx.addIssue({
					path: ['constructionSize'],
					code: z.ZodIssueCode.custom,
					message: 'El tamaño de la construcción no puede ser mayor que el tamaño del lote'
				});
			}
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
