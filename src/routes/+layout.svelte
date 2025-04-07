<script lang="ts">
	import { goto } from '$app/navigation';
	import Banner from '$lib/components/Banner.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';
	import type { PageData } from './$types';

	type Props = {
		children: Snippet;
		data: PageData;
	};

	let { children, data } = $props();

	let { loggedUser, showBanner } = $derived(data);
</script>

<svelte:window onerror={() => goto('/error')} />
{#if showBanner}
	<Banner>
		<p class="text-sm/6 text-gray-900">
			<strong class="font-semibold">Inhaus</strong><svg
				viewBox="0 0 2 2"
				class="mx-2 inline size-0.5 fill-current"
				aria-hidden="true"><circle cx="1" cy="1" r="1"></circle></svg
			>Descubre las propiedades de Inhaus en nuestra plataforma.
		</p>
		<a
			href="/vendedores-exclusivos/Inhaus"
			class="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
			>Visitar publicaciones <span aria-hidden="true">&rarr;</span></a
		>
	</Banner>
{/if}
<Header {loggedUser} />
{@render children()}
<Footer />
