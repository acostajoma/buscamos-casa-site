import * as Sentry from '@sentry/browser';
import { type HandleClientError } from '@sveltejs/kit';

Sentry.init({
	dsn: 'https://91e99e7f2e932483e521c8aa159affb3@o4508807636123648.ingest.us.sentry.io/4508807637696512',
	tracesSampleRate: 1.0,
	tracePropagationTargets: ['localhost', /^https:\/\/buscamos\.casa\//]
});

export const handleError: HandleClientError = async ({ event, error, message, status }) => {
	const errorId = crypto.randomUUID();
	Sentry.captureException(error, {
		extra: {
			event,
			errorId,
			status
		}
	});
	return {
		message
	};
};
