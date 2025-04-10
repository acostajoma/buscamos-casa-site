<script lang="ts">
	import Website from '$lib/icons/Website.svelte';
	import WhatsApp from '$lib/icons/WhatsApp.svelte';
	import type { PropertyWithAllData } from '$lib/server/utils/postsUtils';
	import { createWhatsAppLink, getFormattedPhoneNumber } from '$lib/utils/phone';
	import { getPhotoUrl } from '$lib/utils/photos';

	type Props = {
		sellerInformation: NonNullable<PropertyWithAllData>['sellerInformation'];
		pageUrl: string;
		externalUrl?: string | null;
		agentOrBroker?: NonNullable<PropertyWithAllData>['agentOrBroker'];
	};
	let { sellerInformation, pageUrl, externalUrl, agentOrBroker }: Props = $props();
	let { name } = $derived(sellerInformation);
	let formattedPhoneNumber = $derived(
		getFormattedPhoneNumber(sellerInformation?.phone, sellerInformation?.countryCode)
	);

	let formattedExternalUrl = $derived.by(() => {
		if (!externalUrl) return 'pagina del vendedor';
		const url = new URL(externalUrl);
		const hostname = url.hostname;
		return hostname;
	});
</script>

<div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
	<div class="-mt-4 -ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
		<div class="mt-4 ml-4">
			<div class="flex items-center">
				{#if agentOrBroker && agentOrBroker?.imageId}
					<div class="shrink-0">
						<img
							class="size-16 rounded-full"
							alt={agentOrBroker.imageAlt || 'Logo del vendedor'}
							src={getPhotoUrl(agentOrBroker.imageId, 70)}
						/>
					</div>
				{/if}

				<div class="ml-4">
					<h3 class="text-base font-semibold text-gray-900">{name}</h3>
					{#if agentOrBroker?.instagramUserName}
						{@const { instagramUserName } = agentOrBroker}
						<p class="text-sm text-gray-500">
							<a href="https://www.instagram.com/{instagramUserName}" target="_blank"
								>@{instagramUserName}</a
							>
						</p>
					{/if}
				</div>
			</div>
		</div>
		<div class="mt-4 ml-4 flex shrink-0 gap-2">
			{#if formattedPhoneNumber}
				<a
					target="_blank"
					href={createWhatsAppLink(
						`Estoy interesado en la propiedad: ${pageUrl}`,
						formattedPhoneNumber
					)}
					class="relative inline-flex items-center rounded-md bg-green-500 px-3 py-2 text-sm font-semiboldring-1 shadow-xs ring-green-600 ring-inset hover:bg-green-600 text-white"
				>
					<WhatsApp class="mr-1.5 -ml-0.5 size-5 fill-white" />
					<span>Pregunta por WhatsApp</span>
				</a>
			{/if}
			{#if externalUrl}
				<a
					target="_blank"
					href={externalUrl}
					class="relative inline-flex items-center rounded-md bg-gray-500 px-3 py-2 text-sm font-semiboldring-1 shadow-xs ring-gray-600 ring-inset hover:bg-gray-600 text-white"
				>
					<Website class="mr-1.5 -ml-0.5 size-5 fill-white" />
					<span>Ver en {formattedExternalUrl}</span>
				</a>
			{/if}
		</div>
	</div>
</div>
