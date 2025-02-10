<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();
</script>

<div class="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
	{@render children()}
</div>
