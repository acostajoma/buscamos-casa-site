import { dev } from '$app/environment';
import { PUBLIC_ENVIRONMENT } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';
import { handleErrorWithSentry } from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://91e99e7f2e932483e521c8aa159affb3@o4508807636123648.ingest.us.sentry.io/4508807637696512',
	environment: PUBLIC_ENVIRONMENT,
	tracesSampleRate: dev ? 1.0 : 0.2
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
