<script lang="ts">
	import { PUBLIC_CLOUDINARY_API_KEY, PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
	import { allowedImageTypes, uploadPreset } from '$lib/utils/constants';
	import { untrack } from 'svelte';
	import Button from './Button.svelte';
	import DoubleColForm from './Forms/DoubleColForm.svelte';
	import ImageGrid from './ImageGrid.svelte';

	type Props = {
		signature: string;
		timestamp: string;
		context: string;
	};

	let files = $state<FileList | null | undefined>(null);
	let fileDragOver = $state(false);
	let images = $state<Cloudinary.Image[]>([]);

	let { signature, timestamp, context }: Props = $props();
	let url = $derived(
		'https://api.cloudinary.com/v1_1/' + PUBLIC_CLOUDINARY_CLOUD_NAME + '/image/upload'
	);
	let lengthError = $state<string[]>([]);
	let uploadingInProgress = $state(false);

	const acceptedTypes = allowedImageTypes.map((type) => `image/${type}`).join(',');
	$inspect(files);

	async function uploadFile(file: File) {
		const imageKey = crypto.randomUUID();
		const image: Cloudinary.Image = {
			key: imageKey,
			state: 'uploading',
			file
		};
		images.push(image);
		const i = images.findIndex((images) => images.key === imageKey);
		try {
			const formData = new FormData();
			formData.set('file', file);
			formData.set('api_key', PUBLIC_CLOUDINARY_API_KEY);
			formData.set('timestamp', timestamp);
			formData.set('context', context);
			formData.set('upload_preset', uploadPreset);
			formData.set('allowed_formats', allowedImageTypes.join(','));
			formData.set('signature', signature);

			const response = await fetch(url, { method: 'POST', body: formData });
			if (!response.ok) {
				throw new Error(`Error uploading file: ${response.status} - ${response.statusText}`);
			}
			const data = await response.json();

			if ((data as Cloudinary.AssetError)?.error) {
				images[i] = { ...image, state: 'error', data: data as Cloudinary.AssetError };
				return;
			}

			// Optionally, notify your endpoint
			await fetch('/crear-publicacion/api/add-photos-to-post', {
				method: 'POST',
				body: JSON.stringify(data)
			});
			images[i] = { ...image, state: 'successful', data: data as Cloudinary.Asset };
		} catch (err: any) {
			// If there’s a failure, revert the last 'uploading' entry
			if (images[i].state === 'uploading') {
				images.pop();
			}
		}
	}

	$effect(() => {
		if (files) {
			untrack(() =>
				(async () => {
					uploadingInProgress = true;
					const newFiles = Array.from(files!);
					const imageArrayLength = images.length;
					if (imageArrayLength + newFiles.length > 20) {
						lengthError.push(`You can only upload up to 20 images in total.`);
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
							{:else if images.length > 0}
								{#if uploadingInProgress}
									Subiendo fotos
								{:else}
									Aun puedes subir {20 - images.length} fotos
								{/if}
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
							accept={acceptedTypes}
							disabled={uploadingInProgress}
						/>
					</div>
				</div>
				<p class="text-xs/5 text-gray-600">{allowedImageTypes.join(', ')} hasta 10MB</p>
			</div>
		</label>
	</div>
	<div class="col-span-full">
		<ImageGrid {images} />
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
		<Button type="submit">Guardar</Button>
	{/snippet}
</DoubleColForm>
