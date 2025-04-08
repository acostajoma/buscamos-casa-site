<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import SelectMenu from '$lib/components/Forms/SelectMenu.svelte';
	import { locationMap, states } from '$lib/utils/location/costaRicaData';
	import { searchSchema, type SearchSchema } from '$lib/validation/search';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	type Props = {
		searchForm: SuperValidated<Infer<SearchSchema>>;
	};

	let { searchForm }: Props = $props();

	const searchSuperForm = superForm(searchForm, {
		validationMethod: 'onblur',
		validators: zod(searchSchema),
		customValidity: false,
		dataType: 'json'
	});

	const { form: formStores } = searchSuperForm;
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

<div class="border-t border-gray-200 pt-4 pb-4">
	<form action="/publicaciones" method="get">
		<fieldset>
			<div class="px-4 pt-4 pb-2" id="filter-section-0">
				<div class="space-y-6">
					<SelectMenu
						id="state"
						label="Provincia"
						name="state"
						options={states}
						form={searchSuperForm}
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
						form={searchSuperForm}
					/>
				</div>
			</div>
			<div class="px-4 pt-4 pb-2" id="filter-section-0">
				<div class="space-y-6">
					<SelectMenu
						id="district"
						label="Distrito"
						name="district"
						form={searchSuperForm}
						options={districts}
					/>
				</div>
			</div>
		</fieldset>
		<div class="px-4 pt-4 pb-2">
			<Button type="submit" form={searchSuperForm}>Buscar</Button>
		</div>
	</form>
</div>
