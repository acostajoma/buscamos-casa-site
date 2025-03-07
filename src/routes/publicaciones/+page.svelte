<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import SelectMenu from '$lib/components/Forms/SelectMenu.svelte';
	import GridList from '$lib/components/GridList.svelte';
	import SidebarFilters from '$lib/components/SidebarFilters.svelte';
	import { locationMap } from '$lib/utils/location/costaRicaData';
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

	const { form: formStores } = searchForm;
	const cantonEmptyState = ['Selecciona una provincia'];
	const districtEmptyState = ['Selecciona un cantón'];

	const states = Array.from(locationMap.keys()) || [];
	let cantons: string[] = $derived(
		($formStores.state ? locationMap.get($formStores.state)?.keys().toArray() : cantonEmptyState) ||
			cantonEmptyState
	);
	let districts: string[] = $derived(
		($formStores.state && $formStores.city
			? locationMap.get($formStores.state)?.get($formStores.city)?.keys().toArray()
			: districtEmptyState) || districtEmptyState
	);
</script>

<svelte:head>
	<title>Publicaciones | Buscamos.casa</title>
</svelte:head>

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
								label="Canton"
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
