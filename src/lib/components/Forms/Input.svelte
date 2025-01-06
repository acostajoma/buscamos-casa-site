<script lang="ts">
	import InvalidInput from '$lib/icons/InvalidInput.svelte';
	import ValidInput from '$lib/icons/ValidInput.svelte';
	import { formatDateForInput } from '$lib/utils/dates';
	import { type FullAutoFill, type HTMLInputTypeAttribute } from 'svelte/elements';
	import { dateProxy, formFieldProxy, type SuperForm } from 'sveltekit-superforms';
	import Label from './Label.svelte';

	type Props = {
		label: string;
		id: string;
		name: string;
		type: HTMLInputTypeAttribute;
		required: boolean;
		form: SuperForm<any>;
		disabled?: boolean;
		placeholder?: string;
		autocomplete?: FullAutoFill | null | undefined;
	};
	let {
		label,
		id,
		name,
		type,
		placeholder,
		required,
		form,
		disabled = false,
		autocomplete
	}: Props = $props();

	const dateValue = dateProxy(form, name, { format: 'datetime-local' });
	const fieldProxy = formFieldProxy(form, name);
	const { errors, constraints } = fieldProxy;

	const valueStore = type === 'datetime-local' ? dateValue : fieldProxy.value;

	let value: string | number | undefined = $state(undefined);

	/**
	 * Escape Hack to manage datetime-local inputs.
	 * As can't bind to Date, and need to bin to a string
	 */
	$effect(() => {
		if (type === 'datetime-local' && $valueStore) {
			value = formatDateForInput($valueStore);
		} else {
			value = $valueStore;
		}
	});

	$effect(() => {
		$valueStore = value;
	});
</script>

<div>
	<Label forId={id} {required} inputName={name}>
		{label}
	</Label>
	<div class="relative mt-2 rounded-md shadow-sm">
		<input
			{id}
			{name}
			{type}
			{placeholder}
			{required}
			{disabled}
			{autocomplete}
			aria-describedby={!required ? `${name}-optional` : undefined}
			aria-errormessage={`${name}-error`}
			aria-required={required}
			aria-invalid={$errors ? 'true' : undefined}
			bind:value
			class="peer block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
            user-invalid:!text-red-900 user-invalid:!ring-red-500
			user-valid:!text-green-900 user-valid:!ring-green-500"
			{...$constraints}
		/>

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
