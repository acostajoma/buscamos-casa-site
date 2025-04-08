<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		forId: string;
		inputName?: string;
		required?: boolean;
		additionalClasses?: string;
	};
	let { children, forId, inputName, required = false, additionalClasses }: Props = $props();
</script>

<div class="flex justify-between">
	<label
		for={forId}
		class="block text-sm font-semibold leading-6 text-gray-900 {additionalClasses || ''}"
	>
		{@render children()}
	</label>
	{#if !required && inputName}
		<span class="text-sm leading-6 text-gray-500" id={`${inputName}-optional`}>Opcional</span>
	{/if}
</div>
