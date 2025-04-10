<script lang="ts">
	import type { ExclusiveVendors } from '$lib/server/utils/vendors';
	import { getFormattedPhoneNumber } from '$lib/utils/phone';
	import { getPhotoUrl } from '$lib/utils/photos';

	interface Props {
		vendors: ExclusiveVendors;
	}
	let { vendors }: Props = $props();
</script>

<ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each vendors as { userId, user: { agentOrBroker, userData } } (userId)}
		{@const formattedPhone = getFormattedPhoneNumber(userData?.phoneNumber, userData?.countryCode)}
		<li
			class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-sm"
		>
			<div class="flex flex-1 flex-col p-8">
				{#if agentOrBroker?.imageId}
					<img
						class="mx-auto size-32 shrink-0 rounded-full"
						src={getPhotoUrl(agentOrBroker.imageId)}
						alt={agentOrBroker.imageAlt || 'Logo del vendedor'}
					/>
				{/if}
				<h3 class="mt-6 text-sm font-medium text-gray-900">{userData.name}</h3>
			</div>

			<a
				href="/publicaciones?exclusiveSeller={agentOrBroker.displayName}"
				class="cursor-pointer text-sm font-semibold text-gray-900 my-4"
			>
				Ver Publicaciones
			</a>
		</li>
	{/each}
</ul>
