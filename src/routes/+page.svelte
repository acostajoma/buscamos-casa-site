<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import GridList from '$lib/components/GridList.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import { companyPhoneNumber } from '$lib/utils/constants';
	import { createWhatsAppLink } from '$lib/utils/phone';
	import { type PageData } from './$types';

	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
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

<Hero
	headline="Estamos construyendo algo increíble"
	description="Muy pronto, encontrarás la mejor plataforma para comprar, vender y descubrir propiedades exclusivas."
>
	{#snippet announcement()}
		¿Quieres ser de los primeros en enterarte? <a
			target="_blank"
			href={createWhatsAppLink(
				'Estoy interesado en ser de los primeros usuarios de Buscamos.Casa',
				companyPhoneNumber
			)}
			class="font-semibold text-amber-600">Escríbenos por WhatsApp →</a
		>
	{/snippet}
	{#snippet bottomZone()}
		<!-- <a
			href="/unet"
			class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>Get started</a
		> -->
		<a href="/unete" class="text-sm/6 font-semibold text-gray-900"
			>Más información<span aria-hidden="true">→</span></a
		>
	{/snippet}
</Hero>
<Container>
	<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl xl:text-4xl mb-9">
		Ultimas Publicaciones
	</h1>
	<GridList posts={data.posts} />
</Container>
