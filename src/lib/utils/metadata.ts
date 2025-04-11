/**
 * Configuration options for generating page metadata.
 */
export type MetaDataConfig = {
	title: string; // The core title of the page (e.g., "Contact Us", "Beautiful House in Escazu")
	description?: string; // Meta description for search engines and social sharing
	robots?: 'index, follow' | 'noindex, follow' | 'index, nofollow' | 'noindex, nofollow'; // Robots directive
	canonicalUrl?: string; // Optional: Override the default canonical URL (defaults to pageUrl)
	ogType?: 'website' | 'article' | 'profile' | string; // Open Graph type (e.g., 'product' for Schema)
	ogImageUrl?: string; // URL for the main image used in social sharing
	ogLocale?: string; // Open Graph locale (e.g., 'es_CR', 'en_US')
	twitterCard?: 'summary' | 'summary_large_image'; // Twitter card type
	keywords?: string[];
};

/**
 * Structure containing the generated metadata values ready for use in <svelte:head>.
 */
export type GeneratedMetaData = {
	title: string; // Full title including site name
	description?: string;
	robots: string;
	canonicalUrl: string;
	ogTitle: string; // Often the base title without site name
	ogDescription?: string;
	ogType: string;
	ogUrl: string;
	ogLocale: string;
	ogSiteName: string;
	ogImageUrl?: string;
	twitterCard: 'summary' | 'summary_large_image';
	twitterTitle: string; // Often same as ogTitle
	twitterDescription?: string;
	twitterImage?: string; // Often same as ogImageUrl
	keywords?: string;
};

const SITE_NAME = 'Buscamos.casa';
const DEFAULT_LOCALE = 'es_CR'; // Default language/region

/**
 * Generates standard metadata objects for use in <svelte:head>.
 * @param config - Page-specific metadata configuration.
 * @param pageUrl - The full, current URL of the page (e.g., from page.url.pathname).
 * @returns An object containing calculated metadata values.
 */
export function generateMetaData(config: MetaDataConfig, pageUrl: URL): GeneratedMetaData {
	const fullTitle = `${config.title} | ${SITE_NAME}`;
	const robots = config.robots || 'index, follow'; // Default to indexable
	const description = config.description;
	const canonical = config.canonicalUrl || pageUrl.origin + pageUrl.pathname;
	const ogLocale = config.ogLocale || DEFAULT_LOCALE;
	const ogType = config.ogType || 'website'; // Default to website

	// Default twitter card depends on whether an image is provided
	const twitterCardDefault = config.ogImageUrl ? 'summary_large_image' : 'summary';
	const twitterCard = config.twitterCard || twitterCardDefault;
	const keywords = config.keywords?.join(', ') || '';

	return {
		title: fullTitle,
		description: description,
		robots: robots,
		canonicalUrl: canonical,
		ogTitle: config.title, // Use base title for OG/Twitter
		ogDescription: description,
		keywords,
		ogType: ogType,
		ogUrl: canonical, // Use canonical for OG URL
		ogLocale: ogLocale,
		ogSiteName: SITE_NAME,
		ogImageUrl: config.ogImageUrl || '/images/destacada.jpg',
		twitterCard: twitterCard,
		twitterTitle: config.title, // Use base title
		twitterDescription: description,
		twitterImage: config.ogImageUrl || '/images/destacada.jpg' // Use the same image
	};
}
