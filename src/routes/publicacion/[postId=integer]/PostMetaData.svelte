<script lang="ts">
	import { page } from '$app/state';
	import { cloudinaryUrl } from '$lib/utils/constants';
	import { serializeSchema } from '$lib/utils/formatters';
	import type { PropertyWithAllData } from '../../../ambient';

	type Props = {
		post: PropertyWithAllData;
		robots?: string;
		type?: string;
		locale?: string;
	};
	let { post, robots = 'index, follow', type = 'website', locale = 'es_CR' }: Props = $props();

	let keywords = $derived.by(() => {
		let keywordsString = '';
		const { location, propertyType, listingStatus, saleType } = post;
		const saleTypesString = saleType.map((type) => type?.type ?? '').join(', ');
		return `${location.country}, ${location?.state}, ${location?.city}, ${location?.district}, ${propertyType}, ${saleTypesString} `;
	});
	// Helper function to build a photo URL.
	// Adjust the base URL to match your image hosting.
	function getPhotoUrl(photoId: string) {
		return `${cloudinaryUrl}/image/upload/c_scale,h_675,w_auto/f_auto/q_auto/${photoId}`;
	}

	// Pick the primary image from the photos array (lowest order)
	let primaryPhoto = post.photos ? [...post.photos].sort((a, b) => a.order - b.order)[0] : null;

	// Generate JSON-LD structured data for the listing.
	let structuredData = $derived.by(() => {
		// Using window.location.href if available (client side), otherwise fallback.
		const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';
		return serializeSchema({
			'@context': 'https://schema.org',
			'@type': 'Offer',
			name: post.title,
			description: post.description,
			url: canonicalUrl,
			price: post.propertyFinancialDetails?.salePrice,
			priceCurrency: post.propertyFinancialDetails?.currency,
			itemOffered: {
				'@type': 'Product',
				name: post.title,
				description: post.description,
				image: primaryPhoto ? getPhotoUrl(primaryPhoto.id) : undefined,
				additionalProperty: [
					{
						'@type': 'PropertyValue',
						name: 'Property Type',
						value: post.propertyType
					},
					{
						'@type': 'PropertyValue',
						name: 'Size',
						value: post.size
					},
					{
						'@type': 'PropertyValue',
						name: 'Listing Status',
						value: post.listingStatus
					}
				]
			},
			seller: {
				'@type': 'Person',
				name: post.sellerInformation
					? `${post.sellerInformation.name} ${post.sellerInformation.lastName || ''}`.trim()
					: ''
			}
		});
	});
</script>

<svelte:head>
	<!-- Basic SEO -->
	<title>{post.title}</title>
	<meta name="description" content={post.description} />
	<meta name="keywords" content={keywords} />
	<meta name="robots" content={robots} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href={page.url.toString()} />

	<!-- Open Graph Tags -->
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.description} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={page.url.toString()} />
	<meta property="og:locale" content={locale} />
	<meta property="og:site_name" content="Buscamos.casa" />

	{#if primaryPhoto}
		<meta property="og:image" content={getPhotoUrl(primaryPhoto.id)} />
	{/if}

	<!-- Twitter Card Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={post.title} />
	<meta name="twitter:description" content={post.description} />
	{#if primaryPhoto}
		<meta name="twitter:image" content={getPhotoUrl(primaryPhoto.id)} />
	{/if}

	<!-- Structured Data for SEO -->
	{@html structuredData}
</svelte:head>

<!-- The component doesn't render any visible HTML -->
