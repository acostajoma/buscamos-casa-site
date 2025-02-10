<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();
</script>

<div class="grid grid-cols-2 gap-px overflow-hidden rounded-lg sm:grid-cols-3">
	{@render children()}
</div>
