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
	<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
