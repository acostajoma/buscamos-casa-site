import { dev } from '$app/environment';
import { PUBLIC_ENVIRONMENT, PUBLIC_SENTRY_DSN } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';
import { handleErrorWithSentry } from '@sentry/sveltekit';

Sentry.init({
	dsn: PUBLIC_SENTRY_DSN,
	environment: PUBLIC_ENVIRONMENT,
	tracesSampleRate: dev ? 0 : 0.2
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
