<script>
	import Hero from '$lib/components/Hero.svelte';
</script>

<svelte:head>
	<title>Publicación en revisión</title>
</svelte:head>

<Hero
	headline="Tu publicación está en revisión."
	description="Tu publicación será revisada por nuestro equipo para asegurarnos de que cumple con nuestras
			políticas de contenido. Podrás verificar el resultado de la revisión en tu panel de
			publicaciones. Toma en cuenta que este proceso puede tardar hasta 24 horas."
>
	{#snippet bottomZone()}
		<a
			href="/"
			class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>Ir a la página de inicio</a
		>
		<a href="/terminos-y-condiciones" class="text-sm/6 font-semibold text-gray-900"
			>Nuestras Políticas<span aria-hidden="true">→</span></a
		>
	{/snippet}
</Hero>
