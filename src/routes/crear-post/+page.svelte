<script lang="ts">
	import Form from '$lib/components/Forms/Form.svelte';
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

<Form {form} class="w-full max-w-sm flex flex-col gap-2 mx-auto">
	<Input {form} label="Título" name="title" id="title" type="text" required />
	<Input {form} label="Descripción" name="description" id="description" type="text" required />
</Form>
