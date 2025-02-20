export function createWhatsAppLink(message: string, phoneNumber: string = '') {
	const encodedMessage = encodeURIComponent(message);
	return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
