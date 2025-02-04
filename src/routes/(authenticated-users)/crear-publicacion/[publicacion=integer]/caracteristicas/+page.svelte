<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import DoubleColForm from '$lib/components/Forms/DoubleColForm.svelte';
	import Fieldset from '$lib/components/Forms/Fieldset.svelte';
	import Link from '$lib/components/Link.svelte';
	import { createFeaturesSchema } from '$lib/validation/post';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validationMethod: 'auto',
		validators: zod(createFeaturesSchema(data.allFeatures)),
		customValidity: false
	});

	let { allFeatures } = $derived(data);

	const formItems = [
		{
			title: 'Características',
			description:
				'Selecciona todas las características que su propiedad posee. Estas no son obligatorias, pero seleccionar con detenimiento, ayudará a posibles compradores a hacerse una mejor idea de los beneficios de su propiedad.',
			fields: featuresMultipleSelect
		}
	];
</script>

<svelte:head>
	<title>Características de la propiedad</title>
</svelte:head>
{#snippet featuresMultipleSelect()}
	<div class="sm:col-span-full">
		<Fieldset
			{form}
			legend="Características o beneficios de la propiedad"
			description="Selecciona todas las modalidades que apliquen para la propiedad"
			name="features"
			options={allFeatures}
			type="checkbox"
			doubleCol={true}
		></Fieldset>
	</div>
{/snippet}

<div class="container mx-auto">
	<DoubleColForm items={formItems} {form}>
		{#snippet button()}
			<Link href={`/crear-publicacion/${page.params.publicacion}/fotos`}>Anterior</Link>
			<p class="text-sm text-gray-500">Paso 5 de 6</p>

			<Button type="submit">Siguiente</Button>
		{/snippet}
	</DoubleColForm>
</div>
