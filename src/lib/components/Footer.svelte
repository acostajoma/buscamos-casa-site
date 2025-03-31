<script lang="ts">
	const year = new Date().getFullYear();
	const links = [
		{ name: 'Publicaciones', href: '/publicaciones' },
		{ name: 'Términos y condiciones', href: '/terminos-y-condiciones' },
		{ name: 'Política de privacidad', href: '/privacidad' }
	];
</script>

<footer class="bg-white">
	<div class="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
		<nav class="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6" aria-label="Footer">
			{#each links as { name, href } (href)}
				<a {href} class="text-gray-600 hover:text-brand-2">{name}</a>
			{/each}
		</nav>

		<p class="mt-10 text-center text-sm/6 text-gray-600">
			&copy; {year} Buscamos.casa. Todos los derechos reservados.
		</p>
	</div>
</footer>
