<script lang="ts">
	import { page } from '$app/state';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import { PhotoState, setPhotoContext } from '$lib/stores/photos.svelte';
	import { type PageData } from './$types';

	const { data }: { data: PageData } = $props();

	setPhotoContext(`crear-publicacion/fotos${page.params.publicacion}`, new PhotoState(data.photos));
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />

	<title>Fotos de la propiedad</title>
</svelte:head>

<div class="container mx-auto">
	<ImageUploader />
</div>
