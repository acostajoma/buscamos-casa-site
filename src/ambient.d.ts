import type {
	Location,
	Photo,
	PropertiesWithConstruction,
	Property,
	PropertyFeature,
	PropertyFinancialDetail,
	SaleType,
	SellerInformation
} from '$lib/server/db/schema';

type PropertyIdAndFeatures = {
	id: number;
	postOwnerId: string;
	propertyFeatures: {
		featureId: number;
		feature: {
			name: string;
		};
	}[];
};

type PropertyWithAllData = Property & {
	sellerInformation: SellerInformation;
	location: Location;
	photos: Photo[];
	propertiesWithConstruction: PropertiesWithConstruction;
	propertyFeatures: PropertyFeature[];
	propertyFinancialDetails: PropertyFinancialDetail;
	saleType: SaleType[];
};
