export const required_error = 'Este campo es requerido.';
export const invalid_type_error = 'El valor ingresado no es válido.';
export const min_length_error = (min: number) => `El valor debe tener al menos ${min} caracteres.`;
export const max_length_error = (max: number) => `El valor no puede exceder ${max} caracteres.`;
export const multiple_of_error = (step: number) => `El valor debe ser múltiplo de ${step}.`;
export const greater_than = (min: number, formatNumber: boolean) => {
	const val = formatNumber ? min.toLocaleString('es-ES') : min;
	return `El valor debe ser mayor que ${val}.`;
};
export const less_or_equal_than = (max: number, formatNumber?: boolean) => {
	const val = formatNumber ? max.toLocaleString('es-ES') : max;
	return `El valor debe ser menor o igual que ${val}.`;
};
export const greater_or_equal_than = (min: number, formatNumber?: boolean) => {
	const val = formatNumber ? min.toLocaleString('es-ES') : min;
	return `El valor debe ser mayor o igual que ${val}.`;
};
export const not_in_the_list_error = 'El valor no se encuentra en la lista.';
