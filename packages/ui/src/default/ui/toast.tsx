import {
  Toast as CoreToast,
  toaster,
  type ToastActionProps as CoreToastActionProps,
  type ToastCloseProps as CoreToastCloseProps,
  type ToastData,
  type ToastDescriptionProps as CoreToastDescriptionProps,
  type ToastInput,
  type ToastManager,
  type ToastPromiseInput,
  type ToastProviderProps as CoreToastProviderProps,
  type ToastRenderInfo,
  type ToastRootProps as CoreToastRootProps,
  type ToastTitleProps as CoreToastTitleProps,
  type ToastViewportProps as CoreToastViewportProps,
} from "@keystone-ui/core/toast";
import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert, X } from "lucide-solid";
import { createSignal, onCleanup, onMount, splitProps, type JSX } from "solid-js";
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
  expanded?: boolean;
  gap?: string;
  offset?: string;
  peek?: string;
  position?: ToastPosition;
  strategy?: "absolute" | "fixed";
  width?: string;
};
export type ToastStackProps = {
  expanded: boolean;
  frontHeight?: number;
  index: number;
  offset: number;
  onHeightChange?: (height: number) => void;
  position: ToastPosition;
};
export type ToastProps = CoreToastRootProps & {
  inset?: boolean;
  stack?: ToastStackProps;
};
export type ToastContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  behind?: boolean;
  expanded?: boolean;
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
  expand?: boolean;
  gap?: number;
  icon?: boolean;
  renderToast?: (toast: ToastData, info: ToastRenderInfo) => JSX.Element;
  viewport?: ToastViewportProps;
  visibleToasts?: number;
};
type ToasterToastProps = {
  closeButton: () => boolean;
  expanded: () => boolean;
  getStackOffset: (info: ToastRenderInfo) => number;
  icon: (toast: ToastData) => boolean;
  info: ToastRenderInfo;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  position: () => ToastPosition;
  setToastHeight: (toast: ToastData, height: number) => void;
  toast: ToastData;
  toastHeights: () => Record<string, number>;
};
export type { ToastData, ToastInput, ToastManager, ToastPromiseInput, ToastRenderInfo };

export { toaster };

const DEFAULT_VISIBLE_TOASTS = 3;
const DEFAULT_TOAST_GAP = 12;
const DEFAULT_TOAST_OFFSET = "2rem";
const DEFAULT_TOAST_WIDTH = "22.5rem";
const TOAST_ENTER_DURATION = 500;
const toastAnimationStyles = `
@keyframes ui-toast-enter-bottom {
  from {
    transform: translateY(calc(100% + var(--toast-offset)));
  }
  to {
    transform: translateX(var(--toast-swipe-movement-x)) translateY(0) scale(1);
  }
}

@keyframes ui-toast-enter-top {
  from {
    transform: translateY(calc(-100% - var(--toast-offset)));
  }
  to {
    transform: translateX(var(--toast-swipe-movement-x)) translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="toast"][data-entering] {
    animation: none !important;
  }
}
`;

const classes = (...tokens: Array<string | undefined>) => tokens.filter(Boolean).join(" ");

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
  const [local, rest] = splitProps(props, [
    "class",
    "expanded",
    "gap",
    "offset",
    "peek",
    "position",
    "style",
    "strategy",
    "width",
  ]);
  const position = () => local.position ?? "bottom-right";
  const strategy = () => local.strategy ?? "fixed";

  return (
    <CoreToast.Viewport
      {...rest}
      data-expanded={local.expanded ? "" : undefined}
      data-position={position()}
      data-slot="toast-viewport"
      style={{
        "--toast-offset": local.offset ?? DEFAULT_TOAST_OFFSET,
        "--toast-gap": local.gap ?? `${DEFAULT_TOAST_GAP}px`,
        "--toast-peek": local.peek ?? `${DEFAULT_TOAST_GAP}px`,
        "--toast-width": local.width ?? DEFAULT_TOAST_WIDTH,
        ...(typeof local.style === "object" ? local.style : undefined),
      }}
      class={cn(
        classes(
          "ui-toast-viewport",
          strategy(),
          "z-50",
          "m-0",
          "flex",
          "w-[calc(100vw-2*var(--toast-offset))]",
          "max-w-(--toast-width)",
          "list-none",
          "p-0",
          "outline-none",
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
  const [local, rest] = splitProps(props, ["class", "inset", "ref", "stack", "style"]);
  const [height, setHeight] = createSignal(0);
  const [entering, setEntering] = createSignal(true);
  let enterTimer: ReturnType<typeof setTimeout> | undefined;
  let resizeObserver: ResizeObserver | undefined;

  const setRootRef = (element: HTMLLIElement) => {
    if (typeof local.ref === "function") {
      local.ref(element);
    }

    if (!local.stack) {
      return;
    }

    const measure = () => {
      const nextHeight = element.getBoundingClientRect().height;
      if (nextHeight <= 0 || nextHeight === height()) {
        return;
      }

      setHeight(nextHeight);
      local.stack?.onHeightChange?.(nextHeight);
    };

    queueMicrotask(measure);
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(element);
    }
  };

  onCleanup(() => {
    if (enterTimer) {
      clearTimeout(enterTimer);
    }
    resizeObserver?.disconnect();
    local.stack?.onHeightChange?.(0);
  });

  onMount(() => {
    if (local.stack) {
      enterTimer = setTimeout(() => setEntering(false), TOAST_ENTER_DURATION);
    }
  });

  const stackStyle = (): JSX.CSSProperties => {
    if (!local.stack) {
      return {};
    }

    const measuredHeight = height();
    const toastHeight = measuredHeight > 0 ? `${measuredHeight}px` : "auto";
    const calcHeightValue = local.stack.frontHeight ?? measuredHeight;
    const calcHeight = calcHeightValue > 0 ? `${calcHeightValue}px` : "auto";
    const scale = local.stack.expanded ? 1 : Math.max(0, 1 - local.stack.index * 0.1);

    return {
      "--toast-calc-height": calcHeight,
      "--toast-height": toastHeight,
      "--toast-index": String(local.stack.index),
      "--toast-scale": String(scale),
      "--toast-shrink": "calc(1 - var(--toast-scale))",
      "--toast-stack-offset": `${local.stack.offset}px`,
      "--toast-swipe-movement-x": "0px",
      "--toast-swipe-movement-y": "0px",
      height: calcHeight,
      transform: getToastStackTransform({
        expanded: local.stack.expanded,
        height: calcHeightValue,
        index: local.stack.index,
        offset: local.stack.offset,
        position: local.stack.position,
        scale,
      }),
      "z-index": String(9999 - local.stack.index),
    } as JSX.CSSProperties;
  };
  const mergedStyle = () => {
    if (typeof local.style === "object") {
      return { ...stackStyle(), ...local.style };
    }

    return local.stack ? stackStyle() : local.style;
  };

  return (
    <CoreToast.Root
      {...rest}
      data-behind={local.stack && local.stack.index > 0 ? "" : undefined}
      data-entering={local.stack && local.stack.index === 0 && entering() ? "" : undefined}
      data-expanded={local.stack?.expanded ? "" : undefined}
      data-inset={local.inset ? "" : undefined}
      data-position={local.stack?.position}
      data-slot="toast"
      data-stacked={local.stack ? "" : undefined}
      ref={setRootRef}
      style={mergedStyle()}
      class={cn(
        classes(
          "ui-toast",
          "group/toast",
          "pointer-events-auto",
          "relative",
          "min-h-14",
          "w-full",
          "overflow-visible",
          "select-none",
          "rounded-lg",
          "border",
          "bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(1%*max(0,var(--toast-index,0))))]",
          "not-dark:bg-clip-padding",
          "text-popover-foreground",
          "text-sm",
          "shadow-lg/5",
          "outline-none",
          "[transition:transform_.5s_cubic-bezier(.22,1,.36,1),opacity_.5s,height_.15s,background-color_.5s]",
          "before:pointer-events-none",
          "before:absolute",
          "before:inset-0",
          "before:rounded-[calc(var(--radius-lg)-1px)]",
          "before:shadow-[0_1px_--theme(--color-black/4%)]",
          "focus-visible:ring-3",
          "focus-visible:ring-ring/24",
          "data-[expanded]:bg-popover",
          "data-[status=closed]:opacity-0",
          "data-[type=error]:border-destructive/24",
          "data-[type=success]:border-success/24",
          "data-[type=warning]:border-warning/24",
          "data-[stacked]:absolute",
          "data-[stacked]:h-(--toast-calc-height)",
          "data-[stacked]:z-[calc(9999-var(--toast-index))]",
          "data-[stacked]:will-change-transform",
          "data-[stacked]:after:absolute",
          "data-[stacked]:after:left-0",
          "data-[stacked]:after:h-[calc(var(--toast-gap)+1px)]",
          "data-[stacked]:after:w-full",
          "data-[entering]:[animation-duration:.5s]",
          "data-[entering]:[animation-fill-mode:both]",
          "data-[entering]:[animation-timing-function:cubic-bezier(.22,1,.36,1)]",
          "data-[position*=center]:right-0",
          "data-[position*=center]:left-0",
          "data-[position*=left]:right-auto",
          "data-[position*=left]:left-0",
          "data-[position*=right]:right-0",
          "data-[position*=right]:left-auto",
          "data-[position*=bottom]:bottom-0",
          "data-[position*=bottom]:top-auto",
          "data-[position*=bottom]:data-[entering]:[animation-name:ui-toast-enter-bottom]",
          "data-[position*=bottom]:origin-[50%_calc(50%+50%*min(var(--toast-index,0),1))]",
          "data-[position*=bottom]:after:bottom-full",
          "data-[position*=bottom]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--toast-peek))-(var(--toast-shrink)*var(--toast-height))))_scale(var(--toast-scale))]",
          "data-[position*=bottom]:data-[expanded]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-stack-offset)*-1))]",
          "data-[position*=bottom]:data-[status=closed]:transform-[translateY(calc(100%+var(--toast-offset)))]",
          "data-[position*=top]:top-0",
          "data-[position*=top]:bottom-auto",
          "data-[position*=top]:data-[entering]:[animation-name:ui-toast-enter-top]",
          "data-[position*=top]:origin-[50%_calc(50%-50%*min(var(--toast-index,0),1))]",
          "data-[position*=top]:after:top-full",
          "data-[position*=top]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--toast-peek))+(var(--toast-shrink)*var(--toast-height))))_scale(var(--toast-scale))]",
          "data-[position*=top]:data-[expanded]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-stack-offset))]",
          "data-[position*=top]:data-[status=closed]:transform-[translateY(calc(-100%-var(--toast-offset)))]",
          "dark:bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(6%*max(0,var(--toast-index,0))))]",
          "dark:data-[expanded]:bg-popover",
          "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        ),
        local.class,
      )}
    />
  );
}

export function ToastContent(props: ToastContentProps) {
  const [local, rest] = splitProps(props, ["behind", "class", "expanded", "inset"]);

  return (
    <div
      {...rest}
      data-behind={local.behind ? "" : undefined}
      data-expanded={local.expanded ? "" : undefined}
      data-inset={local.inset ? "" : undefined}
      data-slot="toast-content"
      class={cn(
        classes(
          "ui-toast-content",
          "pointer-events-auto",
          "flex",
          "items-center",
          "justify-between",
          "gap-1.5",
          "overflow-hidden",
          "px-3.5",
          "py-3",
          "text-sm",
          "transition-opacity",
          "duration-[250ms]",
          "data-[behind]:not-data-expanded:pointer-events-none",
          "data-[behind]:opacity-0",
          "data-[expanded]:opacity-100",
          "data-[inset]:gap-3",
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
          "min-w-0",
          "font-medium",
          "text-foreground",
          "transition-opacity",
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
        classes("ui-toast-description", "min-w-0", "text-muted-foreground", "transition-opacity"),
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
          "inline-flex",
          "h-7",
          "w-fit",
          "shrink-0",
          "items-center",
          "justify-center",
          "rounded-md",
          "border",
          "border-input",
          "bg-background",
          "px-2.5",
          "text-xs",
          "font-medium",
          "text-foreground",
          "shadow-xs/5",
          "outline-none",
          "transition-[opacity,background-color,color,border-color]",
          "hover:bg-accent",
          "focus-visible:ring-3",
          "focus-visible:ring-ring/24",
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
          "absolute",
          "-top-2",
          "-right-2",
          "inline-flex",
          "size-6",
          "shrink-0",
          "cursor-pointer",
          "items-center",
          "justify-center",
          "rounded-full",
          "border",
          "border-border",
          "bg-popover",
          "text-muted-foreground",
          "opacity-0",
          "shadow-xs/5",
          "outline-none",
          "transition-[opacity,background-color,color,border-color]",
          "hover:bg-accent",
          "hover:text-foreground",
          "focus-visible:opacity-100",
          "focus-visible:ring-3",
          "focus-visible:ring-ring/24",
          "group-hover/toast:opacity-100",
          "max-sm:opacity-100",
          "sm:size-5",
        ),
        local.class,
      )}
    >
      {local.children ?? <X aria-hidden="true" class="size-3.5" strokeWidth={2} />}
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
          "flex",
          "h-lh",
          "w-4",
          "shrink-0",
          "items-center",
          "justify-center",
          "[&_svg]:pointer-events-none",
          "[&_svg]:h-lh",
          "[&_svg]:w-4",
          "[&_svg]:shrink-0",
          "transition-opacity",
        ),
        toastIconClass[type()],
        local.class,
      )}
    >
      <ToastStatusIcon type={type()} />
    </div>
  );
}

export function Toaster(props: ToasterProps) {
  const [local, providerProps] = splitProps(props, [
    "closeButton",
    "expand",
    "gap",
    "icon",
    "renderToast",
    "viewport",
    "visibleToasts",
  ]);
  const [hoverExpanded, setHoverExpanded] = createSignal(false);
  const [toastHeights, setToastHeights] = createSignal<Record<string, number>>({});
  let collapseTimer: ReturnType<typeof setTimeout> | undefined;
  const gap = () => local.gap ?? DEFAULT_TOAST_GAP;
  const isExpanded = () => local.expand || hoverExpanded();
  const showCloseButton = () => local.closeButton ?? false;
  const showIcon = (toast: ToastData) => (local.icon ?? true) && toast.type !== "default";
  const setToastHeight = (toast: ToastData, height: number) => {
    setToastHeights((current) => {
      const next = { ...current };
      if (height > 0) {
        next[toast.id] = height;
      } else {
        delete next[toast.id];
      }
      return next;
    });
  };
  const getStackOffset = (info: ToastRenderInfo) => {
    if (!isExpanded()) {
      return info.frontIndex * Math.min(gap(), DEFAULT_TOAST_GAP);
    }

    return info.toasts
      .slice(info.index + 1)
      .reduce((offset, toast) => offset + (toastHeights()[toast.id] ?? 0) + gap(), 0);
  };
  const expandStack = () => {
    if (collapseTimer) {
      clearTimeout(collapseTimer);
      collapseTimer = undefined;
    }
    setHoverExpanded(true);
  };
  const collapseStack = () => {
    if (local.expand) {
      return;
    }
    if (collapseTimer) {
      clearTimeout(collapseTimer);
    }
    collapseTimer = setTimeout(() => setHoverExpanded(false), 40);
  };
  const handleViewportFocusIn = (event: FocusEvent) => {
    callEventHandler(local.viewport?.onFocusIn, event);
    if (!event.defaultPrevented) {
      expandStack();
    }
  };
  const handleViewportFocusOut = (event: FocusEvent) => {
    callEventHandler(local.viewport?.onFocusOut, event);
    const nextTarget = event.relatedTarget;
    if (
      !event.defaultPrevented &&
      event.currentTarget instanceof HTMLElement &&
      !(nextTarget instanceof Node && event.currentTarget.contains(nextTarget))
    ) {
      collapseStack();
    }
  };

  onCleanup(() => {
    if (collapseTimer) {
      clearTimeout(collapseTimer);
    }
  });

  return (
    <ToastProvider
      {...providerProps}
      limit={providerProps.limit ?? local.visibleToasts ?? DEFAULT_VISIBLE_TOASTS}
    >
      <style>{toastAnimationStyles}</style>
      <ToastViewport
        {...local.viewport}
        expanded={isExpanded()}
        gap={`${gap()}px`}
        onFocusIn={handleViewportFocusIn}
        onFocusOut={handleViewportFocusOut}
      >
        {(toast: ToastData, info: ToastRenderInfo) =>
          local.renderToast?.(toast, info) ?? (
            <ToasterToast
              closeButton={showCloseButton}
              expanded={isExpanded}
              getStackOffset={getStackOffset}
              icon={showIcon}
              info={info}
              onMouseEnter={expandStack}
              onMouseLeave={collapseStack}
              position={() => local.viewport?.position ?? "bottom-right"}
              setToastHeight={setToastHeight}
              toast={toast}
              toastHeights={toastHeights}
            />
          )
        }
      </ToastViewport>
    </ToastProvider>
  );
}

export const ToastPrimitive = CoreToast;

function ToasterToast(props: ToasterToastProps) {
  const showIcon = () => props.icon(props.toast);

  return (
    <Toast
      toast={props.toast}
      inset={!showIcon()}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      stack={{
        expanded: props.expanded(),
        frontHeight:
          props.toastHeights()[props.info.toasts[props.info.toasts.length - 1]?.id ?? ""],
        index: props.info.frontIndex,
        offset: props.getStackOffset(props.info),
        onHeightChange: (height) => props.setToastHeight(props.toast, height),
        position: props.position(),
      }}
    >
      <ToastContent
        behind={props.info.frontIndex > 0}
        expanded={props.expanded()}
        inset={!showIcon()}
      >
        <div class="flex min-w-0 gap-2">
          {showIcon() && <ToastIcon type={props.toast.type} />}
          <div class="flex min-w-0 flex-col gap-0.5">
            <ToastTitle />
            <ToastDescription />
          </div>
        </div>
        <ToastAction />
        {props.closeButton() && <ToastClose />}
      </ToastContent>
    </Toast>
  );
}

function ToastStatusIcon(props: { type: ToastData["type"] }) {
  if (props.type === "success") {
    return <CircleCheck aria-hidden="true" strokeWidth={2} />;
  }

  if (props.type === "error") {
    return <CircleAlert aria-hidden="true" strokeWidth={2} />;
  }

  if (props.type === "warning") {
    return <TriangleAlert aria-hidden="true" strokeWidth={2} />;
  }

  if (props.type === "loading") {
    return <LoaderCircle aria-hidden="true" class="animate-spin" strokeWidth={2} />;
  }

  return <Info aria-hidden="true" strokeWidth={2} />;
}

function getToastStackTransform(props: {
  expanded: boolean;
  height: number;
  index: number;
  offset: number;
  position: ToastPosition;
  scale: number;
}) {
  if (props.expanded) {
    const offset = props.position.startsWith("top") ? props.offset : props.offset * -1;
    return `translateX(0px) translateY(${offset}px) scale(1)`;
  }

  const shrink = 1 - props.scale;
  const distance = props.index * DEFAULT_TOAST_GAP + shrink * props.height;
  const offset = props.position.startsWith("top") ? distance : distance * -1;
  return `translateX(0px) translateY(${offset}px) scale(${props.scale})`;
}

function callEventHandler(handler: unknown, event: Event) {
  if (typeof handler === "function") {
    handler(event);
    return;
  }

  if (Array.isArray(handler)) {
    const [first, second] = handler;

    if (typeof first === "function") {
      first(second, event);
    } else if (typeof second === "function") {
      second(first, event);
    }
  }
}
