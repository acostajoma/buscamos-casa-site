import { property } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const prerender = false;

const staticPaths: { path: string; lastmod: string }[] = [
	{ path: '/', lastmod: '2025-04-11' },
	{ path: '/inicia-sesion', lastmod: '2025-04-11' },
	{ path: '/privacidad', lastmod: '2025-04-11' },
	{ path: '/terminos-y-condiciones', lastmod: '2025-04-11' },
	{ path: '/publicaciones', lastmod: '2025-04-11' }
];

function generateStaticSitemapUrlsAsText(baseUrl: string) {
	return staticPaths.reduce((acc, { path, lastmod }) => {
		return (
			acc +
			`<url>
				<loc>${baseUrl}${path}</loc>
				<lastmod>${lastmod}</lastmod>
			</url>
		`
		);
	}, '');
}

async function generatePostsSitemapUrlsAsText(baseUrl: string, db: App.Locals['db']) {
	const posts = await db.query.property.findMany({
		columns: {
			id: true,
			createdAt: true
		},
		where: eq(property.listingStatus, 'Publicado')
	});

	return posts.reduce((acc, { id, createdAt }) => {
		return (
			acc +
			`<url>
				<loc>${baseUrl}/publicaciones/${id}</loc>
				<lastmod>${createdAt.split(' ')[0]}</lastmod>
			</url>
		`
		);
	}, '');
}

export const GET: RequestHandler = async ({ url, locals: { db } }) => {
	const baseUrl = url.origin;
	const staticContent = generateStaticSitemapUrlsAsText(baseUrl);
	const postContent = await generatePostsSitemapUrlsAsText(baseUrl, db);
	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${staticContent}
			${postContent}
		</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml; charset=utf-8',
				'Cache-Control': 'public, max-age=14400, s-maxage=14400' // cache for 4 hours
			},
			cf: {
				cacheTtlByStatus: {
					'200-299': 14400,
					'404': 1,
					'500-599': 0
				}
			},
			status: 200
		}
	);
};
