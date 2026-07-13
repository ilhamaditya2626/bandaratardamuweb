import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'drizzle-kit';

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Update api/.env before running Drizzle.');
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle-mysql',
  dialect: 'mysql',
  dbCredentials: {
    url: databaseUrl,
  },
});
