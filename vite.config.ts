import { partytownVite } from '@qwik.dev/partytown/utils';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'rids',
				project: 'buscamos-casa'
			}
		}),
		sveltekit(),
		partytownVite({ debug: false })
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
