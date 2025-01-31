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
