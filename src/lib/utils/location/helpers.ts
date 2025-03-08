import { locationMap } from './costaRicaData';

export const getCantons = (state: string) => locationMap.get(state)?.keys() || [];

export const getDistricts = (state: string, canton: string) =>
	locationMap.get(state)?.get(canton)?.keys() || [];

export const getCantonsArray = (state: string) => Array.from(getCantons(state));

export const getDistrictsArray = (state: string, canton: string) =>
	Array.from(getDistricts(state, canton)) || [];
