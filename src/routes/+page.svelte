<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import GridList from '$lib/components/GridList.svelte';
	import SearchBanner from '$lib/components/SearchBanner.svelte';
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
</script>

<svelte:head>
	<title>Encuentra tu hogar ideal | Buscamos.casa</title>
	<meta
		name="description"
		content="Descubre las mejores propiedades en venta y alquiler. Encuentra tu hogar ideal con Buscamos.casa."
	/>
	<meta
		name="keywords"
		content="bienes raíces, casas en venta, alquiler de propiedades, compra de casa, inmobiliaria"
	/>
	<meta name="robots" content="index, follow" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="https://www.buscamos.casa/" />

	<!-- Open Graph Tags -->
	<meta property="og:title" content="Encuentra tu hogar ideal | Buscamos.casa" />
	<meta
		property="og:description"
		content="Descubre las mejores propiedades en venta y alquiler. Encuentra tu hogar ideal con Buscamos.casa."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.buscamos.casa/" />
	<meta property="og:locale" content="es_ES" />
	<meta property="og:site_name" content="Buscamos.casa" />
	<meta property="og:image" content="/images/destacada.jpg" />
</svelte:head>

<SearchBanner form={searchForm} />
<Container>
	<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl xl:text-4xl mb-9">
		Ultimas Publicaciones
	</h1>
	<GridList posts={data.posts} />
</Container>
