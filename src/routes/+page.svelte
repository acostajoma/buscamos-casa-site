<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import GridContactList from '$lib/components/GridContactList.svelte';
	import GridList from '$lib/components/GridList.svelte';
	import MetaData from '$lib/components/MetaData.svelte';
	import SearchBanner from '$lib/components/SearchBanner.svelte';
	import type { MetaDataConfig } from '$lib/utils/metadata';
	import { searchSchema } from '$lib/validation/search';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { type PageData } from './$types';

	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
	const searchForm = superForm(data.form, {
		validationMethod: 'onblur',
		validators: zod(searchSchema),
		customValidity: false,
		dataType: 'json'
	});
	const pageConfig: MetaDataConfig = {
		title: 'Encuentra tu hogar ideal | Buscamos.casa',
		canonicalUrl: 'https://www.buscamos.casa/',
		description:
			'Descubre las mejores propiedades en venta y alquiler en Costa Rica. Encuentra tu hogar ideal con Buscamos.casa.',
		keywords: [
			'bienes raíces',
			'casas en venta',
			'alquiler de propiedades',
			'compra de casa',
			'inmobiliaria',
			'Casas en venta en Costa Rica'
		],
		robots: 'index, follow',
		ogImageUrl: '/images/destacada.jpg',
		ogLocale: 'es_CR',
		ogType: 'website'
	};
</script>

<MetaData {pageConfig} />

<SearchBanner form={searchForm} />
<Container>
	{#if data.exclusiveVendors}
		<h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl xl:text-4xl mb-9">
			Vendedores exclusivos
		</h2>
		<GridContactList vendors={data.exclusiveVendors} />
	{/if}
	<h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl xl:text-4xl my-16">
		Últimas Publicaciones
	</h2>
	<GridList posts={data.posts} />
	{#if data?.posts?.length}
		<Divider><a href="/publicaciones">Ver más publicaciones</a></Divider>
	{/if}
</Container>
