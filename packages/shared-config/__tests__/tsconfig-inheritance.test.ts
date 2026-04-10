/**
 * Property 2: Shared TypeScript Config Inheritance
 *
 * Verifies that the tsconfig.json of any workspace package (excluding shared-config itself)
 * extends shared-config's tsconfig.base.json or tsconfig.react.json.
 *
 * Also verifies that even when arbitrary compilerOptions overrides are applied,
 * the required options from tsconfig.base.json are preserved.
 *
 * **Validates: Requirements 2.1**
 *
 * Tag: Feature: atlas-v3-hackathon-boilerplate, Property 2: Shared TypeScript Config Inheritance
 */
import { describe, it, expect } from 'vitest';
import { test as fcTest, fc } from '@fast-check/vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGES_DIR = path.resolve(__dirname, '../../');
const SHARED_CONFIG_PKG = 'shared-config';

const VALID_EXTENDS_PATTERNS = [
  '@atlas-v3/shared-config/tsconfig.base.json',
  '@atlas-v3/shared-config/tsconfig.react.json',
  '../shared-config/tsconfig.base.json',
  '../shared-config/tsconfig.react.json',
];

/** Required compiler options that tsconfig.base.json must always provide */
const REQUIRED_BASE_OPTIONS = {
  target: 'ES2022',
  module: 'ESNext',
  moduleResolution: 'bundler',
  strict: true,
} as const;

function getBaseTsconfig(): Record<string, unknown> {
  const basePath = path.join(
    PACKAGES_DIR, SHARED_CONFIG_PKG, 'tsconfig.base.json',
  );
  return JSON.parse(fs.readFileSync(basePath, 'utf-8'));
}

function getWorkspacePackages(): string[] {
  if (!fs.existsSync(PACKAGES_DIR)) return [];
  return fs
    .readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== SHARED_CONFIG_PKG)
    .map((d) => d.name);
}


function getTsconfigExtends(
  pkgName: string,
): string | string[] | undefined {
  const tsconfigPath = path.join(PACKAGES_DIR, pkgName, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) return undefined;
  const content = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
  return content.extends;
}

function extendsSharedConfig(
  extendsValue: string | string[] | undefined,
): boolean {
  if (!extendsValue) return false;
  const values = Array.isArray(extendsValue)
    ? extendsValue
    : [extendsValue];
  return values.some((v) =>
    VALID_EXTENDS_PATTERNS.some((pattern) => v.includes(pattern)),
  );
}

/**
 * Simulate extending tsconfig.base.json with arbitrary overrides.
 * In TypeScript config inheritance, child options merge on top of parent.
 */
function simulateExtend(
  base: Record<string, unknown>,
  overrides: Record<string, unknown>,
): Record<string, unknown> {
  const baseOpts = (base.compilerOptions ?? {}) as Record<string, unknown>;
  return { ...baseOpts, ...overrides };
}

/** Arbitrary: random compilerOptions overrides (non-required keys only) */
const arbitraryOverrides = fc.dictionary(
  fc.constantFrom(
    'outDir', 'rootDir', 'declaration', 'sourceMap',
    'jsx', 'lib', 'paths',
  ),
  fc.oneof(fc.string(), fc.boolean(), fc.constant(null)),
  { minKeys: 0, maxKeys: 4 },
);

describe('Property 2: Shared TypeScript Config Inheritance', () => {
  const packages = getWorkspacePackages();

  if (packages.length > 0) {
    const pkgArbitrary = fc.constantFrom(...packages);

    fcTest.prop([pkgArbitrary])(
      'workspace package extends shared-config tsconfig',
      (pkgName) => {
        const extendsValue = getTsconfigExtends(pkgName);
        expect(extendsValue).toBeDefined();
        expect(extendsSharedConfig(extendsValue)).toBe(true);
      },
    );
  } else {
    it('no workspace packages yet (validates when created)', () => {
      expect(packages).toHaveLength(0);
    });
  }

  fcTest.prop([arbitraryOverrides])(
    'extending tsconfig.base.json preserves required options',
    (overrides) => {
      const base = getBaseTsconfig();
      const merged = simulateExtend(base, overrides);

      for (const [key, value] of Object.entries(REQUIRED_BASE_OPTIONS)) {
        if (!(key in overrides)) {
          expect(merged[key]).toBe(value);
        }
      }
    },
  );

  it('tsconfig.base.json has required compiler options', () => {
    const baseTsconfig = getBaseTsconfig();
    const opts = baseTsconfig.compilerOptions as Record<string, unknown>;
    expect(opts.target).toBe('ES2022');
    expect(opts.module).toBe('ESNext');
    expect(opts.moduleResolution).toBe('bundler');
    expect(opts.strict).toBe(true);
  });

  it('tsconfig.react.json extends base and adds jsx', () => {
    const reactPath = path.join(
      PACKAGES_DIR, SHARED_CONFIG_PKG, 'tsconfig.react.json',
    );
    const reactTsconfig = JSON.parse(fs.readFileSync(reactPath, 'utf-8'));
    expect(reactTsconfig.extends).toContain('tsconfig.base.json');
    expect(reactTsconfig.compilerOptions.jsx).toBe('react-jsx');
  });
});
