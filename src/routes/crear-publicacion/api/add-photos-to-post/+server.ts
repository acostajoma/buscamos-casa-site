import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const requestData = await request.json();
	console.log(requestData);

	return new Response();
};
