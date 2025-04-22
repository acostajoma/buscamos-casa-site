<script lang="ts">
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';
	import Label from './Label.svelte';

	type Props = {
		id: string;
		name: string;
		label: string;
		form: SuperForm<any>;
		options: string[] | number[];
		onchange?: (event: Event) => void;
	};
	let { id, name, label, options, form, onchange }: Props = $props();
	const { value, errors, constraints } = formFieldProxy(form, name);
</script>

<div>
	<Label forId={id} inputName={name} required>
		{label}
	</Label>
	<div class="mt-2 grid grid-cols-1 relative">
		<select
			{id}
			{name}
			{onchange}
			{...$constraints}
			bind:value={$value}
			class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
		>
			{#each options as option}
				<option>{option}</option>
			{/each}
		</select>
	</div>
	{#if $errors}
		<p class="mt-2 text-sm text-red-600" id={`${name}-error`}>{$errors.join(' ')}</p>
	{/if}
</div>
