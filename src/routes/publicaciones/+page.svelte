<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import GridList from '$lib/components/GridList.svelte';
	import { type PageData } from './$types';

	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Publicaciones | Buscamos.casa</title>
</svelte:head>

<Container>
	<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl xl:text-4xl mb-9">
		Publicaciones
	</h1>
	<GridList posts={data.posts} />
</Container>
