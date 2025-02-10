import { cloudinaryUrl } from './constants';

export function getPhotoUrl(photoId: string, width: number = 480) {
	return `${cloudinaryUrl}/image/upload/c_scale,w_${width}/f_auto/q_auto/${photoId}`;
}
