<script lang="ts">
	import InvalidInput from '$lib/icons/InvalidInput.svelte';
	import ValidInput from '$lib/icons/ValidInput.svelte';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';
	import Label from './Label.svelte';

	type Props = {
		label: string;
		id: string;
		name: string;
		required: boolean;
		form: SuperForm<any>;

		disabled?: boolean;
	};
	let { label, id, name, form, required, disabled = false }: Props = $props();

	const { value, errors, constraints } = formFieldProxy(form, name);
</script>

<div>
	<Label forId={id} {required} inputName={name}>
		{label}
	</Label>
	<div class="relative mt-2 rounded-md shadow-sm">
		<textarea
			{id}
			{name}
			{required}
			{disabled}
			aria-describedby={!required ? `${name}-optional` : undefined}
			aria-errormessage={`${name}-error`}
			aria-required={required}
			aria-invalid={$errors ? 'true' : undefined}
			bind:value={$value}
			class="peer block w-full min-h-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 user-invalid:!text-red-900 user-invalid:!ring-red-500user-valid:!text-green-900 user-valid:!ring-green-500"
			{...$constraints}
		>
		</textarea>
		<div
			class="invisible peer-user-invalid:visible pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
		>
			<InvalidInput />
		</div>
		<div
			class="invisible peer-user-valid:visible pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
		>
			<ValidInput />
		</div>
	</div>

	{#if $errors}
		<p class="mt-2 text-sm text-red-600" id={`${name}-error`}>{$errors}</p>
	{/if}
</div>
