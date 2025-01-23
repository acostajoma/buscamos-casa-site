import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/lib/server/db/schema.ts',
	verbose: true,
	strict: true,
	dialect: 'sqlite'
});
