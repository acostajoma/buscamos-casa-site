import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		prerender: {
			handleHttpError: 'warn',
			crawl: true,
			handleEntryGeneratorMismatch: 'fail',
			entries: ['*']
		},
		adapter: adapter({
			platformProxy: {
				configPath: 'wrangler.toml',
				environment: undefined,
				experimentalJsonConfig: false,
				persist: false
			},
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		}),

		csrf: {
			checkOrigin: true
		},
		csp: {
			mode: 'auto',
			directives: {
				'base-uri': ['self'],
				'default-src': ['self'],
				'script-src': [
					'self',
					'wasm-unsafe-eval',
					'https://maps.googleapis.com',
					'sha256-k/u9VGPm2nqWRTiGn69G6FRyiyhfRON36kY+8PM4bDs=', // Hash for partytown.forward definition
					'sha256-FG8BH/l5TJdAfRoGXpV+ClN4RRwcS6p9nCUnDEDPdy8=', // Hash for partytown bootstrap
					// 'wasm-unsafe-eval', // TODO: REMOVE
					'https://ajax.cloudflare.com',
					'https://static.cloudflareinsights.com',
					'blob:',
					'https://buscamos.casa',
					'https://www.googletagmanager.com',
					'https://www.google-analytics.com'
				],
				'script-src-elem': [
					// More specific than script-src for <script> elements
					'self',
					'wasm-unsafe-eval',
					'sha256-k/u9VGPm2nqWRTiGn69G6FRyiyhfRON36kY+8PM4bDs=', // Hash for partytown.forward definition
					'sha256-FG8BH/l5TJdAfRoGXpV+ClN4RRwcS6p9nCUnDEDPdy8=', // Hash for partytown bootstrap
					'https://maps.googleapis.com',
					'https://ajax.cloudflare.com',
					'https://static.cloudflareinsights.com',
					'https://www.googletagmanager.com',
					'https://www.google-analytics.com',
					'https://buscamos.casa',
					'https://preview.buscamos-casa-site.pages.dev',
					'https://www.buscamos.casa'
				],
				'connect-src': [
					'self',
					'https://static.cloudflareinsights.com',
					'https://maps.googleapis.com',
					'https://mapsresources-pa.googleapis.com',
					'https://maps.gstatic.com',
					'https://o4508807636123648.ingest.us.sentry.io/api/4508807637696512/',
					'data:',
					'https://www.googletagmanager.com',
					'https://www.google-analytics.com'
				],
				'img-src': [
					'self',
					'data:',
					'https://tailwindui.com',
					'https://imagedelivery.net',
					'https://maps.gstatic.com',
					'https://maps.googleapis.com',
					'https://upload.imagedelivery.net',
					'https://res.cloudinary.com'
				],
				'report-to': ['csp-endpoint'],
				'report-uri': [
					'https://o4508807636123648.ingest.us.sentry.io/api/4508807637696512/security/?sentry_key=91e99e7f2e932483e521c8aa159affb3',
					'https://www.googletagmanager.com',
					'https://www.google-analytics.com'
				],
				'worker-src': ['self', 'blob:'],
				'style-src': ['self', 'https://fonts.googleapis.com', 'unsafe-inline'],
				'style-src-elem': [
					// More specific for <style> and <link rel="stylesheet">
					'self',
					'https://fonts.googleapis.com',
					'unsafe-inline' // If needed for inline <style> blocks
				],
				'font-src': [
					// Be explicit about fonts
					'self',
					'https://fonts.gstatic.com'
				],
				'child-src': ['self', 'blob:'],
				'frame-src': ['self'],
				'object-src': ['none']
			}
		},
		version: {
			name: 'buscamos-casa 0.01'
		}
	},

	extensions: ['.svelte', '.svx']
};

export default config;
