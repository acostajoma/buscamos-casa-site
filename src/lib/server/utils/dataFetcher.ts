import { error } from '@sveltejs/kit';

// Helper type to infer the return type of the functions in an object
type FallbackResults<T extends Record<string, () => Promise<unknown>>> = {
	[K in keyof T]: Awaited<ReturnType<T[K]>>;
};

/**
 * Retrieves data from Cloudflare's cache, or fetches and caches it if not present.
 *
 * This function attempts to retrieve data associated with the provided `url` from Cloudflare's cache.
 * If the data is found, the cached data is returned. Otherwise, the `fallbackFunction` is executed to fetch the data.
 * The fetched data is then stored in the cache with the specified `max-age` and returned.
 * @param url - The URL to use as the cache key.
 * @param fallbackFunction - The function to execute if the data is not found in the cache. Ensure this function doesn't error silently
 */
export async function getDataWithCloudflareCache<T extends Record<string, () => Promise<unknown>>>(
	url: URL,
	fallbackFunctions: T,
	platform: App.Platform | undefined,
	cacheName: string = 'custom:cache'
): Promise<FallbackResults<T>> {
	if (!platform) {
		console.error('CRITICAL: Cloudflare platform object not available.');
		error(500, 'Ha ocurrido un error interno');
	}

	/**
	 * Using named cache as the default cache is used by cloudflare to return immediate responses
	 * If the default cache is used and we save a json, the cloudflare will return the json to the
	 * client instead of the desired HTML
	 */
	const cache = await platform.caches.open(cacheName);
	const cacheKey = url.toString();

	// Try to match the cache key
	const cachedResponse = await cache.match(cacheKey);

	if (cachedResponse) {
		/**
		 * Cache Hit
		 */
		try {
			// Try to parse the cached data
			const cachedData = await cachedResponse.json();
			return cachedData as FallbackResults<T>;
		} catch (e) {
			console.error(`CACHE_ERROR: Failed to parse cached JSON for key: ${cacheKey}`, e);
			/**
			 * If executions ends in this block, means even we got a response, the server failed to parse it
			 * Meaning the possibility of a corrupted entry, so we proceed to delete it.
			 */
			platform.context.waitUntil(cache.delete(cacheKey));
		}
	}

	/**
	 * Cache Miss
	 */

	// Fetch the data using the fallbacks functions
	const keys = Object.keys(fallbackFunctions) as (keyof T)[];
	const promises = keys.map((key) => fallbackFunctions[key]());
	const results = await Promise.all(promises);

	// Build the response
	const fetchedData = results.reduce((acc, item, index) => {
		acc = { ...(acc as Record<string, unknown>), [keys[index]]: item };
		return acc;
	}, {}) as FallbackResults<T>;

	const responseToCache = new Response(JSON.stringify(fetchedData), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=150'
		}
	});

	try {
		/**
		 * Put the data in the cache
		 * We use platform.waitUntil() for better performance as extends the lifetime of the Worker, allowing to
		 * perform work without blocking returning a response, and that may continue after a response is returned.
		 * @see https://developers.cloudflare.com/workers/runtime-apis/context/#waituntil
		 */
		platform.context.waitUntil(cache.put(cacheKey, responseToCache.clone()));
	} catch (e) {
		console.error(`CACHE_ERROR: Failed cache put for key: ${cacheKey}`, e);
	}

	// return data even if cache put failed
	return fetchedData;
}
