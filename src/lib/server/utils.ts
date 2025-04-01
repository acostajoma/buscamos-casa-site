import { CLOUDINARY_API_SECRET } from '$env/static/private';
import { sha1 } from '@oslojs/crypto/sha1';
import { and, count, desc, eq, ne, SQL, sql } from 'drizzle-orm';
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

	const stringToSign = `${paramString}${CLOUDINARY_API_SECRET}`;
	const hashedString = sha1(new TextEncoder().encode(stringToSign));
	const signature = Array.from(new Uint8Array(hashedString))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	return signature;
};

type GetPostsOptions = {
	db: App.Locals['db'];
	pageNumber?: string | number | null;
} & (
	| {
			role?: 'owner' | 'admin';
			userId: string;
			providedFilters: undefined;
	  }
	| {
			role?: 'user';
			userId?: undefined;
			providedFilters?: SQL<unknown>[];
	  }
);

export const getPosts = async ({
	db,
	pageNumber = 1,
	role = 'user',
	userId,
	providedFilters
}: GetPostsOptions) => {
	const limit = 20;
	const page = typeof pageNumber === 'string' ? parseInt(pageNumber) : pageNumber || 1;
	const offset = page > 1 ? (page - 1) * limit : 0;

	let filters: SQL<unknown> | undefined;
	if (role === 'admin') {
		filters = and(
			ne(property.listingStatus, 'Publicado'),
			ne(property.listingStatus, 'Borrador'),
			ne(property.listingStatus, 'Vendido'),
			ne(property.listingStatus, 'Alquilado'),
			ne(property.listingStatus, 'Denegado')
		);
	} else if (role === 'user') {
		filters =
			providedFilters && providedFilters.length > 0
				? and(...providedFilters, eq(property.listingStatus, 'Publicado'))
				: eq(property.listingStatus, 'Publicado');
	} else if (role === 'owner') {
		filters = eq(property.postOwnerId, userId as string);
	}

	// Combine sale types and photos into simpler subqueries
	const saleTypeSub = db
		.select({
			propertyId: saleType.propertyId,
			types: sql`json_group_array(distinct ${saleType.type})`.as('types')
		})
		.from(saleType)
		.groupBy(saleType.propertyId)
		.as('saleTypeSub');

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
		photoId: photo.id
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
			.leftJoin(photo, and(eq(property.id, photo.propertyId), eq(photo.order, 0)))
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
			saleType: post.saleType ? JSON.parse(post.saleType as string) : []
		}))
	};
};

export type GetPosts = Awaited<ReturnType<typeof getPosts>>;
