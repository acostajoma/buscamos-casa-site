import { imageCdnUrl } from '$lib/utils/constants';

export const createPropertySchema = (
	information: Post.Information,
	photos: string[],
	url: URL | string
) => ({
	'@context': 'https://schema.org',
	'@type': 'House',
	name: information.properties.title,
	description: information.properties.description,
	image: photos.map((p) => `${imageCdnUrl}/${p}/medium`),
	accommodationCategory: information.propertyTypes?.type === 'Terreno' ? 'LAND' : undefined,
	url,
	address: {
		'@type': 'PostalAddress',
		streetAddress: information.locations?.address,
		addressLocality: information.locations?.city,
		addressRegion: information.locations?.state,
		addressCountry: 'CR'
	},
	geo: {
		'@type': 'GeoCoordinates',
		latitude: information.locations?.latitude,
		longitude: information.locations?.longitude
	},
	numberOfRooms: 4,
	floorSize: {
		'@type': 'QuantitativeValue',
		value: '200',
		unitCode: 'M2'
	},
	seller: {
		'@type': 'RealEstateAgent',
		name: 'Inmobiliaria Los Robles',
		url: 'https://tusitio.com',
		telephone: '+34 987 654 321',
		address: {
			'@type': 'PostalAddress',
			streetAddress: 'Avenida Principal 321',
			addressLocality: 'Barrio Los Robles',
			addressRegion: 'Provincia',
			postalCode: '67890',
			addressCountry: 'ES'
		}
	}
});
