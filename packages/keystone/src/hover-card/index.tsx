import {
  createContext,
  onCleanup,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import {
  OverlayLayerProvider,
  getFloatingArrowProps,
  type FloatingAdapter,
  type FloatingArrowProps,
  type FloatingCollisionBoundary,
  type FloatingPlacement,
  type FloatingRootBoundary,
  type FloatingSticky,
  type FloatingStrategy,
  type OverlayLayerOutsideEvent,
  type OverlayPresenceCompleteDetail,
} from "../overlay/index";
import { createOverlayController } from "../overlay/controller";
import { Portal } from "../portal/index";
import { composeEventHandlers, renderPolymorphic, type PolymorphicProps } from "../utils/index";

export type HoverCardOpenChangeDetail = {
  event?: Event;
  reason: "pointer" | "focus" | "escape" | "outside" | "programmatic";
};

export type HoverCardRootProps = {
  children?: JSX.Element;
  arrowPadding?: number;
  closeDelay?: number;
  collisionBoundary?: FloatingCollisionBoundary;
  collisionPadding?: number;
  defaultOpen?: boolean;
  fitViewport?: boolean;
  gutter?: number;
  hoverableContent?: boolean;
  onOpenChange?: (open: boolean, detail: HoverCardOpenChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open?: boolean;
  openDelay?: number;
  placement?: FloatingPlacement;
  pointerGraceArea?: number;
  rootBoundary?: FloatingRootBoundary;
  sameWidth?: boolean;
  sticky?: FloatingSticky;
  strategy?: FloatingStrategy;
};

export type HoverCardPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type HoverCardTriggerProps = HoverCardPartProps<HTMLAnchorElement> &
  PolymorphicProps<HTMLAnchorElement> &
  Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "ref">;
export type HoverCardPortalProps = {
  children?: JSX.Element;
  forceMount?: boolean;
  mount?: Node;
};
export type HoverCardPositionerProps = HoverCardPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type HoverCardArrowProps = FloatingArrowProps<HTMLSpanElement>;
export type HoverCardContentProps = HoverCardPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: OverlayLayerOutsideEvent) => void;
    onFocusOutside?: (event: OverlayLayerOutsideEvent) => void;
    onInteractOutside?: (event: OverlayLayerOutsideEvent) => void;
  };

type HoverCardApi = {
  contentId: string;
  floating: FloatingAdapter;
  getArrowProps: (props: Omit<HoverCardArrowProps, "children">) => Record<string, unknown>;
  getContentProps: (props: Omit<HoverCardContentProps, "children">) => Record<string, unknown>;
  getPositionerProps: (
    props: Omit<HoverCardPositionerProps, "children">,
  ) => Record<string, unknown>;
  getTriggerProps: (
    props: Omit<HoverCardTriggerProps, "as" | "children">,
  ) => Record<string, unknown>;
  open: () => boolean;
  shouldMount: (forceMount?: boolean) => boolean;
};

export type CreateHoverCardOptions = {
  arrowPadding?: () => number | undefined;
  closeDelay?: () => number | undefined;
  collisionBoundary?: () => FloatingCollisionBoundary | undefined;
  collisionPadding?: () => number | undefined;
  defaultOpen?: boolean;
  fitViewport?: () => boolean | undefined;
  gutter?: () => number | undefined;
  hoverableContent?: () => boolean | undefined;
  onOpenChange?: (open: boolean, detail: HoverCardOpenChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open?: () => boolean | undefined;
  openDelay?: () => number | undefined;
  placement?: () => FloatingPlacement | undefined;
  pointerGraceArea?: () => number | undefined;
  rootBoundary?: () => FloatingRootBoundary | undefined;
  sameWidth?: () => boolean | undefined;
  sticky?: () => FloatingSticky | undefined;
  strategy?: () => FloatingStrategy | undefined;
};

const HoverCardContext = createContext<HoverCardApi>();

export function createHoverCard(options: CreateHoverCardOptions = {}): HoverCardApi {
  const overlay = createOverlayController<HoverCardOpenChangeDetail["reason"]>({
    scope: "hover-card",
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
  const interaction = createHoverCardInteraction({
    close: (event, reason) => overlay.close(event, reason),
    closeDelay: () => options.closeDelay?.() ?? 0,
    contentElement: overlay.contentElement,
    hoverableContent: () => options.hoverableContent?.() ?? true,
    open: overlay.open,
    openCard: (event, reason) => overlay.setOpen(true, { event, reason }),
    openDelay: () => options.openDelay?.() ?? 700,
    pointerGraceArea: () => options.pointerGraceArea?.() ?? 8,
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
    getArrowProps: (props) => getFloatingArrowProps(floating, props, partProps("arrow")),
    getContentProps: (props) => {
      const [local, others] = splitProps(props, [
        "ref",
        "style",
        "onEscapeKeyDown",
        "onPointerDownOutside",
        "onFocusOutside",
        "onInteractOutside",
      ]);
      const layerProps = overlay.getContentLayerProps<HTMLDivElement>(
        {
          onEscapeKeyDown: local.onEscapeKeyDown,
          onFocusOutside: local.onFocusOutside,
          onInteractOutside: local.onInteractOutside,
          onPointerDownOutside: local.onPointerDownOutside,
        },
        {
          containsTrigger: true,
          dismissReason: (event) => (event.type === "keydown" ? "escape" : "outside"),
        },
      );
      const floatingProps = overlay.getFloatingContentProps<HTMLDivElement>(
        interaction.getContentProps({
          ref: local.ref,
          style: local.style,
        }),
      );

      return {
        ...others,
        ...layerProps,
        ...floatingProps,
        id: overlay.contentId,
        get hidden() {
          return overlay.hidden();
        },
        "aria-hidden": "true",
        tabindex: -1,
        ...partProps("content"),
      };
    },
    getPositionerProps: (props) => {
      const floatingProps = overlay.getFloatingPositionerProps<HTMLDivElement>(props);
      return {
        ...floatingProps,
        get hidden() {
          return overlay.hidden();
        },
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
        "aria-describedby": undefined,
        onKeyDown: composeEventHandlers<KeyboardEvent>(triggerProps.onKeyDown, (event) => {
          if (event.key !== "Escape" || !overlay.open()) {
            return;
          }

          event.preventDefault();
          overlay.close(event, "escape");
        }),
      }) as Record<string, unknown>;
    },
    open: overlay.open,
    shouldMount: overlay.shouldMount,
  };
}

function useHoverCard(part: string) {
  const hoverCard = useContext(HoverCardContext);
  if (!hoverCard) throw new Error(`HoverCard.${part} must be used within HoverCard.Root`);
  return hoverCard;
}

function Root(props: HoverCardRootProps) {
  const hoverCard = createHoverCard({
    arrowPadding: () => props.arrowPadding,
    closeDelay: () => props.closeDelay,
    collisionBoundary: () => props.collisionBoundary,
    collisionPadding: () => props.collisionPadding,
    defaultOpen: props.defaultOpen,
    fitViewport: () => props.fitViewport,
    gutter: () => props.gutter,
    hoverableContent: () => props.hoverableContent,
    onOpenChange: props.onOpenChange,
    onOpenChangeComplete: props.onOpenChangeComplete,
    open: () => props.open,
    openDelay: () => props.openDelay,
    placement: () => props.placement,
    pointerGraceArea: () => props.pointerGraceArea,
    rootBoundary: () => props.rootBoundary,
    sameWidth: () => props.sameWidth,
    sticky: () => props.sticky,
    strategy: () => props.strategy,
  });

  return (
    <OverlayLayerProvider>
      <HoverCardContext.Provider value={hoverCard}>{props.children}</HoverCardContext.Provider>
    </OverlayLayerProvider>
  );
}

function Trigger(props: HoverCardTriggerProps) {
  const hoverCard = useHoverCard("Trigger");
  const [local, others] = splitProps(props, [
    "as",
    "children",
    "onBlur",
    "onFocus",
    "onPointerEnter",
    "onPointerLeave",
    "ref",
  ]);
  const triggerProps = hoverCard.getTriggerProps({
    ...others,
    onBlur: local.onBlur,
    onFocus: local.onFocus,
    onPointerEnter: local.onPointerEnter,
    onPointerLeave: local.onPointerLeave,
    ref: local.ref,
  }) as Record<string, unknown>;

  if (!local.as) return <a {...triggerProps}>{local.children}</a>;
  return renderPolymorphic(local.as, "a", { ...triggerProps, children: local.children });
}

function PortalPart(props: HoverCardPortalProps) {
  const hoverCard = useHoverCard("Portal");
  return (
    <Portal
      forceMount={props.forceMount}
      mount={props.mount}
      present={hoverCard.shouldMount(props.forceMount)}
    >
      {props.children}
    </Portal>
  );
}

function Positioner(props: HoverCardPositionerProps) {
  const hoverCard = useHoverCard("Positioner");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);
  const positionerProps = hoverCard.getPositionerProps({
    ...others,
    ref: local.ref,
    style: local.style,
  });
  return <div {...positionerProps}>{local.children}</div>;
}

function Content(props: HoverCardContentProps) {
  const hoverCard = useHoverCard("Content");
  const [local, others] = splitProps(props, [
    "children",
    "onEscapeKeyDown",
    "onFocusOutside",
    "onInteractOutside",
    "onPointerDownOutside",
    "ref",
    "style",
  ]);
  const contentProps = hoverCard.getContentProps({
    ...others,
    onEscapeKeyDown: local.onEscapeKeyDown,
    onFocusOutside: local.onFocusOutside,
    onInteractOutside: local.onInteractOutside,
    onPointerDownOutside: local.onPointerDownOutside,
    ref: local.ref,
    style: local.style,
  });
  return <div {...contentProps}>{local.children}</div>;
}

function Arrow(props: HoverCardArrowProps) {
  const hoverCard = useHoverCard("Arrow");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);
  const arrowProps = hoverCard.getArrowProps({
    ...others,
    ref: local.ref,
    style: local.style,
  });
  return <span {...arrowProps}>{local.children}</span>;
}

export const HoverCard = {
  Root,
  Trigger,
  Portal: PortalPart,
  Positioner,
  Arrow,
  Content,
};

function createHoverCardInteraction(options: {
  close: (event: Event | undefined, reason: HoverCardOpenChangeDetail["reason"]) => void;
  closeDelay: Accessor<number>;
  contentElement: Accessor<HTMLElement | undefined>;
  hoverableContent: Accessor<boolean>;
  open: Accessor<boolean>;
  openCard: (event: Event | undefined, reason: HoverCardOpenChangeDetail["reason"]) => void;
  openDelay: Accessor<number>;
  pointerGraceArea: Accessor<number>;
  triggerElement: Accessor<HTMLElement | undefined>;
}) {
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
  const scheduleOpen = (event: Event, reason: HoverCardOpenChangeDetail["reason"]) => {
    clearCloseTimer();
    clearSafeHover();

    const delay = options.openDelay();

    if (delay <= 0) {
      options.openCard(event, reason);
      return;
    }

    clearOpenTimer();
    openTimeout = setTimeout(() => {
      openTimeout = undefined;
      options.openCard(event, reason);
    }, delay);
  };
  const scheduleClose = (event: Event, reason: HoverCardOpenChangeDetail["reason"]) => {
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
    reason: HoverCardOpenChangeDetail["reason"],
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
    getContentProps: <T extends HTMLElement>(props: JSX.HTMLAttributes<T>) => ({
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
    getTriggerProps: <T extends HTMLElement>(props: JSX.HTMLAttributes<T>) => ({
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
