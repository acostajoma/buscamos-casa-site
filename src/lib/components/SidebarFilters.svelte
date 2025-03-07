<script lang="ts">
	import Exit from '$lib/icons/Exit.svelte';
	import type { Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';

	type Props = {
		children: Snippet;
		formFields: Snippet;
	};
	let { children, formFields }: Props = $props();

	let isVisible = $state(false);
	const largeViewport = new MediaQuery('min-width: 1024px');

	let showMenu = $derived.by(() => {
		if (largeViewport.current) {
			return true;
		}
		return isVisible;
	});
</script>

<div class="bg-white">
	<div>
		<main class="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-480 lg:px-8">
			<div class="border-b border-gray-200 pb-10">
				<h1 class="text-4xl font-bold tracking-tight text-gray-900">Publicaciones</h1>
				<p class="mt-4 text-base text-gray-500">
					Encuentra tu próxima propiedad entre nuestra selección disponible en venta y renta.
				</p>
			</div>

			<div class="pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
				<aside>
					<h2 class="sr-only">Filtros</h2>

					<button
						type="button"
						class="inline-flex items-center lg:hidden cursor-pointer"
						onclick={() => (isVisible = true)}
					>
						<span class="text-sm font-medium text-gray-700">Filtros</span>
						<svg
							class="ml-1 size-5 shrink-0 text-gray-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path
								d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
							></path>
						</svg>
					</button>

					<!--
                        Mobile filter dialog
                
                        Off-canvas menu for mobile, show/hide based on off-canvas menu state.
                    -->
					<div class="z-40 {showMenu ? 'relative' : 'hidden'}" role="dialog" aria-modal="true">
						<!--
                            Off-canvas menu backdrop, show/hide based on off-canvas menu state.
                    
                            Entering: "transition-opacity ease-linear duration-300"
                                From: "opacity-0"
                                To: "opacity-100"
                            Leaving: "transition-opacity ease-linear duration-300"
                                From: "opacity-100"
                                To: "opacity-0"
                            -->
						<div class="fixed inset-0 bg-black/25 lg:hidden" aria-hidden="true"></div>

						<div class="fixed lg:relative inset-0 z-40 flex lg:max-w-xs">
							<!--
                                Off-canvas menu, show/hide based on off-canvas menu state.
                    
                                Entering: "transition ease-in-out duration-300 transform"
                                From: "translate-x-full"
                                To: "translate-x-0"
                                Leaving: "transition ease-in-out duration-300 transform"
                                From: "translate-x-0"
                                To: "translate-x-full"
                            -->
							<div
								class="flex size-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl lg:shadow-none"
							>
								<div class="flex items-center justify-between px-4">
									<h2 class="text-lg font-medium text-gray-900">Filtros</h2>
									<button
										type="button"
										class="-mr-2 flex size-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500 lg:hidden cursor-pointer"
										onclick={() => (isVisible = false)}
									>
										<span class="sr-only">Cerrar menú</span>
										<Exit />
									</button>
								</div>

								<!-- Filtros -->
								<div class="mt-4">
									{@render formFields()}
								</div>
							</div>
						</div>
					</div>
				</aside>

				<!-- Product grid -->
				<div class="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
					{@render children()}
				</div>
			</div>
		</main>
	</div>
</div>
