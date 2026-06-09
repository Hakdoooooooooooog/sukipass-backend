import type { Router } from 'express';
import type { ZodOpenApiPathsObject } from 'zod-openapi';
import type { PrismaClient } from '../generated/prisma/client.js';

/** Shared dependencies injected into every module's register() at the composition root. */
export interface AppDeps {
  prisma: PrismaClient;
}

/** A self-contained feature module: where it mounts, what it documents, how it wires up. */
export interface AppModule {
  basePath: string;
  openapiPaths: ZodOpenApiPathsObject;
  register: (deps: AppDeps) => Router;
}
