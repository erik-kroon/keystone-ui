import {
  Toast as CoreToast,
  toaster,
  type ToastActionProps as CoreToastActionProps,
  type ToastCloseProps as CoreToastCloseProps,
  type ToastData,
  type ToastDescriptionProps as CoreToastDescriptionProps,
  type ToastInput,
  type ToastManager,
  type ToastProviderProps as CoreToastProviderProps,
  type ToastRootProps as CoreToastRootProps,
  type ToastTitleProps as CoreToastTitleProps,
  type ToastViewportProps as CoreToastViewportProps,
} from "@keystone-ui/core/toast";
import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type ToastProviderProps = CoreToastProviderProps;
export type ToastPosition =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "top-left"
  | "top-right";
export type ToastViewportProps = CoreToastViewportProps & {
  offset?: string;
  position?: ToastPosition;
};
export type ToastProps = CoreToastRootProps & {
  inset?: boolean;
};
export type ToastTitleProps = CoreToastTitleProps;
export type ToastDescriptionProps = CoreToastDescriptionProps;
export type ToastActionProps = CoreToastActionProps;
export type ToastCloseProps = CoreToastCloseProps;
export type ToastIconProps = JSX.HTMLAttributes<HTMLDivElement> & {
  type?: ToastData["type"];
};
export type ToasterProps = ToastProviderProps & {
  closeButton?: boolean;
  icon?: boolean;
  renderToast?: (toast: ToastData) => JSX.Element;
  viewport?: ToastViewportProps;
};
export type { ToastData, ToastInput, ToastManager };

export { toaster };

const classes = (...tokens: string[]) => tokens.join(" ");

const toastViewportPositionClass: Record<ToastPosition, string> = {
  "bottom-center": classes("bottom-(--toast-offset)", "left-1/2", "-translate-x-1/2"),
  "bottom-left": classes("bottom-(--toast-offset)", "left-(--toast-offset)"),
  "bottom-right": classes("right-(--toast-offset)", "bottom-(--toast-offset)"),
  "top-center": classes("top-(--toast-offset)", "left-1/2", "-translate-x-1/2"),
  "top-left": classes("top-(--toast-offset)", "left-(--toast-offset)"),
  "top-right": classes("top-(--toast-offset)", "right-(--toast-offset)"),
};

const toastIconClass: Record<ToastData["type"], string> = {
  default: "text-muted-foreground",
  error: "text-destructive",
  info: "text-info",
  loading: "text-muted-foreground",
  success: "text-success",
  warning: "text-warning",
};

export function ToastProvider(props: ToastProviderProps) {
  return <CoreToast.Provider {...props} />;
}

export function ToastViewport(props: ToastViewportProps) {
  const [local, rest] = splitProps(props, ["class", "offset", "position", "style"]);
  const position = () => local.position ?? "bottom-right";

  return (
    <CoreToast.Viewport
      {...rest}
      data-position={position()}
      data-slot="toast-viewport"
      style={{
        "--toast-offset": local.offset ?? "24px",
        ...(typeof local.style === "object" ? local.style : undefined),
      }}
      class={cn(
        classes(
          "ui-toast-viewport",
          "fixed",
          "z-50",
          "m-0",
          "flex",
          "w-[calc(100vw-2*var(--toast-offset))]",
          "max-w-(--toast-width)",
          "list-none",
          "flex-col",
          "gap-(--toast-gap)",
          "p-0",
          "outline-none",
          "[--toast-gap:--spacing(3)]",
          "[--toast-width:24rem]",
          "max-sm:right-(--toast-offset)",
          "max-sm:left-(--toast-offset)",
          "max-sm:w-auto",
          "max-sm:max-w-none",
          "max-sm:translate-x-0",
        ),
        toastViewportPositionClass[position()],
        local.class,
      )}
    />
  );
}

export function Toast(props: ToastProps) {
  const [local, rest] = splitProps(props, ["class", "inset"]);
  return (
    <CoreToast.Root
      {...rest}
      data-inset={local.inset ? "" : undefined}
      data-slot="toast"
      class={cn(
        classes(
          "ui-toast",
          "group/toast",
          "relative",
          "grid",
          "min-h-14",
          "w-full",
          "grid-cols-[auto_1fr_auto]",
          "items-start",
          "gap-x-3",
          "gap-y-1",
          "overflow-hidden",
          "rounded-xl",
          "border",
          "bg-popover",
          "px-4",
          "py-3",
          "text-popover-foreground",
          "shadow-lg/8",
          "outline-none",
          "transition-[opacity,translate,scale]",
          "duration-200",
          "before:pointer-events-none",
          "before:absolute",
          "before:inset-0",
          "before:rounded-[calc(var(--radius-xl)-1px)]",
          "before:shadow-[0_1px_--theme(--color-black/4%)]",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          "focus-visible:ring-offset-1",
          "focus-visible:ring-offset-background",
          "data-[status=closed]:opacity-0",
          "data-[type=error]:border-destructive/24",
          "data-[type=error]:bg-destructive/6",
          "data-[type=success]:border-success/24",
          "data-[type=success]:bg-success/6",
          "data-[type=warning]:border-warning/24",
          "data-[type=warning]:bg-warning/8",
          "data-[inset]:grid-cols-[1fr_auto]",
          "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        ),
        local.class,
      )}
    />
  );
}

export function ToastTitle(props: ToastTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreToast.Title
      {...rest}
      data-slot="toast-title"
      class={cn(
        classes(
          "ui-toast-title",
          "col-start-2",
          "min-w-0",
          "text-sm",
          "leading-5",
          "font-medium",
          "text-foreground",
          "group-data-[inset]/toast:col-start-1",
        ),
        local.class,
      )}
    />
  );
}

export function ToastDescription(props: ToastDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreToast.Description
      {...rest}
      data-slot="toast-description"
      class={cn(
        classes(
          "ui-toast-description",
          "col-start-2",
          "min-w-0",
          "text-sm",
          "leading-5",
          "text-muted-foreground",
          "group-data-[inset]/toast:col-start-1",
        ),
        local.class,
      )}
    />
  );
}

export function ToastAction(props: ToastActionProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreToast.Action
      {...rest}
      data-slot="toast-action"
      class={cn(
        classes(
          "ui-toast-action",
          "col-start-2",
          "mt-2",
          "inline-flex",
          "h-8",
          "w-fit",
          "items-center",
          "justify-center",
          "rounded-lg",
          "border",
          "border-input",
          "bg-background",
          "px-3",
          "text-sm",
          "font-medium",
          "text-foreground",
          "shadow-xs/5",
          "outline-none",
          "transition-colors",
          "hover:bg-accent",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          "focus-visible:ring-offset-1",
          "focus-visible:ring-offset-background",
          "group-data-[inset]/toast:col-start-1",
        ),
        local.class,
      )}
    />
  );
}

export function ToastClose(props: ToastCloseProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);
  return (
    <CoreToast.Close
      {...rest}
      data-slot="toast-close"
      class={cn(
        classes(
          "ui-toast-close",
          "col-start-3",
          "row-span-2",
          "-me-1.5",
          "-mt-1.5",
          "inline-flex",
          "size-8",
          "shrink-0",
          "cursor-pointer",
          "items-center",
          "justify-center",
          "rounded-lg",
          "border",
          "border-transparent",
          "text-muted-foreground",
          "outline-none",
          "transition-colors",
          "hover:bg-accent",
          "hover:text-foreground",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          "focus-visible:ring-offset-1",
          "focus-visible:ring-offset-background",
        ),
        local.class,
      )}
    >
      {local.children ?? <ToastCloseIcon />}
    </CoreToast.Close>
  );
}

export function ToastIcon(props: ToastIconProps) {
  const [local, rest] = splitProps(props, ["class", "type"]);
  const type = () => local.type ?? "default";

  return (
    <div
      {...rest}
      aria-hidden="true"
      data-slot="toast-icon"
      data-type={type()}
      class={cn(
        classes(
          "ui-toast-icon",
          "col-start-1",
          "row-span-2",
          "mt-0.5",
          "flex",
          "size-4.5",
          "items-center",
          "justify-center",
          "group-data-[inset]/toast:hidden",
        ),
        toastIconClass[type()],
        local.class,
      )}
    >
      {type() === "loading" ? <ToastLoadingIcon /> : <ToastStatusIcon type={type()} />}
    </div>
  );
}

export function Toaster(props: ToasterProps) {
  const [local, providerProps] = splitProps(props, [
    "closeButton",
    "icon",
    "renderToast",
    "viewport",
  ]);
  const showCloseButton = () => local.closeButton ?? true;
  const showIcon = () => local.icon ?? true;

  return (
    <ToastProvider {...providerProps}>
      <ToastViewport {...local.viewport}>
        {(toast: ToastData) =>
          local.renderToast?.(toast) ?? (
            <Toast toast={toast} inset={!showIcon()}>
              {showIcon() && <ToastIcon type={toast.type} />}
              <ToastTitle />
              <ToastDescription />
              <ToastAction />
              {showCloseButton() && <ToastClose />}
            </Toast>
          )
        }
      </ToastViewport>
    </ToastProvider>
  );
}

export const ToastPrimitive = CoreToast;

function ToastCloseIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="16"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ToastLoadingIcon() {
  return (
    <svg
      aria-hidden="true"
      class="animate-spin"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        d="M4 12a8 8 0 0 1 8-8"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="4"
      />
    </svg>
  );
}

function ToastStatusIcon(props: { type: ToastData["type"] }) {
  if (props.type === "success") {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        height="18"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }

  if (props.type === "error") {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        height="18"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    );
  }

  if (props.type === "warning") {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        height="18"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="18"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
