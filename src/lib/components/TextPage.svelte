<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		title: string;
	};
	let { children, title }: Props = $props();
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="max-w-xl mx-auto py-20 px-4 sm:px-0">
	<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl xl:text-4xl">
		{title}
	</h1>

	{@render children()}
</div>
