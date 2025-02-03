import { relations, sql } from 'drizzle-orm';
import { index, integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { currencies, listingStates, propertyTypes, saleTypes } from '../../utils/postConstants';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	googleId: text('google_id').unique(),
	facebookId: text('facebook_id').unique(),
	email: text('email').notNull().unique(),
	userDataId: text('user_data_id')
		.unique()
		.references(() => userData.id, { onDelete: 'set null' })
});

export const userRelations = relations(user, ({ one, many }) => ({
	userData: one(userData, {
		fields: [user.userDataId],
		references: [userData.id]
	}),
	property: many(property)
}));

export const session = sqliteTable(
	'session',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
	},
	(table) => {
		return { userIdIdx: index('user_id_idx').on(table.userId) };
	}
);

export const userData = sqliteTable('user_data', {
	id: text('id').primaryKey(),
	phoneNumber: text('phone_number'),
	name: text('name'),
	lastName: text('last_name')
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type UserData = typeof userData.$inferSelect;

// Property Tables

export const property = sqliteTable(
	'property',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		title: text('title').notNull(),
		description: text('description').notNull(),
		listingStatus: text('listing_status', { enum: listingStates })
			.notNull()
			.default(listingStates[0]),
		propertyType: text('property_type', { enum: propertyTypes }),
		size: real('size').notNull(),
		postOwnerId: text('post_owner_id')
			.notNull()
			.references(() => user.id, { onDelete: 'set null' }),
		createdAt: text('created_at')
			.notNull()
			.default(sql`(current_timestamp)`),
		updatedAt: text('updated_at'),
		deletedAt: text('deleted_at')
	},
	(table) => ({
		listingStatusIdx: index('idx_property_listing_status').on(table.listingStatus),
		createdAtIdx: index('idx_property_created_at').on(table.createdAt)
	})
);
export type Property = typeof property.$inferSelect;

export const propertyRelations = relations(property, ({ one, many }) => ({
	propertyFinancialDetails: one(propertyFinancialDetails, {
		fields: [property.id],
		references: [propertyFinancialDetails.propertyId]
	}),
	saleType: many(saleType),
	propertyMetaData: one(propertyMetaData, {
		fields: [property.id],
		references: [propertyMetaData.propertyId]
	}),
	photos: many(photo),
	location: one(location, {
		fields: [property.id],
		references: [location.propertyId]
	}),
	sellerInformation: one(sellerInformation, {
		fields: [property.id],
		references: [sellerInformation.propertyId]
	}),
	propertiesWithConstruction: one(propertiesWithConstruction, {
		fields: [property.id],
		references: [propertiesWithConstruction.propertyId]
	}),
	propertyFeatures: many(propertyFeature)
}));

export const propertyFinancialDetails = sqliteTable('property_financial_details', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	propertyId: integer('property_id')
		.notNull()
		.unique()
		.references(() => property.id, { onDelete: 'cascade' }),
	salePrice: real('sale_price'),
	rentPrice: real('rent_price'),
	maintenanceCost: real('rent_price'),
	currency: text('currency', { enum: currencies }).notNull()
});

export type PropertyFinancialDetails = typeof propertyFinancialDetails.$inferSelect;

export const saleType = sqliteTable(
	'sale_type',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		propertyId: integer('property_id')
			.notNull()
			.references(() => property.id, { onDelete: 'cascade' }),
		type: text('type', { enum: saleTypes })
	},
	(table) => ({
		propertyIdx: index('idx_saletype_property_id').on(table.propertyId),
		typeIdx: index('idx_saletype_type').on(table.type)
	})
);

export const saleTypeRelations = relations(saleType, ({ one }) => ({
	property: one(property, {
		fields: [saleType.propertyId],
		references: [property.id]
	})
}));

export type SaleType = typeof saleType.$inferSelect;

export const propertyMetaData = sqliteTable('property_meta_data', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	views: integer('views').default(0),
	shared: integer('shared').default(0),
	propertyId: integer('property_id')
		.notNull()
		.references(() => property.id, { onDelete: 'cascade' })
});

export type PropertyMetaData = typeof propertyMetaData.$inferSelect;

export const propertiesWithConstruction = sqliteTable('properties_with_construction', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	propertyId: integer('property_id')
		.notNull()
		.unique()
		.references(() => property.id, { onDelete: 'restrict' }),
	numBedrooms: integer('num_bedrooms').default(1).notNull(),
	numBathrooms: real('num_bathrooms').default(1).notNull(),
	constructionSize: real('construction_size').notNull(),
	yearBuilt: integer('year_built').notNull(),
	garageSpace: integer('garage_space').default(0).notNull()
});

export type PropertiesWithConstruction = typeof propertiesWithConstruction.$inferSelect;

export const location = sqliteTable(
	'location',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		address: text('address').notNull(),
		city: text('city').notNull(),
		state: text('state').notNull(),
		district: text('district').notNull(),
		country: text('country').notNull(),
		mapUrl: text('map_url'),
		longitude: real('longitude'),
		latitude: real('latitude'),
		propertyId: integer('property_id')
			.notNull()
			.unique()
			.references(() => property.id, { onDelete: 'cascade' })
	},
	(table) => {
		return {
			districtIdx: index('idx_location_district').on(table.district),
			cityIdx: index('idx_location_city').on(table.city),
			stateIdx: index('idx_location_state').on(table.state)
		};
	}
);

export type Location = typeof location.$inferSelect;

export const locationRelations = relations(location, ({ one }) => ({
	property: one(property, {
		fields: [location.propertyId],
		references: [property.id]
	})
}));

export const sellerInformation = sqliteTable(
	'seller_information',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		propertyId: integer('property_id')
			.notNull()
			.references(() => property.id, { onDelete: 'cascade' }),
		email: text('email'),
		phoneNumber: text('phone_number'),
		name: text('name'),
		lastName: text('last_name')
	},
	(table) => ({
		propertyIdx: index('idx_sellerinformation_property_id').on(table.propertyId)
	})
);

export type SellerInformation = typeof sellerInformation.$inferSelect;

export const photo = sqliteTable(
	'photo',
	{
		id: text('photo_id').primaryKey(),
		propertyId: integer('property_id')
			.notNull()
			.references(() => property.id, { onDelete: 'cascade' }),
		order: integer('order').notNull()
	},
	(table) => ({
		propertyIdx: index('idx_photos_property_id').on(table.propertyId)
	})
);

export type Photo = typeof photo.$inferSelect;

export const photoRelations = relations(photo, ({ one }) => ({
	property: one(property, {
		fields: [photo.propertyId],
		references: [property.id]
	})
}));

export const feature = sqliteTable('features', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique()
});

export const featureRelations = relations(feature, ({ many }) => ({
	propertyFeatures: many(propertyFeature)
}));

export type Feature = typeof feature.$inferSelect;

export const propertyFeature = sqliteTable(
	'property_features',
	{
		propertyId: integer('property_id')
			.notNull()
			.references(() => property.id),
		featureId: integer('feature_id')
			.notNull()
			.references(() => feature.id, { onDelete: 'cascade' })
	},
	(table) => ({
		pk: primaryKey({ columns: [table.propertyId, table.featureId] }),
		propertyIdx: index('idx_property_feature_property_id').on(table.propertyId)
	})
);

export const propertyFeatureRelations = relations(propertyFeature, ({ one }) => ({
	property: one(property, {
		fields: [propertyFeature.propertyId],
		references: [property.id]
	}),
	feature: one(feature, {
		fields: [propertyFeature.featureId],
		references: [feature.id]
	})
}));

export type PropertyFeature = typeof propertyFeature.$inferSelect;

export const propertyContactInformation = sqliteTable(
	'property_contact_information',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		propertyId: integer('property_id')
			.notNull()
			.unique()
			.references(() => property.id, { onDelete: 'cascade' }),
		phoneNumber: text('phone_number'),
		email: text('email'),
		name: text('name')
	},
	(table) => ({
		propertyIdx: index('idx_property_contact_information_property_id').on(table.propertyId)
	})
);

export type PropertyContactInformation = typeof propertyContactInformation.$inferSelect;

export const propertyContactInformationRelations = relations(
	propertyContactInformation,
	({ one }) => ({
		property: one(property, {
			fields: [propertyContactInformation.propertyId],
			references: [property.id]
		})
	})
);
