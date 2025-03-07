<script lang="ts">
	import { locationMap } from '$lib/utils/location/costaRicaData';
	import type { SearchSchema } from '$lib/validation/search';
	import { type Infer, type SuperForm } from 'sveltekit-superforms';
	import Button from './Button.svelte';
	import SelectMenu from './Forms/SelectMenu.svelte';

	type Props = {
		form: SuperForm<Infer<SearchSchema>>;
	};
	let { form }: Props = $props();

	const cantonEmptyState = ['Selecciona una provincia'];
	const districtEmptyState = ['Selecciona un cantón'];

	const { form: formStores } = form;

	let minSliderValue = $state(0); // value from 0-1
	let maxSliderValue = $state(1); // value from 0-1

	let states = $state(locationMap.keys().toArray() ?? []);

	let cantons: string[] = $derived(
		($formStores.state ? locationMap.get($formStores.state)?.keys().toArray() : cantonEmptyState) ??
			cantonEmptyState
	);
	let districts: string[] = $derived(
		($formStores.state && $formStores.city
			? locationMap.get($formStores.state)?.get($formStores.city)?.keys().toArray()
			: districtEmptyState) ?? districtEmptyState
	);

	// $effect(() => {
	// 	$formStores.price.min = minSliderValue * maxNumberValue;
	// 	$formStores.price.max = maxSliderValue * maxNumberValue;
	// });
</script>

<div class="relative isolate px-6 py-10 sm:py-20 lg:px-8">
	<div class="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
		<div
			class="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
			style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
		></div>
	</div>
	<div class="mx-auto max-w-3xl py-10 sm:py-36 lg:py-48">
		<div class="text-center">
			<h1 class="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
				Busca tu propiedad ideal
			</h1>
			<form
				action="/publicaciones"
				method="GET"
				class="grid grid-cols-4 gap-6 sm:grid-cols-6 px-6 sm:px-0 mt-10"
			>
				<div class="col-span-4 sm:col-span-2">
					<SelectMenu id="state" label="Provincia" name="state" {form} options={states}
					></SelectMenu>
				</div>
				<div class="col-span-2 sm:col-span-2">
					<SelectMenu id="city" label="Canton" name="city" {form} options={cantons}></SelectMenu>
				</div>
				<div class="col-span-2 sm:col-span-2">
					<SelectMenu id="district" label="Distrito" name="district" {form} options={districts}
					></SelectMenu>
				</div>
				<!-- <div class="col-span-4 sm:col-span-3">
					<Fieldset {form} name="propertyType" options={propertyTypes} type="checkbox" doubleCol>
						{#snippet legendSnippet()}
							<legend class="text-sm/6 font-semibold text-gray-900 text-left">
								Tipo de propiedad que buscas
							</legend>
						{/snippet}
					</Fieldset>
				</div>
				<div class="col-span-4 sm:col-span-3 sm:ml-8">
					<Fieldset
						{form}
						legend="Tipo de contrato"
						name="saleType"
						options={['Compra', 'Alquiler']}
						type="radio"
					>
						{#snippet legendSnippet()}
							<legend class="text-sm/6 font-semibold text-gray-900 text-left">
								Tipo de contrato
							</legend>
						{/snippet}
					</Fieldset>
				</div>
				{#if $formStores.saleType}
					<div class="col-span-2">
						<SelectMenu id="currency" label="Moneda" name="currency" {form} options={currencies}
						></SelectMenu>
					</div>

					<div class="col-span-4 mt-5 sm:mt-0">
						<div class="flex flex-col gap-2">
							<div class="flex flex-col sm:flex-row gap-2">
								<p class="block text-sm font-semibold leading-6 text-gray-900 place-self-start">
									Rango de precio
								</p>
								<p class="font-normal text-gray-600 place-self-start">
									(
									{formatCurrency($formStores.price.min, $formStores.currency as Currencies, 0)}
									-
									{formatCurrency($formStores.price.max, $formStores.currency as Currencies, 0)}
									)
								</p>
							</div>

							<DoubleRangeSlider
								bind:start={minSliderValue}
								bind:end={maxSliderValue}
								min={0}
								max={maxNumberValue}
								currency="Colon"
							/>
						</div>
					</div>
				{/if} -->
				<Button type="submit" {form}>Buscar</Button>
			</form>
		</div>
	</div>
</div>
