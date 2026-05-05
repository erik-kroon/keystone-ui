import { createStore, useSelector, type Store } from "@tanstack/solid-store";
import {
  createContext,
  createEffect,
  onCleanup,
  onMount,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
  type ParentProps,
} from "solid-js";

export type ThemeMode = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";
export type ThemeChangeReason = "controlled" | "programmatic" | "storage" | "system";
export type ThemeAttribute = "class" | "data-theme";

export type ThemeChangeDetail = {
  reason: ThemeChangeReason;
};

export type ThemeStoreState = {
  mounted: boolean;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
  theme: ThemeMode;
};

export type ThemeStore = {
  store: Store<ThemeStoreState>;
  applyTheme: (target?: Document | HTMLElement | null) => void;
  cycleTheme: (themes?: readonly ThemeMode[]) => ThemeMode;
  resolvedTheme: Accessor<ResolvedTheme>;
  setMounted: (mounted: boolean) => void;
  setSystemTheme: (theme: ResolvedTheme, detail?: ThemeChangeDetail) => void;
  setTheme: (theme: ThemeMode, detail?: ThemeChangeDetail) => void;
  systemTheme: Accessor<ResolvedTheme>;
  theme: Accessor<ThemeMode>;
};

export type CreateThemeStoreOptions = {
  attribute?: ThemeAttribute;
  defaultTheme?: ThemeMode;
  disableTransitionOnChange?: boolean;
  onThemeChange?: (theme: ThemeMode, detail: ThemeChangeDetail) => void;
  storageKey?: string;
};

export type MountThemeStoreOptions = {
  document?: Document;
  storage?: Storage | null;
  storageKey?: string;
};

export type ThemeProviderProps = ParentProps<
  CreateThemeStoreOptions & {
    document?: Document;
    storage?: Storage | null;
    store?: ThemeStore;
    theme?: ThemeMode;
  }
>;

const defaultStorageKey = "keystone-ui-theme";
const defaultTheme: ThemeMode = "system";
const themeModes: readonly ThemeMode[] = ["light", "dark", "system"];
const ThemeStoreContext = createContext<ThemeStore>();

function resolveTheme(theme: ThemeMode, systemTheme: ResolvedTheme): ResolvedTheme {
  return theme === "system" ? systemTheme : theme;
}

function getSystemTheme(ownerDocument: Document | undefined): ResolvedTheme {
  const view = ownerDocument?.defaultView;
  if (!view?.matchMedia) return "light";
  return view.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(storage: Storage | null | undefined, key: string): ThemeMode | undefined {
  const value = storage?.getItem(key);
  return value === "light" || value === "dark" || value === "system" ? value : undefined;
}

function withoutThemeTransition(ownerDocument: Document, callback: () => void) {
  const style = ownerDocument.createElement("style");
  style.appendChild(
    ownerDocument.createTextNode("*{transition:none!important;animation:none!important}"),
  );
  ownerDocument.head.appendChild(style);
  callback();
  ownerDocument.defaultView?.requestAnimationFrame(() => style.remove());
}

export function createThemeStore(options: CreateThemeStoreOptions = {}): ThemeStore {
  const initialTheme = options.defaultTheme ?? defaultTheme;
  const initialSystemTheme: ResolvedTheme = "light";
  const store = createStore<ThemeStoreState>({
    mounted: false,
    resolvedTheme: resolveTheme(initialTheme, initialSystemTheme),
    systemTheme: initialSystemTheme,
    theme: initialTheme,
  });
  const theme = useSelector(store, (state) => state.theme);
  const systemTheme = useSelector(store, (state) => state.systemTheme);
  const resolvedTheme = useSelector(store, (state) => state.resolvedTheme);

  const setTheme = (
    nextTheme: ThemeMode,
    detail: ThemeChangeDetail = { reason: "programmatic" },
  ) => {
    store.setState((state) => ({
      ...state,
      resolvedTheme: resolveTheme(nextTheme, state.systemTheme),
      theme: nextTheme,
    }));
    options.onThemeChange?.(nextTheme, detail);
  };

  const setSystemTheme = (
    nextSystemTheme: ResolvedTheme,
    detail: ThemeChangeDetail = { reason: "system" },
  ) => {
    store.setState((state) => ({
      ...state,
      resolvedTheme: resolveTheme(state.theme, nextSystemTheme),
      systemTheme: nextSystemTheme,
    }));

    if (theme() === "system") {
      options.onThemeChange?.("system", detail);
    }
  };

  const applyTheme = (target?: Document | HTMLElement | null) => {
    const attribute = options.attribute ?? "class";
    const ownerDocument =
      target && "documentElement" in target
        ? target
        : (target?.ownerDocument ?? globalThis.document);
    const element = target && "classList" in target ? target : ownerDocument?.documentElement;
    if (!element || !ownerDocument) return;

    const apply = () => {
      if (attribute === "class") {
        element.classList.remove("light", "dark");
        element.classList.add(resolvedTheme());
      } else {
        element.setAttribute("data-theme", resolvedTheme());
      }
      element.setAttribute("data-ui-theme", theme());
      element.setAttribute("data-ui-resolved-theme", resolvedTheme());
      (element as HTMLElement).style.colorScheme = resolvedTheme();
    };

    if (options.disableTransitionOnChange) {
      withoutThemeTransition(ownerDocument, apply);
      return;
    }

    apply();
  };

  return {
    store,
    applyTheme,
    cycleTheme: (themes = themeModes) => {
      const index = themes.indexOf(theme());
      const nextTheme = themes[(index + 1) % themes.length] ?? defaultTheme;
      setTheme(nextTheme);
      return nextTheme;
    },
    resolvedTheme,
    setMounted: (mounted) => store.setState((state) => ({ ...state, mounted })),
    setSystemTheme,
    setTheme,
    systemTheme,
    theme,
  };
}

export function mountThemeStore(store: ThemeStore, options: MountThemeStoreOptions = {}) {
  const ownerDocument = options.document ?? globalThis.document;
  const storage = options.storage ?? ownerDocument?.defaultView?.localStorage ?? null;
  const storageKey = options.storageKey ?? defaultStorageKey;
  const mediaQuery = ownerDocument?.defaultView?.matchMedia?.("(prefers-color-scheme: dark)");

  store.setMounted(true);
  store.setSystemTheme(getSystemTheme(ownerDocument), { reason: "system" });

  const storedTheme = readStoredTheme(storage, storageKey);
  if (storedTheme) {
    store.setTheme(storedTheme, { reason: "storage" });
  }

  const onChange = () => {
    store.setSystemTheme(mediaQuery?.matches ? "dark" : "light", { reason: "system" });
    store.applyTheme(ownerDocument);
  };

  mediaQuery?.addEventListener?.("change", onChange);
  const unsubscribe = store.store.subscribe(() => {
    storage?.setItem(storageKey, store.theme());
  });
  store.applyTheme(ownerDocument);

  return () => {
    unsubscribe.unsubscribe();
    mediaQuery?.removeEventListener?.("change", onChange);
    store.setMounted(false);
  };
}

export function ThemeProvider(props: ThemeProviderProps) {
  const [local, options] = splitProps(props, [
    "children",
    "document",
    "storage",
    "storageKey",
    "store",
    "theme",
  ]);
  const themeStore = local.store ?? createThemeStore({ ...options, storageKey: local.storageKey });

  createEffect(() => {
    if (local.theme) {
      themeStore.setTheme(local.theme, { reason: "controlled" });
    }
  });

  createEffect(() => {
    themeStore.applyTheme(local.document);
  });

  onMount(() => {
    const cleanup = mountThemeStore(themeStore, {
      document: local.document,
      storage: local.storage,
      storageKey: local.storageKey,
    });
    onCleanup(cleanup);
  });

  return (
    <ThemeStoreContext.Provider value={themeStore}>{local.children}</ThemeStoreContext.Provider>
  );
}

export function useThemeStore() {
  const context = useContext(ThemeStoreContext);
  if (!context) {
    throw new Error("useThemeStore must be used within a ThemeProvider.");
  }
  return context;
}

export function ThemeScript(props: { defaultTheme?: ThemeMode; storageKey?: string }): JSX.Element {
  const storageKey = props.storageKey ?? defaultStorageKey;
  const fallback = props.defaultTheme ?? defaultTheme;
  return (
    <script
      innerHTML={`try{var t=localStorage.getItem(${JSON.stringify(storageKey)})||${JSON.stringify(
        fallback,
      )};var s=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var r=t==="system"?s:t;document.documentElement.classList.remove("light","dark");document.documentElement.classList.add(r);document.documentElement.dataset.uiTheme=t;document.documentElement.dataset.uiResolvedTheme=r;document.documentElement.style.colorScheme=r}catch{}`}
    />
  );
}
