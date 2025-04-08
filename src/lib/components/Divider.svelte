<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
	};
	let { children }: Props = $props();
</script>

<div class="relative mt-5">
	<div class="absolute inset-0 flex items-center" aria-hidden="true">
		<div class="w-full border-t border-gray-300"></div>
	</div>
	{#if children}
		<div class="relative flex justify-center">
			<div class="px-2 text-sm text-gray-500 bg-gray-50">
				{@render children()}
			</div>
		</div>
	{/if}
</div>
