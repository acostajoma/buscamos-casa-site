<script lang="ts">
	import SelectMenu from '$lib/components/Forms/SelectMenu.svelte';
	import { locationMap } from '$lib/utils/location/costaRicaData';
	import { locationSchema } from '$lib/validation/post';
	import { formFieldProxy, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const form = superForm(data.form, {
		validationMethod: 'oninput',
		validators: zod(locationSchema),
		customValidity: false
	});
	const { value: stateValue } = formFieldProxy(form, 'state');
	const { value: cantonValue } = formFieldProxy(form, 'city');
	const { value: districtValue } = formFieldProxy(form, 'district');

	let states = $state(locationMap.keys().toArray() ?? []);
	let cantons = $state(locationMap.get($stateValue)?.keys().toArray() ?? []);
	let districts = $state(locationMap.get($stateValue)?.get($cantonValue)?.keys().toArray() ?? []);
</script>

<p>Ubicación</p>

<SelectMenu
	{form}
	id="state"
	name="state"
	label="Provincia"
	options={states}
	onchange={() => {
		cantons = locationMap.get($stateValue)?.keys().toArray() ?? [];
		$cantonValue = cantons[0];
		districts = locationMap.get($stateValue)?.get($cantonValue)?.keys().toArray() ?? [];
		$districtValue = districts[0];
	}}
/>

<SelectMenu
	{form}
	id="city"
	name="city"
	label="Cantón"
	options={cantons}
	onchange={() => {
		districts = locationMap.get($stateValue)?.get($cantonValue)?.keys().toArray() ?? [];
		$districtValue = districts[0];
	}}
/>

<SelectMenu {form} id="district" name="district" label="Distrito" options={districts} />
