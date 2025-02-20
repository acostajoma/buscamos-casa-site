export function createWhatsAppLink(message: string, phoneNumber: string = '') {
	return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
