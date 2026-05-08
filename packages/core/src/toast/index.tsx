import {
  For,
  Show,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  splitProps,
  untrack,
  useContext,
  type Accessor,
  type JSX,
  type Setter,
} from "solid-js";
import { getPartDataAttributes } from "../metadata/index";
import {
  composeEventHandlers,
  createStableId,
  dataBoolean,
  renderPolymorphic,
  type PolymorphicProps,
} from "../utils/index";

export type ToastType = "default" | "success" | "info" | "warning" | "error" | "loading";
export type ToastPriority = "polite" | "assertive";
export type ToastStatus = "open" | "closed";

export type ToastAction = {
  closeOnClick?: boolean;
  label: JSX.Element;
  onClick?: (toast: ToastData, event: MouseEvent) => void;
};

export type ToastInput = {
  action?: ToastAction;
  description?: JSX.Element;
  dismissible?: boolean;
  duration?: number;
  id?: string;
  priority?: ToastPriority;
  region?: string;
  title?: JSX.Element;
  type?: ToastType;
};

export type ToastData = Required<
  Pick<ToastInput, "dismissible" | "duration" | "priority" | "type">
> &
  Omit<ToastInput, "dismissible" | "duration" | "priority" | "type"> & {
    id: string;
    status: ToastStatus;
  };

export type ToastPromiseSource<T> = Promise<T> | (() => Promise<T>);
export type ToastPromiseResult<T> =
  | JSX.Element
  | ToastInput
  | ((value: T) => JSX.Element | ToastInput | Promise<JSX.Element | ToastInput>);
export type ToastPromiseInput<T = unknown> = Omit<ToastInput, "description" | "type"> & {
  description?: JSX.Element | ((value: T | unknown) => JSX.Element | Promise<JSX.Element>);
  error?: ToastPromiseResult<unknown>;
  loading?: JSX.Element | ToastInput;
  success?: ToastPromiseResult<T>;
  finally?: () => void | Promise<void>;
};

export type ToastRenderInfo = {
  count: number;
  frontIndex: number;
  index: number;
  isFront: boolean;
  toasts: readonly ToastData[];
};

export type ToastManager = {
  (toast: ToastInput | JSX.Element): string;
  add: (toast: ToastInput | JSX.Element) => string;
  clear: () => void;
  custom: (toast: ToastInput | JSX.Element) => string;
  dismiss: (id?: string) => void;
  error: (toast: ToastInput | JSX.Element) => string;
  getToasts: () => readonly ToastData[];
  info: (toast: ToastInput | JSX.Element) => string;
  loading: (toast: ToastInput | JSX.Element) => string;
  message: (toast: ToastInput | JSX.Element) => string;
  promise: <T>(promise: ToastPromiseSource<T>, toast: ToastPromiseInput<T>) => string | undefined;
  subscribe: (listener: ToastManagerListener) => () => void;
  success: (toast: ToastInput | JSX.Element) => string;
  update: (id: string, toast: Partial<ToastInput>) => void;
  warning: (toast: ToastInput | JSX.Element) => string;
};

export type ToastManagerListener = (toasts: readonly ToastData[]) => void;

export type ToastProviderProps = {
  children?: JSX.Element;
  duration?: number;
  exitDuration?: number;
  limit?: number;
  manager?: ToastManager;
  pauseOnPageIdle?: boolean;
};

export type ToastViewportProps = Omit<JSX.HTMLAttributes<HTMLOListElement>, "children" | "ref"> & {
  children?: JSX.Element | ((toast: ToastData, info: ToastRenderInfo) => JSX.Element);
  hotkey?: false | string[];
  label?: string;
  ref?: HTMLOListElement | ((element: HTMLOListElement) => void);
  region?: string;
};

export type ToastPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type ToastRootProps = ToastPartProps<HTMLLIElement> &
  PolymorphicProps<HTMLLIElement> &
  Omit<JSX.LiHTMLAttributes<HTMLLIElement>, "children" | "ref"> & {
    toast?: ToastData;
  };
export type ToastTitleProps = ToastPartProps<HTMLDivElement> &
  PolymorphicProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type ToastDescriptionProps = ToastPartProps<HTMLDivElement> &
  PolymorphicProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type ToastActionProps = ToastPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type ToastCloseProps = ToastPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;

export type CreateToastManagerOptions = {
  duration?: number;
};

type ToastProviderContextValue = {
  dismiss: (id?: string) => void;
  duration: Accessor<number>;
  limit: Accessor<number | undefined>;
  manager: ToastManager;
  pause: (id?: string) => void;
  resume: (id?: string) => void;
  toasts: Accessor<readonly ToastData[]>;
};

type ToastContextValue = {
  toast: Accessor<ToastData>;
};

type ToastViewportEntry = {
  id: string;
  info: Accessor<ToastRenderInfo>;
  infoProxy: ToastRenderInfo;
  setInfo: Setter<ToastRenderInfo>;
  setToast: Setter<ToastData>;
  toast: Accessor<ToastData>;
  toastProxy: ToastData;
};

const defaultDuration = 5000;
const ToastProviderContext = createContext<ToastProviderContextValue>();
const ToastContext = createContext<ToastContextValue>();
const defaultToastManager = createToastManager();

let toastId = 0;

export function createToastManager(options: CreateToastManagerOptions = {}): ToastManager {
  const listeners = new Set<ToastManagerListener>();
  let toasts: ToastData[] = [];

  const emit = () => {
    const snapshot = [...toasts];
    for (const listener of listeners) {
      listener(snapshot);
    }
  };

  const normalize = (input: ToastInput | JSX.Element): ToastData => {
    const toast = toToastInput(input);
    const id = toast.id ?? `toast-${++toastId}`;
    return {
      dismissible: toast.dismissible ?? true,
      duration: toast.duration ?? options.duration ?? defaultDuration,
      id,
      priority: toast.priority ?? "polite",
      status: "open",
      type: toast.type ?? "default",
      ...toast,
    };
  };

  const addTypedToast = (type: ToastType, input: ToastInput | JSX.Element) => {
    const toast = { ...toToastInput(input), type };

    return manager.add(toast);
  };
  const manager = ((input: ToastInput | JSX.Element) => manager.add(input)) as ToastManager;

  manager.add = (input) => {
    const next = normalize(input);
    const index = toasts.findIndex((toast) => toast.id === next.id);
    if (index >= 0) {
      toasts = toasts.map((toast) => (toast.id === next.id ? { ...toast, ...next } : toast));
    } else {
      toasts = [...toasts, next];
    }
    emit();
    return next.id;
  };
  manager.clear = () => {
    toasts = [];
    emit();
  };
  manager.custom = (input) => manager.add(input);
  manager.dismiss = (id) => {
    toasts = id ? toasts.filter((toast) => toast.id !== id) : [];
    emit();
  };
  manager.error = (input) => addTypedToast("error", input);
  manager.getToasts = () => [...toasts];
  manager.info = (input) => addTypedToast("info", input);
  manager.loading = (input) => addTypedToast("loading", input);
  manager.message = (input) => manager.add(input);
  manager.promise = (promise, toast) => {
    let id =
      toast.loading === undefined
        ? toast.id
        : manager.loading({ ...toToastInput(toast.loading), id: toast.id });

    void resolveToastPromise(promise)
      .then(async (value) => {
        if (toast.success === undefined) {
          if (id) {
            manager.dismiss(id);
          }
          return;
        }

        const next = await resolvePromiseResult(toast.success, value);
        const description = await resolvePromiseDescription(toast.description, value);
        id = upsertPromiseToast(manager, id, "success", next, description);
      })
      .catch(async (error: unknown) => {
        if (toast.error === undefined) {
          if (id) {
            manager.dismiss(id);
          }
          return;
        }

        const next = await resolvePromiseResult(toast.error, error);
        const description = await resolvePromiseDescription(toast.description, error);
        id = upsertPromiseToast(manager, id, "error", next, description);
      })
      .finally(() => {
        void toast.finally?.();
      });

    return id;
  };
  manager.subscribe = (listener) => {
    listeners.add(listener);
    listener([...toasts]);
    return () => listeners.delete(listener);
  };
  manager.success = (input) => addTypedToast("success", input);
  manager.update = (id, toast) => {
    toasts = toasts.map((current) =>
      current.id === id ? { ...current, ...toast, id, status: "open" } : current,
    );
    emit();
  };
  manager.warning = (input) => addTypedToast("warning", input);

  return manager;
}

export const toaster = defaultToastManager;

export function ToastProvider(props: ToastProviderProps) {
  const [sourceToasts, setSourceToasts] = createSignal<readonly ToastData[]>([]);
  const [renderedToasts, setRenderedToasts] = createSignal<readonly ToastData[]>([]);
  const manager = createMemo(() => props.manager ?? defaultToastManager);
  const duration = createMemo(() => props.duration ?? defaultDuration);
  const exitDuration = createMemo(() => Math.max(0, props.exitDuration ?? 0));
  const limit = createMemo(() => props.limit);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const exitTimers = new Map<string, ReturnType<typeof setTimeout>>();
  const scheduledToasts = new Map<string, ToastData>();
  const paused = new Set<string>();

  const clearTimer = (id: string) => {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
    scheduledToasts.delete(id);
  };
  const clearExitTimer = (id: string) => {
    const timer = exitTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      exitTimers.delete(id);
    }
  };
  const scheduleExitRemoval = (id: string, timeout: number) => {
    clearExitTimer(id);
    if (timeout <= 0) {
      return;
    }
    exitTimers.set(
      id,
      setTimeout(() => {
        exitTimers.delete(id);
        setRenderedToasts((current) => current.filter((toast) => toast.id !== id));
      }, timeout),
    );
  };
  const syncRenderedToasts = (nextSource: readonly ToastData[]) => {
    const timeout = exitDuration();
    const sourceById = new Map(nextSource.map((toast) => [toast.id, toast]));
    const currentIds = new Set<string>();

    setRenderedToasts((current) => {
      const next: ToastData[] = [];

      for (const toast of current) {
        currentIds.add(toast.id);
        const sourceToast = sourceById.get(toast.id);

        if (sourceToast) {
          clearExitTimer(toast.id);
          next.push(sourceToast);
          continue;
        }

        if (toast.status === "closed" && exitTimers.has(toast.id)) {
          next.push(toast);
          continue;
        }

        if (timeout > 0) {
          const closingToast: ToastData = { ...toast, status: "closed" };
          scheduleExitRemoval(toast.id, timeout);
          next.push(closingToast);
        }
      }

      for (const toast of nextSource) {
        if (!currentIds.has(toast.id)) {
          next.push(toast);
        }
      }

      return next;
    });
  };

  const schedule = (toast: ToastData) => {
    clearTimer(toast.id);
    const timeout = toast.duration ?? duration();
    const pageIdlePaused =
      props.pauseOnPageIdle !== false && typeof document !== "undefined" && document.hidden;
    if (timeout <= 0 || !Number.isFinite(timeout) || paused.has(toast.id) || pageIdlePaused) {
      return;
    }
    timers.set(
      toast.id,
      setTimeout(() => {
        manager().dismiss(toast.id);
      }, timeout),
    );
    scheduledToasts.set(toast.id, toast);
  };

  const pause = (id?: string) => {
    const ids = id ? [id] : sourceToasts().map((toast) => toast.id);
    for (const toastId of ids) {
      paused.add(toastId);
      clearTimer(toastId);
    }
  };

  const resume = (id?: string) => {
    const ids = id ? [id] : sourceToasts().map((toast) => toast.id);
    for (const toastId of ids) {
      paused.delete(toastId);
      const toast = sourceToasts().find((candidate) => candidate.id === toastId);
      if (toast) {
        schedule(toast);
      }
    }
  };

  createEffect(() => {
    const unsubscribe = manager().subscribe((next) => {
      setSourceToasts(next);
      syncRenderedToasts(next);
    });
    onCleanup(unsubscribe);
  });

  createEffect(() => {
    if (props.pauseOnPageIdle === false || typeof document === "undefined") {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pause();
      } else {
        resume();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    onCleanup(() => document.removeEventListener("visibilitychange", handleVisibilityChange));
  });

  createEffect(() => {
    const current = sourceToasts();
    const ids = new Set(current.map((toast) => toast.id));
    for (const id of timers.keys()) {
      if (!ids.has(id)) {
        clearTimer(id);
      }
    }
    for (const toast of current) {
      if (scheduledToasts.get(toast.id) !== toast) {
        schedule(toast);
      }
    }
  });

  onCleanup(() => {
    for (const id of timers.keys()) {
      clearTimer(id);
    }
    for (const id of exitTimers.keys()) {
      clearExitTimer(id);
    }
  });

  const context: ToastProviderContextValue = {
    dismiss: (id) => manager().dismiss(id),
    duration,
    limit,
    manager: manager(),
    pause,
    resume,
    toasts: renderedToasts,
  };

  return (
    <ToastProviderContext.Provider value={context}>{props.children}</ToastProviderContext.Provider>
  );
}

export function ToastViewport(props: ToastViewportProps) {
  const context = useToastProviderContext("Toast.Viewport");
  const [local, rest] = splitProps(props, [
    "children",
    "hotkey",
    "label",
    "onFocusIn",
    "onFocusOut",
    "onMouseEnter",
    "onMouseLeave",
    "ref",
    "region",
  ]);
  let viewportElement: HTMLOListElement | undefined;
  const visibleToasts = createMemo(() => {
    const filtered = context
      .toasts()
      .filter((toast) => (local.region ? toast.region === local.region : true));
    const limit = context.limit();
    return limit ? filtered.slice(-limit) : filtered;
  });
  const entries = new Map<string, ToastViewportEntry>();
  const visibleEntries = createMemo(() => {
    const toasts = visibleToasts();
    const visibleIds = new Set<string>();

    const nextEntries = toasts.map((toast, index) => {
      visibleIds.add(toast.id);
      const info = getToastRenderInfo(toasts, index);
      let entry = entries.get(toast.id);

      if (!entry) {
        entry = createToastViewportEntry(toast, info);
        entries.set(toast.id, entry);
      } else {
        entry.setToast(toast);
        entry.setInfo(info);
      }

      return entry;
    });

    for (const id of entries.keys()) {
      if (!visibleIds.has(id)) {
        entries.delete(id);
      }
    }

    return nextEntries;
  });
  const setViewportRef = (element: HTMLOListElement) => {
    viewportElement = element;
    if (typeof local.ref === "function") {
      local.ref(element);
    }
  };

  createEffect(() => {
    if (local.hotkey === false || typeof document === "undefined") {
      return;
    }

    const hotkey = local.hotkey ?? ["altKey", "KeyT"];
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isHotkeyPressed(event, hotkey)) {
        return;
      }

      event.preventDefault();
      viewportElement?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  return (
    <ol
      {...rest}
      {...getPartDataAttributes("toast", "viewport")}
      aria-label={local.label ?? "Notifications"}
      ref={setViewportRef}
      role="region"
      tabindex="-1"
      onFocusIn={composeEventHandlers(local.onFocusIn, () => context.pause())}
      onFocusOut={composeEventHandlers(local.onFocusOut, () => context.resume())}
      onMouseEnter={composeEventHandlers(local.onMouseEnter, () => context.pause())}
      onMouseLeave={composeEventHandlers(local.onMouseLeave, () => context.resume())}
    >
      <For each={visibleEntries()}>
        {(entry) => <ToastViewportEntryView entry={entry} render={local.children} />}
      </For>
    </ol>
  );
}

function ToastViewportEntryView(props: {
  entry: ToastViewportEntry;
  render?: ToastViewportProps["children"];
}) {
  const children = untrack(() =>
    typeof props.render === "function" ? (
      props.render(props.entry.toastProxy, props.entry.infoProxy)
    ) : (
      <ToastRoot>
        <ToastTitle />
        <ToastDescription />
        <ToastAction />
        <ToastClose>Close</ToastClose>
      </ToastRoot>
    ),
  );

  return (
    <ToastContext.Provider value={{ toast: props.entry.toast }}>{children}</ToastContext.Provider>
  );
}

function getToastRenderInfo(toasts: readonly ToastData[], index: number): ToastRenderInfo {
  const frontIndex = toasts.length - index - 1;

  return {
    count: toasts.length,
    frontIndex,
    index,
    isFront: frontIndex === 0,
    toasts,
  };
}

function createToastViewportEntry(toast: ToastData, info: ToastRenderInfo): ToastViewportEntry {
  const [toastValue, setToast] = createSignal(toast);
  const [infoValue, setInfo] = createSignal(info);

  return {
    id: toast.id,
    info: infoValue,
    infoProxy: createReactiveProxy(infoValue),
    setInfo,
    setToast,
    toast: toastValue,
    toastProxy: createReactiveProxy(toastValue),
  };
}

function createReactiveProxy<T extends object>(source: Accessor<T>): T {
  return new Proxy({} as T, {
    get(_target, property, receiver) {
      const value = Reflect.get(source(), property, receiver);
      return typeof value === "function" ? value.bind(source()) : value;
    },
    getOwnPropertyDescriptor(_target, property) {
      const descriptor = Reflect.getOwnPropertyDescriptor(source(), property);

      if (!descriptor) {
        return undefined;
      }

      return { ...descriptor, configurable: true };
    },
    has(_target, property) {
      return property in source();
    },
    ownKeys() {
      return Reflect.ownKeys(source());
    },
  });
}

export function ToastRoot(props: ToastRootProps) {
  const contextToast = useContext(ToastContext);
  const provider = useToastProviderContext("Toast.Root");
  const [local, rest] = splitProps(props, [
    "as",
    "children",
    "id",
    "onFocusIn",
    "onFocusOut",
    "onMouseEnter",
    "onMouseLeave",
    "toast",
  ]);
  const toast = createMemo(() => local.toast ?? contextToast?.toast());
  const titleId = createStableId("toast-title", () => (local.id ? `${local.id}-title` : undefined));
  const descriptionId = createStableId("toast-description", () =>
    local.id ? `${local.id}-description` : undefined,
  );
  const toastContext: ToastContextValue = {
    toast: () => requireToast(toast()),
  };
  const root = renderPolymorphic(
    local.as,
    "li",
    mergeProps(rest, getPartDataAttributes("toast", "root"), {
      get "aria-describedby"() {
        return toast()?.description ? descriptionId() : undefined;
      },
      get "aria-labelledby"() {
        return toast()?.title ? titleId() : undefined;
      },
      get "data-status"() {
        return toast()?.status;
      },
      get "data-type"() {
        return toast()?.type;
      },
      get children() {
        return <ToastContext.Provider value={toastContext}>{local.children}</ToastContext.Provider>;
      },
      get id() {
        return local.id;
      },
      get onFocusIn() {
        return composeEventHandlers(local.onFocusIn, () => provider.pause(toast()?.id));
      },
      get onFocusOut() {
        return composeEventHandlers(local.onFocusOut, () => provider.resume(toast()?.id));
      },
      get onMouseEnter() {
        return composeEventHandlers(local.onMouseEnter, () => provider.pause(toast()?.id));
      },
      get onMouseLeave() {
        return composeEventHandlers(local.onMouseLeave, () => provider.resume(toast()?.id));
      },
      get role() {
        return toast()?.priority === "assertive" ? "alert" : "status";
      },
    }),
  );

  return root;
}

export function ToastTitle(props: ToastTitleProps) {
  const context = useToastContext("Toast.Title");
  const [local, rest] = splitProps(props, ["as", "children"]);
  return (
    <Show when={local.children ?? context.toast().title}>
      {(children) =>
        renderPolymorphic(
          local.as,
          "div",
          mergeProps(rest, getPartDataAttributes("toast", "title"), {
            get children() {
              return children();
            },
          }),
        )
      }
    </Show>
  );
}

export function ToastDescription(props: ToastDescriptionProps) {
  const context = useToastContext("Toast.Description");
  const [local, rest] = splitProps(props, ["as", "children"]);
  return (
    <Show when={local.children ?? context.toast().description}>
      {(children) =>
        renderPolymorphic(
          local.as,
          "div",
          mergeProps(rest, getPartDataAttributes("toast", "description"), {
            get children() {
              return children();
            },
          }),
        )
      }
    </Show>
  );
}

export function ToastAction(props: ToastActionProps) {
  const context = useToastContext("Toast.Action");
  const provider = useToastProviderContext("Toast.Action");
  const [local, rest] = splitProps(props, ["as", "children", "onClick"]);
  const action = createMemo(() => context.toast().action);
  return (
    <Show when={local.children ?? action()?.label}>
      {(children) =>
        renderPolymorphic(
          local.as,
          "button",
          mergeProps({ type: "button" }, rest, getPartDataAttributes("toast", "action"), {
            get children() {
              return children();
            },
            get onClick() {
              return composeEventHandlers(local.onClick, (event: MouseEvent) => {
                action()?.onClick?.(context.toast(), event);
                if (!event.defaultPrevented && action()?.closeOnClick !== false) {
                  provider.dismiss(context.toast().id);
                }
              });
            },
          }),
        )
      }
    </Show>
  );
}

export function ToastClose(props: ToastCloseProps) {
  const context = useToastContext("Toast.Close");
  const provider = useToastProviderContext("Toast.Close");
  const [local, rest] = splitProps(props, ["as", "children", "onClick"]);
  return (
    <Show when={context.toast().dismissible}>
      {renderPolymorphic(local.as, "button", {
        type: "button",
        "aria-label": "Close notification",
        ...rest,
        ...getPartDataAttributes("toast", "close"),
        "data-disabled": dataBoolean(!context.toast().dismissible),
        onClick: composeEventHandlers(local.onClick, () => provider.dismiss(context.toast().id)),
        children: local.children,
      })}
    </Show>
  );
}

export const Toast = {
  Action: ToastAction,
  Close: ToastClose,
  Description: ToastDescription,
  Provider: ToastProvider,
  Root: ToastRoot,
  Title: ToastTitle,
  Viewport: ToastViewport,
};

function useToastProviderContext(component: string): ToastProviderContextValue {
  const context = useContext(ToastProviderContext);
  if (!context) {
    throw new Error(`${component} must be used inside Toast.Provider`);
  }
  return context;
}

function useToastContext(component: string): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(`${component} must be used inside Toast.Root`);
  }
  return context;
}

function requireToast(toast: ToastData | undefined): ToastData {
  if (!toast) {
    throw new Error("Toast.Root requires a toast from Toast.Viewport or the toast prop");
  }
  return toast;
}

function toToastInput(input: ToastInput | JSX.Element): ToastInput {
  return isToastInput(input) ? input : { title: input };
}

function isToastInput(value: ToastInput | JSX.Element): value is ToastInput {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function resolveToastPromise<T>(promise: ToastPromiseSource<T>): Promise<T> {
  return Promise.resolve().then(() => (typeof promise === "function" ? promise() : promise));
}

async function resolvePromiseResult<T>(
  result: ToastPromiseResult<T>,
  value: T,
): Promise<ToastInput> {
  return toToastInput(typeof result === "function" ? await result(value) : result);
}

async function resolvePromiseDescription<T>(
  description: ToastPromiseInput<T>["description"],
  value: T | unknown,
): Promise<JSX.Element | undefined> {
  if (description === undefined) {
    return undefined;
  }

  return typeof description === "function" ? await description(value) : description;
}

function upsertPromiseToast(
  manager: ToastManager,
  id: string | undefined,
  type: ToastType,
  toast: ToastInput,
  description: JSX.Element | undefined,
) {
  const next = {
    ...toast,
    description: toast.description ?? description,
    id: toast.id ?? id,
    type,
  };

  if (id && manager.getToasts().some((toast) => toast.id === id)) {
    manager.update(id, next);
    return id;
  }

  return manager.add(next);
}

function isHotkeyPressed(event: KeyboardEvent, hotkey: string[]) {
  return hotkey.every((key) => {
    const eventValue = (event as unknown as Record<string, unknown>)[key];

    if (typeof eventValue === "boolean") {
      return eventValue;
    }

    return event.code === key || event.key.toLowerCase() === key.toLowerCase();
  });
}
