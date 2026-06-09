# SukiPass Backend

Express 5 + TypeScript API for SukiPass — a digital loyalty platform for Philippine MSMEs.

## Stack

- **Express 5** (ESM, `module: nodenext`)
- **Zod 4 + zod-openapi** — request validation and OpenAPI 3.1 generation from a single schema
- **Prisma 7** (`prisma-client` generator + `@prisma/adapter-pg`) on **PostgreSQL**
- **Swagger UI** — browsable API docs at `/docs`
- **Docker Compose** for local Postgres
- **ESLint + Prettier**, **Husky + lint-staged + commitlint**

## Architecture

Feature-module structure under `src/modules/<feature>/`. Each module is split by responsibility:

- **controller** — HTTP concerns only
- **service** — business rules; depends on a repository _interface_
- **repository** — Prisma data access (the seam between persistence and the API contract)
- **schema** — Zod schemas (request/response validation + OpenAPI metadata)
- **openapi** — the module's OpenAPI path contributions
- **module** — an `AppModule` descriptor: `{ basePath, openapiPaths, register(deps) }`

Modules are collected in `src/modules/index.ts` (the registry). `src/app.ts` loops over the registry: it mounts each module's router and the OpenAPI builder merges each module's paths. Dependencies are wired via constructor injection inside each module's `register()` (no DI framework).

### API versioning

All API routes are served under a version prefix defined once in `src/config/constants.ts` (`API_PREFIX = /api/v1`). The prefix is applied centrally to both route mounting and the OpenAPI path keys, so the live routes and the generated spec always match. Modules declare **local** paths (e.g. `/health`); the version is applied for them. Bump the version in one place to roll `/api/v2`. The `/openapi.json` and `/docs` endpoints are intentionally un-versioned (they are infrastructure, not API).

## Prerequisites

- Node 20+
- Docker Desktop

## Getting started

```bash
# 1. Install dependencies (also runs `prisma generate`)
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start Postgres
docker compose up -d

# 4. Generate the Prisma Client (if needed)
npm run prisma:generate

# 5. Run the API in watch mode
npm run dev
```

Verify:

- `curl http://localhost:3000/api/v1/health` → `{"status":"ok","db":"connected",...}`
- Open `http://localhost:3000/docs` for the Swagger UI.

## The OpenAPI → frontend contract

The API serves its spec at **`GET /openapi.json`**, and `npm run openapi:gen` writes a static `openapi.json` to the repo root. The frontend's Orval reads this spec to generate typed TanStack Query hooks. **After changing any request/response schema, restart the server so the frontend can regenerate its client.**

## Adding a new module

1. Create `src/modules/<feature>/` with `*.schema.ts`, `*.repository.ts`, `*.service.ts`, `*.controller.ts`, `*.routes.ts`, `*.openapi.ts`, and `*.module.ts` (exporting an `AppModule`).
2. Register it in `src/modules/index.ts` by adding it to the `modules` array. That's it — `app.ts` and the OpenAPI builder pick it up automatically (under `/api/v1`).
3. For new tables: edit `prisma/schema.prisma`, then `npm run prisma:migrate`.

> Prisma 7 note: the database connection URL lives in `prisma.config.ts` (not in `schema.prisma`); the runtime client connects via the `@prisma/adapter-pg` driver adapter configured in `src/lib/prisma.ts`.

## Scripts

| Script                                       | Purpose                           |
| -------------------------------------------- | --------------------------------- |
| `npm run dev`                                | Watch-mode dev server             |
| `npm run build` / `start`                    | Compile to `dist/` / run compiled |
| `npm run lint` / `lint:fix`                  | ESLint                            |
| `npm run format` / `format:check`            | Prettier                          |
| `npm run openapi:gen`                        | Emit static `openapi.json`        |
| `npm run prisma:generate` / `prisma:migrate` | Prisma client / migrations        |

## Commits

Conventional Commits enforced by commitlint (`feat:`, `fix:`, `chore:`…). Pre-commit runs lint-staged (ESLint + Prettier on staged files).
