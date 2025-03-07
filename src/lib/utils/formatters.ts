import type { Currencies } from './postConstants';

export function formatNumber(value: number, toFixed: number = 2): string {
	if (toFixed > 0) {
		return value.toFixed(toFixed).replace(/\d(?=(\d{3})+\.)/g, '$&,');
	}
	return Math.ceil(value)
		.toString()
		.replace(/\d(?=(\d{3})+$)/g, '$&,');
}

export function formatCurrency(value: number, currency: Currencies, toFixed: number = 2): string {
	return `${currency === 'Colon' ? '₡' : '$'}${formatNumber(value, toFixed)}`;
}

export function serializeSchema(object: object) {
	return `<script type="application/ld+json">${JSON.stringify(object, null, 2)}</script>`;
}
