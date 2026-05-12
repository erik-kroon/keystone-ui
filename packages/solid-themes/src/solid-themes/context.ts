import { createContext, useContext } from "solid-js";
import type { ThemeContextValue } from "./types";

const noop = () => {};

export const defaultThemeContext: ThemeContextValue = {
  theme: () => undefined,
  resolvedTheme: () => undefined,
  systemTheme: () => undefined,
  forcedTheme: () => undefined,
  mounted: () => false,
  themes: () => [],
  setTheme: noop
};

export const ThemeContext = createContext<ThemeContextValue>();

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext) ?? defaultThemeContext;
}
