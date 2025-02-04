<script lang="ts">
	import { TelInput, normalizedCountries } from 'svelte-tel-input';
	import type { CountryCode, DetailedValue, E164Number } from 'svelte-tel-input/types';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';

	type Props = {
		name: string;
		countryPlaceholderName: string;
		form: SuperForm<any>;
	};
	let { name, form, countryPlaceholderName }: Props = $props();
	const { value: proxiedPhoneValue, errors } = formFieldProxy(form, name);
	const { value: proxiedCountryValue } = formFieldProxy(form, countryPlaceholderName);

	// Any Country Code Alpha-2 (ISO 3166)
	let selectedCountry: CountryCode | null = $state('CR');

	// You must use E164 number format. It's guarantee the parsing and storing consistency.
	let value: E164Number | null = $state($proxiedPhoneValue);

	// Validity
	let valid = $state(true);
	let conditionalClasses = $state('text-gray-900 ring-gray-300');

	// Optional - Extended details about the parsed phone number
	let detailedValue: DetailedValue | null = $state(null);
</script>

<div class="wrapper">
	<select
		class="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
		aria-label="Default select example"
		name="Country"
		bind:value={selectedCountry}
		onchange={() => {
			$proxiedCountryValue = selectedCountry;
		}}
	>
		<option value={null} hidden={selectedCountry !== null}>Please select</option>
		{#each normalizedCountries as currentCountry (currentCountry.id)}
			<option
				value={currentCountry.iso2}
				selected={currentCountry.iso2 === selectedCountry}
				aria-selected={currentCountry.iso2 === selectedCountry}
			>
				{currentCountry.iso2} (+{currentCountry.dialCode})
			</option>
		{/each}
	</select>
	<TelInput
		bind:country={selectedCountry}
		bind:value
		bind:valid
		bind:detailedValue
		required
		class="rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:outline-gray-200 {conditionalClasses}"
		placeholder="89066157"
		oninput={() => {
			$proxiedPhoneValue = detailedValue ? detailedValue.nationalNumber : undefined;
		}}
		onblur={() => {
			if (valid) {
				conditionalClasses = 'text-green-900 ring-green-500';
			} else if (!valid && value && value.length > 2) {
				conditionalClasses = 'text-red-900 ring-red-500';
			} else {
				conditionalClasses = 'text-gray-900 ring-gray-300';
			}
		}}
	/>

	{#if $errors && $errors.length}
		<p class="mt-2 text-sm text-red-600" id={`${name}-error`}>{$errors.join(' ')}</p>
	{/if}
</div>
