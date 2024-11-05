import * as React from 'react';

type ValueObject = Record<string, string>;

type DataAttribute = `data-${string}`;

interface ScriptProps extends React.DetailedHTMLProps<React.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>, Record<DataAttribute, string | number> { }

interface UseThemeProps {
  themes: string[];
  forcedTheme?: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  theme?: string;
  resolvedTheme?: string;
  systemTheme?: 'dark' | 'light';
}

type Attribute = DataAttribute | 'class';

export interface ThemeProviderProps extends React.PropsWithChildren {
  themes?: string[];
  forcedTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
  storageKey?: string;
  defaultTheme?: string;
  attribute?: Attribute | Attribute[];
  value?: ValueObject;
  nonce?: string;
  scriptProps?: ScriptProps;
}
