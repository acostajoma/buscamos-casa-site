<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { type Snippet } from 'svelte';
	import { type SuperForm } from 'sveltekit-superforms';
	import Form from './Form.svelte';

	type Props = {
		form?: SuperForm<any>;
		action?: string;
		items: {
			title: string;
			description: string;
			fields: Snippet;
		}[];
		button: Snippet;
		enctype?:
			| 'application/x-www-form-urlencoded'
			| 'multipart/form-data'
			| 'text/plain'
			| null
			| undefined;
		submitFunction?: SubmitFunction;
	};
	let { form, action, items, button, enctype, submitFunction }: Props = $props();
</script>

<div class="space-y-10 divide-y divide-gray-900/10">
	<Form
		{form}
		{action}
		class="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3"
		{enctype}
		{submitFunction}
	>
		{#each items as { title, description, fields }, i (title)}
			<div class="px-4 sm:px-0">
				<h2 class="text-base font-semibold leading-7 text-gray-900">{title}</h2>
				<p class="mt-1 text-sm leading-6 text-gray-600">
					{description}
				</p>
			</div>

			<div class="bg-white sm:rounded-xl md:col-span-2 shadow-sm ring-1 ring-gray-900/5 max-w-3xl">
				<div class="px-4 py-6 sm:p-8 border-b border-gray-900/10">
					<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
						{@render fields()}
					</div>
				</div>

				{#if i === items.length - 1}
					<div
						class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8"
					>
						{@render button()}
					</div>
				{/if}
			</div>
		{/each}
	</Form>
</div>

<!-- @component
	Provides a two column form.
	Example: 
	```svelte
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
	```
-->
