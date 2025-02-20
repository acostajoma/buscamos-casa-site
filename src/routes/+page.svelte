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
	<title>Inicio | Buscamos.casa</title>
</svelte:head>

<Hero
	headline="Estamos construyendo algo increíble"
	description="Muy pronto, encontrarás la mejor plataforma para comprar, vender y descubrir propiedades exclusivas."
>
	{#snippet announcement()}
		¿Quieres ser de los primeros en enterarte? <a
			target="_blank"
			href={createWhatsAppLink(
				encodeURIComponent('Estoy interesado en ser de los primeros usuarios de Buscamos.Casa'),
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
