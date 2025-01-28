<script lang="ts">
	import { page } from '$app/state';
	import { getPhotoContext } from '$lib/stores/photos.svelte';
	import { acceptedImageTypes, allowedImageTypes } from '$lib/utils/constants';
	import { untrack } from 'svelte';
	import Button from './Button.svelte';
	import DoubleColForm from './Forms/DoubleColForm.svelte';
	import ImageGrid from './ImageGrid.svelte';
	import Link from './Link.svelte';

	const photoState = getPhotoContext(`crear-publicacion/fotos${page.params.publicacion}`);
	let photoLength = $derived(photoState.getLength());

	let files = $state<FileList | null | undefined>(null);
	let fileDragOver = $state(false);
	let disabled = $derived(photoLength === 0);

	let uploaderError = $state<string[]>([]);
	let uploadingInProgress = $state(false);
	let uploadMessage = $derived(
		uploadingInProgress ? 'Subiendo fotos' : `Aun puedes subir ${20 - photoLength} fotos`
	);

	async function uploadFile(file: File) {
		const imageKey = crypto.randomUUID();
		const image: Cloudinary.Image = {
			key: imageKey,
			state: 'uploading',
			file
		};
		photoState.photos.push(image);
		const i = photoState.getImageIndex(imageKey);
		const imageFormData = new FormData();
		imageFormData.append('file', file);
		imageFormData.append('order', i.toString());

		const response = await fetch(`/crear-publicacion/${page.params.publicacion}/fotos/image-api`, {
			method: 'POST',
			body: imageFormData
		});
		const result: Cloudinary.ImageError | Cloudinary.ImageSuccessful = await response.json();
		photoState.updatePhoto(i, result.data, result.state);
	}

	$effect(() => {
		if (files) {
			untrack(() =>
				(async () => {
					uploadingInProgress = true;
					const newFiles = Array.from(files!);
					if (photoLength + newFiles.length > 20) {
						uploaderError.push(`Solo se permiten un máximo de 20 imágenes.`);
						files = null;
						return;
					}
					await Promise.all(newFiles.map(async (file, i) => uploadFile(file)));
					files = null;
					uploadingInProgress = false;
				})()
			);
		}
	});
</script>

{#snippet content()}
	<div
		class="col-span-full"
		role="button"
		tabindex="0"
		aria-label="Área para soltar archivos"
		ondragenter={() => {
			fileDragOver = true;
		}}
		ondragleave={() => {
			fileDragOver = false;
		}}
		ondragover={(event) => {
			event.preventDefault();
		}}
		ondrop={(event) => {
			event.preventDefault();
			fileDragOver = false;
			files = event.dataTransfer?.files;
		}}
	>
		<label
			class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
			for="file-upload"
			aria-disabled={uploadingInProgress}
			class:hover:bg-gray-100={!uploadingInProgress}
			class:cursor-pointer={!uploadingInProgress}
		>
			<div class="text-center">
				<svg
					class="mx-auto size-12 text-gray-300"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path
						fill-rule="evenodd"
						d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
						clip-rule="evenodd"
					></path>
				</svg>
				<div class="mt-4 flex text-sm/6 text-gray-600 text-center">
					<div
						class="relative rounded-md font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500 mx-auto"
						class:cursor-pointer={!uploadingInProgress}
					>
						<span>
							{#if fileDragOver}
								Suelta aquí
							{:else if photoLength > 0}
								{uploadMessage}
							{:else}
								Sube imágenes o arrastra y suelta aquí
							{/if}
						</span>

						<input
							bind:files
							type="file"
							name="files"
							multiple
							id="file-upload"
							class="sr-only"
							accept={acceptedImageTypes}
							disabled={uploadingInProgress}
						/>
					</div>
				</div>
				<p class="text-xs/5 text-gray-600">{allowedImageTypes.join(', ')} hasta 10MB</p>
			</div>
		</label>
	</div>
	<div class="col-span-full">
		<ImageGrid />
	</div>
{/snippet}

<DoubleColForm
	enctype="multipart/form-data"
	items={[
		{
			title: 'Fotos',
			description: 'Sube las fotos de tu publicación',
			fields: content
		}
	]}
>
	{#snippet button()}
		<Link href={`/crear-publicacion/${page.params.publicacion}/ubicacion`}>Anterior</Link>
		<p class="text-sm text-gray-500">Paso 4 de 4</p>

		<Button type="submit" {disabled}>Siguiente</Button>
	{/snippet}
</DoubleColForm>
