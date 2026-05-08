import { createStore, useSelector, type Store } from "@tanstack/solid-store";
import {
  createContext,
  createEffect,
  onCleanup,
  onMount,
  splitProps,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";

export type SidebarState = "collapsed" | "expanded";
export type SidebarChangeReason =
  | "controlled"
  | "keyboard"
  | "media"
  | "programmatic"
  | "storage"
  | "trigger";

export type SidebarChangeDetail = {
  reason: SidebarChangeReason;
};

export type SidebarStoreState = {
  activeItemId?: string;
  isMobile: boolean;
  mounted: boolean;
  open: boolean;
  openMobile: boolean;
};

export type SidebarStore = {
  activeItemId: Accessor<string | undefined>;
  collapse: () => void;
  expand: () => void;
  isMobile: Accessor<boolean>;
  mounted: Accessor<boolean>;
  open: Accessor<boolean>;
  openMobile: Accessor<boolean>;
  setActiveItemId: (itemId: string | undefined) => void;
  setIsMobile: (isMobile: boolean, detail?: SidebarChangeDetail) => void;
  setMounted: (mounted: boolean) => void;
  setOpen: (open: boolean, detail?: SidebarChangeDetail) => void;
  setOpenMobile: (open: boolean, detail?: SidebarChangeDetail) => void;
  state: Accessor<SidebarState>;
  store: Store<SidebarStoreState>;
  toggle: (detail?: SidebarChangeDetail) => void;
};

export type CreateSidebarStoreOptions = {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, detail: SidebarChangeDetail) => void;
  onOpenMobileChange?: (open: boolean, detail: SidebarChangeDetail) => void;
};

export type MountSidebarStoreOptions = {
  document?: Document;
  keyboardShortcut?: string | false;
  mediaQuery?: string;
  storage?: Storage | null;
  storageKey?: string;
};

export type SidebarProviderProps = ParentProps<
  CreateSidebarStoreOptions &
    MountSidebarStoreOptions & {
      open?: boolean;
      store?: SidebarStore;
    }
>;

const defaultStorageKey = "keystone-ui-sidebar-open";
const defaultMediaQuery = "(max-width: 767px)";
const defaultKeyboardShortcut = "b";
const SidebarStoreContext = createContext<SidebarStore>();

function readStoredOpen(storage: Storage | null | undefined, storageKey: string) {
  const value = storage?.getItem(storageKey);
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function writeStoredOpen(storage: Storage | null | undefined, storageKey: string, open: boolean) {
  storage?.setItem(storageKey, String(open));
}

export function createSidebarStore(options: CreateSidebarStoreOptions = {}): SidebarStore {
  const store = createStore<SidebarStoreState>({
    activeItemId: undefined,
    isMobile: false,
    mounted: false,
    open: options.defaultOpen ?? true,
    openMobile: false,
  });
  const open = useSelector(store, (state) => state.open);
  const openMobile = useSelector(store, (state) => state.openMobile);
  const isMobile = useSelector(store, (state) => state.isMobile);
  const mounted = useSelector(store, (state) => state.mounted);
  const activeItemId = useSelector(store, (state) => state.activeItemId);
  const state = useSelector(store, (nextState) => (nextState.open ? "expanded" : "collapsed"));

  const setOpen = (nextOpen: boolean, detail: SidebarChangeDetail = { reason: "programmatic" }) => {
    store.setState((current) => ({ ...current, open: nextOpen }));
    options.onOpenChange?.(nextOpen, detail);
  };

  const setOpenMobile = (
    nextOpen: boolean,
    detail: SidebarChangeDetail = { reason: "programmatic" },
  ) => {
    store.setState((current) => ({ ...current, openMobile: nextOpen }));
    options.onOpenMobileChange?.(nextOpen, detail);
  };

  return {
    activeItemId,
    collapse: () => setOpen(false),
    expand: () => setOpen(true),
    isMobile,
    mounted,
    open,
    openMobile,
    setActiveItemId: (activeItemId) => store.setState((current) => ({ ...current, activeItemId })),
    setIsMobile: (nextIsMobile, detail = { reason: "media" }) => {
      store.setState((current) => ({
        ...current,
        isMobile: nextIsMobile,
        openMobile: nextIsMobile ? current.openMobile : false,
      }));

      if (!nextIsMobile) {
        options.onOpenMobileChange?.(false, detail);
      }
    },
    setMounted: (mounted) => store.setState((current) => ({ ...current, mounted })),
    setOpen,
    setOpenMobile,
    state,
    store,
    toggle: (detail = { reason: "trigger" }) => {
      if (isMobile()) {
        setOpenMobile(!openMobile(), detail);
        return;
      }

      setOpen(!open(), detail);
    },
  };
}

export function mountSidebarStore(store: SidebarStore, options: MountSidebarStoreOptions = {}) {
  const ownerDocument = options.document ?? globalThis.document;
  const view = ownerDocument?.defaultView;
  const storage = options.storage ?? view?.localStorage ?? null;
  const storageKey = options.storageKey ?? defaultStorageKey;
  const mediaQuery = view?.matchMedia?.(options.mediaQuery ?? defaultMediaQuery);
  const keyboardShortcut = options.keyboardShortcut ?? defaultKeyboardShortcut;

  store.setMounted(true);

  const storedOpen = readStoredOpen(storage, storageKey);
  if (storedOpen !== undefined) {
    store.setOpen(storedOpen, { reason: "storage" });
  }

  const syncMedia = () => {
    store.setIsMobile(mediaQuery?.matches ?? false, { reason: "media" });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!keyboardShortcut) return;
    if (event.key.toLowerCase() !== keyboardShortcut.toLowerCase()) return;
    if (!event.metaKey && !event.ctrlKey) return;
    event.preventDefault();
    store.toggle({ reason: "keyboard" });
  };

  const unsubscribe = store.store.subscribe(() => {
    writeStoredOpen(storage, storageKey, store.open());
  });

  syncMedia();
  mediaQuery?.addEventListener?.("change", syncMedia);
  ownerDocument?.addEventListener("keydown", onKeyDown);

  return () => {
    unsubscribe.unsubscribe();
    mediaQuery?.removeEventListener?.("change", syncMedia);
    ownerDocument?.removeEventListener("keydown", onKeyDown);
    store.setMounted(false);
  };
}

export function SidebarProvider(props: SidebarProviderProps) {
  const [local, options] = splitProps(props, [
    "children",
    "document",
    "keyboardShortcut",
    "mediaQuery",
    "open",
    "storage",
    "storageKey",
    "store",
  ]);
  const sidebarStore = local.store ?? createSidebarStore(options);

  createEffect(() => {
    if (local.open !== undefined) {
      sidebarStore.setOpen(local.open, { reason: "controlled" });
    }
  });

  onMount(() => {
    const cleanup = mountSidebarStore(sidebarStore, {
      document: local.document,
      keyboardShortcut: local.keyboardShortcut,
      mediaQuery: local.mediaQuery,
      storage: local.storage,
      storageKey: local.storageKey,
    });
    onCleanup(cleanup);
  });

  return (
    <SidebarStoreContext.Provider value={sidebarStore}>
      {local.children}
    </SidebarStoreContext.Provider>
  );
}

export function useSidebarStore() {
  const context = useContext(SidebarStoreContext);
  if (!context) {
    throw new Error("useSidebarStore must be used within a SidebarProvider.");
  }
  return context;
}
