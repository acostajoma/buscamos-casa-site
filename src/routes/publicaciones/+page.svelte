<script lang="ts">
	import Filters from '$lib/components/Filters.svelte';
	import GridList from '$lib/components/GridList.svelte';
	import MetaData from '$lib/components/MetaData.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { type MetaDataConfig } from '$lib/utils/metadata';
	import { type PageData } from './$types';

	const title = 'Publicaciones de Propiedades en Costa Rica | Buscamos.casa';
	const pageConfig: MetaDataConfig = {
		title,
		description:
			'Encuentra tu hogar ideal en Costa Rica. Explora una amplia selección de propiedades en venta y alquiler. Filtra por ubicación, tipo de propiedad y más. ¡Encuentra tu casa hoy!',
		keywords: [
			'propiedades en venta',
			'propiedades en alquiler',
			'bienes raíces Costa Rica',
			'casas en venta',
			'apartamentos en alquiler',
			'Buscamos.casa'
		],
		robots: 'index, follow',
		ogImageUrl: '/images/destacada.jpg'
	};

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();
</script>

<MetaData {pageConfig} />
<Sidebar>
	{#snippet formFields()}
		<Filters searchForm={data.form} />
	{/snippet}
	<GridList posts={data.posts} />
	<Pagination
		pageQuantity={data.pageQuantity}
		currentPage={data.currentPageNumber}
		resultsPerPage={data.resultsPerPage}
		resultsCount={data.postCount}
	/>
</Sidebar>
