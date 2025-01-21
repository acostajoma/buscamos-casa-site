<script lang="ts">
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	let { signature, timestamp, context, photos } = $derived(data);
</script>

<div class="container mx-auto">
	<ImageUploader {signature} {timestamp} {context} {photos} />
</div>
