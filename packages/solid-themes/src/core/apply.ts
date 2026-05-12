import {
  getDomThemeValue,
  getThemeClassValues,
  isColorScheme,
  normalizeThemeConfig,
  toAttributes
} from "./config";
import { getSystemTheme } from "./system";
import type { ApplyThemeOptions, ThemeConfig, ThemeResolution, ResolveThemeOptions } from "./types";

export function resolveTheme(options: ResolveThemeOptions = {}): ThemeResolution {
  const config = normalizeThemeConfig(options);
  const systemTheme = options.systemTheme ?? getSystemTheme();
  const storedOrDefault = options.theme ?? options.storedTheme ?? config.defaultTheme;
  const theme = storedOrDefault ?? undefined;
  const forcedTheme = config.forcedTheme;
  const activeTheme = forcedTheme ?? theme;
  const resolvedTheme =
    activeTheme === "system" && config.enableSystem
      ? (systemTheme ?? "light")
      : (activeTheme ?? undefined);

  return {
    theme,
    forcedTheme,
    resolvedTheme,
    systemTheme
  };
}

export function applyTheme(
  theme: string | undefined,
  options: ApplyThemeOptions = {}
): ThemeResolution {
  const config = normalizeThemeConfig(options);
  const target =
    options.target ?? (typeof document !== "undefined" ? document.documentElement : undefined);
  const resolution = resolveTheme({ ...config, theme, systemTheme: options.systemTheme });
  const domValue = getDomThemeValue(resolution.resolvedTheme, config);

  if (!target || !resolution.resolvedTheme) return resolution;

  for (const attribute of toAttributes(config.attribute)) {
    if (attribute === "class") {
      const classValues = getThemeClassValues(config);
      if (classValues.length) target.classList.remove(...classValues);
      if (domValue) target.classList.add(domValue);
    } else if (domValue) {
      target.setAttribute(attribute, domValue);
    } else {
      target.removeAttribute(attribute);
    }
  }

  if (config.enableColorScheme) {
    target.style.colorScheme = isColorScheme(resolution.resolvedTheme)
      ? resolution.resolvedTheme
      : "";
  }

  return resolution;
}

export function disableTransitions(nonce?: string): () => void {
  if (typeof document === "undefined") return () => {};

  const style = document.createElement("style");
  if (nonce) style.setAttribute("nonce", nonce);
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
    )
  );
  document.head.appendChild(style);

  return () => {
    if (typeof window !== "undefined" && document.body) {
      window.getComputedStyle(document.body);
    }
    window.setTimeout(() => style.parentNode?.removeChild(style), 1);
  };
}

export function applyThemeWithOptionalTransition(
  theme: string | undefined,
  options: ApplyThemeOptions & { nonce?: string; disableTransitionOnChange?: boolean } = {}
): ThemeResolution {
  const enable = options.disableTransitionOnChange ? disableTransitions(options.nonce) : undefined;
  const resolution = applyTheme(theme, options);
  enable?.();
  return resolution;
}

export function getAppliedClassValues(config: ThemeConfig): string[] {
  return getThemeClassValues(config);
}
