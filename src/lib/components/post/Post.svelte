<script lang="ts">
	import { page } from '$app/state';
	import Card from '$lib/components/grid/Card.svelte';
	import Grid from '$lib/components/grid/Grid.svelte';
	import Area from '$lib/icons/Area.svelte';
	import Bathroom from '$lib/icons/Bathroom.svelte';
	import Bedroom from '$lib/icons/Bedroom.svelte';
	import Construction from '$lib/icons/Construction.svelte';
	import Facebook from '$lib/icons/Facebook.svelte';
	import Garage from '$lib/icons/Garage.svelte';
	import Url from '$lib/icons/Url.svelte';
	import WhatsApp from '$lib/icons/WhatsApp.svelte';
	import Year from '$lib/icons/Year.svelte';
	import type { PropertyWithAllData } from '$lib/server/utils/postsUtils';
	import { formatCurrency, formatNumber } from '$lib/utils/formatters';
	import { createWhatsAppLink } from '$lib/utils/phone';
	import { fade } from 'svelte/transition';
	import CardHeading from '../CardHeading.svelte';
	import Container from '../Container.svelte';
	import Link from '../Link.svelte';
	import ListWithDivider from '../ListWithDivider.svelte';
	import ImageGallery from './ImageGallery.svelte';
	import Map from './Map.svelte';
	import PostMetaData from './PostMetaData.svelte';

	type Props = {
		post: NonNullable<PropertyWithAllData>;
	};
	let { post }: Props = $props();

	let {
		description,
		location,
		propertiesWithConstruction,
		propertyFeatures,
		propertyFinancialDetails: { salePrice, currency, rentPrice, maintenanceCost },
		sellerInformation,
		isForRent,
		isForSale,
		isRentToBuy,
		title,
		size,
		propertyType,
		agentOrBroker
	} = $derived(post);

	let pageUrl = $derived(page.url.toString());

	let sharingMessage: undefined | string = $state.raw(undefined);

	function copyUrl() {
		navigator.clipboard.writeText(pageUrl);
		sharingMessage = 'URL copiada al portapapeles';

		setTimeout(() => {
			sharingMessage = undefined;
		}, 2500);
	}
</script>

{#if !page.url.pathname.startsWith('/admin')}
	<!-- Avoid adding metadata if is on the admin page -->
	<PostMetaData {post} orderedPhotos={post.photos} />
{/if}

<Container>
	<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl xl:text-4xl">{title}</h1>
</Container>
<ImageGallery imagesIds={post.photos?.map((p) => p.id) || []} />
<Container>
	<h3 class="mb-4 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
		Aspectos Financieros
	</h3>
	<div class="mb-6 mt-3">
		<p class="text-lg tracking-tight text-gray-900 sm:text-xl lg:text-2xl">
			{#if salePrice && isForSale}
				Precio de venta: {formatCurrency(salePrice, currency)}<br />
			{/if}
			{#if rentPrice && (isForRent || isRentToBuy)}
				Precio de alquiler: {formatCurrency(rentPrice, currency)}<br />
			{/if}
			{#if maintenanceCost && maintenanceCost > 0}
				Costo de mantenimiento: {formatCurrency(maintenanceCost, currency)}
			{/if}
		</p>
	</div>
	<div class="my-6">
		<h3 class="mb-4 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Descripción</h3>

		<div class="space-y-6 text-base text-gray-700 sm:text-xl">
			<p>
				{description}
			</p>
		</div>
	</div>

	<Grid>
		<h3 class="sr-only">Información del Post</h3>

		{#if propertyType && propertyType !== 'Lote' && propertyType !== 'Finca'}
			{@const { constructionSize, garageSpace, numBathrooms, numBedrooms, yearBuilt } =
				propertiesWithConstruction}
			<Card title="Baños" iconComponent={Bathroom} detail={numBathrooms} />
			<Card title="Cuartos" iconComponent={Bedroom} detail={numBedrooms} />
			<Card title="Garage" iconComponent={Garage} detail={garageSpace} />
			<Card title="Área" iconComponent={Area} detail={`${formatNumber(size)} m2`} />
			<Card
				title="Construcción"
				iconComponent={Construction}
				detail={`${formatNumber(constructionSize || 0)} m2`}
			/>
			<Card title="Año de Construcción" iconComponent={Year} detail={yearBuilt} />
		{:else}
			<Card title="Área" iconComponent={Area} detail={`${formatNumber(size)} m2`} />
		{/if}
	</Grid>

	<h3 class="my-10 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
		Información de contacto
	</h3>
	<CardHeading {sellerInformation} {pageUrl} externalUrl={post.externalURL} {agentOrBroker} />

	<div class="my-10">
		<h3 class="mb-4 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
			Ubicación de la propiedad
		</h3>

		<div class="flex flex-col gap-6 lg:flex-row">
			<Map {location} />
			<div>
				<p class="mb-4 text-lg tracking-tight text-gray-900 sm:text-xl">
					<span class="font-bold">Provincia:</span>
					{location.state}
				</p>
				<p class="mb-4 text-lg tracking-tight text-gray-900 sm:text-xl">
					<span class="font-bold">Cantón:</span>
					{location.city}
				</p>
				<p class="mb-4 text-lg tracking-tight text-gray-900 sm:text-xl">
					<span class="font-bold">Distrito:</span>
					{location.district}
				</p>
				<p class="mb-4 text-lg tracking-tight text-gray-900 sm:text-xl">
					<span class="font-bold">Dirección Exacta:</span>
					{location.address}
				</p>
			</div>
		</div>
	</div>

	{#if propertyFeatures.length > 0}
		<div class="my-6">
			<h3 class="mb-4 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
				Características
			</h3>

			<ListWithDivider useGrid>
				{#each propertyFeatures as { feature }}
					<li class="text-xs sm:text-lg tracking-tight text-gray-900 md:text-xl">
						{feature.name}
					</li>
				{/each}
			</ListWithDivider>
		</div>
	{/if}
	<div id="sharing-section">
		<h3 class="mt-10 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl mb-2">
			Comparte esta Publicación
		</h3>
		<div class="flex gap-4 flex-wrap">
			<Link
				target="_blank"
				href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(
					pageUrl
				)}&src=sdkpreparse"
				class="inline-flex items-center space-x-2 rounded bg-[#4267B2] px-4 py-2 text-white hover:bg-[#36528C] max-w-56"
			>
				<Facebook class="h-5 w-5 fill-current" />
				<span>Facebook</span>
			</Link>
			<Link
				target="_blank"
				class="inline-flex items-center space-x-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 max-w-56"
				href={createWhatsAppLink(
					`Mira esta propiedad que está publicada en Buscamos.casa: ${pageUrl}`
				)}
			>
				<WhatsApp class="h-5 w-5 fill-current" />
				<span>WhatsApp</span>
			</Link>

			<button
				onclick={copyUrl}
				type="button"
				class="inline-flex items-center space-x-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 max-w-56"
			>
				<Url class="h-5 w-5 fill-current" />
				<span>Copiar URL</span>
			</button>
		</div>
		{#if sharingMessage}
			<p class="mt-4 text-sm text-gray-700" transition:fade>{sharingMessage}</p>
		{/if}
	</div>
</Container>
