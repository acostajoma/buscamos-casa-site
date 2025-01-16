<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import DoubleColForm from '$lib/components/Forms/DoubleColForm.svelte';
	import Input from '$lib/components/Forms/Input.svelte';
	import SelectMenu from '$lib/components/Forms/SelectMenu.svelte';
	import Link from '$lib/components/Link.svelte';
	import Map from '$lib/components/Map.svelte';
	import { locationMap } from '$lib/utils/location/costaRicaData';
	import { locationSchema } from '$lib/validation/post';
	import { untrack } from 'svelte';
	import { formFieldProxy, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const form = superForm(data.form, {
		validationMethod: 'oninput',
		validators: zod(locationSchema),
		customValidity: false,
		dataType: 'json'
	});
	let disabledButton = $derived(!data.form.valid);

	const { value: stateValue } = formFieldProxy(form, 'state');
	const { value: cantonValue } = formFieldProxy(form, 'city');

	let states = $state(locationMap.keys().toArray() ?? []);
	let cantons = $state(locationMap.get($stateValue)?.keys().toArray() ?? []);
	let districts = $state(locationMap.get($stateValue)?.get($cantonValue)?.keys().toArray() ?? []);

	$effect(() => {
		if ($stateValue) {
			untrack(() => {
				cantons = locationMap.get($stateValue)?.keys().toArray() ?? [];
			});
		}
	});

	$effect(() => {
		if ($cantonValue) {
			untrack(() => {
				districts = locationMap.get($stateValue)?.get($cantonValue)?.keys().toArray() ?? [];
			});
		}
	});
</script>

{#snippet formItems()}
	<div class="sm:col-span-3">
		<SelectMenu {form} id="state" name="state" label="Provincia" options={states} />
	</div>
	<div class="sm:col-span-3">
		<SelectMenu {form} id="city" name="city" label="Cantón" options={cantons} />
	</div>
	<div class="sm:col-span-3">
		<SelectMenu {form} id="district" name="district" label="Distrito" options={districts} />
	</div>
	<div class="sm:col-span-full">
		<Input {form} type="text" id="address" name="address" label="Dirección" required />
	</div>
	<div class="sm:col-span-full">
		<p class="block text-sm font-semibold leading-6 text-gray-900 mb-1">
			Coordenadas de la propiedad
		</p>
		<span class="text-sm leading-6 text-gray-600 mb-1"
			>Selecciona la ubicación de la propiedad en el mapa. Si no deseas proveer la dirección exacta,
			selecciona un lugar de referencia cercano.</span
		>
		<div class="h-96">
			<Map {form} />
		</div>
	</div>
{/snippet}

<div class="container mx-auto">
	<DoubleColForm
		{form}
		items={[
			{
				title: 'Ubicación',
				description:
					'Selecciona una provincia, luego un cantón y, finalmente, un distrito de Costa Rica. Para mayor precisión, se incluye un mapa interactivo: basta con hacer clic en el lugar donde se encuentra la propiedad y posteriormente el botón "Rellenar datos de Ubicación con los datos del mapa" y así se rellenará automáticamente la información de provincia, cantón y distrito.',
				fields: formItems
			}
		]}
	>
		{#snippet button()}
			<Link href={`/crear-publicacion/${page.params.publicacion}/detalles-financieros`}>
				Anterior
			</Link>
			<p class="text-sm text-gray-500">Paso 3 de 4</p>
			<Button type="submit" {form} disabled={disabledButton}>Siguiente</Button>
		{/snippet}
	</DoubleColForm>
</div>
