<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Exit from '$lib/icons/Exit.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	type Props = {
		images: Cloudinary.Image[];
	};

	let { images }: Props = $props();

	const deleteHandler: SubmitFunction = ({}) => {
		return ({ result }) => {
			console.log(result);
			if (result.type === 'success' && result.data?.publicId) {
				images = images.filter(({ key }) => key === result.data?.publicId);
			}
			if (result.type === 'error') {
				applyAction(result);
			}
			if (result.type === 'redirect') {
				goto(result.location);
			}
		};
	};
</script>

{#snippet image(imgSrc: string, i: number, publicId: string)}
	<div class="relative inline-block">
		<img
			src={imgSrc}
			alt="image {i}"
			class="py-2 px-2 pointer-events-none aspect-4/3 object-cover group-hover:opacity-75 rounded-lg"
		/>
		<form action="?/delete" method="POST" use:enhance={deleteHandler}>
			<input type="text" name="publicId" value={publicId} hidden />
			<button
				type="submit"
				class="absolute top-0 right-0 flex size-5.5 rounded-full bg-red-400 ring-2 ring-white items-center justify-center text-white"
				><Exit class="size-4" /></button
			>
		</form>
	</div>
{/snippet}

<ul role="list" class="flex flex-wrap gap-1">
	{#each images as { key, data, state }, i (key)}
		<li class="relative">
			<div
				class="mt-1 group overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
			>
				{#if state === 'successful'}
					{@const imgSrc = (data as Cloudinary.Asset).eager[0].secure_url}
					{@render image(imgSrc, i, (data as Cloudinary.Asset).public_id)}
				{:else if state === 'posted' && data && typeof data === 'object' && 'id' in data}
					{@const imgSrc = `https://res.cloudinary.com/dldnvubae/image/upload/c_scale,h_90,w_auto/f_auto/q_auto/${data.id}`}
					{@render image(imgSrc, i, data.id)}
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
				{/if}
			</div>
		</li>
	{/each}
</ul>
