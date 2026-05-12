import type { Accessor, JSX } from "solid-js";
import type { ThemeAttributeInput, ThemeName } from "../core";

export interface ThemeProviderProps {
  children?: JSX.Element;
  themes?: ThemeName[];
  forcedTheme?: ThemeName;
  enableSystem?: boolean;
  enableColorScheme?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  defaultTheme?: ThemeName;
  attribute?: ThemeAttributeInput;
  value?: Record<ThemeName, string>;
  nonce?: string;
  scriptProps?: JSX.ScriptHTMLAttributes<HTMLScriptElement>;
}

export type ThemeScriptProps = Omit<ThemeProviderProps, "children" | "disableTransitionOnChange">;

export interface ThemeContextValue {
  theme: Accessor<string | undefined>;
  resolvedTheme: Accessor<string | undefined>;
  systemTheme: Accessor<"light" | "dark" | undefined>;
  forcedTheme: Accessor<string | undefined>;
  mounted: Accessor<boolean>;
  themes: Accessor<string[]>;
  setTheme(next: string | ((previous: string | undefined) => string)): void;
}

export interface ThemeGateProps {
  children?: JSX.Element | ((theme: ThemeContextValue) => JSX.Element);
  fallback?: JSX.Element;
}

export interface ThemeSelectProps extends Omit<
  JSX.SelectHTMLAttributes<HTMLSelectElement>,
  "children" | "onInput" | "value"
> {
  fallback?: JSX.Element;
  labels?: Record<string, JSX.Element>;
  themes?: string[];
  onThemeChange?: (theme: string) => void;
}
