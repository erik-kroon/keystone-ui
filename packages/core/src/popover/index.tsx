import { createContext, splitProps, useContext, type JSX } from "solid-js";
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
  type OverlayPresenceCompleteDetail,
  type OverlayLayerOutsideEvent,
} from "../overlay/index";
import { createOverlayController } from "../overlay/controller";
import { Portal } from "../portal/index";
import { renderPolymorphic, type PolymorphicProps } from "../utils/index";

export type PopoverOpenChangeDetail = {
  event?: Event;
  reason: "trigger" | "escape" | "outside" | "programmatic";
};

export type PopoverRootProps = {
  children?: JSX.Element;
  arrowPadding?: number;
  collisionBoundary?: FloatingCollisionBoundary;
  collisionPadding?: number;
  defaultOpen?: boolean;
  fitViewport?: boolean;
  gutter?: number;
  modal?: boolean;
  onOpenChange?: (open: boolean, detail: PopoverOpenChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open?: boolean;
  placement?: FloatingPlacement;
  rootBoundary?: FloatingRootBoundary;
  sameWidth?: boolean;
  sticky?: FloatingSticky;
  strategy?: FloatingStrategy;
};

export type PopoverPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type PopoverTriggerProps = PopoverPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type PopoverPortalProps = {
  children?: JSX.Element;
  forceMount?: boolean;
  mount?: Node;
};
export type PopoverPositionerProps = PopoverPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type PopoverArrowProps = FloatingArrowProps<HTMLSpanElement>;
export type PopoverContentProps = PopoverPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: OverlayLayerOutsideEvent) => void;
    onFocusOutside?: (event: OverlayLayerOutsideEvent) => void;
    onInteractOutside?: (event: OverlayLayerOutsideEvent) => void;
  };

type PopoverApi = {
  contentId: string;
  floating: FloatingAdapter;
  getArrowProps: (props: Omit<PopoverArrowProps, "children">) => Record<string, unknown>;
  getContentProps: (props: Omit<PopoverContentProps, "children">) => Record<string, unknown>;
  getPositionerProps: (props: Omit<PopoverPositionerProps, "children">) => Record<string, unknown>;
  getTriggerProps: (props: Omit<PopoverTriggerProps, "as" | "children">) => Record<string, unknown>;
  open: () => boolean;
  shouldMount: (forceMount?: boolean) => boolean;
};

export type CreatePopoverOptions = {
  arrowPadding?: () => number | undefined;
  collisionBoundary?: () => FloatingCollisionBoundary | undefined;
  collisionPadding?: () => number | undefined;
  defaultOpen?: boolean;
  fitViewport?: () => boolean | undefined;
  gutter?: () => number | undefined;
  modal?: () => boolean | undefined;
  onOpenChange?: (open: boolean, detail: PopoverOpenChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open?: () => boolean | undefined;
  placement?: () => FloatingPlacement | undefined;
  rootBoundary?: () => FloatingRootBoundary | undefined;
  sameWidth?: () => boolean | undefined;
  sticky?: () => FloatingSticky | undefined;
  strategy?: () => FloatingStrategy | undefined;
};

const PopoverContext = createContext<PopoverApi>();

export function createPopover(options: CreatePopoverOptions = {}): PopoverApi {
  const overlay = createOverlayController<PopoverOpenChangeDetail["reason"]>({
    scope: "popover",
    open: options.open,
    defaultOpen: options.defaultOpen,
    modal: () => options.modal?.() ?? false,
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
          modal: overlay.modal,
          disableOutsidePointerEvents: overlay.modal,
          dismissReason: (event) => (event.type === "keydown" ? "escape" : "outside"),
        },
      );
      const floatingProps = overlay.getFloatingContentProps<HTMLDivElement>({
        ref: local.ref,
        style: local.style,
      });

      return {
        ...others,
        ...layerProps,
        ...floatingProps,
        id: overlay.contentId,
        get hidden() {
          return overlay.hidden();
        },
        role: "dialog",
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
    getTriggerProps: (props) =>
      overlay.getTriggerProps(props, {
        action: "toggle",
        ariaHasPopup: "dialog",
        reason: "trigger",
      }) as Record<string, unknown>,
    open: overlay.open,
    shouldMount: overlay.shouldMount,
  };
}

function usePopover(part: string) {
  const popover = useContext(PopoverContext);
  if (!popover) throw new Error(`Popover.${part} must be used within Popover.Root`);
  return popover;
}

function Root(props: PopoverRootProps) {
  const popover = createPopover({
    arrowPadding: () => props.arrowPadding,
    collisionBoundary: () => props.collisionBoundary,
    collisionPadding: () => props.collisionPadding,
    defaultOpen: props.defaultOpen,
    fitViewport: () => props.fitViewport,
    gutter: () => props.gutter,
    modal: () => props.modal,
    onOpenChange: props.onOpenChange,
    onOpenChangeComplete: props.onOpenChangeComplete,
    open: () => props.open,
    placement: () => props.placement,
    rootBoundary: () => props.rootBoundary,
    sameWidth: () => props.sameWidth,
    sticky: () => props.sticky,
    strategy: () => props.strategy,
  });

  return (
    <OverlayLayerProvider>
      <PopoverContext.Provider value={popover}>{props.children}</PopoverContext.Provider>
    </OverlayLayerProvider>
  );
}

function Trigger(props: PopoverTriggerProps) {
  const popover = usePopover("Trigger");
  const [local, others] = splitProps(props, ["as", "children", "onClick", "ref"]);
  const triggerProps = popover.getTriggerProps({
    ...others,
    onClick: local.onClick,
    ref: local.ref,
  }) as Record<string, unknown>;

  if (!local.as) return <button {...triggerProps}>{local.children}</button>;
  return renderPolymorphic(local.as, "button", { ...triggerProps, children: local.children });
}

function PortalPart(props: PopoverPortalProps) {
  const popover = usePopover("Portal");
  return (
    <Portal
      forceMount={props.forceMount}
      mount={props.mount}
      present={popover.shouldMount(props.forceMount)}
    >
      {props.children}
    </Portal>
  );
}

function Positioner(props: PopoverPositionerProps) {
  const popover = usePopover("Positioner");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);
  const positionerProps = popover.getPositionerProps({
    ...others,
    ref: local.ref,
    style: local.style,
  });
  return <div {...positionerProps}>{local.children}</div>;
}

function Content(props: PopoverContentProps) {
  const popover = usePopover("Content");
  const [local, others] = splitProps(props, [
    "children",
    "onEscapeKeyDown",
    "onFocusOutside",
    "onInteractOutside",
    "onPointerDownOutside",
    "ref",
    "style",
  ]);
  const contentProps = popover.getContentProps({
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

function Arrow(props: PopoverArrowProps) {
  const popover = usePopover("Arrow");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);
  const arrowProps = popover.getArrowProps({
    ...others,
    ref: local.ref,
    style: local.style,
  });
  return <span {...arrowProps}>{local.children}</span>;
}

export const Popover = {
  Root,
  Trigger,
  Portal: PortalPart,
  Positioner,
  Arrow,
  Content,
};
