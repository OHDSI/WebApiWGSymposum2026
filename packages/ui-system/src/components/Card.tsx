import * as React from 'react';
import { useTheme } from '../theme/index.js';

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className }: CardProps): React.JSX.Element {
  const theme = useTheme();

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.text}20`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily,
  };

  const titleStyle: React.CSSProperties = {
    margin: `0 0 ${theme.spacing.md} 0`,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  };

  return React.createElement(
    'div',
    { style: containerStyle, className },
    title ? React.createElement('h3', { style: titleStyle }, title) : null,
    children,
  );
}
