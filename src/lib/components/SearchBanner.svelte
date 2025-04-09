<script lang="ts">
	import { locationMap, states } from '$lib/utils/location/costaRicaData';
	import { getCantonsArray } from '$lib/utils/location/helpers';
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

	// let minSliderValue = $state(0); // value from 0-1
	// let maxSliderValue = $state(1); // value from 0-1
	let cantons: string[] = $derived(
		$formStores.state ? getCantonsArray($formStores.state) : cantonEmptyState
	);
	let districts: string[] = $derived(
		($formStores.state && $formStores.city
			? Array.from(locationMap.get($formStores.state)?.get($formStores.city)?.keys() || [])
			: districtEmptyState) || districtEmptyState
	);

	let buttonDisabled = $derived.by(() => {
		if ($formStores.state) return false;
		if (!$formStores.city || $formStores.city === cantonEmptyState[0]) return true;
		if (!$formStores.district || $formStores.district === districtEmptyState[0]) return true;
		return false;
	});
</script>

<div class="relative isolate px-6 py-10 sm:py-20 lg:px-8">
	<div class="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
		<div
			class="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
			style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
		></div>
	</div>
	<div class="mx-auto max-w-3xl py-10 sm:py-24 lg:py-36">
		<div class="text-center">
			<h1 class="text-3xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
				Encuentra Casas y Apartamentos en Costa Rica
			</h1>
			<p class="text-xs sm:text-sm text-gray-700 mt-2 sm:mt-6 mx-4">
				Bienvenido a Buscamos.casa, tu portal de confianza para encontrar las mejores propiedades en
				venta y alquiler en todo Costa Rica. Explora listados actualizados de casas, apartamentos y
				terrenos y encuentra hoy mismo tu hogar ideal.
			</p>
			<form
				action="/publicaciones"
				method="GET"
				class="grid grid-cols-4 gap-6 sm:grid-cols-6 px-6 sm:px-0 mt-6 sm:mt-10"
			>
				<div class="col-span-4 sm:col-span-2">
					<SelectMenu id="state" label="Provincia" name="state" {form} options={states}
					></SelectMenu>
				</div>
				<div class="col-span-2">
					<SelectMenu id="city" label="Cantón" name="city" {form} options={cantons}></SelectMenu>
				</div>
				<div class="col-span-2">
					<SelectMenu id="district" label="Distrito" name="district" {form} options={districts}
					></SelectMenu>
				</div>

				<div class="col-start-2 col-span-2 sm:col-start-6 sm:col-span-1">
					<Button type="submit" additionalClasses="w-full" {form} disabled={buttonDisabled}
						>Buscar</Button
					>
				</div>
			</form>
		</div>
	</div>
</div>
