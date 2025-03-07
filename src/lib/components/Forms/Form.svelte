<script lang="ts">
	import { dev } from '$app/environment';
	import { enhance as svelteEnhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { type Snippet } from 'svelte';
	import SuperDebug, { type SuperForm } from 'sveltekit-superforms';

	type Props = {
		children: Snippet;
		form?: SuperForm<any>;
		action?: string;
		class?: string;
		enctype?:
			| 'application/x-www-form-urlencoded'
			| 'multipart/form-data'
			| 'text/plain'
			| null
			| undefined;
		submitFunction?: SubmitFunction;
		debug?: boolean;
	};
	let {
		children,
		action,
		class: _class,
		form: superform,
		enctype,
		submitFunction,
		debug = false
	}: Props = $props();
	const { form, message, formId } = superform || {};

	const enhance = superform ? superform.enhance : svelteEnhance;
</script>

<form method="post" {action} use:enhance={submitFunction} class={_class} id={$formId} {enctype}>
	{@render children()}

	{#if $message}
		{@const success = $message.success}
		<p class="mt-2 text-sm" class:text-green-600={success} class:text-red-600={!success}>
			{$message.message}
		</p>
	{/if}
</form>

{#if dev && form && debug}
	<div class="min-w-80 pt-10">
		<p>This SuperDebug Section will only appear on dev mode</p>
		<SuperDebug data={$form} />
	</div>
{/if}
