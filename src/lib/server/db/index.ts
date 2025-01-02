import { drizzle } from 'drizzle-orm/d1';

export const getDB = (env: App.Platform['env']) => {
	if (!env || !env.DB) throw new Error('DATABASE is not set');
	return drizzle(env.DB);
};
