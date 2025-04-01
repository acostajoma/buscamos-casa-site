<script lang="ts">
	import MetaData from '$lib/components/MetaData.svelte';
	import TextPage from '$lib/components/TextPage.svelte';
	import { companyMail } from '$lib/utils/constants';
	import { type MetaDataConfig } from '$lib/utils/metadata';

	const title = 'Política de Privacidad';
	const pageConfig: MetaDataConfig = {
		title,
		description:
			'Conoce nuestra política de privacidad. En Buscamos.casa, nos comprometemos a proteger tus datos personales. Descubre cómo recopilamos, utilizamos y protegemos tu información.',
		keywords: ['política de privacidad', 'protección de datos', 'privacidad'],
		robots: 'index, follow',
		ogImageUrl: '/images/destacada.jpg'
	};
</script>

<MetaData {pageConfig} />
<TextPage {title}>
	<p class="mt-8 text-gray-600">
		En Buscamos.casa, valoramos la privacidad de nuestros usuarios y nos comprometemos a proteger
		sus datos personales. Esta Política de Privacidad describe cómo recopilamos, utilizamos,
		almacenamos y compartimos la información de nuestros usuarios.
	</p>
	<ol class="list-decimal list-inside mt-8 space-y-8 text-gray-600">
		<li>
			<span class="font-bold">Información que Recopilamos</span>

			Podemos recopilar la siguiente información cuando usas nuestra plataforma:
			<ol class="list-disc list-inside space-y-4 mt-4">
				<li>Datos de contacto (correo electrónico, número de teléfono y nombre).</li>
				<li>Información sobre propiedades de interés.</li>
				<li>Preferencias de búsqueda y navegación.</li>
				<li>Estadísticas de uso de la plataforma.</li>
			</ol>
		</li>

		<li>
			<span class="font-bold">Uso de la información</span>
			La información recopilada se utiliza para:
			<ol class="list-disc list-inside space-y-4 mt-4">
				<li>Mejorar la experiencia del usuario en nuestra plataforma.</li>
				<li>Optimizar la oferta de propiedades y servicios.</li>
				<li>Personalizar contenido y recomendaciones.</li>
				<li>Desarrollar análisis estadísticos sobre tendencias del mercado inmobiliario.</li>
				<li>Contactar a los usuarios cuando sea necesario.</li>
			</ol>
		</li>

		<li>
			<span class="font-bold">Compartir Datos con Terceros</span>
			Podemos compartir información anonimizada con terceros, incluyendo:
			<ol class="list-disc list-inside space-y-4 mt-4">
				<li>Inmobiliarias y desarrolladoras para mejorar sus proyectos de vivienda</li>
				<li>Socios comerciales para estudios de mercado</li>
				<li>Proveedores de servicios tecnológicos para mejorar la plataforma</li>
			</ol>
			<p class="mt-2">
				<span class="bold">Importante:</span> Nunca compartiremos información que permita identificar
				a un usuario de manera individual, como nombres o datos de contacto.
			</p>
		</li>
		<li>
			<span class="font-bold"> Seguridad de la Información</span> Implementamos medidas de seguridad
			adecuadas para proteger los datos de nuestros usuarios contra accesos no autorizados, pérdidas
			o alteraciones.
		</li>
		<li>
			<span class="font-bold">Derechos del Usuario</span> Los usuarios tienen derecho a:
			<ol class="list-disc list-inside space-y-4 mt-4">
				<li>Acceder a sus datos personales.</li>
				<li>Solicitar la eliminación de sus datos.</li>
				<li>Limitar el uso de sus datos.</li>
			</ol>
			<p class="mt-2">
				Para ejercer estos derechos, puedes contactarnos a través de <a
					target="_blank"
					href="mailto:
            {companyMail}"
					class="font-semibold text-amber-600 hover:text-amber-700">{companyMail}</a
				>.
			</p>
		</li>
		<li>
			<span class="font-bold">Cambios en la Política de Privacidad</span> Nos reservamos el derecho de
			actualizar esta Política de Privacidad en cualquier momento. Notificaremos a los usuarios sobre
			cambios relevantes a través de nuestra plataforma o por correo electrónico.
		</li>

		<li>
			<span class="font-bold">Contacto:</span> Si tienes dudas o consultas sobre estos términos, puedes
			comunicarte con nosotros a través de los canales de atención disponibles en la plataforma.
		</li>
	</ol>
</TextPage>
