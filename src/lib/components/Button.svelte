<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms';

	type BaseProps = {
		children: Snippet;
		additionalClasses?: string;
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
		additionalClasses,
		class:
			_class = `rounded-md bg-brand-1 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-1 disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:cursor-pointer${additionalClasses ? ` ${additionalClasses}` : ''}`,
		form = undefined,
		onclick = undefined
	}: Props = $props();

	const { tainted, isTainted, submitting, allErrors } = form || {};

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
