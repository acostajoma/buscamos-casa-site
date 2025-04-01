import { property } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const prerender = false;

// Do not add HP "/" as it will have a separate treatment
const staticPaths: string[] = [
	'/inicia-sesion',
	'/privacidad',
	'/terminos-y-condiciones',
	'/publicaciones'
];

export const GET: RequestHandler = async ({ url, locals: { db } }) => {
	const baseUrl = url.origin;
	const postData = await db.query.property.findMany({
		where: eq(property.listingStatus, 'Publicado'),
		columns: {
			id: true,
			updatedAt: true,
			createdAt: true
		},
		orderBy: (property, { desc }) => [desc(property.updatedAt), desc(property.createdAt)]
	});
	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="https://www.w3.org/1999/xhtml"
			xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
		>
			<url>
				<loc>${baseUrl}/</loc>
				<changefreq>weekly</changefreq>
				<priority>1</priority>
			</url>
			${staticPaths
				.map(
					(path) => `<url>
					<loc>${baseUrl}${path}</loc>
					<changefreq>weekly</changefreq>
					<priority>0.7</priority>
				</url>`
				)
				.join('')}
			${postData
				.map(
					(post) => `<url>
					<loc>${baseUrl}/publicacion/${post.id}</loc>
					<lastmod>${new Date(post.updatedAt || post.createdAt).toISOString()}</lastmod>
					<changefreq>daily</changefreq>
					<priority>0.8</priority>
				</url>`
				)
				.join('')}
		</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, max-age=86400, s-maxage=86400' // cache for a day
			},
			cf: {
				cacheTtlByStatus: {
					'200-299': 86400,
					'404': 1,
					'500-599': 0
				}
			},
			status: 200
		}
	);
};
