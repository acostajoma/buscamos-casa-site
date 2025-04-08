<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		pageQuantity: number;
		currentPage: number;
		resultsPerPage: number;
		resultsCount: number;
	}
	let { pageQuantity, currentPage, resultsPerPage, resultsCount }: Props = $props();
	const paginatorRangeSize = 1; // Number of pages to show on each side of the current page
	let paginatorRange: number[] = $derived.by(() => {
		if (pageQuantity <= 1) return [];

		const start = Math.max(2, currentPage - paginatorRangeSize);
		const end = Math.min(pageQuantity - 1, currentPage + paginatorRangeSize);
		const range = [];
		for (let i = start; i <= end; i++) {
			range.push(i);
		}
		return range;
	});

	const isFirstPage = $derived(currentPage === 1);
	const isLastPage = $derived(currentPage === pageQuantity);

	let urlPathName = $derived(page.url.pathname);
</script>

{#snippet paginatorButton(pageNumber: number)}
	{@const paginatorStyles =
		currentPage === pageNumber
			? 'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
			: 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}
	<a href="{urlPathName}?pag={pageNumber}" class={paginatorStyles}>
		{pageNumber}
	</a>
{/snippet}

{#if resultsCount > 0}
	<div
		class="mt-10 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
	>
		<div class="flex flex-1 sm:hidden">
			{#if pageQuantity > 1 && currentPage > 1}
				<a
					href="{urlPathName}?pag={currentPage - 1}"
					class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				>
					Anterior
				</a>
			{/if}
			{#if currentPage < pageQuantity && pageQuantity > 1}
				<a
					href="{urlPathName}?pag={currentPage + 1}"
					class="relative ml-auto inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>Siguiente</a
				>
			{/if}
		</div>

		<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
			<div>
				<p class="text-sm text-gray-700">
					Mostrando del
					<span class="font-medium">{(currentPage - 1) * resultsPerPage + 1}</span>
					al
					<span class="font-medium">
						{currentPage * resultsPerPage > resultsCount
							? resultsCount
							: currentPage * resultsPerPage}
					</span>
					de
					<span class="font-medium">{resultsCount}</span>
					resultados
				</p>
			</div>
			{#if pageQuantity > 1}
				<div>
					<nav class="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
						<!-- Previous Page Arrow -->
						{#if !isFirstPage}
							<a
								href="{urlPathName}?pag={currentPage - 1}"
								class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
							>
								<span class="sr-only">Anterior</span>
								<svg
									class="size-5"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
									data-slot="icon"
								>
									<path
										fill-rule="evenodd"
										d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
										clip-rule="evenodd"
									></path>
								</svg>
							</a>
						{/if}

						<!-- Always show first page for quick navigation -->
						{@render paginatorButton(1)}

						<!-- Show dots if there is a gap between the first page and current range -->
						{#if paginatorRange[0] > 2}
							<span
								class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
								>...</span
							>
						{/if}

						<!-- Show the current range of pages -->
						{#each paginatorRange as pageNumber}
							{@render paginatorButton(pageNumber)}
						{/each}

						<!-- Show dots if there is a gap between the last page and current range -->
						{#if paginatorRange[paginatorRange.length - 1] < pageQuantity - 1}
							<span
								class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
								>...</span
							>
						{/if}
						{@render paginatorButton(pageQuantity)}
						{#if !isLastPage}
							<a
								href="{urlPathName}?pag={currentPage + 1}"
								class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
							>
								<span class="sr-only">Siguiente</span>
								<svg
									class="size-5"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
									data-slot="icon"
								>
									<path
										fill-rule="evenodd"
										d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
										clip-rule="evenodd"
									></path>
								</svg>
							</a>
						{/if}
					</nav>
				</div>
			{/if}
		</div>
	</div>
{/if}
