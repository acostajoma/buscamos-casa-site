<script lang="ts">
	import DoubleColForm from '$lib/components/Forms/DoubleColForm.svelte';
	import Input from '$lib/components/Forms/Input.svelte';
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
{/snippet}

<div class="container mx-auto">
	<DoubleColForm
		{form}
		items={[
			{ title: 'General', description: 'Aspectos generales de la propiedad', fields: general }
		]}
	/>
</div>
