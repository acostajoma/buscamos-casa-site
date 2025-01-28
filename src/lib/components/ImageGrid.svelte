<script lang="ts">
	import { page } from '$app/state';
	import Exit from '$lib/icons/Exit.svelte';
	import { getPhotoContext } from '$lib/stores/photos.svelte';
	import { flip } from 'svelte/animate';

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

	const dragStart = (event: DragEvent, index: string) => {
		event.dataTransfer?.setData('text/plain', index);
	};
	const drop = (event: DragEvent, newIndex: number) => {
		event.preventDefault();
		const oldIndex = parseInt(event.dataTransfer?.getData('text/plain') || '0', 10);
		if (oldIndex === newIndex) return;
		const updated = [...photoState.photos];
		updated.splice(newIndex, 0, updated.splice(oldIndex, 1)[0]);
		photoState.photos = updated;
	};
	const flipOptions = { duration: 1000 };
</script>

<ul role="list" class="flex flex-wrap gap-1">
	{#each photoState.photos as { key, data, state }, i (key)}
		<li
			class="relative cursor-move select-none mt-1 group overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 w-35 bg-gray-200 pointer-events-auto"
			draggable={true}
			ondragstart={(event) => dragStart(event, `${i}`)}
			ondrop={(event) => drop(event, i)}
			ondragover={(event) => event.preventDefault()}
			animate:flip={flipOptions}
		>
			{#if state === 'successful'}
				{@const id = (data as Cloudinary.ImageSuccessful['data']).id}
				{@const imgSrc = `https://res.cloudinary.com/dldnvubae/image/upload/c_scale,h_90,w_auto/f_auto/q_auto/${id}`}

				<img
					src={imgSrc}
					alt="image {i}"
					class="py-2 px-2 pointer-events-none aspect-4/3 rounded-lg object-cover mx-auto"
					draggable="false"
				/>
				<button
					type="button"
					onclick={() => deleteHandler(id)}
					class="absolute top-0 right-0 flex size-6.5 rounded-full bg-red-400 hover:bg-red-600 ring-2 ring-white items-center justify-center text-white cursor-pointer z-10"
					><Exit class="size-5" /></button
				>
			{:else if state === 'uploading'}
				<div class="flex justify-center items-center">
					<svg
						class="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-500"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
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
		</li>
	{/each}
</ul>

{#if message}
	<p class={message.type}>
		{message.text}
	</p>
{/if}
