import { defineConfig } from 'prisma/config';
import 'dotenv/config';

declare const process: {
  env: {
    DATABASE_URL_LOCAL?: string;
  };
};

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env['DATABASE_URL_LOCAL'] ?? '',
  },
});
