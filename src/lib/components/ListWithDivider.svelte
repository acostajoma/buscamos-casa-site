<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		useGrid?: boolean;
	};
	let { children, useGrid = false }: Props = $props();
</script>

<ul
	role="list"
	class="divide-y divide-gray-200 *:py-4 {useGrid
		? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
		: ''}"
>
	{@render children()}
</ul>
