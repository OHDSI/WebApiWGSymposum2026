# Atlas V3 Hackathon Boilerplate

A monorepo boilerplate for hackathons targeting OHDSI Atlas WebAPI v3.  
It adopts a **3-layer separation architecture (UI / Domain / API)** and, thanks to MSW mock mode,
allows you to start frontend development immediately without a backend.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Applications                       │
│  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │   starter-kit    │  │     reference-app        │  │
│  │   (port 3000)    │  │     (port 3001)          │  │
│  └────────┬─────────┘  └────────────┬─────────────┘  │
├───────────┼─────────────────────────┼────────────────┤
│           ▼                         ▼                │
│  ┌─────────────────────────────────────────────────┐ │
│  │            UI Layer: ui-system                  │ │
│  │   Button, DataTable, Card, Input, Theme         │ │
│  └──────────────────────┬──────────────────────────┘ │
│                         ▼                            │
│  ┌─────────────────────────────────────────────────┐ │
│  │          Domain Layer: domain-core              │ │
│  │   Models, Validators, Serializers, Services     │ │
│  └──────────────────────┬──────────────────────────┘ │
│                         ▼                            │
│  ┌─────────────────────────────────────────────────┐ │
│  │           API Layer: api-v3-client              │ │
│  │   AtlasApiClient, Endpoints, MSW Mocks          │ │
│  └──────────────────────┬──────────────────────────┘ │
│                         ▼                            │
│  ┌─────────────────────────────────────────────────┐ │
│  │            Shared: shared-config                │ │
│  │   TypeScript Config, Vite Config                │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
            ┌──────────────────────────┐
            │   OHDSI WebAPI (Docker)  │
            │   PostgreSQL + Atlas UI  │
            └──────────────────────────┘
```

## Prerequisites

| Tool       | Version    | Purpose                      |
| ---------- | ---------- | ---------------------------- |
| Node.js    | 18+        | Runtime                      |
| npm        | 9+         | Package management (workspaces) |
| Docker     | 20+        | Backend environment (optional) |

> Docker is not required when using mock mode (`dev:mock`).

## Quick Start (Under 5 Minutes)

```bash
# 1. Clone the repository
git clone <repository-url>
cd atlas-v3-hackathon

# 2. Install dependencies
npm install

# 3. Start in MSW mock mode (no Docker required)
npm run dev:mock
```

Access the following in your browser:

| App            | URL                        |
| -------------- | -------------------------- |
| starter-kit    | http://localhost:3000       |
| reference-app  | http://localhost:3001       |

### Using the Docker Backend

```bash
# 1. Create an environment variables file (optional — defaults work out of the box)
cp .env.example .env

# 2. Start Docker containers
docker compose up -d

# 3. Wait for WebAPI to start (1-2 minutes on first run)
docker compose logs -f webapi

# 4. Start apps in real API mode
npm run dev
```

Endpoints after Docker startup:

| Service    | URL                                  |
| ---------- | ------------------------------------ |
| WebAPI     | http://localhost:8080/WebAPI/        |
| Atlas UI   | http://localhost:8088/               |
| PostgreSQL | localhost:5432                        |


## Project Structure

```
atlas-v3-hackathon/
├── packages/
│   ├── shared-config/     Shared TypeScript & Vite configuration
│   ├── api-v3-client/     Atlas WebAPI v3 client + MSW mocks
│   ├── domain-core/       Domain models, validation & services
│   └── ui-system/         React UI components + theme system
├── apps/
│   ├── starter-kit/       Minimal starter app (port 3000)
│   └── reference-app/     Full CRUD reference app (port 3001)
├── docker/                Docker config (Atlas + WebAPI + PostgreSQL)
├── docker-compose.yml
├── package.json           Root (npm workspaces)
└── tsconfig.json          Root TypeScript config
```


### Package Details

| Package | npm Name | Description |
| ---------- | ------ | ---- |
| `shared-config` | `@atlas-v3/shared-config` | Provides shared TypeScript base configuration (`tsconfig.base.json`, `tsconfig.react.json`) and Vite build configuration for all packages |
| `api-v3-client` | `@atlas-v3/api-v3-client` | REST client for Atlas WebAPI v3. Includes `AtlasApiClient` class, Cohort/Concept endpoints, and MSW mock handlers |
| `domain-core` | `@atlas-v3/domain-core` | UI-framework-independent domain layer. Provides CohortDefinition model, validation (empty name check, 255-character limit), serializers, and CohortService |
| `ui-system` | `@atlas-v3/ui-system` | React UI component library. Provides Button, DataTable, Card, Input and a theme system (ThemeProvider + useTheme) |

### Application Details

| App | npm Name | Description |
| ------ | ------ | ---- |
| `starter-kit` | `@atlas-v3/starter-kit` | Minimal demo of the 3-layer architecture. Use as a starting point for hackathons |
| `reference-app` | `@atlas-v3/reference-app` | Full reference implementation including Cohort definition CRUD operations. Demonstrates package integration patterns |

## Development Commands

### Starting Applications

```bash
# Start all apps in MSW mock mode (no Docker required)
npm run dev:mock

# Start all apps in real API mode (Docker required)
npm run dev

# Start individual apps
npm run dev:starter-kit
npm run dev:reference-app
npm run dev:mock:starter-kit
npm run dev:mock:reference-app
```

### Build

```bash
# Build all packages (dependency order: shared-config → api-v3-client → domain-core → ui-system)
npm run build

# Build applications
npm run build:apps

# Build everything
npm run build:all
```

### Test

```bash
# Run all tests
npm test
```

### Cleanup

```bash
# Remove all node_modules and dist directories
npm run clean

# Remove Docker containers and volumes
docker compose down -v
```

## 3-Layer Architecture Explained

This boilerplate adopts a **UI / Domain / API** 3-layer separation.

### API Layer (`api-v3-client`)

- Handles HTTP communication with Atlas WebAPI v3
- `AtlasApiClient` unifies configuration management and error handling
- MSW mock handlers enable development without a backend

### Domain Layer (`domain-core`)

- Manages business logic independently from the UI framework
- Provides model definitions, validation, and serialization
- `CohortService` abstracts the API layer and provides a unified interface to applications

### UI Layer (`ui-system`)

- Provides React components and a theme system
- `ThemeProvider` centrally manages the application-wide theme
- Generic components for displaying Domain layer models

### Data Flow

```
User Action
    ↓
UI Layer (ui-system components)
    ↓
Domain Layer (CohortService → Validation → Serialization)
    ↓
API Layer (AtlasApiClient → fetch / MSW mock)
    ↓
OHDSI WebAPI (Docker) or MSW mock response
```

## Environment Variables

Copy `.env.example` to create `.env`:

```bash
cp .env.example .env
```

Key environment variables:

| Variable | Default | Description |
| ---- | ---------- | ---- |
| `VITE_MOCK_MODE` | `true` | `true`: MSW mock, `false`: real API |
| `VITE_WEBAPI_BASE_URL` | `http://localhost:8080/WebAPI` | WebAPI endpoint |
| `POSTGRES_USER` | `ohdsi` | PostgreSQL username |
| `POSTGRES_PASSWORD` | `ohdsi` | PostgreSQL password |
| `WEBAPI_PORT` | `8080` | WebAPI host port |
| `ATLAS_PORT` | `8088` | Atlas UI host port |

## FAQ

### Q: Can I develop without Docker?

Yes. Use `npm run dev:mock` to run in MSW mock mode, which allows frontend development without Docker or a backend server.

### Q: How do I switch between MSW mock mode and real API mode?

Change `VITE_MOCK_MODE` in the `.env` file:
- `true` → MSW mock mode (default)
- `false` → Real API mode (requires Docker)

Or switch directly via commands:
```bash
npm run dev:mock   # Mock mode
npm run dev        # Real API mode
```

### Q: How do I add a new package?

1. Create a new directory under `packages/`
2. Create a `package.json` and specify `workspace:*` for required dependencies
3. In `tsconfig.json`, extend `@atlas-v3/shared-config/tsconfig.base.json`
4. Run `npm install` to update workspace links

### Q: What if the build fails?

Build order matters. `npm run build` executes in the correct order:
```
shared-config → api-v3-client → domain-core → ui-system
```
If building individually, follow this order.

### Q: What test framework is used?

[Vitest](https://vitest.dev/) is used. Property-based tests use [fast-check](https://fast-check.dev/) alongside it.

### Q: What if WebAPI won't start?

```bash
# Check logs
docker compose logs webapi

# Reset DB and restart
docker compose down -v
docker compose up -d
```

The first startup takes 1-2 minutes due to Flyway migrations.

### Q: What if ports conflict?

You can change each service's port in the `.env` file:
```env
WEBAPI_PORT=8080
ATLAS_PORT=8088
POSTGRES_PORT=5432
```

## License

Apache License 2.0
