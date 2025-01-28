import { getContext, setContext } from 'svelte';

export class PhotoState {
	photos: Cloudinary.Image[] = $state([]);
	constructor(photos: Cloudinary.Image[]) {
		this.photos = photos;
	}
	getLength() {
		return this.photos.length;
	}
	getImageIndex(key: string) {
		return this.photos.findIndex((photo) => photo.key === key);
	}

	updatePhoto(
		index: number,
		data: Cloudinary.ImageError['data'] | Cloudinary.ImageSuccessful['data'],
		state: 'successful' | 'uploading' | 'error'
	) {
		if (index >= 0 && index < this.photos.length) {
			this.photos[index].data = data;
			this.photos[index].state = state;
			if (typeof data !== 'string') {
				this.photos[index].key = data.id;
			}
		}
	}
	deletePhoto(publicId: string) {
		this.photos = this.photos.filter(
			(image) => typeof image.data !== 'string' && image.data && image.data.id !== publicId
		);
	}
}

export function setPhotoContext(key: string, photos: PhotoState) {
	setContext(key, photos);
}

export function getPhotoContext(key: string): PhotoState {
	return getContext(key);
}
