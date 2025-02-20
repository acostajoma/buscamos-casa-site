<script lang="ts">
	import { PUBLIC_GOOGLEMAPS_API_KEY } from '$env/static/public';
	import type { Location } from '$lib/validation/post';
	import * as mapsApi from '@googlemaps/js-api-loader';
	import { onMount } from 'svelte';

	const { Loader } = mapsApi;

	type Props = {
		location: Location;
	};
	let { location }: Props = $props();

	let mapElement: HTMLElement;

	onMount(() => {
		const loader = new Loader({
			apiKey: PUBLIC_GOOGLEMAPS_API_KEY,
			version: 'weekly'
		});

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
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
					observer.unobserve(mapElement);
				}
			},
			{ rootMargin: '200px' }
		);
		observer.observe(mapElement);
		return () => observer.disconnect();
	});
</script>

<div class="w-full aspect-4/3 max-w-200" id="maps" bind:this={mapElement}></div>
