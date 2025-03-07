<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import type { Snippet } from 'svelte';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	type Props = {
		children: Snippet;
		openModalButtonTitle?: string;
		selfOpen?: boolean;
	};
	let { children, openModalButtonTitle, selfOpen }: Props = $props();

	let show = $state.raw(selfOpen || false);

	$effect(() => {
		show = selfOpen || false;
	});
</script>

{#if openModalButtonTitle}
	<button type="button" onclick={() => (show = true)}>{openModalButtonTitle}</button>
{/if}

{#if show}
	<div
		id="modal"
		class="relative z-10"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
		in:fade={{ duration: 300, delay: 0, easing: cubicOut }}
		out:fade={{ duration: 200, easing: cubicIn }}
	>
		<div class="fixed inset-0 bg-gray-500/75" aria-hidden={show}></div>

		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					class="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
					use:clickOutside={() => (show = false)}
				>
					<div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
						<button
							type="button"
							class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-hidden"
							onclick={() => (show = false)}
						>
							<span class="sr-only">Close</span>
							<svg
								class="size-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
								data-slot="icon"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"
								></path>
							</svg>
						</button>
					</div>
					{@render children()}
				</div>
			</div>
		</div>
	</div>
{/if}
