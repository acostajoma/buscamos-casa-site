<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { PUBLIC_GTAG } from '$env/static/public';
	import Banner from '$lib/components/Banner.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { partytownSnippet } from '@qwik.dev/partytown/integration';
	import type { AfterNavigate } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';
	import '../app.css';
	import type { PageData } from './$types';

	type Props = {
		children: Snippet;
		data: PageData;
	};

	let { children, data } = $props();
	let showBanner = $state.raw(data.showBanner);

	afterNavigate(({ from, to }: AfterNavigate) => {
		if (from && to && from.url.href !== to?.url.href) {
			showBanner = false;
		}
	});
</script>

<svelte:head>
	<!-- 
		PARTY TOWN INTEGRATION
		SEE https://partytown.qwik.dev/sveltekit/
	-->
	<script>
		// Forward the necessary functions to the web worker layer
		partytown = {
			forward: ['dataLayer.push', 'gtag']
		};
	</script>

	{@html '<script>' + partytownSnippet() + '</script>'}

	<script
		type="text/partytown"
		src={`https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GTAG}`}
	></script>

	{@html `<script type="text/partytown">
				window.dataLayer = window.dataLayer || [];
				function gtag() {dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', '${PUBLIC_GTAG}')
			</script>`}
</svelte:head>
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
			href="/publicaciones?exclusiveSeller=Inhaus"
			class="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
			>Visitar publicaciones <span aria-hidden="true">&rarr;</span></a
		>
	</Banner>
{/if}

<Header loggedUser={data.loggedUser} />
{@render children()}
<Footer />
