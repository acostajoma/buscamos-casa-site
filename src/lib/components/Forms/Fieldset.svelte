<script lang="ts">
	import CheckBoxMark from '$lib/icons/CheckBoxMark.svelte';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';
	import Radio from './Radio.svelte';
	type Props = {
		legend: string;
		description: string;
		form: SuperForm<any>;
		name: string;
		options: string[] | readonly [string, ...string[]];
		type: 'radio' | 'checkbox';
		doubleCol?: boolean;
	};

	let { legend, description, form, name, options, type, doubleCol }: Props = $props();
	const { errors, value } = formFieldProxy(form, name);
</script>

<fieldset>
	<legend class="text-sm/6 font-semibold text-gray-900">{legend}</legend>
	{#if description}
		<p class="mt-1 text-sm/6 text-gray-600">{description}</p>
	{/if}

	<div class="mt-6 space-y-6 {doubleCol ? 'grid grid-cols-2' : ''}">
		{#if type === 'radio'}
			{#each options as option (option)}
				<div class:col-span-2={doubleCol}>
					<Radio id={option} {name} label={option} bind:group={$value} value={option} />
				</div>
			{/each}
		{:else if type === 'checkbox'}
			<!-- Has to be implemented in this component to bind:group to work correctly -->
			{#each options as option (option)}
				<div class:col-span-1={doubleCol} class:px-1={doubleCol}>
					<div class="flex gap-3">
						<div class="flex h-6 shrink-0 items-center">
							<div class="group grid size-4 grid-cols-1">
								<input
									id={option}
									{name}
									type="checkbox"
									bind:group={$value}
									value={option}
									class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
								/>
								<CheckBoxMark />
							</div>
						</div>
						<div class={doubleCol ? 'text-xs sm:text-sm/6' : 'text-sm/6'}>
							<label for={option} class="font-medium text-gray-900">{option}</label>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	{#if $errors?._errors}
		<p class="mt-2 text-sm text-red-600" id={`${name}-error`}>{$errors._errors}</p>
	{/if}
</fieldset>
