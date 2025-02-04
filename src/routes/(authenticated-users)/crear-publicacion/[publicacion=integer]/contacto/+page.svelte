<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import Link from '$lib/components/Link.svelte';
	import type { PageData } from './$types';
	type Props = { data: PageData };
	let { data }: Props = $props();
</script>

{#snippet buttonSnippet()}
	<Link href={`/crear-publicacion/${page.params.publicacion}/caracteristicas`}>Anterior</Link>
	<p class="text-sm text-gray-500">Paso 6 de 6</p>

	<Button type="submit">Publicar</Button>
{/snippet}

<ContactForm
	formData={data.form}
	description="Esta información se usará para rellenar los datos de las publicaciones que crees. No te preocupes, siempre puedes agregarlos o poner unos distintos a la hora de publicar."
	emailDisabled={false}
	{buttonSnippet}
/>
