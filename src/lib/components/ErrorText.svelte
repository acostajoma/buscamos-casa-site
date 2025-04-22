<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		name: string;
	};
	let { children, name }: Props = $props();
</script>

<p class="mt-2 text-sm text-red-600" id={`${name}-error`}>{@render children()}</p>
