<script lang="ts">
	import MetaData from '$lib/components/MetaData.svelte';
	import Facebook from '$lib/icons/Facebook.svelte';
	import Google from '$lib/icons/Google.svelte';
	import { type MetaDataConfig } from '$lib/utils/metadata';

	const pageConfig: MetaDataConfig = {
		title: 'Inicia Sesión | Regístrate',
		description:
			'Inicia sesión o regístrate en Buscamos.casa para publicar propiedades, contactar vendedores y encontrar tu hogar ideal.',
		keywords: [
			'iniciar sesión',
			'registrarse',
			'crear cuenta',
			'publicar propiedades',
			'contactar vendedores',
			'encontrar hogar',
			'Buscamos.casa'
		],
		robots: 'index, nofollow',
		ogImageUrl: '/images/destacada.jpg'
	};
</script>

<MetaData {pageConfig} />

<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<img
			class="mx-auto h-10 w-auto"
			src="https://res.cloudinary.com/dldnvubae/image/upload/c_thumb,f_auto,q_auto,w_80/v1738775687/r31f2flzuno2iixvpbtb"
			alt="Buscamos Casa"
		/>
		<h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
			Crea una cuenta o regístrate
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
		<div class="bg-white px-6 pb-12 pt-6 shadow-sm sm:rounded-lg sm:px-12">
			<div class="mb-4 flex justify-center text-sm/5 font-light">
				<span class="bg-white px-6 text-gray-900"
					>Usa Google o Facebook para continuar ¡Es Gratis!</span
				>
			</div>

			<div class="flex flex-col gap-4">
				<a
					href="/inicia-sesion/google"
					class="shadow-xs flex w-full items-center justify-center gap-3 rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
				>
					<Google />
					<span class="text-sm/6 font-semibold">Continua con Google</span>
				</a>

				<a
					href="/inicia-sesion/facebook"
					class="shadow-xs flex w-full items-center justify-center gap-3 rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
				>
					<Facebook />
					<span class="text-sm/6 font-semibold">Continua con Facebook</span>
				</a>
			</div>

			<div class="flex justify-center pt-6 text-sm/4 font-light">
				<span class="bg-white px-6 text-gray-900"
					>Al continuar, aceptas los <a
						href="/terminos-y-condiciones"
						class="font-semibold text-yellow-600 hover:text-yellow-500">Términos de Uso.</a
					></span
				>
			</div>
		</div>
	</div>
</div>
