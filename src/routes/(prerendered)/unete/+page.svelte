<script lang="ts">
	import TextPage from '$lib/components/TextPage.svelte';
	import YellowCheck from '$lib/icons/YellowCheck.svelte';
	import { companyMail, companyPhoneNumber } from '$lib/utils/constants';
	import { createWhatsAppLink } from '$lib/utils/phone';
</script>

<TextPage title="¡Únete a la Beta de Nuestra Plataforma de Bienes Raíces!">
	<div class="my-10 space-y-4 text-gray-600">
		<p>
			¡Estamos emocionados de anunciar que nuestra plataforma de bienes raíces está en fase beta!
		</p>
		<p>
			En Buscamos.casa tenemos la idea de construir un espacio eficiente, fácil de usar y adaptado a
			las necesidades reales de compradores, vendedores e inversionistas.
		</p>
		<ol class="list-decimal list-inside mt-8 max-w-xl space-y-8 text-gray-600">
			<li>
				<span class="font-bold">¿Por qué estamos en beta?</span>
				<p class="mt-4">
					Actualmente, estamos probando todas las funcionalidades y mejorando la experiencia del
					usuario antes del lanzamiento oficial. Para mantener el control de acceso, solo podemos
					registrar usuarios manualmente.
				</p>
			</li>

			<li>
				<span class="font-bold">¿Quieres ser de los primeros en probarla?</span>

				<p class="mt-4">
					Si estás interesado en explorar la plataforma antes que nadie y ayudarnos a mejorarla con
					tu feedback, <a
						target="_blank"
						href={createWhatsAppLink(
							encodeURIComponent(
								'Estoy interesado en ser de los primeros usuarios de Buscamos.Casa'
							),
							companyPhoneNumber
						)}
						class="font-semibold text-amber-600 hover:text-amber-700">escríbenos por WhatsApp</a
					>
					y te registraremos manualmente. O también puedes contactarnos a nuestro correo electrónico:
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
					<li class="flex gap-x-3">
						<YellowCheck /> Beneficios exclusivos cuando lancemos la versión oficial.
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
