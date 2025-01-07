<script lang="ts">
	import DoubleColForm from '$lib/components/Forms/DoubleColForm.svelte';
	import Fieldset from '$lib/components/Forms/Fieldset.svelte';
	import Input from '$lib/components/Forms/Input.svelte';
	import { propertyTypes, saleTypes } from '$lib/utils/postConstants';
	import { postSchema } from '$lib/validation/post';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const form = superForm(data.form, {
		validationMethod: 'oninput',
		validators: zod(postSchema)
	});
</script>

{#snippet general()}
	<div class="sm:col-span-3">
		<Input {form} label="Título" name="title" id="title" type="text" required />
	</div>
	<div class="sm:col-span-3">
		<Input {form} label="Descripción" name="description" id="description" type="text" required />
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
{/snippet}

<div class="container mx-auto">
	<DoubleColForm
		{form}
		items={[
			{ title: 'General', description: 'Aspectos generales de la propiedad', fields: general }
		]}
	/>
</div>
