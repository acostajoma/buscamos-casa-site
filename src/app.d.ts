// See https://svelte.dev/docs/kit/types#app.d.ts

import type { DrizzleD1Database } from 'drizzle-orm/d1';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
			db: DrizzleD1Database
		}

		interface Platform {
			env: {
				DB: D1Database;
			};
		}
	}
}

export {};
