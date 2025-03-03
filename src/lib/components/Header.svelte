<script lang="ts">
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import Exit from '$lib/icons/Exit.svelte';
	import HamburgerMenu from '$lib/icons/HamburgerMenu.svelte';
	import { imageCdnUrl } from '$lib/utils/constants';
	import FlyoutMenu from './FlyoutMenu.svelte';
	import Link from './Link.svelte';

	type Props = {
		loggedUser: boolean;
	};
	let { loggedUser }: Props = $props();

	let checked = $state.raw(false);

	// Reset the checked state to close the mobile menu.
	afterNavigate(() => {
		checked = false;
	});

	const links = [{ title: 'Publicaciones', href: '/publicaciones' }];
</script>

{#snippet logoutButton(_class: string)}
	<form method="POST" use:enhance action="/cerrar-sesion">
		<button type="submit" class={_class}>Cerrar Sesión</button>
	</form>
{/snippet}

{#snippet companyLogo()}
	<a href="/" class="-m-1.5 p-1.5">
		<span class="sr-only">Buscamos Casa</span>
		<img
			class="h-8 w-auto"
			src="{imageCdnUrl}/5c6fafb3-06f9-4c87-6368-110713d3ac00/icon"
			alt="Buscamos Casa"
		/>
	</a>
{/snippet}

<header class="bg-white">
	<nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
		<div class="flex flex-1">
			<div class="hidden lg:flex lg:gap-x-12">
				{#each links as { title, href } (title)}
					<a {href} class="text-sm/6 font-semibold text-gray-900">{title}</a>
				{/each}
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
		{@render companyLogo()}
		<div class="flex flex-1 justify-end gap-3 align-middle">
			{#if loggedUser}
				<div class="hidden lg:block">
					<FlyoutMenu>
						<a href="/perfil" class="block p-2 hover:text-yellow-700">Información Personal</a>
						<a href="/mis-publicaciones" class="block p-2 hover:text-yellow-700"
							>Mis Publicaciones</a
						>
						{@render logoutButton('block p-2 hover:text-yellow-700 cursor-pointer')}
					</FlyoutMenu>
				</div>
				<Link href="/crear-publicacion">Crear Post</Link>
			{:else}
				<Link href="/inicia-sesion">Inicia Sesión</Link>
			{/if}
		</div>
	</nav>

	<!-- Mobile menu, show/hide based on menu open state. (CheckBox controls state using css) -->
	<div class="peer hidden">
		<input type="checkbox" id="mobile-menu" bind:checked />
	</div>
	<div class="hidden peer-has-[:checked]:block lg:!hidden" role="dialog" aria-modal="true">
		<div class="fixed inset-0 z-10"></div>
		<div class="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-6 py-6">
			<div class="flex items-center justify-between">
				<div class="flex flex-1">
					<label for="mobile-menu" class="-m-2.5 rounded-md p-2.5 text-gray-700">
						<span class="sr-only">Close menu</span>
						<Exit />
					</label>
				</div>

				{@render companyLogo()}

				<div class="flex flex-1 justify-end align-middle">
					{#if loggedUser}
						<Link href="/crear-publicacion">Crear Post</Link>
					{:else}
						<Link href="/inicia-sesion">Inicia Sesión</Link>
					{/if}
				</div>
			</div>
			<div class="mt-6 space-y-2">
				{#each links as { title, href } (title)}
					<a
						{href}
						class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
						>{title}</a
					>
				{/each}
				{#if loggedUser}
					<a
						href="/perfil"
						class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
						>Información Personal</a
					>
					<a
						href="/mis-publicaciones"
						class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
						>Mis Publicaciones</a
					>
					{@render logoutButton(
						'-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer w-full text-left'
					)}
				{/if}
			</div>
		</div>
	</div>
</header>
