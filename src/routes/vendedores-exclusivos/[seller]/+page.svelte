<script lang="ts">
	import { page } from '$app/state';
	import Container from '$lib/components/Container.svelte';
	import GridList from '$lib/components/GridList.svelte';
	import MetaData from '$lib/components/MetaData.svelte';
	import type { MetaDataConfig } from '$lib/utils/metadata';
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
	let vendorName = $derived(page.params.seller);
	let pageConfig: MetaDataConfig = $derived({
		title: `Propiedades de ${vendorName} en Buscamos Casa`,
		description: `Explora las propiedades de ${vendorName} en Buscamos Casa. Encuentra casas, apartamentos y más con este vendedor exclusivo.`,
		robots: 'index, follow'
	});
</script>

<MetaData {pageConfig} />

<Container>
	<h1 class="text-4xl font-bold tracking-tight text-gray-900 mb-10">
		Propiedades publicadas por {vendorName}
	</h1>
	<GridList posts={data.posts} />
</Container>
