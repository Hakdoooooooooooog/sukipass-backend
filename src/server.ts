import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 SukiPass backend running on http://localhost:${env.PORT}`);
});

const shutdown = (signal: string): void => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(() => {
    void prisma.$disconnect().finally(() => {
      console.log('Closed HTTP server and database connection.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
