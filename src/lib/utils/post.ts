import type { PropertyWithAllData } from '../../ambient';
import { getPhotoUrl } from './photos';
import type { ListingStates, PropertyTypes } from './postConstants';

function mapStatusToAvailability(status?: ListingStates): string | undefined {
	if (!status) return 'https://schema.org/InStock'; // O undefined si no estás seguro

	switch (status) {
		case 'Publicado':
			return 'https://schema.org/InStock';
		case 'Vendido':
		case 'Alquilado': // A menudo se tratan como vendidos en términos de disponibilidad
			return 'https://schema.org/SoldOut';
		case 'Expirado':
		case 'Denegado':
		case 'Suspendido':
		case 'Retirado':
			return 'https://schema.org/OutOfStock'; // O Discontinued si es permanente
		case 'Borrador':
		case 'Requiere Correcciones':
		case 'En Revision':
			return undefined; // Mejor omitir para estados no públicos/finales
		default:
			return 'https://schema.org/InStock'; // Default conservador
	}
}

function mapPropertyTypeToSchema(propertyType: PropertyTypes) {
	switch (propertyType) {
		case 'Casa':
			return 'House';
		case 'Apartamento':
			return 'Apartment';
		case 'Lote':
			return 'LandPlot';
		case 'Oficina':
			return 'Office';
		case 'Bodega':
			return 'StorageUnit';
		case 'Finca':
			return 'Farm';
		default:
			return 'RealEstateListing';
	}
}

export function createPostMetadataSchema(
	post: PropertyWithAllData,
	url: string,
	primaryPhotoId?: string
) {
	const additionalProperty = [];
	if (post?.propertiesWithConstruction) {
		additionalProperty.push({
			'@type': 'PropertyValue',
			name: 'Año de Construcción',
			value: post.propertiesWithConstruction?.yearBuilt
		});
	}

	return {
		'@context': 'https://schema.org',
		'@type': 'RealEstateListing',
		url: url, // URL de la página del listado
		name: post.title,
		description: post.description,
		image: primaryPhotoId ? getPhotoUrl(primaryPhotoId) : undefined,
		datePosted: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
		offers: {
			'@type': 'Offer',
			price: post.propertyFinancialDetails?.salePrice,
			priceCurrency: post.propertyFinancialDetails?.currency === 'Dólar' ? 'USD' : 'CRC',
			availability: mapStatusToAvailability(post.listingStatus),
			seller: {
				'@type': post.sellerInformation?.isAgent ? 'RealEstateAgent' : 'Person',
				name: post.sellerInformation
					? `${post.sellerInformation.name} ${post.sellerInformation.lastName || ''}`.trim()
					: 'Buscamos.casa',
				telephone: post.sellerInformation?.phone
				// "email": post.sellerInformation?.email // Añadir si tienes el email
			}
		},
		// Describir la propiedad en sí
		itemOffered: {
			// Elige el tipo más específico: SingleFamilyResidence, Apartment, House, LandPlot, etc.
			'@type': post.propertyType ? mapPropertyTypeToSchema(post.propertyType) : undefined,
			name: post.title,
			description: post.description,
			numberOfBedrooms: post?.propertiesWithConstruction?.numBedrooms || undefined,
			numberOfBathroomsTotal: post?.propertiesWithConstruction?.numBathrooms || undefined,
			floorSize: post?.propertiesWithConstruction?.constructionSize
				? {
						'@type': 'QuantitativeValue',
						value: post.propertiesWithConstruction.constructionSize,
						unitCode: 'MTK'
					}
				: undefined,
			landSize: {
				'@type': 'QuantitativeValue',
				value: post.size,
				unitCode: 'MTK'
			},
			address: {
				'@type': 'PostalAddress',
				streetAddress: post.location?.address,
				addressLocality: post.location?.city, // Ciudad
				addressRegion: post.location?.state, // Provincia/Estado
				addressCountry: 'CR'
			},
			geo:
				post.location?.latitude && post.location?.longitude
					? {
							'@type': 'GeoCoordinates',
							latitude: post.location?.latitude, // Necesitas Lat/Lon en tus datos
							longitude: post.location?.longitude
						}
					: undefined,
			additionalProperty
		}
	};
}
