export type ThemeName = string;
export type ColorScheme = "light" | "dark";
export type ThemeAttribute = "class" | `data-${string}`;
export type ThemeAttributeInput = ThemeAttribute | ThemeAttribute[];

export interface ThemeConfig {
  themes: ThemeName[];
  forcedTheme?: ThemeName;
  enableSystem: boolean;
  enableColorScheme: boolean;
  disableTransitionOnChange: boolean;
  storageKey: string;
  defaultTheme: ThemeName;
  attribute: ThemeAttributeInput;
  value?: Record<ThemeName, string>;
}

export interface ThemeOptions extends Partial<ThemeConfig> {}

export interface ResolveThemeOptions extends ThemeOptions {
  theme?: ThemeName | null;
  storedTheme?: ThemeName | null;
  systemTheme?: ColorScheme;
}

export interface ThemeResolution {
  theme: ThemeName | undefined;
  forcedTheme: ThemeName | undefined;
  resolvedTheme: ThemeName | undefined;
  systemTheme: ColorScheme | undefined;
}

export interface ApplyThemeOptions extends ThemeOptions {
  target?: HTMLElement;
  systemTheme?: ColorScheme;
}

export interface CreateThemeScriptOptions extends ThemeOptions {
  nonce?: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}
