<script lang="ts">
	import { page } from '$app/state';
	import {
		generateMetaData,
		type GeneratedMetaData,
		type MetaDataConfig
	} from '$lib/utils/metadata';

	interface Props {
		pageConfig: MetaDataConfig;
	}
	let { pageConfig }: Props = $props();
	let meta: GeneratedMetaData = $derived(generateMetaData(pageConfig, page.url.href));
</script>

<svelte:head>
	<title>{meta.title}</title>
	{#if meta.description}
		<meta name="description" content={meta.description} />
	{/if}
	<meta name="robots" content={meta.robots} />
	<link rel="canonical" href={meta.canonicalUrl} />

	<meta property="og:title" content={meta.ogTitle} />
	{#if meta.ogDescription}
		<meta property="og:description" content={meta.ogDescription} />
	{/if}
	<meta property="og:type" content={meta.ogType} />
	<meta property="og:url" content={meta.ogUrl} />
	<meta property="og:locale" content={meta.ogLocale} />
	<meta property="og:site_name" content={meta.ogSiteName} />
	{#if meta.ogImageUrl}
		<meta property="og:image" content={meta.ogImageUrl} />
	{/if}

	<meta name="twitter:card" content={meta.twitterCard} />
	<meta name="twitter:title" content={meta.twitterTitle} />
	{#if meta.twitterDescription}
		<meta name="twitter:description" content={meta.twitterDescription} />
	{/if}
	{#if meta.twitterImage}
		<meta name="twitter:image" content={meta.twitterImage} />
	{/if}
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>
