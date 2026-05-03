import { createSignal, type Accessor, type JSX } from "solid-js";
import { assignRef, contains } from "./dom";
import { createFloatingAdapter, type FloatingAdapter, type FloatingPlacement } from "./floating";
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
} from "../utils/index";

export type OverlayControllerChangeDetail<Reason extends string> = {
  event?: Event;
  reason: Reason;
};

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
    placement?: Accessor<FloatingPlacement | undefined>;
  };
  ids?: {
    content?: string;
    description?: string;
    title?: string;
    trigger?: string;
  };
  modal?: Accessor<boolean | undefined>;
  onOpenChange?: (open: boolean, detail: OverlayControllerChangeDetail<Reason>) => void;
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
  setOpen: (open: boolean, detail: OverlayControllerChangeDetail<Reason>) => void;
  shouldMount: (forceMount?: boolean) => boolean;
  state: Accessor<"closed" | "open">;
  titleId: string;
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
  let lastDetail: OverlayControllerChangeDetail<Reason> = {
    reason: "programmatic" as Reason,
  };
  let contentLayer: OverlayLayerApi | undefined;
  let currentContentEvents: OverlayControllerContentEvents | undefined;
  const [open, setOpenState] = createControllableBooleanSignal({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: (next) => options.onOpenChange?.(next, lastDetail),
  });
  const floating = options.floating
    ? createFloatingAdapter({
        anchor: triggerElement,
        floating: () => positionerElement() ?? contentElement(),
        enabled: open,
        placement: options.floating.placement,
      })
    : undefined;
  const modal = () => options.modal?.() ?? false;
  const state = () => (open() ? "open" : "closed") as "closed" | "open";
  const setOpen = (next: boolean, detail: OverlayControllerChangeDetail<Reason>) => {
    lastDetail = detail;
    setOpenState(next);
  };
  const getPartProps = (part: string) => ({
    "data-scope": options.scope,
    "data-part": part,
    get "data-state"() {
      return state();
    },
  });
  const getFloatingProps = <T extends HTMLElement>(props: JSX.HTMLAttributes<T>) => {
    return floating?.getFloatingProps({ style: props.style }) ?? { style: props.style };
  };

  return {
    close: (event, reason) => setOpen(false, { event, reason }),
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
        modal: layerOptions.modal ?? modal,
        containsTarget: layerOptions.containsTrigger
          ? (target) => contains(triggerElement(), target)
          : undefined,
        disableOutsidePointerEvents: layerOptions.disableOutsidePointerEvents,
        trapFocus: layerOptions.trapFocus,
        restoreFocus: layerOptions.restoreFocus,
        onEscapeKeyDown: (event) => currentContentEvents?.onEscapeKeyDown?.(event),
        onPointerDownOutside: (event) => currentContentEvents?.onPointerDownOutside?.(event),
        onFocusOutside: (event) => currentContentEvents?.onFocusOutside?.(event),
        onInteractOutside: (event) => currentContentEvents?.onInteractOutside?.(event),
        onMountAutoFocus: (event) => currentContentEvents?.onMountAutoFocus?.(event),
        onUnmountAutoFocus: (event) => currentContentEvents?.onUnmountAutoFocus?.(event),
        onDismiss: (event) => {
          if (layerOptions.onDismiss) {
            layerOptions.onDismiss(event);
            return;
          }

          setOpen(false, {
            event,
            reason: layerOptions.dismissReason?.(event) ?? ("programmatic" as Reason),
          });
        },
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
          assignRef(props.ref, element);
          queueMicrotask(() => floating?.update());
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
          queueMicrotask(() => floating?.update());
        },
      };
    },
    getHoverFocusTriggerProps: <T extends HTMLElement>(
      props: JSX.HTMLAttributes<T>,
      triggerOptions: {
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
        setOpen(false, { event, reason: triggerOptions.focusReason });
      }),
      onFocus: composeEventHandlers<FocusEvent>(props.onFocus, (event) => {
        setOpen(true, { event, reason: triggerOptions.focusReason });
      }),
      onPointerEnter: composeEventHandlers<PointerEvent>(props.onPointerEnter, (event) => {
        setOpen(true, { event, reason: triggerOptions.pointerReason });
      }),
      onPointerLeave: composeEventHandlers<PointerEvent>(props.onPointerLeave, (event) => {
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
    setOpen,
    shouldMount: (forceMount) => forceMount === true || open(),
    state,
    titleId: titleId(),
    triggerId: triggerId(),
  };
}
