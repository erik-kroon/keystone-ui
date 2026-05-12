import type { ThemeAttribute, ThemeAttributeInput, ThemeConfig, ThemeOptions } from "./types";

export const DEFAULT_THEMES = ["light", "dark"] as const;
export const DEFAULT_STORAGE_KEY = "theme";
export const DEFAULT_ATTRIBUTE = "data-theme" satisfies ThemeAttribute;
export const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";
export const COLOR_SCHEMES = ["light", "dark"] as const;

export function normalizeThemeConfig(options: ThemeOptions = {}): ThemeConfig {
  const enableSystem = options.enableSystem ?? true;
  const themes = options.themes ? [...options.themes] : [...DEFAULT_THEMES];

  return {
    themes,
    forcedTheme: options.forcedTheme,
    enableSystem,
    enableColorScheme: options.enableColorScheme ?? true,
    disableTransitionOnChange: options.disableTransitionOnChange ?? false,
    storageKey: options.storageKey ?? DEFAULT_STORAGE_KEY,
    defaultTheme: options.defaultTheme ?? (enableSystem ? "system" : "light"),
    attribute: options.attribute ?? DEFAULT_ATTRIBUTE,
    value: options.value
  };
}

export function toAttributes(attribute: ThemeAttributeInput): ThemeAttribute[] {
  return Array.isArray(attribute) ? attribute : [attribute];
}

export function getThemeClassValues(config: ThemeConfig): string[] {
  const values = new Set<string>();

  for (const theme of config.themes) {
    values.add(config.value?.[theme] ?? theme);
  }

  if (config.defaultTheme !== "system") {
    values.add(config.value?.[config.defaultTheme] ?? config.defaultTheme);
  }

  if (config.forcedTheme) {
    values.add(config.value?.[config.forcedTheme] ?? config.forcedTheme);
  }

  if (config.enableSystem) {
    values.add(config.value?.light ?? "light");
    values.add(config.value?.dark ?? "dark");
  }

  return [...values].filter(Boolean);
}

export function getDomThemeValue(
  theme: string | undefined,
  config: ThemeConfig
): string | undefined {
  if (!theme) return undefined;
  return config.value?.[theme] ?? theme;
}

export function isColorScheme(theme: string | undefined): theme is "light" | "dark" {
  return theme === "light" || theme === "dark";
}
