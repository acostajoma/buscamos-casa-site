<script lang="ts">
	import ContactForm from '$lib/components/ContactForm.svelte';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();
</script>

<ContactForm
	formData={data.form}
	description="Esta información se usará para rellenar los datos de las publicaciones que crees. No te preocupes, siempre puedes agregarlos o poner unos distintos a la hora de publicar."
/>
