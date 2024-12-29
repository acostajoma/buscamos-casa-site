import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		adapter: adapter({
			platformProxy : {
				configPath: 'wrangler.toml',
				environment: undefined,
				experimentalJsonConfig: false,
				persist: false,
			},
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			},
		}),
		csrf: {
			checkOrigin : true,
		},
		csp: {
			directives: {
				'script-src': ['self'],
				/** @todo Remove unsplash and tailwind when hitting prod */
				'img-src': ['self', 'https://images.unsplash.com', 'data:', 'https://tailwindui.com'],
				'worker-src': ['self', 'blob:']
			},
		},
		version: {
			name: "buscamos-casa 0.01"
		}
	},

	extensions: ['.svelte', '.svx']
};

export default config;
