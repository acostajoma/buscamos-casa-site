<script lang="ts">
	import { page } from '$app/state';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import { PhotoState, setPhotoContext } from '$lib/stores/photos.svelte';
	import { type PageData } from './$types';

	const { data }: { data: PageData } = $props();

	setPhotoContext(`crear-publicacion/fotos${page.params.publicacion}`, new PhotoState(data.photos));
</script>

<div class="container mx-auto">
	<ImageUploader />
</div>
