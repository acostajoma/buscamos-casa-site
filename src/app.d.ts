import type { DrizzleD1Database } from 'drizzle-orm/d1';

declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
			db: DrizzleD1Database<typeof import('$lib/server/db/schema')>;
			cache: KVNamespace;
		}

		// interface Error {
		// 	message: string;
		// 	errorId: string;
		// }

		interface Platform {
			env: {
				DB: D1Database;
				CACHE_KV: KVNamespace;
			};
			ctx: ExecutionContext;
			caches: CacheStorage & { default: Cache };
			cf: CfProperties;
		}
	}

	namespace Auth {
		interface GoogleIdTokenPayload {
			iss: string;
			azp: string;
			aud: string;
			sub: string;
			hd: string;
			email: string;
			email_verified: boolean;
			at_hash: string;
			name: string;
			picture: string;
			given_name: string;
			family_name: string;
			iat: number;
			exp: number;
		}

		interface FacebookUserPayload {
			id: string;
			name: string;
			picture: {
				data: {
					height: number;
					is_silhouette: boolean;
					url: string;
					width: number;
				};
			};
			email: string;
		}

		type ClientNames = 'Facebook' | 'Google';
	}

	namespace CloudflareTypes {
		interface DirectImageUploadResponse {
			result: {
				uploadURL: string;
				id: string;
			};
			success: boolean;
			errors: unknown[];
			messages: string[];
		}
	}

	namespace Cloudinary {
		interface ParamsToSign {
			timestamp: string;
			source?: string;
			context?: string;
			public_id?: string;
			eager?: string;
			upload_preset?: string;
			secure?: boolean;
			allowed_formats?: string;
		}
		interface Asset {
			access_mode: string;
			api_key: string;
			asset_id: string;
			bytes: number;
			context: {
				custom: Record<string, unknown>;
			};
			created_at: string;
			delete_token: string;
			etag: string;
			folder: string;
			format: string;
			height: number;
			placeholder: boolean;
			public_id: string;
			resource_type: string;
			secure_url: string;
			signature: string;
			tags: string[];
			type: string;
			url: string;
			version: number;
			version_id: string;
			width: number;
			eager: {
				secure_url: string;
			}[];
		}
		interface AssetError {
			error: { message: string };
		}

		interface ImageUploading {
			state: 'uploading';
			data?: undefined;
		}

		interface ImageError {
			state: 'error';
			data: string;
		}

		interface ImageSuccessful {
			state: 'successful';
			data: import('$lib/server/db/schema').Photo;
		}

		type Image = { key: string; file?: File } & (ImageUploading | ImageSuccessful | ImageError);
	}
}

export {};
