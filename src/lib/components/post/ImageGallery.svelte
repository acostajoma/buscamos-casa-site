<script lang="ts">
	import { getPhotoUrl } from '$lib/utils/photos';
	import Glide from '@glidejs/glide';
	import '@glidejs/glide/dist/css/glide.core.min.css';

	type Props = {
		imagesIds: string[];
	};
	let { imagesIds }: Props = $props();

	const glide = new Glide('.glide', {
		type: 'slider',
		startAt: 0,
		perView: 1,
		peek: { before: 600, after: 600 },
		breakpoints: {
			1025: {
				perView: 1,
				peek: {
					before: 0,
					after: 0
				}
			},
			1536: {
				perView: 1,
				peek: {
					before: 300,
					after: 300
				}
			}
		}
	});

	$effect(() => {
		glide.mount();
	});
</script>

<div class="max-w-full">
	<div class="glide relative w-full">
		<div class="glide__track" data-glide-el="track">
			<ul class="glide__slides">
				{#each imagesIds as id, i (id)}
					<li class="glide__slide w-full">
						<picture>
							<source srcset={getPhotoUrl(id, 720)} media="(min-width: 1980px)" />
							<source srcset={getPhotoUrl(id, 680)} media="(min-width: 1025px)" />
							<source srcset={getPhotoUrl(id, 950)} media="(min-width: 768px)" />
							<source srcset={getPhotoUrl(id, 480)} media="(max-width: 600px)" />
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
