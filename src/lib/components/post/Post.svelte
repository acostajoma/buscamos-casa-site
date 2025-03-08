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
	import { formatCurrency, formatNumber } from '$lib/utils/formatters';
	import { createWhatsAppLink } from '$lib/utils/phone';
	import { parsePhoneNumberWithError } from 'svelte-tel-input';
	import type { CountryCode } from 'svelte-tel-input/types';
	import { fade } from 'svelte/transition';
	import type { PropertyWithAllData } from '../../../ambient';
	import Container from '../Container.svelte';
	import Link from '../Link.svelte';
	import ListWithDivider from '../ListWithDivider.svelte';
	import ImageGallery from './ImageGallery.svelte';
	import Map from './Map.svelte';
	import PostMetaData from './PostMetaData.svelte';

	type Props = {
		post: PropertyWithAllData;
	};
	let { post }: Props = $props();

	let {
		location,
		title,
		saleType,
		propertiesWithConstruction,
		propertyFeatures,
		propertyFinancialDetails,
		sellerInformation,
		size,
		propertyType,
		description
	} = $derived(post);

	let { salePrice, currency, rentPrice, maintenanceCost } = $derived(propertyFinancialDetails);
	let pageUrl = $derived(page.url.toString());

	let formattedPhoneNumber = $derived.by(() => {
		if (!sellerInformation?.phone || !sellerInformation?.countryCode) {
			return null;
		}
		const phoneNumber = parsePhoneNumberWithError(
			sellerInformation?.phone as string,
			sellerInformation?.countryCode as CountryCode
		);
		if (!phoneNumber.isValid) {
			return null;
		}
		return phoneNumber.countryCallingCode + phoneNumber.nationalNumber;
	});

	let sharingMessage: undefined | string = $state.raw(undefined);
	let url = $derived(page.url.toString());

	function copyUrl() {
		navigator.clipboard.writeText(pageUrl);
		sharingMessage = 'URL copiada al portapapeles';

		setTimeout(() => {
			sharingMessage = undefined;
		}, 2500);
	}
</script>

<PostMetaData {post} orderedPhotos={post.photos} />

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
			{#if salePrice && saleType.some((type) => type.type === 'Venta')}
				Precio de venta: {formatCurrency(salePrice, currency)}<br />
			{/if}
			{#if rentPrice && saleType.some((type) => type.type === 'Alquiler')}
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

	{#if formattedPhoneNumber}
		<h3 class="mt-10 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
			Información de contacto
		</h3>
		<p class="text-lg tracking-tight text-gray-900 sm:text-xl lg:text-2xl">
			Nombre del anunciante: {sellerInformation.name}
		</p>
		<a
			target="_blank"
			href={createWhatsAppLink(`Estoy interesado en la propiedad: ${url}`, formattedPhoneNumber)}
			class="mt-4 flex max-w-sm flex-1 items-center justify-center rounded-md border border-transparent bg-green-500 px-8 py-3 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
			><WhatsApp class="mr-2 h-6 w-6 fill-white" />Pregunta por esta propiedad</a
		>
	{/if}

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

	<div class="my-6">
		<h3 class="mb-4 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Ubicación</h3>

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
					<li class="text-xs sm:text-lg tracking-tight text-gray-900 md:text-xl">{feature.name}</li>
				{/each}
			</ListWithDivider>
		</div>
	{/if}
</Container>
