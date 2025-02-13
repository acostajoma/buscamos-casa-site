<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-px overflow-hidden rounded-lg 2xs:grid-cols-2 md:grid-cols-3">
	{@render children()}
</div>
