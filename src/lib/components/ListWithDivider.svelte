<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();
</script>

<ul
	role="list"
	class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-gray-200 *:py-4"
>
	{@render children()}
</ul>
