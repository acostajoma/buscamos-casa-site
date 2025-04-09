<script lang="ts">
	import Area from '$lib/icons/Area.svelte';
	import Bathroom from '$lib/icons/Bathroom.svelte';
	import Bedroom from '$lib/icons/Bedroom.svelte';
	import Construction from '$lib/icons/Construction.svelte';
	import Garage from '$lib/icons/Garage.svelte';
	import type { GetPosts } from '$lib/server/utils';
	import { formatCurrency } from '$lib/utils/formatters';
	import { getPhotoUrl } from '$lib/utils/photos';
	import { type Currencies } from '$lib/utils/postConstants';
	import { type Component } from 'svelte';
	import Link from './Link.svelte';

	type Props = {
		posts: GetPosts['posts'];
		admin?: boolean;
		owner?: boolean;
		noPostsMessage?: string;
	};
	let {
		posts,
		admin = false,
		owner = false,
		noPostsMessage = 'No hay publicaciones...'
	}: Props = $props();
</script>

{#snippet propertyInfoItem(Icon: Component, amount: number | string | null, description: string)}
	<div class="flex w-0 flex-1 not-first:-ml-px">
		<span
			class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-1 rounded-br-lg border border-transparent py-4"
		>
			<p class="sr-only">{description}</p>
			<Icon class="size-4 sm:size-5" />
			{amount || 0}
		</span>
	</div>
{/snippet}

{#snippet typeAndPrice(type: string, price: number | null, currency: Currencies | null)}
	<span
		class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset nth-of-type-[2]:ml-1"
	>
		{type}:
		{#if price && currency}
			{formatCurrency(price, currency)}
		{:else if owner}
			No tiene precio
		{:else}
			Consultar precio
		{/if}
	</span>
{/snippet}

{#if posts.length > 0}
	<ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
		{#each posts as post (post.id)}
			<li>
				<div class="shadow-sm bg-white flex flex-col divide-y divide-gray-200 rounded-b-lg">
					<a
						href="/{admin ? 'admin' : 'publicacion'}/{post.id}"
						class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-t-lg text-center"
					>
						<div class="flex flex-1 flex-col py-8 px-2">
							{#if post.photoId}
								{@const { photoId } = post}
								<picture>
									<source srcset={getPhotoUrl(post.photoId, 375)} media="(min-width: 1280px)" />
									<source srcset={getPhotoUrl(post.photoId, 340)} media="(min-width: 640px)" />
									<source srcset={getPhotoUrl(post.photoId, 300)} media="(min-width: 640px)" />
									<source srcset={getPhotoUrl(post.photoId, 580)} media="(min-width: 450px)" />
									<source srcset={getPhotoUrl(post.photoId, 400)} media="(max-width: 450px)" />
									<img
										class="mx-auto w-full aspect-4/3 hrink-0"
										src={getPhotoUrl(post.photoId, 400)}
										alt="imagen post {post.id}"
										loading="lazy"
									/>
								</picture>
							{:else}
								<div class="mx-auto w-full aspect-4/3 bg-gray-200">
									<p class="mt-10">Esta publicación no tiene imagen</p>
								</div>
							{/if}

							<h3 class="mt-6 text-sm font-medium text-gray-900">{post.title}</h3>
							<dl class="mt-1 flex grow flex-col justify-between">
								<dt class="sr-only">Ubicación</dt>
								<dd class="text-sm text-gray-500">{post.district}, {post.city}, {post.state}</dd>

								<dt class="sr-only">Tipos de venta</dt>
								<dd class="mt-3">
									{#if post.isForSale}
										{@render typeAndPrice('Venta', post.salePrice, post.currency)}
									{/if}
									{#if post.isForRent || post.isRentToBuy}
										{@render typeAndPrice('Alquiler', post.rentPrice, post.currency)}
									{/if}
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

					{#if owner}
						<p class="py-2 text-sm font-medium text-gray-900 text-center">
							Estado: {post.listingStatus}
						</p>
						<Link
							href="/crear-publicacion/{post.id}"
							class="rounded-md bg-yellow-500 px-2.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 text-center"
							>Editar Publicación</Link
						>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
{:else}
	<p class="text-left text-gray-500 text-lg">{noPostsMessage}</p>
{/if}
