import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { buildOpenApiDocument } from '../src/lib/openapi.js';

const here = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(here, '../openapi.json');

writeFileSync(outPath, JSON.stringify(buildOpenApiDocument(), null, 2));
console.log(`✅ Wrote OpenAPI spec to ${outPath}`);
