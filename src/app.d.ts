// See https://svelte.dev/docs/kit/types#app.d.ts

import type { DrizzleD1Database } from 'drizzle-orm/d1';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
			db: DrizzleD1Database<typeof import('$lib/server/db/schema')>;
			cache: KVNamespace;
		}

		interface Platform {
			env: {
				DB: D1Database;
				CACHE_KV: KVNamespace;
			};
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
}

export {};
