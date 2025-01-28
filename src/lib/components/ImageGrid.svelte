<script lang="ts">
	import { page } from '$app/state';
	import Exit from '$lib/icons/Exit.svelte';
	import { getPhotoContext } from '$lib/stores/photos.svelte';

	const photoState = getPhotoContext(`crear-publicacion/fotos${page.params.publicacion}`);

	let message:
		| { type: 'text-red-500' | 'notification' | 'text-green-500'; text: string }
		| undefined = $state(undefined);
	const deleteHandler = async (publicId: string) => {
		message = { type: 'notification', text: 'Eliminando imagen...' };
		const request = await fetch(`/crear-publicacion/${page.params.publicacion}/fotos/image-api`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ publicId })
		});
		const response: { publicId: string } | Cloudinary.ImageError = await request.json();

		if (!request.ok) {
			message = { type: 'text-red-500', text: (response as Cloudinary.ImageError)?.data };
			setTimeout(() => {
				message = undefined;
			}, 5000);
			return;
		}
		message = { type: 'text-green-500', text: 'Imagen eliminada' };
		setTimeout(() => {
			message = undefined;
		}, 5000);

		photoState.deletePhoto(publicId);
	};
</script>

{#snippet image(imgSrc: string, i: number, publicId: string)}
	<div class="relative inline-block">
		<img
			src={imgSrc}
			alt="image {i}"
			class="py-2 px-2 pointer-events-none aspect-4/3 rounded-lg object-cover"
		/>
		<button
			type="button"
			onclick={() => deleteHandler(publicId)}
			class="absolute top-0 right-0 flex size-6.5 rounded-full bg-red-400 hover:bg-red-600 ring-2 ring-white items-center justify-center text-white cursor-pointer"
			><Exit class="size-5" /></button
		>
	</div>
{/snippet}

<ul role="list" class="flex flex-wrap gap-1">
	{#each photoState.photos as { key, data, state }, i (key)}
		<li class="relative">
			<div
				class="mt-1 group overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 h-35 w-35"
			>
				{#if state === 'successful'}
					{@const id = (data as Cloudinary.ImageSuccessful['data']).id}
					{@const imgSrc = `https://res.cloudinary.com/dldnvubae/image/upload/c_scale,h_90,w_auto/f_auto/q_auto/${id}`}
					{@render image(imgSrc, i, id)}
				{:else if state === 'uploading'}
					<div class="flex justify-center items-center">
						<svg
							class="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-500"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						<p>Subiendo...</p>
					</div>
				{:else if state === 'error'}
					<div class="flex justify-center items-center">
						<p class="text-red-500">{data as string}</p>
					</div>
				{/if}
			</div>
		</li>
	{/each}
</ul>

{#if message}
	<p class={message.type}>
		{message.text}
	</p>
{/if}
