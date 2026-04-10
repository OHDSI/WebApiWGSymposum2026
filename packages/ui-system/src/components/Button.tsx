import * as React from 'react';
import { useTheme } from '../theme/index.js';
import type { AtlasTheme } from '../theme/index.js';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

function getVariantStyles(
  variant: 'primary' | 'secondary' | 'outline',
  theme: AtlasTheme,
): React.CSSProperties {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.colors.primary,
        color: '#ffffff',
        border: 'none',
      };
    case 'secondary':
      return {
        backgroundColor: theme.colors.secondary,
        color: '#ffffff',
        border: 'none',
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: theme.colors.primary,
        border: `1px solid ${theme.colors.primary}`,
      };
  }
}

function getSizeStyles(
  size: 'sm' | 'md' | 'lg',
  theme: AtlasTheme,
): React.CSSProperties {
  switch (size) {
    case 'sm':
      return {
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        fontSize: theme.typography.fontSize.sm,
      };
    case 'md':
      return {
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        fontSize: theme.typography.fontSize.md,
      };
    case 'lg':
      return {
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        fontSize: theme.typography.fontSize.lg,
      };
  }
}


export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
}: ButtonProps): React.JSX.Element {
  const theme = useTheme();

  const style: React.CSSProperties = {
    ...getVariantStyles(variant, theme),
    ...getSizeStyles(size, theme),
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeight.medium,
    borderRadius: theme.borderRadius.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'opacity 0.2s ease',
  };

  return React.createElement(
    'button',
    { style, disabled, onClick, type: 'button' as const },
    children,
  );
}
