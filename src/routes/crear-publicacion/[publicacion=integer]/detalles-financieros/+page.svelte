<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import DoubleColForm from '$lib/components/Forms/DoubleColForm.svelte';
	import Fieldset from '$lib/components/Forms/Fieldset.svelte';
	import Input from '$lib/components/Forms/Input.svelte';
	import Link from '$lib/components/Link.svelte';
	import { getPropertyForm } from '$lib/utils/forms';
	import { currencies } from '$lib/utils/postConstants';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { property } = $state(data);

	const form = superForm(data.form, {
		validationMethod: 'oninput',
		validators: getPropertyForm(data.property),
		customValidity: false
	});

	let disabledButton = $derived(!data.form.valid);

	let formItems = $derived.by(() => {
		const items = [
			{
				title: 'Financiero',
				description: 'Aspectos financieros de la propiedad',
				fields: financeFields
			}
		];
		if (property.propertyType !== 'Lote' && property.propertyType !== 'Finca') {
			items.push({
				title: 'Propiedad',
				description: 'Aspectos de la propiedad',
				fields: propertyFields
			});
		}

		return items;
	});
</script>

{#snippet financeFields()}
	<div class="sm:col-span-full">
		<Fieldset
			{form}
			legend="Moneda"
			description="Selecciona la moneda en la que se ofrece la propiedad."
			name="currency"
			options={currencies}
			type="radio"
		></Fieldset>
	</div>
	{#if property.saleType.some(({ type }) => type === 'Venta')}
		<div class="sm:col-span-3">
			<Input
				{form}
				label="Precio de venta"
				name="salePrice"
				id="salePrice"
				type="number"
				required
			/>
		</div>
	{/if}

	{#if property.saleType.some(({ type }) => type === 'Alquiler' || type === 'Alquiler con opción a compra')}
		<div class="sm:col-span-3">
			<Input
				{form}
				label="Precio de renta"
				name="rentPrice"
				id="rentPrice"
				type="number"
				required
			/>
		</div>
	{/if}
{/snippet}

{#snippet propertyFields()}
	<div class="sm:col-span-3">
		<Input
			{form}
			label={property.propertyType === 'Oficina'
				? 'Número de áreas de trabajo'
				: 'Número de habitaciones'}
			name="numBedrooms"
			id="numBedrooms"
			type="number"
			required
		/>
	</div>
	<div class="sm:col-span-3">
		<Input
			{form}
			label="Cantidad de baños"
			name="numBathrooms"
			id="numBathrooms"
			type="number"
			required
		/>
	</div>
	<div class="sm:col-span-3">
		<Input
			{form}
			label="Espacios de estacionamiento"
			name="garageSpace"
			id="garageSpace"
			type="number"
			required
		/>
	</div>
	<div class="sm:col-span-3">
		<Input
			{form}
			label="Año de construcción"
			name="yearBuilt"
			id="yearBuilt"
			type="number"
			required
		/>
	</div>
{/snippet}

<div class="container mx-auto">
	<DoubleColForm {form} items={formItems}>
		{#snippet button()}
			<Link href={`/crear-publicacion/${page.params.publicacion}`}>Anterior</Link>
			<p class="text-sm text-gray-500">Paso 2 de 4</p>

			<Button type="submit" {form} disabled={disabledButton}>Siguiente</Button>
		{/snippet}
	</DoubleColForm>
</div>
