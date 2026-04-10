# Requirements: Atlas V3 Hackathon Boilerplate

## Requirement 1: Monorepo Structure Initialization

**User Story:** As a hackathon participant, I want to start development with an initialized npm workspaces-based monorepo structure, with unified dependency management across multiple packages.

### Acceptance Criteria

1. WHEN the project is cloned and `npm install` is run THEN the system installs all package dependencies at once
2. WHEN the root package.json is checked THEN the workspaces field defines `apps/*` and `packages/*`
3. WHEN any package references another workspace package THEN it is resolved via the `workspace:*` protocol

## Requirement 2: Shared Configuration Package (shared-config)

**User Story:** As a developer, I want to centrally manage TypeScript, ESLint, and Vite configurations, avoiding configuration duplication across packages.

### Acceptance Criteria

1. WHEN each package references shared-config THEN the TypeScript base configuration (tsconfig) is inherited
2. WHEN the shared-config configuration is changed THEN the changes are reflected across all packages
3. WHEN the Vite build configuration is checked THEN common build options are provided from shared-config

## Requirement 3: Web API 3.0 Client SDK (api-v3-client)

**User Story:** As a developer, I want to communicate with Atlas Web API 3.0 in a type-safe manner, with API endpoint calls provided through a unified interface.

### Acceptance Criteria

1. WHEN the API client is initialized THEN the base URL and authentication credentials can be configured
2. WHEN an API endpoint is called THEN requests and responses are type-safe via TypeScript type definitions
3. WHEN an API call returns an error THEN the error is handled through a unified error handling mechanism
4. WHEN MSW mock mode is enabled THEN the client works without an actual API server

## Requirement 4: Domain Core Package (domain-core)

**User Story:** As a developer, I want to manage OHDSI/Atlas domain logic (Cohort definitions, Concept Set operations, etc.) separately from the UI.

### Acceptance Criteria

1. WHEN domain logic is used THEN it is implemented in pure TypeScript independent of any UI framework
2. WHEN a Cohort definition is manipulated THEN validation logic is executed in the domain layer
3. WHEN a domain model is serialized THEN bidirectional conversion with JSON is performed correctly
4. WHEN domain logic is unit tested THEN it can be tested without UI or network mocks

## Requirement 5: UI System Package (ui-system)

**User Story:** As a developer, I want to use Atlas V3 UI components in a reusable form, maintaining design consistency.

### Acceptance Criteria

1. WHEN a UI component is imported THEN it is usable as a React component
2. WHEN Props are passed to a component THEN TypeScript type checking works
3. WHEN theme settings are changed THEN they are consistently reflected across all components
4. WHEN a component is tested independently THEN there are no dependencies on domain-core or api-v3-client

## Requirement 6: Starter Kit Application (starter-kit)

**User Story:** As a hackathon participant, I want to start development from a minimal application template that works in MSW mock mode without an API server.

### Acceptance Criteria

1. WHEN starter-kit is started THEN the Vite dev server starts and is accessible in the browser
2. WHEN started in MSW mock mode THEN all features work with mock data
3. WHEN the starter-kit code is reviewed THEN the UI / Domain / API 3-layer separation is clear
4. WHEN a new feature is added THEN it can be extended following the existing package structure

## Requirement 7: Reference Application (reference-app)

**User Story:** As a developer, I want to reference an implementation example of the Atlas V3 architecture that demonstrates best practices.

### Acceptance Criteria

1. WHEN reference-app is started THEN Cohort definition CRUD operations work as implementation examples
2. WHEN the code is reviewed THEN inter-package integration patterns are clearly demonstrated
3. WHEN connected to the Docker environment THEN it can communicate with the actual Web API 3.0 Sandbox

## Requirement 8: Unified Startup Scripts

**User Story:** As a developer, I want to start all applications and services with a single command.

### Acceptance Criteria

1. WHEN `npm run dev` is executed THEN all application dev servers start in parallel
2. WHEN `npm run dev:mock` is executed THEN all apps start in MSW mock mode
3. WHEN an individual package script is executed THEN only that package starts

## Requirement 9: Infrastructure Environment (Docker)

**User Story:** As a developer, I want to easily set up a Web API 3.0 Sandbox environment with Docker.

### Acceptance Criteria

1. WHEN `docker compose up` is executed THEN the Web API 3.0 Sandbox starts
2. WHEN the Docker environment is running THEN API endpoints are accessible from the application
3. WHEN the Docker environment is stopped THEN all containers and networks are cleaned up

## Requirement 10: Quick Start Guide (README.md)

**User Story:** As a hackathon participant, I want to set up the development environment and launch the first application within 5 minutes.

### Acceptance Criteria

1. WHEN the README is read THEN prerequisites, setup steps, and startup instructions are clearly documented
2. WHEN the steps are followed THEN the development environment is working within 5 minutes
3. WHEN trouble occurs THEN the FAQ section provides solutions for common problems

## Requirement 11: Build Dependency Optimization During Development

**User Story:** As a developer, I want package dependencies to be correctly resolved and build order to be optimized.

### Acceptance Criteria

1. WHEN a package is built THEN dependent packages are built first
2. WHEN source code is changed THEN only affected packages are rebuilt
3. WHEN TypeScript path resolution is checked THEN inter-workspace references are correctly resolved
