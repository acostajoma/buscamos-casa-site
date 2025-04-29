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
	import Button from './Button.svelte';
	import Link from './Link.svelte';
	import Modal from './Modal.svelte';

	type Props = {
		posts: GetPosts['posts'];
		admin?: boolean;
		owner?: boolean;
		noPostsMessage?: string;
		deleteAction?: string;
	};
	let {
		posts,
		admin = false,
		owner = false,
		noPostsMessage = 'No hay publicaciones...',
		deleteAction
	}: Props = $props();

	const toggleShowState = deleteAction
		? (id?: number) => {
				showDeleteModal = !showDeleteModal;
				if (id) {
					deletePostId = id;
				}
			}
		: undefined;

	let deletePostId: undefined | number = $state(undefined);
	let showDeleteModal: boolean | undefined = $state.raw(
		deleteAction !== undefined ? false : undefined
	);
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

{#snippet itemContent(post: GetPosts['posts'][number])}
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
					loading="lazy"
					class="mx-auto w-full aspect-4/3 hrink-0"
					src={getPhotoUrl(post.photoId, 400)}
					alt="imagen post {post.id}"
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
				{@render propertyInfoItem(Construction, post.constructionSize, 'Metros de construcción')}
			{/if}
			{@render propertyInfoItem(Area, post.size, 'Metros cuadrados del lote')}
		</div>
	</div>
{/snippet}

{#if posts && posts.length > 0}
	<ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
		{#each posts as post (post.id)}
			<li>
				<div class="shadow-sm bg-white flex flex-col divide-y divide-gray-200 rounded-b-lg">
					{#if !owner}
						<a
							href="/{admin ? 'admin' : 'publicacion'}/{post.id}"
							class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-t-lg text-center"
						>
							{@render itemContent(post)}
						</a>
					{:else}
						<div class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-t-lg text-center">
							{@render itemContent(post)}
							<p class="py-2 text-sm font-medium text-gray-900 text-center">
								Estado: {post.listingStatus}
							</p>
							<Link href="/crear-publicacion/{post.id}">Editar Publicación</Link>
							{#if toggleShowState !== undefined && showDeleteModal !== undefined}
								<Button
									onclick={() => toggleShowState(post.id)}
									type="button"
									colorClass="bg-red-600 hover:bg-red-500 focus-visible:red-500 focus-visible:outline-red-500 focus-visible:outline-red-600"
									>Borrar Publicación</Button
								>
							{/if}
						</div>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
{:else}
	<p class="text-left text-gray-500 text-lg">{noPostsMessage}</p>
{/if}

{#if toggleShowState !== undefined && showDeleteModal !== undefined}
	<Modal showModal={showDeleteModal} toggleShowState={() => toggleShowState()}>
		<div>
			<div class="sm:flex sm:items-start">
				<div
					class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10"
				>
					<svg
						class="size-6 text-red-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
						></path>
					</svg>
				</div>
				<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
					<h3 class="text-base font-semibold text-gray-900" id="modal-title">
						Borrar la publicación
					</h3>
					<div class="mt-2">
						<p class="text-sm text-gray-500">
							Está seguro que desea borrar la publicación? Esta será borrada permanentemente y no
							podrá ser recuperada.
						</p>
					</div>
				</div>
			</div>
			<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
				<form action={deleteAction} method="post">
					<input value={deletePostId} class="hidden" name="postToDelete" />
					<button
						type="submit"
						class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto hover:cursor-pointer"
						>Borrar</button
					>
				</form>
				<button
					type="button"
					onclick={() => toggleShowState()}
					class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto hover:cursor-pointer"
					>Cancelar</button
				>
			</div>
		</div>
	</Modal>
{/if}
