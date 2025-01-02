<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';
	import type { PageData } from './$types';

	type Props = {
		children: Snippet;
		data: PageData;
	};

	let { children, data } = $props();

	let { loggedUser } = $derived(data);
</script>

<Header {loggedUser} />
{@render children()}
