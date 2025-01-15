<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import DoubleColForm from '$lib/components/Forms/DoubleColForm.svelte';
	import Fieldset from '$lib/components/Forms/Fieldset.svelte';
	import Input from '$lib/components/Forms/Input.svelte';
	import TextArea from '$lib/components/Forms/TextArea.svelte';
	import { propertyTypes, saleTypes } from '$lib/utils/postConstants';
	import { propertySchema } from '$lib/validation/post';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const form = superForm(data.form, {
		validationMethod: 'oninput',
		validators: zod(propertySchema),
		customValidity: false
	});
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
			{form}
			legend="Tipo de negocio"
			description="Selecciona todas las modalidades que apliquen para la propiedad"
			name="saleType"
			options={saleTypes}
			type="checkbox"
		></Fieldset>
	</div>
	<div class="sm:col-span-3">
		<Fieldset
			{form}
			legend="Tipo de propiedad"
			description="Selecciona el tipo de propiedad que mejor describe lo que ofreces."
			name="propertyType"
			options={propertyTypes}
			type="radio"
		></Fieldset>
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
			<Button type="submit" {form}>Siguiente</Button>
		{/snippet}
	</DoubleColForm>
</div>
