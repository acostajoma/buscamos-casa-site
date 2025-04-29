<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue, HTMLAttributeAnchorTarget } from 'svelte/elements';

	type Props = {
		href: string;
		children: Snippet;
		class?: ClassValue;
		target?: HTMLAttributeAnchorTarget | null | undefined;
		colorClass?: string;
	};
	let {
		href,
		children,
		target,
		colorClass = 'bg-brand-1 hover:bg-brand-2',
		class:
			_class = `rounded-md bg-brand-1 px-2.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-1 hover:cursor-pointer ${colorClass}`
	}: Props = $props();
</script>

<a {href} class={_class} {target}>
	{@render children()}
</a>
