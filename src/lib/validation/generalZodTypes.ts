import {
	greater_or_equal_than,
	greater_than,
	invalid_type_error,
	less_or_equal_than,
	max_length_error,
	min_length_error,
	multiple_of_error,
	not_in_the_list_error,
	required_error
} from '$lib/utils/zodErrorMessages';
import { z } from 'zod';

export const text = (min: number = 2, max: number = 30) =>
	z
		.string({ required_error, invalid_type_error })
		.trim()
		.min(min, min_length_error(min))
		.max(max, max_length_error(max));

export const numeric = (min: number, max: number, step: number, formatNumber = true) =>
	z
		.number({
			required_error,
			invalid_type_error
		})
		.multipleOf(step, { message: multiple_of_error(step) })
		.min(min + step, { message: greater_than(min, formatNumber) })
		.max(max, less_or_equal_than(max, formatNumber));

export const coordinates = (min: number, max: number) =>
	z
		.number({
			required_error,
			invalid_type_error
		})
		.gte(min, { message: greater_or_equal_than(min) })
		.lte(max, less_or_equal_than(max))
		.nullable();

export const customEnum = (enumData: readonly [string, ...string[]]) =>
	z.enum(enumData, { invalid_type_error, required_error, message: not_in_the_list_error });

export const booleanField = z.boolean({
	invalid_type_error,
	required_error
});
