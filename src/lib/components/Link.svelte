<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributeAnchorTarget } from 'svelte/elements';

	type Props = {
		href: string;
		children: Snippet;
		class?: string;
		target?: HTMLAttributeAnchorTarget | null | undefined;
	};
	let {
		href,
		children,
		target,
		class:
			_class = 'rounded-md bg-yellow-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500'
	}: Props = $props();
</script>

<a {href} class={_class} {target}>
	{@render children()}
</a>
