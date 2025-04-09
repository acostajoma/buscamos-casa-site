<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import BoolCheckBox from '$lib/components/Forms/BoolCheckBox.svelte';
	import DoubleColForm from '$lib/components/Forms/DoubleColForm.svelte';
	import Input from '$lib/components/Forms/Input.svelte';
	import OptionsFieldset from '$lib/components/Forms/OptionsFieldset.svelte';
	import TextArea from '$lib/components/Forms/TextArea.svelte';
	import { propertyTypes } from '$lib/utils/postConstants';
	import { propertySchema } from '$lib/validation/post';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { z } from 'zod';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type FormData = z.infer<typeof propertySchema>;

	const form = superForm<FormData>(data.form, {
		validationMethod: 'oninput',
		validators: zod(propertySchema),
		customValidity: false
	});

	let { valid } = data.form;
</script>

{#snippet content()}
	<div class="sm:col-span-full">
		<Input {form} label="Título" name="title" id="title" type="text" required />
	</div>
	<div class="sm:col-span-full">
		<TextArea {form} label="Descripción" name="description" id="description" required />
	</div>
	<div class="sm:col-span-full">
		<Input {form} label="Tamaño de la propiedad" name="size" id="size" type="number" required />
	</div>

	<div class="sm:col-span-3">
		<Fieldset
			description="Selecciona todas las modalidades que apliquen para la propiedad"
			legend="Modalidad de negocio"
		>
			<div class="mt-6 space-y-6">
				<BoolCheckBox {form} name="isForSale" label="Venta" />
				<BoolCheckBox {form} name="isForRent" label="Alquiler" />
				<BoolCheckBox {form} name="isRentToBuy" label="Alquiler con opción a compra" />
			</div>
		</Fieldset>
	</div>
	<div class="sm:col-span-3">
		<OptionsFieldset
			{form}
			legend="Tipo de propiedad"
			description="Selecciona el tipo de propiedad que mejor describe lo que ofreces."
			name="propertyType"
			options={propertyTypes}
			type="radio"
		></OptionsFieldset>
	</div>
{/snippet}

<div class="container mx-auto">
	<DoubleColForm
		{form}
		items={[
			{ title: 'General', description: 'Aspectos generales de la propiedad', fields: content }
		]}
	>
		{#snippet button()}
			<p class="text-sm text-gray-500">Paso 1 de 6</p>

			<Button type="submit" {form} disabled={valid === true ? false : undefined}>Siguiente</Button>
		{/snippet}
	</DoubleColForm>
</div>
