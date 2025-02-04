<script lang="ts">
	import PublicationForm from '../PublicationForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Aspectos generales de publicación</title>
</svelte:head>

<PublicationForm {data} />
