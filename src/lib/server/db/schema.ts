import { relations, sql } from 'drizzle-orm';
import { index, integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { currencies, listingStates, propertyTypes } from '../../utils/postConstants';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	googleId: text('google_id').unique(),
	facebookId: text('facebook_id').unique(),
	email: text('email').notNull().unique()
});

export const userRelations = relations(user, ({ one, many }) => ({
	userData: one(userData, {
		fields: [user.id],
		references: [userData.id]
	}),
	userRoles: one(userRoles, {
		fields: [user.id],
		references: [userRoles.userId]
	}),
	agentOrBroker: one(agentOrBroker, {
		fields: [user.id],
		references: [agentOrBroker.userId]
	}),
	property: many(property)
}));

export const userRoles = sqliteTable('user_roles', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	role: text('role', { enum: ['admin', 'user'] })
		.notNull()
		.default('user')
});

export const userRolesRelations = relations(userRoles, ({ one }) => ({
	user: one(user, {
		fields: [userRoles.userId],
		references: [user.id]
	})
}));
export type UserRoles = typeof userRoles.$inferSelect;

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
	id: text('id')
		.primaryKey()
		.references(() => user.id, { onDelete: 'set null' }),
	phoneNumber: text('phone_number'),
	countryCode: text('country_code'),
	name: text('name'),
	lastName: text('last_name')
});

export const userDataRelations = relations(userData, ({ one }) => ({
	user: one(user, {
		fields: [userData.id],
		references: [user.id]
	})
}));

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
		deletedAt: text('deleted_at'),
		externalURL: text('external_url'),
		isForSale: integer('is_for_sale', { mode: 'boolean' }).default(false).notNull(),
		isForRent: integer('is_for_rent', { mode: 'boolean' }).default(false).notNull(),
		isRentToBuy: integer('is_rent_to_buy', { mode: 'boolean' }).default(false).notNull()
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
	propertyFeatures: many(propertyFeature),
	agentOrBroker: one(agentOrBroker, {
		fields: [property.postOwnerId],
		references: [agentOrBroker.userId]
	})
}));

export const propertyFinancialDetails = sqliteTable('property_financial_details', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	propertyId: integer('property_id')
		.notNull()
		.unique()
		.references(() => property.id, { onDelete: 'cascade' }),
	salePrice: real('sale_price'),
	rentPrice: real('rent_price'),
	maintenanceCost: real('maintenance_cost'),
	currency: text('currency', { enum: currencies }).notNull()
});

export type PropertyFinancialDetails = typeof propertyFinancialDetails.$inferSelect;

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
		.references(() => property.id, { onDelete: 'cascade' }),
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
			.unique()
			.references(() => property.id, { onDelete: 'cascade' }),
		email: text('email'),
		phone: text('phone_number'),
		countryCode: text('country_code'),
		name: text('name'),
		lastName: text('last_name')
	},
	(table) => ({
		propertyIdx: index('idx_sellerinformation_property_id').on(table.propertyId)
	})
);

export type SellerInformation = typeof sellerInformation.$inferSelect;

export const sellerInformationRelations = relations(sellerInformation, ({ one }) => ({
	property: one(property, {
		fields: [sellerInformation.propertyId],
		references: [property.id]
	}),
	agentOrBroker: one(agentOrBroker, {
		fields: [sellerInformation.propertyId],
		references: [agentOrBroker.userId]
	})
}));

export const agentOrBroker = sqliteTable('agent_or_broker', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	displayName: text('display_name').notNull().unique(),
	imageId: text('image_id'),
	imageAlt: text('image_alt'),
	instagramUserName: text('instagram_user_name')
});

export const agentOrBrokerRelations = relations(agentOrBroker, ({ one }) => ({
	user: one(user, {
		fields: [agentOrBroker.userId],
		references: [user.id]
	}),
	property: one(property, {
		fields: [agentOrBroker.userId],
		references: [property.postOwnerId]
	})
}));

export type AgentOrBroker = typeof agentOrBroker.$inferSelect;

export const exclusiveVendor = sqliteTable(
	'exclusive_vendor',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' })
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId] })
	})
);

export const exclusiveVendorRelations = relations(exclusiveVendor, ({ one }) => ({
	user: one(user, {
		fields: [exclusiveVendor.userId],
		references: [user.id]
	})
}));

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
			.references(() => property.id, { onDelete: 'cascade' }),
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
