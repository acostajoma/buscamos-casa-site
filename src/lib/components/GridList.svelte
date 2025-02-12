<script lang="ts">
	import Area from '$lib/icons/Area.svelte';
	import Bathroom from '$lib/icons/Bathroom.svelte';
	import Bedroom from '$lib/icons/Bedroom.svelte';
	import Construction from '$lib/icons/Construction.svelte';
	import Garage from '$lib/icons/Garage.svelte';
	import { formatCurrency } from '$lib/utils/formatters';
	import { getPhotoUrl } from '$lib/utils/photos';
	import { type Component } from 'svelte';
	import type { PageData } from '../../../.svelte-kit/types/src/routes/publicaciones/$types';

	type Props = {
		posts: PageData['posts'];
	};
	let { posts }: Props = $props();
</script>

{#snippet propertyInfoItem(Icon: Component, amount: number | string | null, description: string)}
	<div class="flex w-0 flex-1 not-first:-ml-px">
		<span
			class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-1 rounded-br-lg border border-transparent py-4"
		>
			<p class="sr-only">{description}</p>
			<Icon class="size-4 sm:size-5" />
			{amount ?? 0}
		</span>
	</div>
{/snippet}

<ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
	{#each posts as post (post.id)}
		<li>
			<a
				href="/publicacion/{post.id}"
				class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-sm"
			>
				<div class="flex flex-1 flex-col py-8 px-2">
					<picture>
						<source srcset={getPhotoUrl(post.photoIds[0], 375)} media="(min-width: 1280px)" />
						<source srcset={getPhotoUrl(post.photoIds[0], 340)} media="(min-width: 640px)" />
						<source srcset={getPhotoUrl(post.photoIds[0], 300)} media="(min-width: 640px)" />
						<source srcset={getPhotoUrl(post.photoIds[0], 580)} media="(min-width: 450px)" />
						<source srcset={getPhotoUrl(post.photoIds[0], 400)} media="(max-width: 450px)" />
						<img
							class="mx-auto w-full aspect-4/3 hrink-0"
							src={getPhotoUrl(post.photoIds[0], 400)}
							alt="imagen post {post.id}"
							loading="lazy"
						/>
					</picture>

					<h3 class="mt-6 text-sm font-medium text-gray-900">{post.title}</h3>
					<dl class="mt-1 flex grow flex-col justify-between">
						<dt class="sr-only">Ubicación</dt>
						<dd class="text-sm text-gray-500">{post.district}, {post.city}, {post.state}</dd>

						<dt class="sr-only">Tipos de venta</dt>
						<dd class="mt-3">
							{#each post.saleType as type (type)}
								<span
									class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset nth-of-type-[2]:ml-1"
									>{type}:
									{#if type === 'Venta' && post.salePrice && post.currency}
										{formatCurrency(post.salePrice, post.currency)}
									{:else if type === 'Alquiler' && post.rentPrice && post.currency}
										{formatCurrency(post.rentPrice, post.currency)}
									{:else}
										Consultar precio
									{/if}
								</span>
							{/each}
						</dd>
					</dl>
				</div>
				<div>
					<div class="-mt-px flex divide-x divide-gray-200 font-normal text-gray-900 text-xs">
						{#if post.propertyType !== 'Finca' && post.propertyType !== 'Lote'}
							{@render propertyInfoItem(Bathroom, post.numBathrooms, 'Cantidad de baños')}
							{@render propertyInfoItem(Bedroom, post.numBedrooms, 'Cantidad de cuartos')}
							{@render propertyInfoItem(Garage, post.garageSpace, 'Cantidad de garages')}
							{@render propertyInfoItem(
								Construction,
								post.constructionSize,
								'Metros de construcción'
							)}
						{/if}
						{@render propertyInfoItem(Area, post.size, 'Metros cuadrados del lote')}
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>
