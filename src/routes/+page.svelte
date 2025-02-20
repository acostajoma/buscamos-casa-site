<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import GridList from '$lib/components/GridList.svelte';
	import Hero from '$lib/components/Hero.svelte';
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
			href={createWhatsAppLink(
				encodeURIComponent('Estoy interesado en se de los primeros usuarios de Buscamos.Casa'),
				'50664674972'
			)}
			class="font-semibold text-indigo-600">Escríbenos por WhatsApp →</a
		>
	{/snippet}
</Hero>
<Container>
	<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl xl:text-4xl mb-9">
		Ultimas Publicaciones
	</h1>
	<GridList posts={data.posts} />
</Container>
