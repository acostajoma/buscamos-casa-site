<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import GridContactList from '$lib/components/GridContactList.svelte';
	import MetaData from '$lib/components/MetaData.svelte';
	import type { MetaDataConfig } from '$lib/utils/metadata';
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
	const pageConfig: MetaDataConfig = {
		title: 'Vendedores exclusivos de la plataforma Buscamos Casa',
		description:
			'Descubre a los vendedores exclusivos de Buscamos Casa. Conoce a los agentes inmobiliarios y corredores de bienes raíces que ofrecen las mejores propiedades en Costa Rica. ¡Contacta directamente con los expertos!',
		robots: 'index, follow'
	};
</script>

<MetaData {pageConfig} />
<Container>
	<h1 class="text-4xl font-bold tracking-tight text-gray-900 mb-10">Vendedores exclusivos</h1>
	<GridContactList vendors={data.exclusiveVendors} />
</Container>
