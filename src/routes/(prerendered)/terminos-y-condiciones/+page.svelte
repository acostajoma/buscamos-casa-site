<script lang="ts">
	import MetaData from '$lib/components/MetaData.svelte';
	import TextPage from '$lib/components/TextPage.svelte';
	import { type MetaDataConfig } from '$lib/utils/metadata';

	const title = 'Términos y Condiciones de uso';
	const pageConfig: MetaDataConfig = {
		title,
		description:
			'Consulta los Términos y Condiciones de uso de Buscamos.casa. Conoce las reglas y responsabilidades al usar nuestra plataforma para la publicación y búsqueda de propiedades.',
		keywords: [
			'términos de uso',
			'condiciones de uso',
			'reglas de la plataforma',
			'responsabilidades',
			'Buscamos.casa',
			'publicación de propiedades',
			'búsqueda de propiedades'
		],
		robots: 'index, follow',
		ogImageUrl: '/images/destacada.jpg'
	};
</script>

<MetaData {pageConfig} />
<TextPage {title}>
	<ol class="list-decimal list-inside mt-8 max-w-xl space-y-8 text-gray-600">
		<li>
			<span class="font-bold">Aceptación de los Términos:</span>

			Al registrarse y utilizar nuestra plataforma de bienes raíces, el usuario acepta los presentes
			términos y condiciones en su totalidad. Si el usuario no está de acuerdo con alguno de los
			puntos aquí expuestos, deberá abstenerse de utilizar nuestros servicios.
		</li>

		<li>
			<span class="font-bold">Contenido Generado por el Usuario</span>
			<ol class="list-disc list-inside space-y-4 mt-4">
				<li>
					Al compartir contenido en nuestra plataforma, el usuario nos concede una licencia mundial,
					libre de regalías, perpetua, no exclusiva y transferible para utilizar, mostrar,
					reproducir, modificar, adaptar, publicar, distribuir y información derivada, basadas en
					dicho contenido, en cualquier formato o medio presente o futuro.
				</li>
				<li>
					El usuario garantiza que posee todos los derechos necesarios sobre el contenido que
					comparte y que no infringe derechos de terceros.
				</li>
				<li>
					Nos reservamos el derecho de rechazar, modificar o eliminar cualquier contenido que
					consideremos inapropiado, irrelevante o que incumpla con nuestras políticas.
				</li>
			</ol>
		</li>

		<li>
			<span class="font-bold">Uso de Datos</span>
			<ol class="list-disc list-inside space-y-4 mt-4">
				<li>
					Los datos generados por los usuarios pueden ser utilizados para mejorar la plataforma y
					optimizar la experiencia del usuario.
				</li>
				<ol class="list-disc list-inside space-y-4 mt-4">
					<li>
						Si un usuario elimina datos de propiedades, podremos conservar información de forma
						anonimizada con fines analíticos y para mejorar el servicio.
					</li>
					<ol class="list-disc list-inside space-y-4 mt-4">
						<li>
							Podremos compartir datos con terceros. Sin embargo, toda la información utilizada con
							estos fines será previamente anonimizada para garantizar que no se pueda vincular con
							personas específicas y así la privacidad de las personas.
						</li>
					</ol>
				</ol>
			</ol>
		</li>
		<li>
			<span class="font-bold">Revisión de Contenido:</span> Todo contenido enviado será revisado antes
			de su publicación. Nos reservamos el derecho de rechazar cualquier contenido que consideremos inapropiado,
			fraudulento o que no esté relacionado con el propósito de nuestra plataforma.
		</li>
		<li>
			<span class="font-bold">Limitación de Responsabilidad:</span> El usuario acepta que el uso de nuestros
			servicios es bajo su propio riesgo. No garantizamos que la plataforma estará libre de errores o
			interrupciones. No seremos responsables por daños directos, indirectos o consecuentes derivados
			del uso de la plataforma. En la medida permitida por la ley, no nos hacemos responsables por daños
			directos, indirectos, incidentales o consecuentes derivados del uso de la plataforma o de la imposibilidad
			de utilizarla.
		</li>
		<li>
			<span class="font-bold">Modificaciones a los Términos:</span> Nos reservamos el derecho de modificar
			estos términos en cualquier momento. Las modificaciones serán notificadas a los usuarios y el uso
			continuo de la plataforma implicará su aceptación.
		</li>
		<li>
			<span class="font-bold">Ley Aplicable:</span> Estos términos se regirán por las leyes locales donde
			se encuentra registrada nuestra empresa, sin perjuicio de las disposiciones legales imperantes
			en cada jurisdicción.
		</li>
		<li>
			<span class="font-bold">Modificación de los Términos:</span> Nos reservamos el derecho de modificar
			estos términos en cualquier momento. Notificaremos a los usuarios sobre cambios significativos
			mediante la plataforma o por otros medios adecuados. El uso continuo de la plataforma después de
			dichos cambios constituirá la aceptación de los nuevos términos.
		</li>
		<li>
			<span class="font-bold">Responsabilidades del Usuario:</span>
			<ol class="list-disc list-inside space-y-4 mt-4">
				<li>El usuario se compromete a utilizar la plataforma de manera lícita y respetuosa.</li>
				<li>
					No se permite el uso de la plataforma para actividades fraudulentas, engañosas o que
					violen derechos de terceros.
				</li>
			</ol>
		</li>
		<li>
			<span class="font-bold">Propiedad Intelectual:</span> Todo el contenido de la plataforma, incluidos
			textos, gráficos, logotipos y software, es propiedad exclusiva de nuestra empresa o de nuestros
			licenciantes y está protegido por las leyes de propiedad intelectual aplicables.
		</li>
		<li>
			<span class="font-bold">Contacto:</span> Si tienes dudas o consultas sobre estos términos, puedes
			comunicarte con nosotros a través de los canales de atención disponibles en la plataforma.
		</li>
	</ol>
</TextPage>
