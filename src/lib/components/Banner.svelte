<script lang="ts">
	import { type Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	type Props = {
		children: Snippet;
		closeButtonOnClick: () => void;
	};
	let { children, closeButtonOnClick }: Props = $props();
</script>

<div
	transition:fade
	class="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1"
>
	<div
		class="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
		aria-hidden="true"
	>
		<div
			class="aspect-577/310 w-[36.0625rem] bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
			style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
		></div>
	</div>
	<div
		class="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
		aria-hidden="true"
	>
		<div
			class="aspect-577/310 w-[36.0625rem] bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
			style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
		></div>
	</div>
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
		{@render children()}
	</div>
	<div class="flex flex-1 justify-end">
		<button
			type="button"
			class="-m-3 p-3 focus-visible:outline-offset-[-4px] cursor-pointer"
			onclick={closeButtonOnClick}
		>
			<span class="sr-only">Dismiss</span>
			<svg
				class="size-5 text-gray-900"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
				data-slot="icon"
			>
				<path
					d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
				></path>
			</svg>
		</button>
	</div>
</div>
