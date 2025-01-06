import { currencies, listingStates, propertyTypes, saleTypes } from '$lib/utils/postConstants';
import { sql } from 'drizzle-orm';
import { index, integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	googleId: text('google_id').unique(),
	facebookId: text('facebook_id').unique(),
	email: text('email').notNull().unique(),
	userDataId: text('user_data_id')
		.unique()
		.references(() => userData.id, { onDelete: 'set null' })
});

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

export const property = sqliteTable('property', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	listingStatus: text('listing_status', { enum: listingStates }).notNull(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	propertyType: text('property_type', { enum: propertyTypes }),
	price: real('price').notNull(),
	currency: text('currency', { enum: currencies }).notNull(),
	size: real('size').notNull(),
	waterAvailability: integer('water_availability', { mode: 'boolean' }).default(true),
	electricityAvailability: integer('electricity_availability', { mode: 'boolean' }).default(true),
	postOwnerId: text('post_owner_id')
		.notNull()
		.references(() => user.id, { onDelete: 'set null' }),
	locationId: integer('location_id').references(() => location.id, { onDelete: 'set null' }),
	metaData: integer('meta_data')
		.notNull()
		.references(() => propertyMetaData.id, { onDelete: 'restrict' }),

	// Time stamps
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
	updatedAt: text('updated_at'),
	deletedAt: text('deleted_at')
});

export type Property = typeof property.$inferSelect;

export const propertyMetaData = sqliteTable('property_meta_data', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	views: integer('views').default(0),
	shared: integer('shared').default(0)
});

export type PropertyMetaData = typeof propertyMetaData.$inferSelect;

export const propertiesWithConstruction = sqliteTable('properties_with_construction', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	propertyId: integer('property_id')
		.notNull()
		.unique()
		.references(() => property.id, { onDelete: 'restrict' }),
	numBedrooms: integer('num_bedrooms'),
	numBathrooms: integer('num_bathrooms'),
	constructionSize: real('construction_size'),
	yearBuilt: integer('year_built'),
	garageSpace: integer('garage_space')
});

export type PropertiesWithConstruction = typeof propertiesWithConstruction.$inferSelect;

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

export type SaleType = typeof saleType.$inferSelect;

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
		latitude: real('latitude')
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

export const feature = sqliteTable('features', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique()
});

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

export type Feature = typeof feature.$inferSelect;
