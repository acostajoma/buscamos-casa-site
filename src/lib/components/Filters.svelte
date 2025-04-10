<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import SelectMenu from '$lib/components/Forms/SelectMenu.svelte';
	import {
		exclusiveSellerNames,
		maxAmountInColones,
		maxAmountInDollars
	} from '$lib/utils/constants';
	import { locationMap, states } from '$lib/utils/location/costaRicaData';
	import { currencies } from '$lib/utils/postConstants';
	import { searchSchema, type SearchSchema } from '$lib/validation/search';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import DoubleRangeSlider from './DoubleRangeSlider.svelte';
	import Fieldset from './Fieldset.svelte';
	import BoolCheckBox from './Forms/BoolCheckBox.svelte';

	type Props = {
		searchForm: SuperValidated<Infer<SearchSchema>>;
	};

	let { searchForm }: Props = $props();

	const debug = true;
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

	let showExclusiveSellerFilter = $derived.by(() => {
		const exclusiveSellerParamValue = page.url.searchParams.get('exclusiveSeller');
		return typeof exclusiveSellerParamValue === 'string' && exclusiveSellerParamValue !== 'Todos';
	});

	let maxAllowedNumberValue = $state.raw(
		$formStores.currency === 'Dólar' ? maxAmountInDollars : maxAmountInColones
	);

	const handleCurrencyChange = () => {
		if ($formStores.currency === 'Dólar') {
			maxAllowedNumberValue = maxAmountInDollars;
			$formStores.maxPrice = maxAmountInDollars;
		} else {
			maxAllowedNumberValue = maxAmountInColones;
			$formStores.maxPrice = maxAmountInColones;
		}
	};

	const onRentSelected = () => {
		if ($formStores.isForRent || $formStores.isRentToBuy) {
			$formStores.isForSale = false;
		}
	};
	const onSaleSelected = () => {
		if ($formStores.isForSale) {
			$formStores.isForRent = false;
			$formStores.isRentToBuy = false;
		}
	};
</script>

<div class="border-t border-gray-200 pt-4 pb-4">
	<form action="/publicaciones" method="get">
		<fieldset>
			<div class="px-4 pt-4 pb-2">
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
			<div class="px-4 pt-4 pb-2">
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
			<div class="px-4 pt-4 pb-2">
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
			<Fieldset legend="Modalidad">
				<div class="space-y-2">
					<BoolCheckBox
						form={searchSuperForm}
						name="isForSale"
						label="Venta"
						onchange={onSaleSelected}
					/>
					<BoolCheckBox
						form={searchSuperForm}
						name="isForRent"
						label="Alquiler"
						onchange={onRentSelected}
					/>
					<BoolCheckBox
						form={searchSuperForm}
						name="isRentToBuy"
						label="Alquiler con opción a compra"
						onchange={onRentSelected}
					/>
				</div>
			</Fieldset>
		</div>
		<fieldset>
			<div class="px-4 pt-4 pb-2">
				<SelectMenu
					id="currency"
					label="Moneda"
					name="currency"
					form={searchSuperForm}
					options={currencies}
					onchange={handleCurrencyChange}
				/>
			</div>
			<div class="px-4 pt-4 pb-2">
				<DoubleRangeSlider form={searchSuperForm} {maxAllowedNumberValue} />
			</div>
		</fieldset>
		{#if showExclusiveSellerFilter}
			<fieldset>
				<div class="px-4 pt-4 pb-2">
					<SelectMenu
						id="exclusiveSeller"
						label="Filtrar por Vendedores"
						name="exclusiveSeller"
						form={searchSuperForm}
						options={exclusiveSellerNames}
					/>
				</div>
			</fieldset>
		{/if}

		<div class="px-4 pt-4 pb-2">
			<Button type="submit" form={searchSuperForm}>Buscar</Button>
		</div>
	</form>
</div>

{#if dev && debug}
	<SuperDebug data={searchSuperForm.form} />
{/if}
