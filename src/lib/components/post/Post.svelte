<script lang="ts">
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import Card from '$lib/components/grid/Card.svelte';
	import Grid from '$lib/components/grid/Grid.svelte';
	import Area from '$lib/icons/Area.svelte';
	import Bathroom from '$lib/icons/Bathroom.svelte';
	import Bedroom from '$lib/icons/Bedroom.svelte';
	import Construction from '$lib/icons/Construction.svelte';
	import Garage from '$lib/icons/Garage.svelte';
	import WhatsApp from '$lib/icons/WhatsApp.svelte';
	import Year from '$lib/icons/Year.svelte';
	import { formatCurrency, formatNumber } from '$lib/utils/formatters';
	import * as mapsApi from '@googlemaps/js-api-loader';
	import { untrack } from 'svelte';
	import { parsePhoneNumberWithError } from 'svelte-tel-input';
	import type { CountryCode } from 'svelte-tel-input/types';
	import type { PropertyWithAllData } from '../../../ambient';
	import Container from '../Container.svelte';
	import ImageGallery from './ImageGallery.svelte';
	import PostMetaData from './PostMetaData.svelte';

	const { Loader } = mapsApi;

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

	let formattedPhoneNumber = $derived.by(() => {
		const phoneNumber = parsePhoneNumberWithError(
			sellerInformation.phone as string,
			sellerInformation.countryCode as CountryCode
		);
		if (!phoneNumber.isValid) {
			return null;
		}
		return phoneNumber.countryCallingCode + phoneNumber.nationalNumber;
	});

	let orderedPhotos = $derived(post.photos ? post.photos.sort((a, b) => a.order - b.order) : null);
	let { url } = $derived(page);

	let mapElement: HTMLElement;

	$effect.pre(() => {
		untrack(() => {
			const loader = new Loader({
				apiKey: env.PUBLIC_GOOGLEMAPS_API_KEY,
				version: 'weekly'
			});

			loader.importLibrary('maps').then(({ Map }) => {
				return loader.importLibrary('marker').then(({ AdvancedMarkerElement }) => {
					const initialLatLng = {
						lat: location.latitude as number,
						lng: location.longitude as number
					};
					const map: google.maps.Map | undefined = new Map(mapElement, {
						center: initialLatLng,
						zoom: 11,
						mapId: 'fd53ea48bb9a1791'
					});
					new AdvancedMarkerElement({ map, position: initialLatLng });
				});
			});
		});
	});
</script>

<PostMetaData {post} {orderedPhotos} />

<Container>
	<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl xl:text-4xl">{title}</h1>
</Container>
<ImageGallery imagesIds={orderedPhotos?.map((p) => p.id) ?? []} />
<Container>
	<h3 class="mb-4 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
		Aspectos Financieros
	</h3>
	<div class="mb-6 mt-3">
		<p class="text-lg tracking-tight text-gray-900 sm:text-xl lg:text-2xl">
			{#if salePrice}
				Precio de venta: {formatCurrency(salePrice, currency)}<br />
			{/if}
			{#if rentPrice}
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
		<div class="mt-6">
			<div class="mt-10">
				<a
					href="https://wa.me/{formattedPhoneNumber}?text={encodeURIComponent(
						`Estoy interesado en la propiedad: ${url}`
					)}"
					class="flex max-w-sm flex-1 items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
					><WhatsApp class="mr-2 h-6 w-6 fill-white" />Pregunta por esta propiedad</a
				>
			</div>
		</div>
	{/if}

	<div class="my-6">
		<h3 class="mb-4 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Ubicación</h3>

		<div class="flex flex-col gap-6 lg:flex-row">
			<div class="w-full aspect-4/3 max-w-200" id="maps" bind:this={mapElement}></div>
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
</Container>
