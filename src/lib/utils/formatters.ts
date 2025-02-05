export function formatNumber(value: number): string {
	return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export function formatCurrency(value: number, currency: 'USD' | 'CRC'): string {
	return `${currency === 'CRC' ? '₡' : '$'}${formatNumber(value)}`;
}

export function serializeSchema(object: object) {
	return `<script type="application/ld+json">${JSON.stringify(object, null, 2)}</script>`;
}
