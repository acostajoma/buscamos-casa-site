<script lang="ts" module>
	let quantity = 0;
	const colors = [
		'bg-teal-50',
		'bg-purple-50',
		'bg-sky-50',
		'bg-yellow-50',
		'bg-rose-50',
		'bg-indigo-50'
	];
</script>

<script lang="ts">
	import type { Component } from 'svelte';

	type Props = {
		title: string;
		iconComponent: Component<{ class: string }>;
		detail?: string | number | null;
	};
	let { title, iconComponent: Icon, detail }: Props = $props();
	const color = colors[quantity];
	quantity = quantity >= colors.length - 1 ? 0 : quantity + 1;
</script>

<div
	class="group relative rounded-md rounded-tr-lg border border-gray-50 bg-white p-2 shadow sm:p-6"
>
	<div class="flex items-center">
		<span class="inline-flex rounded-lg {color} p-3 text-teal-700 ring-4 ring-white">
			<Icon class="size-5 sm:size-6" />
		</span>
		<div class="ml-4">
			<h3 class="sm text-xs font-semibold text-gray-900 sm:text-base">
				{title}
			</h3>
			<span class="mt-2 text-xs text-gray-500 sm:text-sm">
				{detail || 0}
			</span>
		</div>
	</div>
</div>
