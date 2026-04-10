import * as React from 'react';
import { useTheme } from '../theme/index.js';

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: keyof T) => void;
  onFilter?: (key: keyof T, value: string) => void;
}

export function DataTable<T>({
  columns,
  data,
  onSort,
  onFilter,
}: DataTableProps<T>): React.JSX.Element {
  const theme = useTheme();

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  };

  const thStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    textAlign: 'left',
    fontWeight: theme.typography.fontWeight.bold,
    borderBottom: `2px solid ${theme.colors.primary}`,
    backgroundColor: theme.colors.background,
    cursor: onSort ? 'pointer' : 'default',
  };

  const tdStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderBottom: `1px solid ${theme.colors.text}20`,
  };

  const filterInputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily,
    border: `1px solid ${theme.colors.text}40`,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.xs,
    boxSizing: 'border-box',
  };


  return React.createElement(
    'table',
    { style: tableStyle },
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        columns.map((col) =>
          React.createElement(
            'th',
            {
              key: String(col.key),
              style: thStyle,
              onClick: onSort ? () => onSort(col.key) : undefined,
            },
            col.header,
            onFilter
              ? React.createElement('input', {
                  style: filterInputStyle,
                  placeholder: `Filter ${col.header}...`,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    onFilter(col.key, e.target.value),
                })
              : null,
          ),
        ),
      ),
    ),
    React.createElement(
      'tbody',
      null,
      data.map((row, rowIndex) =>
        React.createElement(
          'tr',
          { key: rowIndex },
          columns.map((col) =>
            React.createElement(
              'td',
              { key: String(col.key), style: tdStyle },
              col.render
                ? col.render(row[col.key], row)
                : String(row[col.key] ?? ''),
            ),
          ),
        ),
      ),
    ),
  );
}
