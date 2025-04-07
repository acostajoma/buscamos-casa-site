import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals: { session }, cookies }) => {
	const hasBannerBeenShown = cookies.get('hasBannerBeenShown') === 'true';
	if (!hasBannerBeenShown) {
		cookies.set('hasBannerBeenShown', 'true', { path: '/', httpOnly: false });
	}
	return { loggedUser: session !== null, showBanner: !hasBannerBeenShown };
}) satisfies LayoutServerLoad;
