<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms';

	type BaseProps = {
		children: Snippet;
		class?: string;
		disabled?: boolean;
		form?: SuperForm<any>;
	};

	type ButtonProps = BaseProps & {
		type: 'button';
		onclick: () => void;
	};

	type SubmitProps = BaseProps & {
		type?: 'submit' | 'reset';
		onclick?: () => void;
	};

	type Props = ButtonProps | SubmitProps;

	let {
		type = 'button',
		children,
		disabled: _disabled = undefined,
		class:
			_class = 'rounded-md bg-yellow-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:cursor-pointer',
		form = undefined,
		onclick = undefined
	}: Props = $props();

	const { tainted, isTainted, submitting, allErrors } = form ?? {};

	let disabled = $derived.by(() => {
		if (_disabled !== undefined) return _disabled;
		if (isTainted && !isTainted($tainted)) return true;
		if (submitting && $submitting) return true;
		if (allErrors && $allErrors && $allErrors.some((error) => error.messages.length > 0))
			return true;
		return false;
	});
</script>

<button {type} {disabled} class={_class} {onclick}>
	{@render children()}
</button>
