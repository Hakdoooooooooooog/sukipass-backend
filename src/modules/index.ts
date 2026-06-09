import type { AppModule } from './module.types.js';
import { healthModule } from './health/health.module.js';

/** All feature modules. Add a module here to register its routes + OpenAPI paths. */
export const modules: AppModule[] = [healthModule];
