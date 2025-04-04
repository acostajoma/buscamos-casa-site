<script lang="ts">
	import { page } from '$app/state';
	import { type Photo } from '$lib/server/db/schema';
	import type { PropertyWithAllData } from '$lib/server/utils/postsUtils';
	import { serializeSchema } from '$lib/utils/formatters';
	import { getPhotoUrl } from '$lib/utils/photos';
	import { createPostMetadataSchema } from '$lib/utils/post';

	type Props = {
		post: NonNullable<PropertyWithAllData>;
		robots?: string;
		type?: string;
		locale?: string;
		orderedPhotos: Omit<Photo, 'propertyId'>[] | null;
	};
	let {
		post,
		robots = 'index, follow',
		type = 'website',
		locale = 'es_CR',
		orderedPhotos
	}: Props = $props();

	let keywords = $derived.by(() => {
		let keywordsString = '';
		const { location, propertyType, listingStatus, saleType } = post || {};
		const saleTypesString = saleType?.map((type) => type?.type || '').join(', ');
		return `${location?.country}, ${location?.state}, ${location?.city}, ${location?.district}, ${propertyType}, ${saleTypesString} `;
	});

	let primaryPhoto = orderedPhotos ? orderedPhotos[0] : null;

	let url = $derived(page.url.toString());
	// Generate JSON-LD structured data for the listing.
	let structuredData = $derived.by(() => {
		return serializeSchema(createPostMetadataSchema(post, url, primaryPhoto?.id));
	});
</script>

<svelte:head>
	<!-- Basic SEO -->
	<title>{post.title}</title>
	<meta name="description" content={post.description} />
	<meta name="keywords" content={keywords} />
	<meta name="robots" content={robots} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href={url} />

	<!-- Open Graph Tags -->
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.description} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
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
