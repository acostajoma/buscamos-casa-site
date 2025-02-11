import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
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
			directives: {
				'script-src': [
					'self',
					'https://maps.googleapis.com',
					'wasm-unsafe-eval',
					'ajax.cloudflare.com',
					'static.cloudflareinsights.com',
					'blob:'
				],
				'connect-src': [
					'self',
					'cloudflareinsights.com',
					'https://maps.googleapis.com',
					'https://mapsresources-pa.googleapis.com',
					'https://maps.gstatic.com',
					'data:'
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
				'worker-src': ['self', 'blob:'],
				'style-src': ['self', 'https://fonts.googleapis.com', 'unsafe-inline']
			},
			mode: 'auto'
		},
		version: {
			name: 'buscamos-casa 0.01'
		}
	},

	extensions: ['.svelte', '.svx']
};

export default config;
