<script lang="ts">
	import { contactDataSchema } from '$lib/validation/post';
	import type { Snippet } from 'svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import Button from './Button.svelte';
	import DoubleColForm from './Forms/DoubleColForm.svelte';
	import Input from './Forms/Input.svelte';
	import PhoneInput from './Forms/PhoneInput.svelte';

	type FormData = Infer<typeof contactDataSchema>;

	let {
		formData,
		description,
		emailDisabled = true,
		buttonSnippet
	}: {
		formData: SuperValidated<FormData>;
		description: string;
		emailDisabled?: boolean;
		buttonSnippet?: Snippet;
	} = $props();

	const form = superForm(formData, {
		validationMethod: 'onblur',
		validators: zod(contactDataSchema),
		customValidity: false,
		dataType: 'json'
	});
	let { valid } = $derived(formData);
</script>

{#snippet content()}
	<div class="sm:col-span-full">
		<Input
			{form}
			label="Correo electrónico"
			name="email"
			id="email"
			type="email"
			required
			disabled={emailDisabled}
		/>
	</div>
	<div class="sm:col-span-full">
		<Input
			{form}
			label="Nombre"
			name="name"
			id="name"
			type="text"
			required
			autocomplete="given-name"
			placeholder="Jose Acosta"
		/>
	</div>
	<div class="sm:col-span-full">
		<PhoneInput name="phone" {form} countryPlaceholderName="countryCode" />
	</div>
{/snippet}

{#snippet button()}
	<p class="text-sm text-gray-500">Paso 6 de 6</p>

	<Button type="submit" {form} disabled={valid === true ? false : undefined}>Guardar</Button>
{/snippet}

<div class="container mx-auto">
	<DoubleColForm
		{form}
		items={[
			{
				title: 'Información Personal',
				description,
				fields: content
			}
		]}
		button={buttonSnippet ?? button}
	></DoubleColForm>
</div>
