<script lang="ts">
	import Post from '$lib/components/post/Post.svelte';
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
	let { post } = $derived(data);
</script>

<Post {post} />
