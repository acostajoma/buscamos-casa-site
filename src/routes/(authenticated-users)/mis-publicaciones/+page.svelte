<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import GridList from '$lib/components/GridList.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />

	<title>Mis Publicaciones | Buscamos.casa</title>
</svelte:head>

<Container>
	<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl xl:text-4xl mb-9">
		Mis Publicaciones
	</h1>
	{#if data.posts.length > 0}
		<p class=" text-gray-500 text-sm mb-4">
			Nota: Publicaciones con Estados diferentes a "Publicado" no se mostrarán a los usuarios
		</p>
	{/if}

	<GridList
		posts={data.posts}
		owner
		noPostsMessage="Aún no has publicado contenido, crea una publicacion para vender o alquilar tu propiedad!"
	/>
</Container>
