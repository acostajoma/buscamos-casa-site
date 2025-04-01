// src/routes/sitemap.xml/+server.ts
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { error } from '@sveltejs/kit';

// Assume you have a way to get your D1 database instance
// This depends on how you set up Drizzle/D1 bindings in SvelteKit
// import { db } from '$lib/server/db'; // Example path to your DB setup
// import { propertiesTable } from '$lib/server/db/schema'; // Example table schema
// import { sql } from 'drizzle-orm';

export async function GET({ platform, setHeaders }) {
	const hostname = 'https://buscamos.casa'; // Your production domain

	try {
		// --- Fetch Dynamic URLs (Properties) ---
		// Adapt this query to your Drizzle/D1 setup
		const db = platform?.env.DB; // Example: Access D1 binding via platform context
		if (!db) throw new Error('Database binding not found');

		// Efficiently get only needed data (e.g., id/slug, lastUpdated)
		// Ensure you have an index on lastUpdated if possible
		const properties = await db
			.prepare(
				"SELECT id, slug, lastUpdated FROM properties WHERE status = 'Publicado'" // Adjust table/column names and status
			)
			.all<{ id: number; slug: string | null; lastUpdated: string }>();

		const propertyLinks = properties.rows.map((p) => ({
			// Choose URL structure: /publicacion/ID or /propiedad/SLUG
			url: `<span class="math-inline">\{hostname\}/es/publicacion/</span>{p.id}`,
			lastmod: p.lastUpdated, // Ensure this is in YYYY-MM-DD format in DB or format here
			changefreq: 'weekly',
			priority: 0.8
			// Add links for hreflang if needed
			// links: [
			//  { lang: 'es-CR', url: `<span class="math-inline">\{hostname\}/es/publicacion/</span>{p.id}` },
			//  { lang: 'en', url: `<span class="math-inline">\{hostname\}/en/publication/</span>{p.id}` },
			// ]
		}));

		// --- Static URLs ---
		const staticLinks = [
			{ url: `${hostname}/es/`, changefreq: 'daily', priority: 1.0 },
			{ url: `${hostname}/en/`, changefreq: 'daily', priority: 1.0 },
			{ url: `${hostname}/es/contacto`, changefreq: 'monthly', priority: 0.7 }
			// Add other static pages
		];

		// Combine all URLs
		const allLinks = [...staticLinks, ...propertyLinks];

		// --- Generate XML ---
		const stream = new SitemapStream({ hostname });
		const xml = await streamToPromise(Readable.from(allLinks).pipe(stream)).then((data) =>
			data.toString()
		);

		// --- Set Headers and Return Response ---
		setHeaders({
			'Content-Type': 'application/xml',
			// Cache for a reasonable time (e.g., 1 hour) to reduce D1 load
			'Cache-Control': 'public, max-age=3600'
		});

		return new Response(xml);
	} catch (err: any) {
		console.error('Error generating sitemap:', err);
		throw error(500, `Failed to generate sitemap: ${err.message}`);
	}
}
