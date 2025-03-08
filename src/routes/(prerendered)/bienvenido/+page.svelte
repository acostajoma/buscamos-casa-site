<script lang="ts">
	import TextPage from '$lib/components/TextPage.svelte';
	import YellowCheck from '$lib/icons/YellowCheck.svelte';
	import { companyMail, companyPhoneNumber } from '$lib/utils/constants';
	import { createWhatsAppLink } from '$lib/utils/phone';
</script>

<TextPage title="¡Únete a Nuestra Plataforma de Bienes Raíces!">
	<div class="my-10 space-y-4 text-gray-600">
		<p>¡Estamos emocionados de anunciar nuestra plataforma de bienes raíces!</p>
		<p>
			En Buscamos.casa tenemos la idea de construir un espacio eficiente, fácil de usar y adaptado a
			las necesidades reales de compradores, vendedores e inversionistas. Donde las personas puedan
			publicar propiedades sin comisiones y encontrar a los cliente ideales.
		</p>
		<ol class="list-decimal list-inside mt-8 max-w-xl space-y-8 text-gray-600">
			<li>
				<span class="font-bold">¿Listo para vender o rentar tu propiedad?</span>
				<p class="mt-4">
					En buscamos.casa, te ofrecemos una plataforma intuitiva y gratuita para publicar tus
					anuncios. Llega a los usuarios interesados y encuentra al cliente perfecto sin pagar
					comisiones.
				</p>
				<p class="mt-4">
					Descubre la libertad de gestionar tus anuncios de forma directa. Con buscamos.casa, tú
					decides cómo presentar tu propiedad y negociar con los interesados. ¡Publica hoy y abre
					las puertas a nuevas oportunidades!
				</p>
			</li>

			<li>
				<span class="font-bold">¿Quieres ser de los primeros en probarla?</span>

				<p class="mt-4">
					Si estás interesado en explorar la plataforma antes que nadie <a
						href="/inicia-sesion"
						class="font-semibold text-amber-600 hover:text-amber-700">Registrate ahora</a
					>
					y empieza a publicar.
				</p>
			</li>

			<li>
				<span class="font-bold"
					>¿Quieres darnos retroalimentación o explorar alguna oportunidad de negocio?</span
				>

				<p class="mt-4">
					Si quieres dejarnos comentarios, explorar alguna oportunidad de negocio o incluso si
					necesitas ayuda con la plataforma <a
						target="_blank"
						href={createWhatsAppLink(
							'Estoy interesado en explorar oportunidades, dar retroalimentación o solicitar ayuda de Buscamos.Casa',
							companyPhoneNumber
						)}
						class="font-semibold text-amber-600 hover:text-amber-700">escríbenos por WhatsApp</a
					>
					o también puedes contactarnos por correo electrónico:
					<a
						target="_blank"
						href="mailto:
                {companyMail}"
						class="font-semibold text-amber-600 hover:text-amber-700">{companyMail}</a
					>.
				</p>
			</li>

			<li>
				<span class="font-bold mb-4">¿Qué obtienes al unirte?</span>
				<ul class="space-y-4 mt-4">
					<li class="flex gap-x-3"><YellowCheck /> Acceso anticipado a la plataforma.</li>
					<li class="flex gap-x-3">
						<YellowCheck /> La oportunidad de influir en el desarrollo con tu retroalimentación.
					</li>
				</ul>
			</li>

			<p>
				¡Gracias por ser parte de este proyecto desde el inicio! Tu apoyo es clave para construir
				nuestra idea.
			</p>
		</ol>
	</div>
</TextPage>
