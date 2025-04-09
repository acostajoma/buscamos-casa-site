<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		legend: string;
		description?: string;
	};
	let { children, legend, description }: Props = $props();
</script>

<fieldset>
	<legend class="text-sm/6 font-semibold text-gray-900">{legend}</legend>
	{#if description}
		<p class="mt-1 text-sm/6 text-gray-600">
			{description}
		</p>
	{/if}

	<div class="mt-2">
		{@render children()}
	</div>
</fieldset>
