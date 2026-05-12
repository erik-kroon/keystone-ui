import {
  batch,
  createComponent,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  untrack,
  useContext
} from "solid-js";
import {
  addSystemThemeListener,
  applyThemeWithOptionalTransition,
  getStoredTheme,
  getSystemTheme,
  normalizeThemeConfig,
  resolveTheme,
  setStoredTheme
} from "../core";
import { ThemeContext } from "./context";
import type { ThemeContextValue, ThemeProviderProps } from "./types";

export function ThemeProvider(props: ThemeProviderProps) {
  const existing = useContext(ThemeContext);
  if (existing) return props.children;

  return createComponent(ThemeRoot, props);
}

function ThemeRoot(props: ThemeProviderProps) {
  const config = createMemo(() => normalizeThemeConfig(props));
  const [theme, setThemeSignal] = createSignal<string | undefined>(undefined);
  const [systemTheme, setSystemTheme] = createSignal<"light" | "dark" | undefined>(undefined);
  const [mounted, setMounted] = createSignal(false);
  let initialApply = true;

  const resolvedTheme = createMemo(() => {
    return resolveTheme({
      ...config(),
      theme: theme(),
      systemTheme: systemTheme()
    }).resolvedTheme;
  });

  const themes = createMemo(() => {
    const cfg = config();
    const names = [...cfg.themes];
    if (cfg.enableSystem && !names.includes("system")) names.push("system");
    return names;
  });

  const setTheme: ThemeContextValue["setTheme"] = (next) => {
    const nextTheme = typeof next === "function" ? next(untrack(theme)) : next;
    setThemeSignal(nextTheme);
    setStoredTheme(nextTheme, config().storageKey);
  };

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    systemTheme,
    forcedTheme: () => config().forcedTheme,
    mounted,
    themes,
    setTheme
  };

  createEffect(() => {
    if (!mounted()) return;

    const cfg = config();
    const activeTheme = cfg.forcedTheme ?? theme() ?? cfg.defaultTheme;
    const shouldDisableTransitions = cfg.disableTransitionOnChange && !initialApply;

    applyThemeWithOptionalTransition(activeTheme, {
      ...cfg,
      systemTheme: systemTheme(),
      disableTransitionOnChange: shouldDisableTransitions,
      nonce: props.nonce
    });

    initialApply = false;
  });

  onMount(() => {
    const cfg = config();
    const storedTheme = getStoredTheme(cfg.storageKey);
    const initialTheme = storedTheme ?? cfg.defaultTheme;

    batch(() => {
      setSystemTheme(getSystemTheme());
      setThemeSignal(initialTheme);
      setMounted(true);
    });

    const removeSystemListener = addSystemThemeListener((nextSystemTheme) => {
      setSystemTheme(nextSystemTheme);
    });

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== config().storageKey) return;

      setThemeSignal(event.newValue || config().defaultTheme);
    };

    window.addEventListener("storage", handleStorage);

    onCleanup(() => {
      removeSystemListener();
      window.removeEventListener("storage", handleStorage);
    });
  });

  return createComponent(ThemeContext.Provider, {
    value,
    get children() {
      return props.children;
    }
  });
}
