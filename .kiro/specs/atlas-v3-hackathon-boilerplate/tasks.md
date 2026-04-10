# Implementation Plan: Atlas V3 Hackathon Boilerplate

## Overview

Implements the Atlas V3 architecture (UI / Domain / API 3-layer separation) using an npm workspaces monorepo structure. Build order: shared-config → api-v3-client → domain-core → ui-system → apps.

## Tasks

- [x] 1. Project Root Setup
  - [x] 1.1 Create root package.json (including workspaces configuration)
    - name: `atlas-v3-hackathon`, workspaces: `["packages/*", "apps/*"]`
    - scripts: `dev`, `dev:mock`, `build`, `test`, `lint`, `clean`
    - _Requirements: 1.1, 1.2, 8.1, 8.2, 8.3_
  - [x] 1.2 Create root tsconfig.json
    - TypeScript 5+ base configuration, workspace references
    - _Requirements: 11.3_
  - [x] 1.3 Create .gitignore
    - _Requirements: 1.1_

- [x] 2. shared-config Package Implementation
  - [x] 2.1 Create `packages/shared-config/` directory structure and package.json
    - name: `@atlas-v3/shared-config`, exports field definition
    - _Requirements: 2.1, 2.2_
  - [x] 2.2 Create TypeScript base configuration files
    - tsconfig.base.json: shared configuration for all packages
    - tsconfig.react.json: additional JSX configuration for React
    - _Requirements: 2.1_
  - [x] 2.3 Create Vite base build configuration
    - _Requirements: 2.3_
  - [x] 2.4 Create index.ts export entry
    - _Requirements: 2.2_
  - [x] 2.5 Property test: Shared TypeScript Config Inheritance
    - **Property 2: Shared TypeScript Config Inheritance**
    - **Validates: Requirements 2.1**

- [x] 3. api-v3-client Package Implementation
  - [x] 3.1 Create directory structure and package.json
    - name: `@atlas-v3/api-v3-client`, workspace:* dependency on shared-config
    - tsconfig.json extends tsconfig.base.json
    - _Requirements: 3.1, 1.3, 2.1_
  - [x] 3.2 Create API type definitions (types/)
    - CohortDefinition, Concept, ConceptSet, ApiClientConfig, ApiResponse, etc.
    - _Requirements: 3.2_
  - [x] 3.3 Implement AtlasApiClient class (client.ts)
    - ApiClientConfig initialization, fetch HTTP methods, unified ApiError handling
    - _Requirements: 3.1, 3.3_


  - [x] 3.4 Implement endpoint modules (endpoints/)
    - CohortEndpoints: getAll, getById, create, update, delete
    - ConceptEndpoints: search, getById, getConceptSets
    - _Requirements: 3.2_
  - [x] 3.5 Implement MSW mock handlers (mocks/)
    - Cohort/Concept mock handlers, mock data factory, setupMockServer
    - _Requirements: 3.4_
  - [x] 3.6 Create index.ts export entry
    - _Requirements: 3.2_
  - [x] 3.7 Property test: API Client Config Preservation
    - **Property 3: API Client Config Preservation**
    - Use fast-check to generate arbitrary ApiClientConfig and verify config match after initialization
    - **Validates: Requirements 3.1**
  - [x] 3.8 Property test: Unified API Error Handling
    - **Property 4: Unified API Error Handling**
    - Use fast-check to generate arbitrary HTTP error statuses (4xx, 5xx) and verify ApiError type is returned
    - **Validates: Requirements 3.3**

- [x] 4. Checkpoint - Verify shared-config and api-v3-client
  - Ensure all tests pass, ask the user if questions arise.
  - Verify build with `npm run build`, confirm workspace dependency resolution

- [x] 5. domain-core Package Implementation
  - [x] 5.1 Create directory structure and package.json
    - name: `@atlas-v3/domain-core`, workspace:* dependency on shared-config/api-v3-client
    - tsconfig.json extends tsconfig.base.json
    - _Requirements: 4.1, 1.3, 2.1_
  - [x] 5.2 Create domain models (models/)
    - CohortDefinition, CohortExpression, CriteriaGroup, Criterion
    - Pure TypeScript types independent of UI frameworks
    - _Requirements: 4.1_
  - [x] 5.3 Implement validation logic (validators/)
    - CohortValidator: empty name check, 255-character limit check
    - ValidationRule<T> based, returns ValidationResult/ValidationError
    - _Requirements: 4.2_
  - [x] 5.4 Implement serializers (serializers/)
    - CohortSerializer: serialize (model→JSON) / deserialize (JSON→model)
    - _Requirements: 4.3_
  - [x] 5.5 Implement domain services (services/)
    - CohortService: list, get, create, update, delete, validate
    - API communication abstraction through api-v3-client
    - _Requirements: 4.1, 4.4_
  - [x] 5.6 Create index.ts export entry
    - _Requirements: 4.1_
  - [x] 5.7 Property test: Cohort Validation Correctness
    - **Property 5: Cohort Validation Correctness**
    - Use fast-check to generate arbitrary CohortDefinition and verify name validation correctness
    - **Validates: Requirements 4.2**
  - [x] 5.8 Property test: Serialization Round-Trip
    - **Property 6: Domain Model Serialization Round-Trip**
    - Use fast-check to verify serialize→deserialize equivalence
    - **Validates: Requirements 4.3**


- [x] 6. ui-system Package Implementation
  - [x] 6.1 Create directory structure and package.json
    - name: `@atlas-v3/ui-system`, workspace:* dependency on shared-config
    - React/ReactDOM as peerDependencies, extends tsconfig.react.json
    - _Requirements: 5.1, 5.4, 1.3, 2.1_
  - [x] 6.2 Implement theme system (theme/)
    - AtlasTheme (colors, spacing, typography, borderRadius)
    - defaultTheme, ThemeProvider (React Context), useTheme hook
    - _Requirements: 5.3_
  - [x] 6.3 Implement basic UI components (components/)
    - Button (variant, size, disabled), DataTable<T> (columns, data, onSort, onFilter)
    - Card, Input, and other basic components
    - _Requirements: 5.1, 5.2_
  - [x] 6.4 Create index.ts export entry
    - _Requirements: 5.1_
  - [x] 6.5 Property test: Consistent Theme Configuration Reflection
    - **Property 7: Consistent Theme Configuration Reflection**
    - Use fast-check to generate arbitrary AtlasTheme and verify ThemeProvider→useTheme value match
    - **Validates: Requirements 5.3**

- [x] 7. Checkpoint - Verify All Packages
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all packages with `npm run build`, confirm workspace dependencies and TypeScript path resolution

- [x] 8. starter-kit Application Implementation
  - [x] 8.1 Create `apps/starter-kit/` directory structure and package.json
    - name: `@atlas-v3/starter-kit`, workspace:* dependency on all packages
    - Create tsconfig.json, vite.config.ts
    - _Requirements: 6.1, 6.3, 1.3_
  - [x] 8.2 Set up MSW mock mode
    - Browser MSW worker initialization, api-v3-client mock handler integration
    - Environment variable (VITE_MOCK_MODE) switching
    - _Requirements: 6.2_
  - [x] 8.3 Implement minimal application entry
    - main.tsx (including MSW initialization), App.tsx (routing & layout)
    - Page components demonstrating 3-layer separation
    - _Requirements: 6.1, 6.3, 6.4_
  - [x] 8.4 Create starter-kit unit tests
    - MSW mock mode behavior verification, component rendering tests
    - _Requirements: 6.2_

- [x] 9. reference-app Application Implementation
  - [x] 9.1 Create `apps/reference-app/` directory structure and package.json
    - name: `@atlas-v3/reference-app`, workspace:* dependency on all packages
    - Create tsconfig.json, vite.config.ts
    - _Requirements: 7.1, 7.2, 1.3_
  - [x] 9.2 Implement Cohort definition CRUD operations
    - CohortListPage, CohortDetailPage, CohortCreatePage
    - API communication through domain-core CohortService
    - _Requirements: 7.1, 7.2_
  - [x] 9.3 Create package integration pattern examples
    - Integration of UI layer (ui-system), Domain layer (domain-core), API layer (api-v3-client)
    - _Requirements: 7.2_
  - [x] 9.4 Create reference-app integration tests
    - Cohort CRUD integration tests (using MSW)
    - _Requirements: 7.1_

- [x] 10. Checkpoint - Verify Applications
  - Ensure all tests pass, ask the user if questions arise.
  - Verify starter-kit / reference-app startup, confirm MSW mock mode behavior


- [x] 11. Workspace Package Reference Integrity Verification
  - [x] 11.1 Verify/fix workspace:* protocol correctness in all package.json files
    - _Requirements: 1.3, 11.3_
  - [x] 11.2 Verify/fix paths/references correctness in all tsconfig.json files
    - _Requirements: 11.1, 11.3_
  - [x] 11.3 Finalize root package.json scripts
    - dev: parallel startup of all apps, dev:mock: MSW mode, build: build order, test, clean
    - _Requirements: 8.1, 8.2, 8.3, 11.1, 11.2_
  - [x] 11.4 Property test: Workspace Package Reference Integrity
    - **Property 1: Workspace Package Reference Integrity**
    - Verify workspace:* and TypeScript path resolution integrity across all package.json and tsconfig.json files
    - **Validates: Requirements 1.3, 11.3**

- [x] 12. Infrastructure Environment (Docker) Setup
  - [x] 12.1 Create docker-compose.yml
    - Web API 3.0 Sandbox, PostgreSQL service, network & volume configuration
    - _Requirements: 9.1, 9.2_
  - [x] 12.2 Create Docker-related configuration files
    - .env.example, application connection settings
    - _Requirements: 9.2, 9.3_

- [x] 13. README.md Quick Start Guide Creation
  - [x] 13.1 Create root README.md
    - Project overview & architecture diagram, prerequisites (Node.js, npm, Docker)
    - Quick start steps (within 5 minutes), package descriptions, development command list, FAQ
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 14. Final Checkpoint - Full Verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all dependency installation with `npm install`
  - Verify all package builds with `npm run build`
  - Verify all tests pass with `npm test`
  - Verify all apps work in MSW mock mode

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate correctness properties (Properties 1-7 from design)
- Build order: shared-config → api-v3-client → domain-core → ui-system → apps
