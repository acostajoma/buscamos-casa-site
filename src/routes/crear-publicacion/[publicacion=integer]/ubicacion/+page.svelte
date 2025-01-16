<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import DoubleColForm from '$lib/components/Forms/DoubleColForm.svelte';
	import Input from '$lib/components/Forms/Input.svelte';
	import SelectMenu from '$lib/components/Forms/SelectMenu.svelte';
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
	<div class="sm:col-span-full h-96">
		<Map {form} />
	</div>
{/snippet}

<div class="container mx-auto">
	<DoubleColForm
		{form}
		items={[
			{
				title: 'Ubicación',
				description:
					'Selecciona una provincia, luego un cantón y, finalmente, un distrito de Costa Rica. Para mayor precisión, se incluye un mapa interactivo: basta con hacer clic en el lugar donde se encuentra la propiedad y posteriormente el botón "Rellenar datos de Ubicación con los datos del mapa" y así se rellenará automáticamente la información de ubicación (provincia, cantón y distrito).',
				fields: formItems
			}
		]}
	>
		{#snippet button()}
			<Button type="submit" {form} disabled={false}>Siguiente</Button>
		{/snippet}
	</DoubleColForm>
</div>
