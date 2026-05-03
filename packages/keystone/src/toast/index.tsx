import {
  For,
  Show,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
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
  label: JSX.Element;
  onClick?: (toast: ToastData) => void;
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

export type ToastManager = {
  add: (toast: ToastInput | JSX.Element) => string;
  clear: () => void;
  dismiss: (id?: string) => void;
  getToasts: () => readonly ToastData[];
  subscribe: (listener: ToastManagerListener) => () => void;
  update: (id: string, toast: Partial<ToastInput>) => void;
};

export type ToastManagerListener = (toasts: readonly ToastData[]) => void;

export type ToastProviderProps = {
  children?: JSX.Element;
  duration?: number;
  limit?: number;
  manager?: ToastManager;
};

export type ToastViewportProps = Omit<JSX.HTMLAttributes<HTMLOListElement>, "children" | "ref"> & {
  children?: JSX.Element | ((toast: ToastData) => JSX.Element);
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
    const toast = isToastInput(input) ? input : { title: input };
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

  return {
    add(input) {
      const next = normalize(input);
      const index = toasts.findIndex((toast) => toast.id === next.id);
      if (index >= 0) {
        toasts = toasts.map((toast) => (toast.id === next.id ? { ...toast, ...next } : toast));
      } else {
        toasts = [...toasts, next];
      }
      emit();
      return next.id;
    },
    clear() {
      toasts = [];
      emit();
    },
    dismiss(id) {
      toasts = id ? toasts.filter((toast) => toast.id !== id) : [];
      emit();
    },
    getToasts() {
      return [...toasts];
    },
    subscribe(listener) {
      listeners.add(listener);
      listener([...toasts]);
      return () => listeners.delete(listener);
    },
    update(id, toast) {
      toasts = toasts.map((current) =>
        current.id === id ? { ...current, ...toast, id, status: "open" } : current,
      );
      emit();
    },
  };
}

export const toaster = defaultToastManager;

export function ToastProvider(props: ToastProviderProps) {
  const [toasts, setToasts] = createSignal<readonly ToastData[]>([]);
  const manager = createMemo(() => props.manager ?? defaultToastManager);
  const duration = createMemo(() => props.duration ?? defaultDuration);
  const limit = createMemo(() => props.limit);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
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

  const schedule = (toast: ToastData) => {
    clearTimer(toast.id);
    const timeout = toast.duration ?? duration();
    if (timeout <= 0 || !Number.isFinite(timeout) || paused.has(toast.id)) {
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

  createEffect(() => {
    const unsubscribe = manager().subscribe((next) => setToasts(next));
    onCleanup(unsubscribe);
  });

  createEffect(() => {
    const current = toasts();
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
  });

  const context: ToastProviderContextValue = {
    dismiss: (id) => manager().dismiss(id),
    duration,
    limit,
    manager: manager(),
    pause: (id) => {
      const ids = id ? [id] : toasts().map((toast) => toast.id);
      for (const toastId of ids) {
        paused.add(toastId);
        clearTimer(toastId);
      }
    },
    resume: (id) => {
      const ids = id ? [id] : toasts().map((toast) => toast.id);
      for (const toastId of ids) {
        paused.delete(toastId);
        const toast = toasts().find((candidate) => candidate.id === toastId);
        if (toast) {
          schedule(toast);
        }
      }
    },
    toasts,
  };

  return (
    <ToastProviderContext.Provider value={context}>{props.children}</ToastProviderContext.Provider>
  );
}

export function ToastViewport(props: ToastViewportProps) {
  const context = useToastProviderContext("Toast.Viewport");
  const [local, rest] = splitProps(props, [
    "children",
    "label",
    "onFocusIn",
    "onFocusOut",
    "onMouseEnter",
    "onMouseLeave",
    "region",
  ]);
  const visibleToasts = createMemo(() => {
    const filtered = context
      .toasts()
      .filter((toast) => (local.region ? toast.region === local.region : true));
    const limit = context.limit();
    return limit ? filtered.slice(-limit) : filtered;
  });

  return (
    <ol
      {...rest}
      {...getPartDataAttributes("toast", "viewport")}
      aria-label={local.label ?? "Notifications"}
      role="region"
      tabindex="-1"
      onFocusIn={composeEventHandlers(local.onFocusIn, () => context.pause())}
      onFocusOut={composeEventHandlers(local.onFocusOut, () => context.resume())}
      onMouseEnter={composeEventHandlers(local.onMouseEnter, () => context.pause())}
      onMouseLeave={composeEventHandlers(local.onMouseLeave, () => context.resume())}
    >
      <For each={visibleToasts()}>
        {(toast) => (
          <ToastContext.Provider value={{ toast: () => toast }}>
            {typeof local.children === "function" ? (
              local.children(toast)
            ) : (
              <ToastRoot>
                <ToastTitle />
                <ToastDescription />
                <ToastAction />
                <ToastClose>Close</ToastClose>
              </ToastRoot>
            )}
          </ToastContext.Provider>
        )}
      </For>
    </ol>
  );
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

  return (
    <ToastContext.Provider value={{ toast: () => requireToast(toast()) }}>
      {renderPolymorphic(local.as, "li", {
        ...rest,
        ...getPartDataAttributes("toast", "root"),
        "aria-describedby": toast()?.description ? descriptionId() : undefined,
        "aria-labelledby": toast()?.title ? titleId() : undefined,
        "data-status": toast()?.status,
        "data-type": toast()?.type,
        id: local.id,
        role: toast()?.priority === "assertive" ? "alert" : "status",
        onFocusIn: composeEventHandlers(local.onFocusIn, () => provider.pause(toast()?.id)),
        onFocusOut: composeEventHandlers(local.onFocusOut, () => provider.resume(toast()?.id)),
        onMouseEnter: composeEventHandlers(local.onMouseEnter, () => provider.pause(toast()?.id)),
        onMouseLeave: composeEventHandlers(local.onMouseLeave, () => provider.resume(toast()?.id)),
        children: local.children,
      })}
    </ToastContext.Provider>
  );
}

export function ToastTitle(props: ToastTitleProps) {
  const context = useToastContext("Toast.Title");
  const [local, rest] = splitProps(props, ["as", "children"]);
  return (
    <Show when={local.children ?? context.toast().title}>
      {(children) =>
        renderPolymorphic(local.as, "div", {
          ...rest,
          ...getPartDataAttributes("toast", "title"),
          children: children(),
        })
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
        renderPolymorphic(local.as, "div", {
          ...rest,
          ...getPartDataAttributes("toast", "description"),
          children: children(),
        })
      }
    </Show>
  );
}

export function ToastAction(props: ToastActionProps) {
  const context = useToastContext("Toast.Action");
  const [local, rest] = splitProps(props, ["as", "children", "onClick"]);
  const action = createMemo(() => context.toast().action);
  return (
    <Show when={local.children ?? action()?.label}>
      {(children) =>
        renderPolymorphic(local.as, "button", {
          type: "button",
          ...rest,
          ...getPartDataAttributes("toast", "action"),
          onClick: composeEventHandlers(local.onClick, () => {
            action()?.onClick?.(context.toast());
          }),
          children: children(),
        })
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

function isToastInput(value: ToastInput | JSX.Element): value is ToastInput {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
