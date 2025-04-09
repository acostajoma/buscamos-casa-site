<script lang="ts">
	import CheckBoxMark from '$lib/icons/CheckBoxMark.svelte';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';

	type Props = {
		id?: string;
		name: string;
		label: string;
		form: SuperForm<any>;
		onchange?: () => void;
	};
	let { name, id = name, label, form, onchange }: Props = $props();
	// This is coded as separated component from radio as it is using bind:checked

	const { errors, value } = formFieldProxy(form, name);
</script>

<div class="flex gap-3">
	<div class="flex h-6 shrink-0 items-center">
		<div class="group grid size-4 grid-cols-1">
			<input
				{id}
				{name}
				type="checkbox"
				value="true"
				bind:checked={$value}
				{onchange}
				class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
			/>
			<CheckBoxMark />
		</div>
	</div>
	<div class="text-sm/6">
		<label for={id} class="font-medium text-gray-900">{label}</label>
	</div>
</div>
