<script lang="ts">
	import DropDownArrow from '$lib/icons/DropDownArrow.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();
</script>

<div class=" group relative">
	<p class="inline-flex items-center gap-x-1 px-2 text-sm/6 font-semibold text-gray-900">
		Perfil
		<DropDownArrow />
	</p>

	<!--
      Flyout menu, show/hide based on flyout menu state.
  
      Entering: "transition ease-out duration-200"
        From: "opacity-0 translate-y-1"
        To: "opacity-100 translate-y-0"
      Leaving: "transition ease-in duration-150"
        From: "opacity-100 translate-y-0"
        To: "opacity-0 translate-y-1"
    -->
	<div
		class="absolute left-1/2 z-10 hidden w-screen max-w-min -translate-x-1/2 px-4 pt-5 group-hover:flex"
	>
		<div
			class="w-56 shrink rounded-xl bg-white p-4 text-sm/6 font-semibold text-gray-900 shadow-lg ring-1 ring-gray-900/5"
		>
			{@render children()}
		</div>
	</div>
</div>
