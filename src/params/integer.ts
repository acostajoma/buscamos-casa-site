import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is `${number}` => {
	return /^-?\d+$/.test(param);
}) satisfies ParamMatcher;
