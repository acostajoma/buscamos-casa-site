import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals: { session, cache }, cookies }) => {
	const hasBannerBeenShown = cookies.get('hasBannerBeenShown') === 'true';
	const showBannerFlag = await cache.get('showBannerFlag');
	const showBanner = !hasBannerBeenShown && showBannerFlag === 'true';

	if (!hasBannerBeenShown && showBannerFlag === 'true') {
		cookies.set('hasBannerBeenShown', 'true', { path: '/', httpOnly: false });
	}
	return { loggedUser: session !== null, showBanner: showBanner };
}) satisfies LayoutServerLoad;
