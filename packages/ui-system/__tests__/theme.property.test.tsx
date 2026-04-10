import React from 'react';
import { describe, expect } from 'vitest';
import { fc, it } from '@fast-check/vitest';
import { render } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../src/theme/index.js';
import type { AtlasTheme } from '../src/theme/index.js';

// Feature: atlas-v3-hackathon-boilerplate, Property 7: Consistent Theme Configuration Reflection
// **Validates: Requirements 5.3**

/**
 * Arbitrary for AtlasThemeColors: generates random hex color strings.
 */
const arbHexColor = fc.integer({ min: 0, max: 0xffffff }).map(
  (n) => `#${n.toString(16).padStart(6, '0')}`,
);

const arbColors = fc.record({
  primary: arbHexColor,
  secondary: arbHexColor,
  background: arbHexColor,
  text: arbHexColor,
  error: arbHexColor,
  success: arbHexColor,
  warning: arbHexColor,
});

/**
 * Arbitrary for CSS size values (e.g. "4px", "1.5rem").
 */
const arbCssSize = fc.oneof(
  fc.integer({ min: 0, max: 200 }).map((n) => `${n}px`),
  fc.integer({ min: 1, max: 100 }).map((n) => `${n / 10}rem`),
);

const arbSpacing = fc.record({
  xs: arbCssSize,
  sm: arbCssSize,
  md: arbCssSize,
  lg: arbCssSize,
  xl: arbCssSize,
});

/**
 * Arbitrary for font family strings.
 */
const arbFontFamily = fc
  .array(
    fc.stringOf(fc.char().filter((c) => c !== ',' && c !== '"'), { minLength: 1, maxLength: 20 }),
    { minLength: 1, maxLength: 4 },
  )
  .map((fonts) => fonts.join(', '));


const arbFontSize = fc.record({
  xs: arbCssSize,
  sm: arbCssSize,
  md: arbCssSize,
  lg: arbCssSize,
  xl: arbCssSize,
});

const arbFontWeight = fc.record({
  normal: fc.integer({ min: 100, max: 900 }),
  medium: fc.integer({ min: 100, max: 900 }),
  bold: fc.integer({ min: 100, max: 900 }),
});

const arbTypography = fc.record({
  fontFamily: arbFontFamily,
  fontSize: arbFontSize,
  fontWeight: arbFontWeight,
});

const arbBorderRadius = fc.record({
  sm: arbCssSize,
  md: arbCssSize,
  lg: arbCssSize,
});

/**
 * Arbitrary for a complete AtlasTheme.
 */
const arbAtlasTheme: fc.Arbitrary<AtlasTheme> = fc.record({
  colors: arbColors,
  spacing: arbSpacing,
  typography: arbTypography,
  borderRadius: arbBorderRadius,
});

/**
 * Test component that captures the theme from useTheme() into a ref
 * so we can assert on it after render.
 */
function ThemeCapture({ onTheme }: { onTheme: (t: AtlasTheme) => void }) {
  const theme = useTheme();
  // Call the callback during render to capture the theme value
  onTheme(theme);
  return React.createElement('div', { 'data-testid': 'theme-capture' }, 'ok');
}

describe('ThemeProvider → useTheme consistency (Property 7)', () => {
  it.prop(
    [arbAtlasTheme],
    { numRuns: 50 },
  )(
    'useTheme returns the exact theme provided to ThemeProvider',
    (theme) => {
      let captured: AtlasTheme | undefined;

      render(
        React.createElement(
          ThemeProvider,
          { theme },
          React.createElement(ThemeCapture, {
            onTheme: (t: AtlasTheme) => {
              captured = t;
            },
          }),
        ),
      );

      expect(captured).toBeDefined();
      expect(captured).toEqual(theme);
    },
  );
});
