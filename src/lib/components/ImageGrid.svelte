<script lang="ts">
	type Props = {
		images: Cloudinary.Image[];
	};

	let { images }: Props = $props();
</script>

<ul role="list" class="flex flex-wrap gap-4">
	{#each images as { key, data, state }, i (key)}
		<li class="relative">
			<div
				class="group overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
			>
				{#if state === 'successful'}
					<img
						src={(data as Cloudinary.Asset).eager[0].secure_url}
						alt="image {i}"
						class="pointer-events-none aspect-10/7 object-cover group-hover:opacity-75"
					/>
				{:else if state === 'posted' && data && typeof data === 'object' && 'id' in data}
					<img
						src={`https://res.cloudinary.com/dldnvubae/image/upload/c_scale,h_90,w_120/f_auto/q_auto/${data.id}`}
						alt="image {i}"
					/>
				{:else if state === 'uploading'}
					<div class="flex justify-center items-center">
						<svg
							class="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-500"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						<p>Subiendo...</p>
					</div>
				{/if}
			</div>
		</li>
	{/each}
</ul>
