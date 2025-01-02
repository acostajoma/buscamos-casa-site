<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import Exit from '$lib/icons/Exit.svelte';
	import HamburgerMenu from '$lib/icons/HamburgerMenu.svelte';
	import { imageCdnUrl } from '$lib/utils/constants';

	type Props = {
		loggedUser: boolean;
	};
	let { loggedUser }: Props = $props();

	let checked = $state.raw(false);

	// Reset the checked state to close the mobile menu.
	afterNavigate(() => {
		checked = false;
	});
</script>

<header class="bg-white">
	<nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
		<div class="flex flex-1">
			<div class="hidden lg:flex lg:gap-x-12">
				<a href="#" class="text-sm/6 font-semibold text-gray-900">Product</a>
				<a href="#" class="text-sm/6 font-semibold text-gray-900">Features</a>
				<a href="#" class="text-sm/6 font-semibold text-gray-900">Company</a>
			</div>
			<div class="flex lg:hidden">
				<label
					for="mobile-menu"
					class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
				>
					<span class="sr-only">Open main menu</span>

					<HamburgerMenu />
				</label>
			</div>
		</div>
		<a href="/" class="-m-1.5 p-1.5">
			<span class="sr-only">Buscamos Casa</span>
			<img
				class="h-8 w-auto"
				src="{imageCdnUrl}/5c6fafb3-06f9-4c87-6368-110713d3ac00/icon"
				alt="Buscamos Casa"
			/>
		</a>
		<div class="flex flex-1 justify-end">
			{#if loggedUser}
				<a href="/crear-post" class="text-sm/6 font-semibold text-gray-900"
					>Crear Post <span aria-hidden="true">&rarr;</span></a
				>
			{:else}
				<a href="/inicia-sesion" class="text-sm/6 font-semibold text-gray-900"
					>Inicia Sesión o Regístrate <span aria-hidden="true">&rarr;</span></a
				>
			{/if}
		</div>
	</nav>

	<!-- Mobile menu, show/hide based on menu open state. (CheckBox controls state using css) -->
	<div class="peer hidden">
		<input type="checkbox" id="mobile-menu" bind:checked />
	</div>
	<div class="hidden peer-has-[:checked]:block lg:!hidden" role="dialog" aria-modal="true">
		<div class="fixed inset-0 z-10"></div>
		<div class="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-white px-6 py-6">
			<div class="flex items-center justify-between">
				<div class="flex flex-1">
					<label for="mobile-menu" class="-m-2.5 rounded-md p-2.5 text-gray-700">
						<span class="sr-only">Close menu</span>
						<Exit />
					</label>
				</div>
				<a href="/" class="-m-1.5 p-1.5">
					<span class="sr-only">Buscamos Casa</span>
					<img
						class="h-8 w-auto"
						src="{imageCdnUrl}/5c6fafb3-06f9-4c87-6368-110713d3ac00/icon"
						alt="Buscamos Casa"
					/>
				</a>
				<div class="flex flex-1 justify-end">
					{#if loggedUser}
						<a href="/crear-post" class="text-sm/6 font-semibold text-gray-900"
							>Crear Post <span aria-hidden="true">&rarr;</span></a
						>
					{:else}
						<a href="/inicia-sesion" class="text-sm/6 font-semibold text-gray-900"
							>Inicia Sesión o Regístrate <span aria-hidden="true">&rarr;</span></a
						>
					{/if}
				</div>
			</div>
			<div class="mt-6 space-y-2">
				<a
					href="#"
					class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
					>Product</a
				>
				<a
					href="#"
					class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
					>Features</a
				>
				<a
					href="#"
					class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
					>Company</a
				>
			</div>
		</div>
	</div>
</header>
