<script lang="ts">
	import { dev } from '$app/environment';
	import { type Snippet } from 'svelte';
	import SuperDebug, { type SuperForm } from 'sveltekit-superforms';

	type Props = {
		children: Snippet;
		form: SuperForm<any>;
		action?: string;
		class?: string;
	};
	let { children, action, class: _class, form: superform }: Props = $props();
	const { form, message, enhance, formId } = superform;
</script>

<form method="post" {action} use:enhance class={_class} id={$formId}>
	{@render children()}

	{#if $message}
		{@const success = $message.success}
		<p class="mt-2 text-sm" class:text-green-600={success} class:text-red-600={!success}>
			{$message.message}
		</p>
	{/if}
</form>

{#if dev}
	<div class="min-w-80 pt-10">
		<p>This SuperDebug Section will only appear on dev mode</p>
		<SuperDebug data={$form} />
	</div>
{/if}
