<script lang="ts">
	type Props = {
		class?: string;
	};
	let { class: _class = 'size-6' }: Props = $props();
</script>

<svg
	class={_class}
	fill="none"
	viewBox="0 0 24 24"
	stroke-width="1.5"
	stroke="currentColor"
	aria-hidden="true"
	data-slot="icon"
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
	/>
</svg>
