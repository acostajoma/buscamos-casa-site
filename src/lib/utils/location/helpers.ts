import { locationMap } from './costaRicaData';

export const getCantons = (state: string) => {
	const cantons = locationMap.get(state);
	if (!cantons) {
		return [];
	}
	return cantons;
};

export const getDistricts = (state: string, canton: string) => {
	const districts = locationMap.get(state)?.get(canton);
	if (!districts) {
		return [];
	}
	return districts;
};
