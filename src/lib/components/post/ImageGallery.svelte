<script lang="ts">
	import { getPhotoUrl } from '$lib/utils/photos';
	import Glide from '@glidejs/glide';
	import '@glidejs/glide/dist/css/glide.core.min.css';

	type Props = {
		imagesIds: string[];
	};
	let { imagesIds }: Props = $props();

	const glide = new Glide('.glide', {
		type: 'carousel',
		startAt: 0,
		perView: 1,
		peek: { before: 600, after: 600 },
		breakpoints: {
			640: {
				// Applies up to 640px (including 640)
				peek: {
					before: 0,
					after: 0
				}
			},
			1024: {
				// Applies up to 1024px (including 1024)
				peek: {
					before: 75,
					after: 75
				}
			},
			1280: {
				// Applies from 1025px up to 1280px (including 1280)
				peek: {
					before: 250,
					after: 250
				}
			},
			1536: {
				// Applies from 1280px to 1536px (including 1536)
				peek: {
					before: 325,
					after: 325
				}
			},
			1920: {
				// Applies from 1536px to 1920px (including 1920)
				peek: {
					before: 500,
					after: 500
				}
			}
		}
	});

	$effect(() => {
		glide.mount();
	});
</script>

<div class="max-w-full 2xl">
	<div class="glide relative w-full">
		<div class="glide__track" data-glide-el="track">
			<ul class="glide__slides">
				{#each imagesIds as id, i (id)}
					<li class="glide__slide w-full">
						<picture>
							<source srcset={getPhotoUrl(id, 920)} media="(min-width: 1536px)" />
							<source srcset={getPhotoUrl(id, 780)} media="(min-width: 1280px)" />
							<source srcset={getPhotoUrl(id, 500)} media="(max-width: 640px)" />
							<img
								src={getPhotoUrl(id)}
								alt="image #{i}"
								class="aspect-4/3 w-full object-contain mx-auto bg-gray-200"
								loading={i < 3 ? 'eager' : 'lazy'}
							/>
						</picture>
					</li>
				{/each}
			</ul>
		</div>
		<div data-glide-el="controls">
			<button
				class="absolute block top-[50%] z-10 px-4 py-4 left-0 ml-2 -translate-y-1/2 text-white bg-black opacity-50 font-bold rounded cursor-pointer"
				data-glide-dir="<">&lt;</button
			>
			<button
				class="absolute block top-[50%] z-10 px-4 py-4 right-0 mr-2 -translate-y-1/2 text-white bg-black opacity-50 font-bold rounded cursor-pointer"
				data-glide-dir=">">&gt;</button
			>
		</div>
	</div>
</div>
