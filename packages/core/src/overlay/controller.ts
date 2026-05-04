import { createEffect, createSignal, type Accessor, type JSX } from "solid-js";
import { assignRef } from "./dom";
import { getPartDataAttributes } from "../metadata/index";
import { createOverlayDismissalPolicy } from "./dismissal-policy";
import {
  createFloatingAdapter,
  type FloatingAdapter,
  type FloatingCollisionBoundary,
  type FloatingPlacement,
  type FloatingReferenceElement,
  type FloatingRootBoundary,
  type FloatingSticky,
  type FloatingStrategy,
} from "./floating";
import {
  createOverlayLayer,
  type CreateOverlayLayerOptions,
  type OverlayLayerApi,
  type OverlayLayerOutsideEvent,
} from "./layer-kernel";
import {
  composeEventHandlers,
  createControllableBooleanSignal,
  createStableId,
  getOpenClosedState,
  scheduleMicrotask,
  type CoreChangeDetail,
} from "../utils/index";
import {
  createOverlayPresence,
  type OverlayPresenceApi,
  type OverlayPresenceCompleteDetail,
} from "./presence";

export type OverlayControllerChangeDetail<Reason extends string> = CoreChangeDetail<Reason>;

export type OverlayControllerContentEvents = {
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onFocusOutside?: (event: OverlayLayerOutsideEvent) => void;
  onInteractOutside?: (event: OverlayLayerOutsideEvent) => void;
  onMountAutoFocus?: (event: Event) => void;
  onPointerDownOutside?: (event: OverlayLayerOutsideEvent) => void;
  onUnmountAutoFocus?: (event: Event) => void;
};

export type OverlayControllerOptions<Reason extends string> = {
  defaultOpen?: boolean;
  floating?: {
    anchor?: Accessor<FloatingReferenceElement | undefined>;
    arrowPadding?: Accessor<number | undefined>;
    collisionBoundary?: Accessor<FloatingCollisionBoundary | undefined>;
    collisionPadding?: Accessor<number | undefined>;
    fitViewport?: Accessor<boolean | undefined>;
    gutter?: Accessor<number | undefined>;
    placement?: Accessor<FloatingPlacement | undefined>;
    rootBoundary?: Accessor<FloatingRootBoundary | undefined>;
    sameWidth?: Accessor<boolean | undefined>;
    sticky?: Accessor<FloatingSticky | undefined>;
    strategy?: Accessor<FloatingStrategy | undefined>;
  };
  ids?: {
    content?: string;
    description?: string;
    title?: string;
    trigger?: string;
  };
  modal?: Accessor<boolean | undefined>;
  onOpenChange?: (open: boolean, detail: OverlayControllerChangeDetail<Reason>) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open?: Accessor<boolean | undefined>;
  scope: string;
};

export type OverlayControllerLayerOptions<Reason extends string> = {
  containsTrigger?: boolean;
  disableOutsidePointerEvents?: Accessor<boolean>;
  modal?: Accessor<boolean>;
  onDismiss?: (event: Event) => void;
  restoreFocus?: Accessor<boolean>;
  trapFocus?: Accessor<boolean>;
  dismissReason?: (event: Event) => Reason;
};

export type OverlayController<Reason extends string> = {
  close: (event: Event | undefined, reason: Reason) => void;
  contentElement: Accessor<HTMLElement | undefined>;
  contentId: string;
  descriptionId: string;
  floating?: FloatingAdapter;
  getCloseProps: <T extends HTMLElement>(
    props: JSX.HTMLAttributes<T>,
    reason: Reason,
  ) => JSX.HTMLAttributes<T>;
  getContentLayerProps: <T extends HTMLElement>(
    props: JSX.HTMLAttributes<T> & OverlayControllerContentEvents,
    options?: OverlayControllerLayerOptions<Reason>,
  ) => JSX.HTMLAttributes<T> & {
    "data-layer-id": string;
    ref: (element: T) => void;
  };
  getFloatingContentProps: <T extends HTMLElement>(
    props: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T> & {
    ref: (element: T) => void;
  };
  getFloatingPositionerProps: <T extends HTMLElement>(
    props: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T> & {
    ref: (element: T) => void;
  };
  getHoverFocusTriggerProps: <T extends HTMLElement>(
    props: JSX.HTMLAttributes<T>,
    options: {
      deferOpenChange?: boolean;
      focusReason: Reason;
      pointerReason: Reason;
    },
  ) => JSX.HTMLAttributes<T>;
  getPartProps: (part: string) => Record<string, unknown>;
  getTriggerProps: <T extends HTMLElement>(
    props: JSX.HTMLAttributes<T>,
    options: {
      action: "open" | "toggle";
      ariaDescribedBy?: boolean;
      ariaHasPopup?: JSX.HTMLAttributes<T>["aria-haspopup"];
      reason: Reason;
    },
  ) => JSX.HTMLAttributes<T>;
  modal: Accessor<boolean>;
  open: Accessor<boolean>;
  presence: OverlayPresenceApi;
  hidden: (forceMount?: boolean) => boolean;
  setOpen: (open: boolean, detail: OverlayControllerChangeDetail<Reason>) => void;
  setVirtualAnchor: (anchor: FloatingReferenceElement | undefined) => void;
  shouldMount: (forceMount?: boolean) => boolean;
  state: Accessor<"closed" | "open">;
  titleId: string;
  triggerElement: Accessor<HTMLElement | undefined>;
  triggerId: string;
};

export function createOverlayController<Reason extends string>(
  options: OverlayControllerOptions<Reason>,
): OverlayController<Reason> {
  const triggerId = createStableId(options.ids?.trigger ?? `${options.scope}-trigger`);
  const contentId = createStableId(options.ids?.content ?? `${options.scope}-content`);
  const titleId = createStableId(options.ids?.title ?? `${options.scope}-title`);
  const descriptionId = createStableId(options.ids?.description ?? `${options.scope}-description`);
  const [triggerElement, setTriggerElement] = createSignal<HTMLElement>();
  const [contentElement, setContentElement] = createSignal<HTMLElement>();
  const [positionerElement, setPositionerElement] = createSignal<HTMLElement>();
  const [virtualAnchor, setVirtualAnchor] = createSignal<FloatingReferenceElement>();
  let contentLayer: OverlayLayerApi | undefined;
  let currentContentEvents: OverlayControllerContentEvents | undefined;
  const [open, setOpenState] = createControllableBooleanSignal({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    defaultDetail: { reason: "programmatic" as Reason },
    onChange: options.onOpenChange,
  });
  const presence = createOverlayPresence({
    open,
    onOpenChangeComplete: options.onOpenChangeComplete,
  });
  const floating = options.floating
    ? createFloatingAdapter({
        anchor: () => virtualAnchor() ?? options.floating?.anchor?.() ?? triggerElement(),
        floating: () => positionerElement() ?? contentElement(),
        enabled: open,
        arrowPadding: options.floating.arrowPadding,
        collisionBoundary: options.floating.collisionBoundary,
        collisionPadding: options.floating.collisionPadding,
        fitViewport: options.floating.fitViewport,
        gutter: options.floating.gutter,
        placement: options.floating.placement,
        rootBoundary: options.floating.rootBoundary,
        sameWidth: options.floating.sameWidth,
        sticky: options.floating.sticky,
        strategy: options.floating.strategy,
      })
    : undefined;
  const modal = () => options.modal?.() ?? false;
  const setOpen = (next: boolean, detail: OverlayControllerChangeDetail<Reason>) => {
    setOpenState(next, detail);
  };
  const dismissal = createOverlayDismissalPolicy<Reason>({
    close: (event, reason) => setOpen(false, { event, reason }),
    contentEvents: () => currentContentEvents,
    modal,
    triggerElement,
  });
  const state = () => getOpenClosedState(open());
  const shouldMount = (forceMount?: boolean) => presence.shouldMount(forceMount);
  createEffect(() => {
    const content = contentElement();
    const status = presence.transitionStatus();
    const currentState = state();

    content?.setAttribute("data-state", currentState);
    content?.setAttribute("data-transition-status", status);
  });
  createEffect(() => {
    const positioner = positionerElement();
    const status = presence.transitionStatus();
    const currentState = state();

    positioner?.setAttribute("data-state", currentState);
    positioner?.setAttribute("data-transition-status", status);
  });
  const getPartProps = (part: string) => ({
    ...getPartDataAttributes(options.scope, part),
    get "data-state"() {
      return state();
    },
    get "data-transition-status"() {
      return presence.transitionStatus();
    },
  });
  const getFloatingProps = <T extends HTMLElement>(props: JSX.HTMLAttributes<T>) => {
    return floating?.getFloatingProps({ style: props.style }) ?? { style: props.style };
  };

  return {
    close: (event, reason) => setOpen(false, { event, reason }),
    contentElement,
    contentId: contentId(),
    descriptionId: descriptionId(),
    floating,
    getCloseProps: (props, reason) => ({
      ...props,
      type: "button",
      ...getPartProps("close"),
      onClick: composeEventHandlers<MouseEvent>(props.onClick, (event) => {
        setOpen(false, { event, reason });
      }),
    }),
    getContentLayerProps: <T extends HTMLElement>(
      props: JSX.HTMLAttributes<T> & OverlayControllerContentEvents,
      layerOptions: OverlayControllerLayerOptions<Reason> = {},
    ) => {
      currentContentEvents = props;
      const {
        onEscapeKeyDown: _onEscapeKeyDown,
        onFocusOutside: _onFocusOutside,
        onInteractOutside: _onInteractOutside,
        onMountAutoFocus: _onMountAutoFocus,
        onPointerDownOutside: _onPointerDownOutside,
        onUnmountAutoFocus: _onUnmountAutoFocus,
        ...domProps
      } = props;
      contentLayer ??= createOverlayLayer({
        id: contentId(),
        element: contentElement,
        enabled: () => open() || presence.transitionStatus() !== "closed",
        modal: layerOptions.modal ?? modal,
        containsTarget: (target) => dismissal.containsTarget(target, layerOptions),
        disableOutsidePointerEvents: () => dismissal.disableOutsidePointerEvents(layerOptions),
        trapFocus: () => dismissal.trapFocus(layerOptions),
        restoreFocus: () => dismissal.restoreFocus(layerOptions),
        onEscapeKeyDown: dismissal.onEscapeKeyDown,
        onPointerDownOutside: (event) => dismissal.onPointerDownOutside(event, layerOptions),
        onFocusOutside: (event) => dismissal.onFocusOutside(event, layerOptions),
        onInteractOutside: (event) => dismissal.onInteractOutside(event, layerOptions),
        onMountAutoFocus: dismissal.onMountAutoFocus,
        onUnmountAutoFocus: dismissal.onUnmountAutoFocus,
        onDismiss: (event) => dismissal.onDismiss(event, layerOptions),
      } satisfies CreateOverlayLayerOptions);
      const layer = contentLayer;

      return {
        ...domProps,
        "data-layer-id": layer.id,
        get "data-layer-index"() {
          return layer.index();
        },
        get "data-top-layer"() {
          return layer.isTopLayer() ? "" : undefined;
        },
        ref: (element: T) => {
          setContentElement(() => element);
          presence.setElement(element);
          assignRef(domProps.ref, element);
        },
      };
    },
    getFloatingContentProps: <T extends HTMLElement>(props: JSX.HTMLAttributes<T>) => {
      const floatingProps = getFloatingProps(props);

      return {
        ...props,
        "data-side": floating?.side(),
        "data-align": floating?.align(),
        style: floatingProps.style,
        ref: (element: T) => {
          setContentElement(() => element);
          presence.setElement(element);
          assignRef(props.ref, element);
          scheduleMicrotask(() => floating?.update());
        },
      };
    },
    getFloatingPositionerProps: <T extends HTMLElement>(props: JSX.HTMLAttributes<T>) => {
      const floatingProps = getFloatingProps(props);

      return {
        ...props,
        "data-side": floating?.side(),
        "data-align": floating?.align(),
        style: floatingProps.style,
        ref: (element: T) => {
          setPositionerElement(() => element);
          assignRef(props.ref, element);
          scheduleMicrotask(() => floating?.update());
        },
      };
    },
    getHoverFocusTriggerProps: <T extends HTMLElement>(
      props: JSX.HTMLAttributes<T>,
      triggerOptions: {
        deferOpenChange?: boolean;
        focusReason: Reason;
        pointerReason: Reason;
      },
    ) => ({
      ...props,
      type: "button",
      "aria-describedby": contentId(),
      ...getPartProps("trigger"),
      ref: (element: T) => {
        setTriggerElement(() => element);
        assignRef(props.ref, element);
      },
      onBlur: composeEventHandlers<FocusEvent>(props.onBlur, (event) => {
        if (triggerOptions.deferOpenChange) {
          return;
        }

        setOpen(false, { event, reason: triggerOptions.focusReason });
      }),
      onFocus: composeEventHandlers<FocusEvent>(props.onFocus, (event) => {
        if (triggerOptions.deferOpenChange) {
          return;
        }

        setOpen(true, { event, reason: triggerOptions.focusReason });
      }),
      onPointerEnter: composeEventHandlers<PointerEvent>(props.onPointerEnter, (event) => {
        if (triggerOptions.deferOpenChange) {
          return;
        }

        setOpen(true, { event, reason: triggerOptions.pointerReason });
      }),
      onPointerLeave: composeEventHandlers<PointerEvent>(props.onPointerLeave, (event) => {
        if (triggerOptions.deferOpenChange) {
          return;
        }

        setOpen(false, { event, reason: triggerOptions.pointerReason });
      }),
    }),
    getPartProps,
    getTriggerProps: <T extends HTMLElement>(
      props: JSX.HTMLAttributes<T>,
      triggerOptions: {
        action: "open" | "toggle";
        ariaDescribedBy?: boolean;
        ariaHasPopup?: JSX.HTMLAttributes<T>["aria-haspopup"];
        reason: Reason;
      },
    ) => ({
      ...props,
      id: triggerId(),
      type: "button",
      "aria-controls": triggerOptions.ariaDescribedBy ? undefined : contentId(),
      "aria-describedby": triggerOptions.ariaDescribedBy ? contentId() : undefined,
      get "aria-expanded"() {
        return triggerOptions.ariaDescribedBy ? undefined : open();
      },
      "aria-haspopup": triggerOptions.ariaHasPopup,
      ...getPartProps("trigger"),
      ref: (element: T) => {
        setTriggerElement(() => element);
        assignRef(props.ref, element);
      },
      onClick: composeEventHandlers<MouseEvent>(props.onClick, (event) => {
        setOpen(triggerOptions.action === "toggle" ? !open() : true, {
          event,
          reason: triggerOptions.reason,
        });
      }),
    }),
    modal,
    open,
    presence,
    hidden: presence.hidden,
    setOpen,
    setVirtualAnchor: (anchor) => setVirtualAnchor(() => anchor),
    shouldMount,
    state,
    titleId: titleId(),
    triggerElement,
    triggerId: triggerId(),
  };
}
