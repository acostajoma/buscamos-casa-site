<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		headline: string;
		description?: string;
		announcement?: Snippet;
		bottomZone?: Snippet;
	};
	let { headline, description, announcement, bottomZone }: Props = $props();
</script>

<div class="relative isolate px-6 py-10 sm:py-20 lg:px-8">
	<div class="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
		<div
			class="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
			style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
		></div>
	</div>
	<div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
		{#if announcement}
			<div class="mb-8 sm:mb-8 sm:flex sm:justify-center">
				<div
					class="relative rounded-full px-3 py-1 text-xs/6 sm:text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
				>
					{@render announcement()}
				</div>
			</div>
		{/if}
		<div class="text-center">
			<h1 class="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
				{headline}
			</h1>
			{#if description}
				<p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
					{description}
				</p>
			{/if}

			{#if bottomZone}
				<div class="mt-10 flex items-center justify-center gap-x-6">
					{@render bottomZone()}
				</div>
			{/if}
		</div>
	</div>
</div>
