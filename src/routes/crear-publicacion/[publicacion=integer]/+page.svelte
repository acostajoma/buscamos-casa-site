<script lang="ts">
	import PublicationForm from '../PublicationForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PublicationForm {data} />
