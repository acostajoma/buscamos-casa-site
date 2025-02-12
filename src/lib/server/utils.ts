import { env } from '$env/dynamic/private';
import { sha1 } from '@oslojs/crypto/sha1';
import { count, desc, eq, sql } from 'drizzle-orm';
import {
	location,
	photo,
	propertiesWithConstruction,
	property,
	propertyFinancialDetails,
	saleType
} from './db/schema';

export const getCloudinarySignature = (paramsToSign: Cloudinary.ParamsToSign) => {
	const paramString = Object.keys(paramsToSign)
		.sort()
		.map((key) => `${key}=${paramsToSign[key as keyof Cloudinary.ParamsToSign]}`)
		.join('&');

	const stringToSign = `${paramString}${env.CLOUDINARY_API_SECRET}`;
	const hashedString = sha1(new TextEncoder().encode(stringToSign));
	const signature = Array.from(new Uint8Array(hashedString))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	return signature;
};

export const getPosts = async (db: App.Locals['db'], pageNumber: string | null | number = 1) => {
	const limit = 20;
	const page = typeof pageNumber === 'string' ? parseInt(pageNumber) : pageNumber || 1;
	const offset = page > 1 ? (page - 1) * limit : 0;

	const filters = eq(property.listingStatus, 'Publicado');

	// Combine sale types and photos into simpler subqueries
	const saleTypeSub = db
		.select({
			propertyId: saleType.propertyId,
			types: sql`json_group_array(distinct ${saleType.type})`.as('types')
		})
		.from(saleType)
		.groupBy(saleType.propertyId)
		.as('saleTypeSub');

	const photosSub = db
		.select({
			propertyId: photo.propertyId,
			photoIds: sql`json_group_array(${photo.id})`.as('photoIds')
		})
		.from(photo)
		.groupBy(photo.propertyId)
		.as('photosSub');

	const postSelect = {
		id: property.id,
		title: property.title,
		propertyType: property.propertyType,
		listingStatus: property.listingStatus,
		size: property.size,
		city: location.city,
		state: location.state,
		district: location.district,
		country: location.country,
		saleType: saleTypeSub.types,
		currency: propertyFinancialDetails.currency,
		salePrice: propertyFinancialDetails.salePrice,
		rentPrice: propertyFinancialDetails.rentPrice,
		constructionSize: propertiesWithConstruction.constructionSize,
		garageSpace: propertiesWithConstruction.garageSpace,
		numBathrooms: propertiesWithConstruction.numBathrooms,
		numBedrooms: propertiesWithConstruction.numBedrooms,
		yearBuilt: propertiesWithConstruction.yearBuilt,
		photoIds: photosSub.photoIds
	};

	// Single queries for count & results in parallel
	const [postCount, postsRaw] = await db.batch([
		db
			.select({ postCount: count().as('postCount') })
			.from(property)
			.leftJoin(location, eq(property.id, location.propertyId))
			.leftJoin(saleTypeSub, eq(property.id, saleTypeSub.propertyId))
			.leftJoin(propertiesWithConstruction, eq(property.id, propertiesWithConstruction.propertyId))
			.leftJoin(propertyFinancialDetails, eq(property.id, propertyFinancialDetails.propertyId))
			.where(filters),
		db
			.select(postSelect)
			.from(property)
			.leftJoin(location, eq(property.id, location.propertyId))
			.leftJoin(saleTypeSub, eq(property.id, saleTypeSub.propertyId))
			.leftJoin(photosSub, eq(property.id, photosSub.propertyId))
			.leftJoin(propertiesWithConstruction, eq(property.id, propertiesWithConstruction.propertyId))
			.leftJoin(propertyFinancialDetails, eq(property.id, propertyFinancialDetails.propertyId))
			.where(filters)
			.orderBy(desc(property.createdAt))
			.limit(limit)
			.offset(offset)
	]);

	return {
		postCount: postCount[0].postCount,
		posts: postsRaw.map((post) => ({
			...post,
			saleType: post.saleType ? JSON.parse(post.saleType as string) : [],
			photoIds: post.photoIds ? JSON.parse(post.photoIds as string) : []
		}))
	};
};
