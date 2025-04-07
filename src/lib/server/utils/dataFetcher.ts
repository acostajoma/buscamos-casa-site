import { dev } from '$app/environment';

/**
 * Retrieves data from a cache, or fetches and caches it if not present.
 *
 * This function attempts to retrieve data associated with the provided `cacheKey` from the cache.
 * If the data is found and the application is not in development mode (`dev` is false), the cached data is returned.
 * Otherwise, the `fallbackFunction` is executed to fetch the data. The fetched data is then stored in the cache
 * with the specified `expirationTtl` (time-to-live) and returned.
 */
export async function getData<T>(
	cacheKey: string,
	fallbackFunction: () => Promise<T>,
	cache: App.Locals['cache'],
	expirationTtl: number = 300
): Promise<T> {
	let cachedData: Awaited<T> | undefined | null;
	if (!dev) {
		cachedData = await cache.get(cacheKey, 'json');
	}

	if (cachedData) {
		return cachedData;
	}
	const fetchedData = await fallbackFunction();
	await cache.put(cacheKey, JSON.stringify(fetchedData), { expirationTtl });
	return fetchedData;
}
