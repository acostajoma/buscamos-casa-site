<script lang="ts">
	import { page } from '$app/state';
	import Post from '$lib/components/post/Post.svelte';
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Admin Post: #{page.params.postId} | Buscamos.casa</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if data.post}
	<div class="flex justify-end space-x-4 mx-4">
		<form action="?/accept" method="post">
			<button
				type="submit"
				class="rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
				>Aceptar</button
			>
		</form>
		<form action="?/reject" method="post">
			<button
				type="submit"
				class="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
				>Denegar</button
			>
		</form>
	</div>
	<Post post={data.post} />
{/if}
