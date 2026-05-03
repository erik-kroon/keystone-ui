import {
  Show,
  createContext,
  onCleanup,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import { Portal } from "solid-js/web";
import {
  OverlayLayerProvider,
  type FloatingAdapter,
  type FloatingCollisionBoundary,
  type FloatingPlacement,
  type FloatingRootBoundary,
  type FloatingSticky,
  type FloatingStrategy,
  type OverlayPresenceCompleteDetail,
} from "../overlay/index";
import { createOverlayController } from "../overlay/controller";
import {
  callEventHandler,
  composeEventHandlers,
  renderPolymorphic,
  type PolymorphicProps,
} from "../utils/index";

export type TooltipOpenChangeDetail = {
  event?: Event;
  reason: "pointer" | "focus" | "escape" | "programmatic";
};

export type TooltipRootProps = {
  children?: JSX.Element;
  arrowPadding?: number;
  closeDelay?: number;
  collisionBoundary?: FloatingCollisionBoundary;
  collisionPadding?: number;
  defaultOpen?: boolean;
  delayDuration?: number;
  fitViewport?: boolean;
  gutter?: number;
  hoverableContent?: boolean;
  onOpenChange?: (open: boolean, detail: TooltipOpenChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open?: boolean;
  placement?: FloatingPlacement;
  pointerGraceArea?: number;
  rootBoundary?: FloatingRootBoundary;
  sameWidth?: boolean;
  skipDelayDuration?: number;
  sticky?: FloatingSticky;
  strategy?: FloatingStrategy;
};

export type TooltipPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type TooltipTriggerProps = TooltipPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type TooltipPortalProps = {
  children?: JSX.Element;
  forceMount?: boolean;
  mount?: Node;
};
export type TooltipPositionerProps = TooltipPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type TooltipContentProps = TooltipPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;

export type TooltipProviderProps = {
  children?: JSX.Element;
  closeDelay?: number;
  delayDuration?: number;
  hoverableContent?: boolean;
  pointerGraceArea?: number;
  skipDelayDuration?: number;
};

type TooltipApi = {
  contentId: string;
  floating: FloatingAdapter;
  getContentProps: (props: Omit<TooltipContentProps, "children">) => Record<string, unknown>;
  getPositionerProps: (props: Omit<TooltipPositionerProps, "children">) => Record<string, unknown>;
  getTriggerProps: (props: Omit<TooltipTriggerProps, "as" | "children">) => Record<string, unknown>;
  open: () => boolean;
  shouldMount: (forceMount?: boolean) => boolean;
};

export type CreateTooltipOptions = {
  arrowPadding?: () => number | undefined;
  closeDelay?: () => number | undefined;
  collisionBoundary?: () => FloatingCollisionBoundary | undefined;
  collisionPadding?: () => number | undefined;
  defaultOpen?: boolean;
  delayDuration?: () => number | undefined;
  fitViewport?: () => boolean | undefined;
  gutter?: () => number | undefined;
  hoverableContent?: () => boolean | undefined;
  onOpenChange?: (open: boolean, detail: TooltipOpenChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open?: () => boolean | undefined;
  placement?: () => FloatingPlacement | undefined;
  pointerGraceArea?: () => number | undefined;
  rootBoundary?: () => FloatingRootBoundary | undefined;
  sameWidth?: () => boolean | undefined;
  skipDelayDuration?: () => number | undefined;
  sticky?: () => FloatingSticky | undefined;
  strategy?: () => FloatingStrategy | undefined;
};

const TooltipContext = createContext<TooltipApi>();
const TooltipProviderContext = createContext<TooltipInteractionProvider>();

type TooltipInteractionProvider = {
  closeDelay: Accessor<number>;
  delayDuration: Accessor<number>;
  hoverableContent: Accessor<boolean>;
  pointerGraceArea: Accessor<number>;
  shouldSkipDelay: Accessor<boolean>;
  skipDelayDuration: Accessor<number>;
  notifyClose: () => void;
  notifyOpen: () => void;
};

type TooltipInteractionApi = {
  getContentProps: <T extends HTMLElement>(props: JSX.HTMLAttributes<T>) => JSX.HTMLAttributes<T>;
  getTriggerProps: <T extends HTMLElement>(props: JSX.HTMLAttributes<T>) => JSX.HTMLAttributes<T>;
};

const defaultTooltipProvider = createTooltipInteractionProvider({});

export function createTooltip(options: CreateTooltipOptions = {}): TooltipApi {
  const provider = useContext(TooltipProviderContext) ?? defaultTooltipProvider;
  const overlay = createOverlayController<TooltipOpenChangeDetail["reason"]>({
    scope: "tooltip",
    open: options.open,
    defaultOpen: options.defaultOpen,
    onOpenChange: (open, detail) => options.onOpenChange?.(open, detail),
    onOpenChangeComplete: options.onOpenChangeComplete,
    floating: {
      arrowPadding: options.arrowPadding,
      collisionBoundary: options.collisionBoundary,
      collisionPadding: options.collisionPadding,
      fitViewport: options.fitViewport,
      gutter: options.gutter,
      placement: options.placement,
      rootBoundary: options.rootBoundary,
      sameWidth: options.sameWidth,
      sticky: options.sticky,
      strategy: options.strategy,
    },
  });
  const floating = overlay.floating as FloatingAdapter;
  const interaction = createTooltipInteraction({
    close: (event, reason) => {
      provider.notifyClose();
      overlay.close(event, reason);
    },
    closeDelay: () => options.closeDelay?.() ?? provider.closeDelay(),
    contentElement: overlay.contentElement,
    delayDuration: () => options.delayDuration?.() ?? provider.delayDuration(),
    hoverableContent: () => options.hoverableContent?.() ?? provider.hoverableContent(),
    open: overlay.open,
    openTooltip: (event, reason) => {
      provider.notifyOpen();
      overlay.setOpen(true, { event, reason });
    },
    pointerGraceArea: () => options.pointerGraceArea?.() ?? provider.pointerGraceArea(),
    shouldSkipDelay: provider.shouldSkipDelay,
    triggerElement: overlay.triggerElement,
  });
  const partProps = (part: string) => ({
    ...overlay.getPartProps(part),
    "data-side": floating.side(),
    "data-align": floating.align(),
  });

  return {
    contentId: overlay.contentId,
    floating,
    getContentProps: (props) => {
      overlay.getContentLayerProps<HTMLDivElement>(
        {},
        {
          containsTrigger: true,
          onDismiss: (event) => {
            overlay.close(event, "escape");
          },
        },
      );
      const floatingProps = overlay.getFloatingContentProps<HTMLDivElement>(
        interaction.getContentProps(props),
      );

      return {
        ...floatingProps,
        id: overlay.contentId,
        role: "tooltip",
        ...partProps("content"),
        onKeyDown: (event: KeyboardEvent) => {
          callEventHandler(floatingProps.onKeyDown, event);
          if (event.defaultPrevented || event.key !== "Escape") {
            return;
          }

          event.preventDefault();
          provider.notifyClose();
          overlay.close(event, "escape");
        },
      };
    },
    getPositionerProps: (props) => {
      const floatingProps = overlay.getFloatingPositionerProps<HTMLDivElement>(props);
      return {
        ...floatingProps,
        ...partProps("positioner"),
      };
    },
    getTriggerProps: (props) => {
      const triggerProps = overlay.getHoverFocusTriggerProps(props, {
        deferOpenChange: true,
        focusReason: "focus",
        pointerReason: "pointer",
      });

      return interaction.getTriggerProps({
        ...triggerProps,
        onKeyDown: composeEventHandlers<KeyboardEvent>(triggerProps.onKeyDown, (event) => {
          if (event.key !== "Escape" || !overlay.open()) {
            return;
          }

          event.preventDefault();
          provider.notifyClose();
          overlay.close(event, "escape");
        }),
      }) as Record<string, unknown>;
    },
    open: overlay.open,
    shouldMount: overlay.shouldMount,
  };
}

function useTooltip(part: string) {
  const tooltip = useContext(TooltipContext);
  if (!tooltip) throw new Error(`Tooltip.${part} must be used within Tooltip.Root`);
  return tooltip;
}

function Root(props: TooltipRootProps) {
  const tooltip = createTooltip({
    arrowPadding: () => props.arrowPadding,
    closeDelay: () => props.closeDelay,
    collisionBoundary: () => props.collisionBoundary,
    collisionPadding: () => props.collisionPadding,
    defaultOpen: props.defaultOpen,
    delayDuration: () => props.delayDuration,
    fitViewport: () => props.fitViewport,
    gutter: () => props.gutter,
    hoverableContent: () => props.hoverableContent,
    onOpenChange: props.onOpenChange,
    onOpenChangeComplete: props.onOpenChangeComplete,
    open: () => props.open,
    placement: () => props.placement,
    pointerGraceArea: () => props.pointerGraceArea,
    rootBoundary: () => props.rootBoundary,
    sameWidth: () => props.sameWidth,
    skipDelayDuration: () => props.skipDelayDuration,
    sticky: () => props.sticky,
    strategy: () => props.strategy,
  });
  return (
    <OverlayLayerProvider>
      <TooltipContext.Provider value={tooltip}>{props.children}</TooltipContext.Provider>
    </OverlayLayerProvider>
  );
}

function Provider(props: TooltipProviderProps) {
  const parent = useContext(TooltipProviderContext) ?? defaultTooltipProvider;
  const provider = createTooltipInteractionProvider({
    closeDelay: () => props.closeDelay ?? parent.closeDelay(),
    delayDuration: () => props.delayDuration ?? parent.delayDuration(),
    hoverableContent: () => props.hoverableContent ?? parent.hoverableContent(),
    pointerGraceArea: () => props.pointerGraceArea ?? parent.pointerGraceArea(),
    skipDelayDuration: () => props.skipDelayDuration ?? parent.skipDelayDuration(),
  });

  return (
    <TooltipProviderContext.Provider value={provider}>
      {props.children}
    </TooltipProviderContext.Provider>
  );
}

function Trigger(props: TooltipTriggerProps) {
  const tooltip = useTooltip("Trigger");
  const [local, others] = splitProps(props, [
    "as",
    "children",
    "onBlur",
    "onFocus",
    "onPointerEnter",
    "onPointerLeave",
    "ref",
  ]);
  const triggerProps = tooltip.getTriggerProps({
    ...others,
    onBlur: local.onBlur,
    onFocus: local.onFocus,
    onPointerEnter: local.onPointerEnter,
    onPointerLeave: local.onPointerLeave,
    ref: local.ref,
  }) as Record<string, unknown>;

  if (!local.as) return <button {...triggerProps}>{local.children}</button>;
  return renderPolymorphic(local.as, "button", { ...triggerProps, children: local.children });
}

function PortalPart(props: TooltipPortalProps) {
  const tooltip = useTooltip("Portal");
  return (
    <Show when={tooltip.shouldMount(props.forceMount)}>
      <Portal mount={props.mount}>{props.children}</Portal>
    </Show>
  );
}

function Positioner(props: TooltipPositionerProps) {
  const tooltip = useTooltip("Positioner");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);
  const positionerProps = tooltip.getPositionerProps({
    ...others,
    ref: local.ref,
    style: local.style,
  });
  return <div {...positionerProps}>{local.children}</div>;
}

function Content(props: TooltipContentProps) {
  const tooltip = useTooltip("Content");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);
  const contentProps = tooltip.getContentProps({ ...others, ref: local.ref, style: local.style });
  return <div {...contentProps}>{local.children}</div>;
}

export const Tooltip = {
  Provider,
  Root,
  Trigger,
  Portal: PortalPart,
  Positioner,
  Content,
};

function createTooltipInteractionProvider(options: {
  closeDelay?: Accessor<number | undefined>;
  delayDuration?: Accessor<number | undefined>;
  hoverableContent?: Accessor<boolean | undefined>;
  pointerGraceArea?: Accessor<number | undefined>;
  skipDelayDuration?: Accessor<number | undefined>;
}): TooltipInteractionProvider {
  let lastCloseAt = Number.NEGATIVE_INFINITY;

  const skipDelayDuration = () => options.skipDelayDuration?.() ?? 300;

  return {
    closeDelay: () => options.closeDelay?.() ?? 0,
    delayDuration: () => options.delayDuration?.() ?? 700,
    hoverableContent: () => options.hoverableContent?.() ?? true,
    pointerGraceArea: () => options.pointerGraceArea?.() ?? 8,
    shouldSkipDelay: () => Date.now() - lastCloseAt <= skipDelayDuration(),
    skipDelayDuration,
    notifyClose: () => {
      lastCloseAt = Date.now();
    },
    notifyOpen: () => {
      lastCloseAt = Date.now();
    },
  };
}

function createTooltipInteraction(options: {
  close: (event: Event | undefined, reason: TooltipOpenChangeDetail["reason"]) => void;
  closeDelay: Accessor<number>;
  contentElement: Accessor<HTMLElement | undefined>;
  delayDuration: Accessor<number>;
  hoverableContent: Accessor<boolean>;
  open: Accessor<boolean>;
  openTooltip: (event: Event | undefined, reason: TooltipOpenChangeDetail["reason"]) => void;
  pointerGraceArea: Accessor<number>;
  shouldSkipDelay: Accessor<boolean>;
  triggerElement: Accessor<HTMLElement | undefined>;
}): TooltipInteractionApi {
  let openTimeout: ReturnType<typeof setTimeout> | undefined;
  let closeTimeout: ReturnType<typeof setTimeout> | undefined;
  let safeHoverCleanup: (() => void) | undefined;

  const clearOpenTimer = () => {
    if (openTimeout) {
      clearTimeout(openTimeout);
      openTimeout = undefined;
    }
  };
  const clearCloseTimer = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = undefined;
    }
  };
  const clearSafeHover = () => {
    safeHoverCleanup?.();
    safeHoverCleanup = undefined;
  };
  const scheduleOpen = (event: Event, reason: TooltipOpenChangeDetail["reason"]) => {
    clearCloseTimer();
    clearSafeHover();

    const delay = options.shouldSkipDelay() ? 0 : options.delayDuration();

    if (delay <= 0) {
      options.openTooltip(event, reason);
      return;
    }

    clearOpenTimer();
    openTimeout = setTimeout(() => {
      openTimeout = undefined;
      options.openTooltip(event, reason);
    }, delay);
  };
  const scheduleClose = (event: Event, reason: TooltipOpenChangeDetail["reason"]) => {
    clearOpenTimer();
    clearSafeHover();

    const delay = options.closeDelay();

    if (delay <= 0) {
      options.close(event, reason);
      return;
    }

    clearCloseTimer();
    closeTimeout = setTimeout(() => {
      closeTimeout = undefined;
      options.close(event, reason);
    }, delay);
  };
  const scheduleSafePointerClose = (
    event: PointerEvent,
    reason: TooltipOpenChangeDetail["reason"],
  ) => {
    const trigger = options.triggerElement();
    const content = options.contentElement();

    if (!options.hoverableContent() || !options.open() || !trigger || !content) {
      scheduleClose(event, reason);
      return;
    }

    const area = createPointerGraceArea(event, trigger, content, options.pointerGraceArea());

    if (!area) {
      scheduleClose(event, reason);
      return;
    }

    clearOpenTimer();
    clearCloseTimer();
    clearSafeHover();

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (content.contains(moveEvent.target as Node)) {
        clearSafeHover();
        return;
      }

      if (!isPointInPolygon({ x: moveEvent.clientX, y: moveEvent.clientY }, area)) {
        clearSafeHover();
        scheduleClose(moveEvent, reason);
      }
    };

    document.addEventListener("pointermove", onPointerMove);
    safeHoverCleanup = () => document.removeEventListener("pointermove", onPointerMove);
  };

  onCleanup(() => {
    clearOpenTimer();
    clearCloseTimer();
    clearSafeHover();
  });

  return {
    getContentProps: (props) => ({
      ...props,
      onPointerEnter: composeEventHandlers<PointerEvent>(props.onPointerEnter, () => {
        if (!options.hoverableContent()) {
          return;
        }

        clearOpenTimer();
        clearCloseTimer();
        clearSafeHover();
      }),
      onPointerLeave: composeEventHandlers<PointerEvent>(props.onPointerLeave, (event) => {
        if (!options.hoverableContent()) {
          return;
        }

        scheduleClose(event, "pointer");
      }),
    }),
    getTriggerProps: (props) => ({
      ...props,
      onBlur: composeEventHandlers<FocusEvent>(props.onBlur, (event) => {
        scheduleClose(event, "focus");
      }),
      onFocus: composeEventHandlers<FocusEvent>(props.onFocus, (event) => {
        scheduleOpen(event, "focus");
      }),
      onPointerEnter: composeEventHandlers<PointerEvent>(props.onPointerEnter, (event) => {
        if (event.pointerType === "touch") {
          return;
        }

        scheduleOpen(event, "pointer");
      }),
      onPointerLeave: composeEventHandlers<PointerEvent>(props.onPointerLeave, (event) => {
        if (event.pointerType === "touch") {
          return;
        }

        scheduleSafePointerClose(event, "pointer");
      }),
    }),
  };
}

type Point = {
  x: number;
  y: number;
};

function createPointerGraceArea(
  event: PointerEvent,
  trigger: HTMLElement,
  content: HTMLElement,
  padding: number,
): readonly Point[] | undefined {
  const triggerRect = trigger.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();

  if (contentRect.width === 0 || contentRect.height === 0) {
    return undefined;
  }

  const pointer = { x: event.clientX, y: event.clientY };
  const paddedContent = {
    bottom: contentRect.bottom + padding,
    left: contentRect.left - padding,
    right: contentRect.right + padding,
    top: contentRect.top - padding,
  };

  if (contentRect.left >= triggerRect.right) {
    return [
      pointer,
      { x: paddedContent.right, y: paddedContent.top },
      { x: paddedContent.right, y: paddedContent.bottom },
    ];
  }

  if (contentRect.right <= triggerRect.left) {
    return [
      pointer,
      { x: paddedContent.left, y: paddedContent.bottom },
      { x: paddedContent.left, y: paddedContent.top },
    ];
  }

  if (contentRect.top >= triggerRect.bottom) {
    return [
      pointer,
      { x: paddedContent.left, y: paddedContent.bottom },
      { x: paddedContent.right, y: paddedContent.bottom },
    ];
  }

  return [
    pointer,
    { x: paddedContent.right, y: paddedContent.top },
    { x: paddedContent.left, y: paddedContent.top },
  ];
}

function isPointInPolygon(point: Point, polygon: readonly Point[]): boolean {
  let inside = false;

  for (
    let index = 0, previousIndex = polygon.length - 1;
    index < polygon.length;
    previousIndex = index++
  ) {
    const current = polygon[index];
    const previous = polygon[previousIndex];

    if (!current || !previous) {
      continue;
    }

    const intersects =
      current.y > point.y !== previous.y > point.y &&
      point.x <
        ((previous.x - current.x) * (point.y - current.y)) / (previous.y - current.y) + current.x;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}
