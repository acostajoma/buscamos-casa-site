<script lang="ts">
	import type { PageData } from './$types';
	import PublicationForm from './PublicationForm.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Crear publicación</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<PublicationForm {data} />
