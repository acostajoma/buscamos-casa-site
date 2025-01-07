<script lang="ts">
	type Props = {
		id: string;
		name: string;
		label: string;
		group: string;
		value: string;
	};
	let { id, name, label, group = $bindable(), value }: Props = $props();
</script>

<div class="flex items-center">
	<input
		{id}
		{name}
		type="radio"
		bind:group
		{value}
		class="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
	/>
	<label for={id} class="ml-3 block text-sm/6 font-medium text-gray-900">{label}</label>
</div>
