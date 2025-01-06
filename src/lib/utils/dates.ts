function isDate(date: unknown): date is Date {
	return date instanceof Date && !isNaN(date.getTime());
}

export function formatDateForInput(receivedDate: Date | string): string | undefined {
	const date = typeof receivedDate === 'string' ? new Date(receivedDate) : receivedDate;

	if (!isDate(date)) return;
	const year: number = date.getFullYear();
	const month: string = String(date.getMonth() + 1).padStart(2, '0'); // Months go from 0 to 11
	const day: string = String(date.getDate()).padStart(2, '0');

	const hours: string = String(date.getHours()).padStart(2, '0');
	const minutes: string = String(date.getMinutes()).padStart(2, '0');

	return `${year}-${month}-${day}T${hours}:${minutes}`;
}
