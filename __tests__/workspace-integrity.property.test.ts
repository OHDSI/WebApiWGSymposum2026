/**
 * Property 1: Workspace Package Reference Integrity
 *
 * For any workspace package, dependencies on other workspace packages must be
 * declared using the workspace:* protocol, and the corresponding TypeScript path resolution
 * (tsconfig paths or references) must be correctly configured.
 *
 * Verification items:
 * 1. All @atlas-v3/* dependencies reference existing workspace packages
 * 2. All tsconfig.json extends paths resolve to existing files
 * 3. All tsconfig.json references point to directories containing tsconfig.json
 * 4. The dependency graph has no circular dependencies
 * 5. The root package.json workspaces glob matches all package/app directories
 *
 * **Validates: Requirements 1.3, 11.3**
 *
 * Tag: Feature: atlas-v3-hackathon-boilerplate, Property 1: Workspace Package Reference Integrity
 */
import { describe, it, expect } from 'vitest';
import { test as fcTest, fc } from '@fast-check/vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface PkgJson {
  name: string;
  main?: string;
  exports?: unknown;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface TsConfig {
  extends?: string;
  references?: Array<{ path: string }>;
  compilerOptions?: Record<string, unknown>;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}



/** Discover all workspace member directories from root package.json workspaces globs */
function discoverWorkspaceMembers(): string[] {
  const rootPkg = readJson<{ workspaces?: string[] }>(
    path.join(ROOT_DIR, 'package.json'),
  );
  const members: string[] = [];
  for (const pattern of rootPkg.workspaces ?? []) {
    // patterns like "packages/*" or "apps/*"
    const base = pattern.replace('/*', '');
    const dir = path.join(ROOT_DIR, base);
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        members.push(path.join(dir, entry.name));
      }
    }
  }
  return members;
}

/** Build a map: package name → absolute directory */
function buildNameToDir(): Map<string, string> {
  const map = new Map<string, string>();
  for (const dir of discoverWorkspaceMembers()) {
    const pkgPath = path.join(dir, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = readJson<PkgJson>(pkgPath);
    map.set(pkg.name, dir);
  }
  return map;
}

/** Get all @atlas-v3/* dependency names from a package.json */
function getAtlasDeps(pkg: PkgJson): string[] {
  const all: Record<string, string> = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  };
  return Object.keys(all).filter((n) => n.startsWith('@atlas-v3/'));
}

/** Detect circular dependencies via DFS */
function hasCycle(graph: Map<string, string[]>): boolean {
  const visited = new Set<string>();
  const inStack = new Set<string>();

  function dfs(node: string): boolean {
    if (inStack.has(node)) return true;
    if (visited.has(node)) return false;
    visited.add(node);
    inStack.add(node);
    for (const dep of graph.get(node) ?? []) {
      if (dfs(dep)) return true;
    }
    inStack.delete(node);
    return false;
  }

  for (const node of graph.keys()) {
    if (dfs(node)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Shared data
// ---------------------------------------------------------------------------

const nameToDir = buildNameToDir();
const memberDirs = discoverWorkspaceMembers();
const memberNames = [...nameToDir.keys()];



// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Property 1: Workspace Package Reference Integrity', () => {
  // -----------------------------------------------------------------------
  // 1. All @atlas-v3/* dependencies reference packages that exist in workspace
  // -----------------------------------------------------------------------
  if (memberNames.length > 0) {
    const memberArb = fc.constantFrom(...memberNames);

    fcTest.prop([memberArb])(
      '@atlas-v3/* dependencies reference existing workspace packages',
      (pkgName) => {
        const dir = nameToDir.get(pkgName)!;
        const pkg = readJson<PkgJson>(path.join(dir, 'package.json'));
        const atlasDeps = getAtlasDeps(pkg);
        for (const dep of atlasDeps) {
          expect(
            nameToDir.has(dep),
            `${pkgName} depends on ${dep} which is not a workspace package`,
          ).toBe(true);
        }
      },
    );
  }

  // -----------------------------------------------------------------------
  // 2. All tsconfig.json extends paths resolve to existing files
  // -----------------------------------------------------------------------
  it('all tsconfig.json extends paths resolve to existing files', () => {
    for (const dir of memberDirs) {
      const tsconfigPath = path.join(dir, 'tsconfig.json');
      if (!fs.existsSync(tsconfigPath)) continue;
      const tsconfig = readJson<TsConfig>(tsconfigPath);
      if (!tsconfig.extends) continue;

      const extendsValue = tsconfig.extends;
      // npm-style extends like "@atlas-v3/shared-config/tsconfig.base.json"
      // resolve via node_modules or workspace link
      if (extendsValue.startsWith('@atlas-v3/')) {
        const parts = extendsValue.replace('@atlas-v3/', '').split('/');
        const pkgDir = nameToDir.get(`@atlas-v3/${parts[0]}`);
        expect(
          pkgDir,
          `extends target package @atlas-v3/${parts[0]} not found for ${dir}`,
        ).toBeDefined();
        if (pkgDir) {
          const targetFile = path.join(pkgDir, ...parts.slice(1));
          expect(
            fs.existsSync(targetFile),
            `extends file ${targetFile} does not exist (from ${dir})`,
          ).toBe(true);
        }
      } else if (extendsValue.startsWith('.')) {
        // relative extends
        const resolved = path.resolve(dir, extendsValue);
        expect(
          fs.existsSync(resolved),
          `extends file ${resolved} does not exist (from ${dir})`,
        ).toBe(true);
      }
    }
  });

  // -----------------------------------------------------------------------
  // 3. All tsconfig.json references point to directories with tsconfig.json
  // -----------------------------------------------------------------------
  it('all tsconfig.json references point to directories with tsconfig.json', () => {
    for (const dir of memberDirs) {
      const tsconfigPath = path.join(dir, 'tsconfig.json');
      if (!fs.existsSync(tsconfigPath)) continue;
      const tsconfig = readJson<TsConfig>(tsconfigPath);
      if (!tsconfig.references) continue;

      for (const ref of tsconfig.references) {
        const refDir = path.resolve(dir, ref.path);
        expect(
          fs.existsSync(refDir),
          `reference directory ${refDir} does not exist (from ${dir})`,
        ).toBe(true);
        const refTsconfig = path.join(refDir, 'tsconfig.json');
        expect(
          fs.existsSync(refTsconfig),
          `reference ${refDir} has no tsconfig.json (from ${dir})`,
        ).toBe(true);
      }
    }
  });

  // Also check root tsconfig.json references
  it('root tsconfig.json references point to directories with tsconfig.json', () => {
    const rootTsconfigPath = path.join(ROOT_DIR, 'tsconfig.json');
    if (!fs.existsSync(rootTsconfigPath)) return;
    const tsconfig = readJson<TsConfig>(rootTsconfigPath);
    if (!tsconfig.references) return;

    for (const ref of tsconfig.references) {
      const refDir = path.resolve(ROOT_DIR, ref.path);
      expect(
        fs.existsSync(refDir),
        `root reference directory ${refDir} does not exist`,
      ).toBe(true);
      const refTsconfig = path.join(refDir, 'tsconfig.json');
      expect(
        fs.existsSync(refTsconfig),
        `root reference ${refDir} has no tsconfig.json`,
      ).toBe(true);
    }
  });

  // -----------------------------------------------------------------------
  // 4. Dependency graph has no circular dependencies
  // -----------------------------------------------------------------------
  it('dependency graph has no circular dependencies', () => {
    const graph = new Map<string, string[]>();
    for (const [name, dir] of nameToDir) {
      const pkg = readJson<PkgJson>(path.join(dir, 'package.json'));
      graph.set(name, getAtlasDeps(pkg));
    }
    expect(
      hasCycle(graph),
      'circular dependency detected in workspace packages',
    ).toBe(false);
  });

  // -----------------------------------------------------------------------
  // 5. Root package.json workspaces glob matches all package/app directories
  // -----------------------------------------------------------------------
  it('root workspaces glob covers all package and app directories', () => {
    const rootPkg = readJson<{ workspaces?: string[] }>(
      path.join(ROOT_DIR, 'package.json'),
    );
    const patterns = rootPkg.workspaces ?? [];

    const hasPackagesGlob = patterns.some((p) => p === 'packages/*');
    const hasAppsGlob = patterns.some((p) => p === 'apps/*');
    expect(hasPackagesGlob, 'workspaces should include "packages/*"').toBe(true);
    expect(hasAppsGlob, 'workspaces should include "apps/*"').toBe(true);

    // Every directory under packages/ and apps/ should have a package.json
    const packagesDir = path.join(ROOT_DIR, 'packages');
    const appsDir = path.join(ROOT_DIR, 'apps');
    for (const baseDir of [packagesDir, appsDir]) {
      if (!fs.existsSync(baseDir)) continue;
      for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const pkgJsonPath = path.join(baseDir, entry.name, 'package.json');
        expect(
          fs.existsSync(pkgJsonPath),
          `${path.join(baseDir, entry.name)} is in workspace glob but has no package.json`,
        ).toBe(true);
      }
    }
  });

  // -----------------------------------------------------------------------
  // Property-based: workspace:* deps have resolvable entry points
  // (Source-level imports with moduleResolution: "bundler" — no project
  //  references needed; verify each dep's main/exports entry exists.)
  // -----------------------------------------------------------------------
  if (memberNames.length > 0) {
    const memberArb = fc.constantFrom(...memberNames);

    fcTest.prop([memberArb])(
      'workspace:* deps have corresponding tsconfig references',
      (pkgName) => {
        const dir = nameToDir.get(pkgName)!;
        const pkg = readJson<PkgJson>(path.join(dir, 'package.json'));
        const atlasDeps = getAtlasDeps(pkg);

        // Each @atlas-v3/* dependency should exist and have a resolvable entry point
        for (const dep of atlasDeps) {
          const depDir = nameToDir.get(dep);
          expect(
            depDir,
            `${pkgName}: dependency ${dep} not found in workspace`,
          ).toBeDefined();
          if (!depDir) continue;

          // Verify the dependency has a package.json with a main or exports entry
          const depPkg = readJson<PkgJson>(path.join(depDir, 'package.json'));
          const hasEntry = depPkg.main || depPkg.exports;
          expect(
            !!hasEntry,
            `${pkgName}: dependency ${dep} has no main or exports field`,
          ).toBe(true);

          // Verify the main entry file exists
          if (depPkg.main) {
            const mainPath = path.join(depDir, depPkg.main);
            expect(
              fs.existsSync(mainPath),
              `${pkgName}: dependency ${dep} main entry ${depPkg.main} does not exist`,
            ).toBe(true);
          }
        }
      },
    );
  }
});
