<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import SelectMenu from '$lib/components/Forms/SelectMenu.svelte';
	import GridList from '$lib/components/GridList.svelte';
	import MetaData from '$lib/components/MetaData.svelte';
	import SidebarFilters from '$lib/components/SidebarFilters.svelte';
	import { locationMap, states } from '$lib/utils/location/costaRicaData';
	import { type MetaDataConfig } from '$lib/utils/metadata';
	import { searchSchema } from '$lib/validation/search';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
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

	const searchForm = superForm(data.form, {
		validationMethod: 'onblur',
		validators: zod(searchSchema),
		customValidity: false,
		dataType: 'json'
	});

	const { form: formStores } = searchForm;
	const cantonEmptyState = ['Selecciona una provincia'];
	const districtEmptyState = ['Selecciona un cantón'];

	let cantons: string[] = $derived(
		($formStores.state
			? Array.from(locationMap.get($formStores.state)?.keys() || [])
			: cantonEmptyState) || cantonEmptyState
	);
	let districts: string[] = $derived(
		($formStores.state && $formStores.city
			? Array.from(locationMap.get($formStores.state)?.get($formStores.city)?.keys() || [])
			: districtEmptyState) || districtEmptyState
	);
</script>

<MetaData {pageConfig} />
<SidebarFilters>
	{#snippet formFields()}
		<div class="border-t border-gray-200 pt-4 pb-4">
			<form action="/publicaciones" method="get">
				<fieldset>
					<!-- <legend class="w-full px-2">
					<span class="text-sm font-lg text-gray-900 pl-2">Ubicación</span>
				</legend> -->
					<div class="px-4 pt-4 pb-2" id="filter-section-0">
						<div class="space-y-6">
							<SelectMenu
								id="state"
								label="Provincia"
								name="state"
								options={states}
								form={searchForm}
							/>
						</div>
					</div>
					<div class="px-4 pt-4 pb-2" id="filter-section-0">
						<div class="space-y-6">
							<SelectMenu
								id="city"
								label="Cantón"
								name="city"
								options={cantons}
								form={searchForm}
							/>
						</div>
					</div>
					<div class="px-4 pt-4 pb-2" id="filter-section-0">
						<div class="space-y-6">
							<SelectMenu
								id="district"
								label="Distrito"
								name="district"
								form={searchForm}
								options={districts}
							/>
						</div>
					</div>
				</fieldset>
				<div class="px-4 pt-4 pb-2">
					<Button type="submit" form={searchForm}>Buscar</Button>
				</div>
			</form>
		</div>
	{/snippet}
	<GridList posts={data.posts} />
</SidebarFilters>
