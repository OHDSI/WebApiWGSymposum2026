import * as React from 'react';
import { useTheme } from '../theme/index.js';

export interface InputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error,
}: InputProps): React.JSX.Element {
  const theme = useTheme();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  };

  const inputStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily,
    border: `1px solid ${error ? theme.colors.error : theme.colors.text + '40'}`,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: disabled ? theme.colors.background + 'cc' : theme.colors.background,
    color: theme.colors.text,
    outline: 'none',
    opacity: disabled ? 0.6 : 1,
  };


  const errorStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    margin: 0,
  };

  return React.createElement(
    'div',
    { style: containerStyle },
    label ? React.createElement('label', { style: labelStyle }, label) : null,
    React.createElement('input', {
      style: inputStyle,
      value,
      onChange,
      placeholder,
      type,
      disabled,
    }),
    error ? React.createElement('span', { style: errorStyle }, error) : null,
  );
}
