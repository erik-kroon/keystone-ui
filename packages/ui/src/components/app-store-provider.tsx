import { createStore, useSelector, type Store } from "@tanstack/solid-store";
import {
  createContext,
  onCleanup,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
  type ParentProps,
} from "solid-js";
import { cn } from "@/lib/cn";

export type AppStoreTheme = "light" | "dark" | "system";

export type AppStoreCommandMenuState = {
  open: boolean;
  query: string;
  lastSelectedValue?: string;
};

export type AppStoreCommandGroup = {
  id: string;
  label: string;
  description?: string;
  scope?: string;
};

export type AppStoreShortcutPreference = {
  id: string;
  enabled: boolean;
  label?: string;
  scope?: string;
};

export type AppStoreShellState = {
  sidebarOpen: boolean;
  theme: AppStoreTheme;
};

export type AppStoreState = {
  commandMenu: AppStoreCommandMenuState;
  commandGroups: Record<string, AppStoreCommandGroup>;
  shortcutPreferences: Record<string, AppStoreShortcutPreference>;
  shortcutScope?: string;
  shell: AppStoreShellState;
  workspace: Record<string, unknown>;
};

export type AppStoreChangeDetail = {
  previous: AppStoreState;
  next: AppStoreState;
};

export type AppStoreApi = {
  store: Store<AppStoreState>;
  closeCommandMenu: () => void;
  openCommandMenu: () => void;
  registerCommandGroup: (group: AppStoreCommandGroup) => void;
  removeShortcutPreference: (id: string) => void;
  resetCommandQuery: () => void;
  resetWorkspaceValue: (key: string) => void;
  selectCommandValue: (value: string) => void;
  setCommandMenuOpen: (open: boolean) => void;
  setCommandQuery: (query: string) => void;
  setShortcutPreference: (preference: AppStoreShortcutPreference) => void;
  setShortcutScope: (scope: string | undefined) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: AppStoreTheme) => void;
  setWorkspaceValue: (key: string, value: unknown) => void;
  toggleCommandMenu: () => void;
  toggleSidebar: () => void;
  unregisterCommandGroup: (id: string) => void;
};

export type CreateAppStoreOptions = {
  initialState?: PartialAppStoreState;
  store?: Store<AppStoreState>;
};

export type AppStoreProviderProps = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "onChange">
> & {
  initialState?: PartialAppStoreState;
  onStateChange?: (detail: AppStoreChangeDetail) => void;
  store?: AppStoreApi | Store<AppStoreState>;
};

export type PartialAppStoreState = {
  commandMenu?: Partial<AppStoreCommandMenuState>;
  commandGroups?: Record<string, AppStoreCommandGroup>;
  shortcutPreferences?: Record<string, AppStoreShortcutPreference>;
  shortcutScope?: string;
  shell?: Partial<AppStoreShellState>;
  workspace?: Record<string, unknown>;
};

export type AppStoreSelectorOptions<TSelected> = {
  compare?: (a: TSelected, b: TSelected) => boolean;
};

const AppStoreContext = createContext<AppStoreApi>();

const defaultState: AppStoreState = {
  commandMenu: {
    open: false,
    query: "",
  },
  commandGroups: {},
  shortcutPreferences: {},
  shell: {
    sidebarOpen: true,
    theme: "system",
  },
  workspace: {},
};

export function createAppStore(options: CreateAppStoreOptions = {}): AppStoreApi {
  const store =
    options.store ?? createStore<AppStoreState>(mergeAppStoreState(options.initialState));

  const update = (updater: (state: AppStoreState) => AppStoreState) => {
    store.setState(updater);
  };

  const setCommandMenuOpen = (open: boolean) => {
    update((state) => ({
      ...state,
      commandMenu: {
        ...state.commandMenu,
        open,
      },
    }));
  };

  const setCommandQuery = (query: string) => {
    update((state) => ({
      ...state,
      commandMenu: {
        ...state.commandMenu,
        query,
      },
    }));
  };

  const setSidebarOpen = (open: boolean) => {
    update((state) => ({
      ...state,
      shell: {
        ...state.shell,
        sidebarOpen: open,
      },
    }));
  };

  return {
    store,
    closeCommandMenu: () => setCommandMenuOpen(false),
    openCommandMenu: () => setCommandMenuOpen(true),
    registerCommandGroup: (group) => {
      update((state) => ({
        ...state,
        commandGroups: {
          ...state.commandGroups,
          [group.id]: group,
        },
      }));
    },
    removeShortcutPreference: (id) => {
      update((state) => {
        const { [id]: _removed, ...shortcutPreferences } = state.shortcutPreferences;
        return {
          ...state,
          shortcutPreferences,
        };
      });
    },
    resetCommandQuery: () => setCommandQuery(""),
    resetWorkspaceValue: (key) => {
      update((state) => {
        const { [key]: _removed, ...workspace } = state.workspace;
        return {
          ...state,
          workspace,
        };
      });
    },
    selectCommandValue: (value) => {
      update((state) => ({
        ...state,
        commandMenu: {
          ...state.commandMenu,
          lastSelectedValue: value,
        },
      }));
    },
    setCommandMenuOpen,
    setCommandQuery,
    setShortcutPreference: (preference) => {
      update((state) => ({
        ...state,
        shortcutPreferences: {
          ...state.shortcutPreferences,
          [preference.id]: preference,
        },
      }));
    },
    setShortcutScope: (scope) => {
      update((state) => ({
        ...state,
        shortcutScope: scope,
      }));
    },
    setSidebarOpen,
    setTheme: (theme) => {
      update((state) => ({
        ...state,
        shell: {
          ...state.shell,
          theme,
        },
      }));
    },
    setWorkspaceValue: (key, value) => {
      update((state) => ({
        ...state,
        workspace: {
          ...state.workspace,
          [key]: value,
        },
      }));
    },
    toggleCommandMenu: () => {
      update((state) => ({
        ...state,
        commandMenu: {
          ...state.commandMenu,
          open: !state.commandMenu.open,
        },
      }));
    },
    toggleSidebar: () => {
      update((state) => ({
        ...state,
        shell: {
          ...state.shell,
          sidebarOpen: !state.shell.sidebarOpen,
        },
      }));
    },
    unregisterCommandGroup: (id) => {
      update((state) => {
        const { [id]: _removed, ...commandGroups } = state.commandGroups;
        return {
          ...state,
          commandGroups,
        };
      });
    },
  };
}

export function useAppStore() {
  return useContext(AppStoreContext);
}

export function useRequiredAppStore() {
  const appStore = useAppStore();

  if (!appStore) {
    throw new Error("AppStoreProvider is required before calling useRequiredAppStore.");
  }

  return appStore;
}

export function useAppStoreSelector<TSelected>(
  selector: (state: AppStoreState) => TSelected,
  options?: AppStoreSelectorOptions<TSelected>,
): Accessor<TSelected | undefined> {
  const appStore = useAppStore();

  if (!appStore) {
    return () => undefined;
  }

  return useSelector(appStore.store, selector, options);
}

export function AppStoreProvider(props: AppStoreProviderProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "initialState",
    "onStateChange",
    "store",
  ]);
  const appStore = normalizeAppStore(local.store, local.initialState);

  if (local.onStateChange) {
    let previous = appStore.store.get();
    const subscription = appStore.store.subscribe((next) => {
      local.onStateChange?.({ previous, next });
      previous = next;
    });

    onCleanup(() => subscription.unsubscribe());
  }

  return (
    <AppStoreContext.Provider value={appStore}>
      <div
        {...rest}
        data-scope="ui-app-store"
        data-part="provider"
        data-slot="app-store-provider"
        class={cn("ui-app-store-provider", local.class)}
      >
        {local.children}
      </div>
    </AppStoreContext.Provider>
  );
}

function normalizeAppStore(
  store: AppStoreProviderProps["store"],
  initialState: PartialAppStoreState | undefined,
) {
  if (!store) {
    return createAppStore({ initialState });
  }

  if ("store" in store) {
    return store;
  }

  return createAppStore({ store });
}

function mergeAppStoreState(initialState: PartialAppStoreState | undefined): AppStoreState {
  return {
    commandMenu: {
      ...defaultState.commandMenu,
      ...initialState?.commandMenu,
    },
    commandGroups: {
      ...defaultState.commandGroups,
      ...initialState?.commandGroups,
    },
    shortcutPreferences: {
      ...defaultState.shortcutPreferences,
      ...initialState?.shortcutPreferences,
    },
    shortcutScope: initialState?.shortcutScope,
    shell: {
      ...defaultState.shell,
      ...initialState?.shell,
    },
    workspace: {
      ...defaultState.workspace,
      ...initialState?.workspace,
    },
  };
}
