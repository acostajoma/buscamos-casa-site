<script lang="ts">
	import { PUBLIC_GOOGLEMAPS_API_KEY } from '$env/static/public';
	import { locationMap } from '$lib/utils/location/costaRicaData';
	import type { Location } from '$lib/validation/post';
	import * as mapsApi from '@googlemaps/js-api-loader';
	import { untrack } from 'svelte';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';

	const { Loader } = mapsApi;

	// Types and Props
	type Props = {
		form: SuperForm<Location>;
	};

	let { form }: Props = $props();

	// Component state
	let map: google.maps.Map | undefined = $state.raw();
	let showMapLocationButton = $state.raw(false);
	let canRunGeocoder = $state.raw(false);
	let errorMessage = $state.raw('');

	let marker: google.maps.marker.AdvancedMarkerElement;
	let mapElement: HTMLElement;
	let controlDiv: HTMLElement;
	let geocoder: google.maps.Geocoder;

	// Form field proxies
	const { value: latitude, errors: latitudeErrors } = formFieldProxy(form, 'latitude');
	const { value: longitude, errors: longitudeErrors } = formFieldProxy(form, 'longitude');
	const { value: district } = formFieldProxy(form, 'district');
	const { value: canton } = formFieldProxy(form, 'city');
	const { value: propertyState } = formFieldProxy(form, 'state');

	// Initial Lat/Lng
	const initialLatLng = { lat: $latitude ?? 9.936128, lng: $longitude ?? -84.105166 };

	/**
	 * Performs geocoding on lat/lng and updates fields.
	 */
	async function geocode(request: google.maps.GeocoderRequest) {
		if (!canRunGeocoder) return;

		try {
			const result = await geocoder.geocode(request);
			const { location } = result.results[0].geometry;
			map?.setCenter(location);
			marker.position = location;
			setLocationData(result);
			validateLocationData();
			canRunGeocoder = false;
		} catch (error) {
			errorMessage = 'Error al obtener la ubicación. Selección manual requerida.';
		}
	}

	/**
	 * Logic to ensure the province, canton and district are valid.
	 */
	function validateLocationData() {
		errorMessage = '';
		const cantons = locationMap.get($propertyState ?? '');
		const districts = cantons?.get($canton as string);
		if (!cantons) {
			$propertyState = '';
			errorMessage = 'Provincia inválida. Selección manual requerida.';
		} else if (!districts) {
			$canton = '';
			errorMessage = 'Cantón inválido. Selección manual requerida.';
		} else if (!districts.has($district)) {
			$district = '';
			errorMessage = 'Distrito inválido. Selección manual requerida.';
		}
	}

	/**
	 * Extracts province, canton and district from geocoding result.
	 */
	function setLocationData(response: google.maps.GeocoderResponse) {
		const requiredTypes = [
			'administrative_area_level_1',
			'administrative_area_level_2',
			'administrative_area_level_3'
		];

		$propertyState = '';
		$canton = '';
		$district = '';

		for (const { address_components } of response.results) {
			for (const component of address_components) {
				// Does it include at least one of the desired types?
				if (!requiredTypes.some((type) => component.types.includes(type))) continue;

				if (!$district && component.types.includes('administrative_area_level_3')) {
					$district = component.long_name;
				} else if (!$canton && component.types.includes('administrative_area_level_2')) {
					$canton = component.long_name;
				} else if (!$propertyState && component.types.includes('administrative_area_level_1')) {
					$propertyState = component.long_name.replace(/( Province|Provincia de )/gi, '');
				}
			}
			if ($propertyState && $canton && $district) break;
		}
	}

	/**
	 * When button is clicked, geocodes based on lat/lng.
	 */
	function handleControlButtonClick() {
		if ($latitude != null && $longitude != null && !isNaN($latitude) && !isNaN($longitude)) {
			geocode({ location: { lat: $latitude, lng: $longitude } });
		}
	}

	// Map initialization
	$effect.pre(() => {
		untrack(() => {
			const loader = new Loader({
				apiKey: PUBLIC_GOOGLEMAPS_API_KEY,
				version: 'weekly'
			});

			loader.importLibrary('maps').then(({ Map }) => {
				return loader.importLibrary('marker').then(({ AdvancedMarkerElement }) => {
					map = new Map(mapElement, {
						center: initialLatLng,
						zoom: 8,
						mapId: 'fd53ea48bb9a1791'
					});

					geocoder = new google.maps.Geocoder();
					marker = new AdvancedMarkerElement({ map, position: initialLatLng });

					const mapClickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
						if (!e.latLng) return;
						marker.position = e.latLng;
						$latitude = parseFloat(e.latLng.lat().toFixed(6)) || null;
						$longitude = parseFloat(e.latLng.lng().toFixed(6)) || null;
						canRunGeocoder = true;
					});

					map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controlDiv);
					showMapLocationButton = true;

					return () => {
						mapClickListener.remove();
					};
				});
			});
		});
	});
</script>

<div id="maps" bind:this={mapElement} class="w-full h-full">
	<div bind:this={controlDiv}>
		<button
			type="button"
			class={`${showMapLocationButton ? '' : 'hidden'} mt-2 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-3`}
			onclick={handleControlButtonClick}
			title="Click para rellenar los campos de abajo con esta información"
		>
			Rellenar datos de Ubicación con los datos del mapa
		</button>
	</div>

	{#if $latitudeErrors || $longitudeErrors || errorMessage}
		<p class="mt-2 text-sm text-red-600" id={`map-error`}>
			{$latitudeErrors || $longitudeErrors || errorMessage}
		</p>
	{/if}
</div>
