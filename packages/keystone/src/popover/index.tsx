import { Show, createContext, createSignal, splitProps, useContext, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { assignRef, contains } from "../overlay/dom";
import {
  OverlayLayerProvider,
  createFloatingAdapter,
  createOverlayLayer,
  type FloatingAdapter,
  type FloatingPlacement,
  type OverlayLayerOutsideEvent,
} from "../overlay/index";
import {
  composeEventHandlers,
  createControllableBooleanSignal,
  createStableId,
  renderPolymorphic,
  type PolymorphicProps,
} from "../utils/index";

export type PopoverOpenChangeDetail = {
  event?: Event;
  reason: "trigger" | "escape" | "outside" | "programmatic";
};

export type PopoverRootProps = {
  children?: JSX.Element;
  defaultOpen?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean, detail: PopoverOpenChangeDetail) => void;
  open?: boolean;
  placement?: FloatingPlacement;
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
  getContentProps: (props: Omit<PopoverContentProps, "children">) => Record<string, unknown>;
  getPositionerProps: (props: Omit<PopoverPositionerProps, "children">) => Record<string, unknown>;
  getTriggerProps: (props: Omit<PopoverTriggerProps, "as" | "children">) => Record<string, unknown>;
  open: () => boolean;
};

export type CreatePopoverOptions = {
  defaultOpen?: boolean;
  modal?: () => boolean | undefined;
  onOpenChange?: (open: boolean, detail: PopoverOpenChangeDetail) => void;
  open?: () => boolean | undefined;
  placement?: () => FloatingPlacement | undefined;
};

const PopoverContext = createContext<PopoverApi>();

export function createPopover(options: CreatePopoverOptions = {}): PopoverApi {
  const triggerId = createStableId("popover-trigger");
  const contentId = createStableId("popover-content");
  const [triggerElement, setTriggerElement] = createSignal<HTMLButtonElement>();
  const [contentElement, setContentElement] = createSignal<HTMLDivElement>();
  const [positionerElement, setPositionerElement] = createSignal<HTMLDivElement>();
  let lastDetail: PopoverOpenChangeDetail = { reason: "programmatic" };
  const [open, setOpenState] = createControllableBooleanSignal({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: (next) => options.onOpenChange?.(next, lastDetail),
  });
  const floating = createFloatingAdapter({
    anchor: triggerElement,
    floating: () => positionerElement() ?? contentElement(),
    enabled: open,
    placement: options.placement,
  });
  const setOpen = (next: boolean, detail: PopoverOpenChangeDetail) => {
    lastDetail = detail;
    setOpenState(next);
  };
  const state = () => (open() ? "open" : "closed");
  const partProps = (part: string) => ({
    "data-scope": "popover",
    "data-part": part,
    "data-state": state(),
  });

  return {
    contentId: contentId(),
    floating,
    getContentProps: (props) => {
      createOverlayLayer({
        id: contentId(),
        element: contentElement,
        modal: () => options.modal?.() ?? false,
        containsTarget: (target) => contains(triggerElement(), target),
        disableOutsidePointerEvents: () => options.modal?.() ?? false,
        onEscapeKeyDown: props.onEscapeKeyDown,
        onPointerDownOutside: props.onPointerDownOutside,
        onFocusOutside: props.onFocusOutside,
        onInteractOutside: props.onInteractOutside,
        onDismiss: (event) => {
          setOpen(false, { event, reason: event.type === "keydown" ? "escape" : "outside" });
        },
      });

      const floatingProps = floating.getFloatingProps({ style: props.style });
      return {
        ...props,
        id: contentId(),
        role: "dialog",
        tabindex: -1,
        ...partProps("content"),
        "data-side": floating.side(),
        "data-align": floating.align(),
        style: floatingProps.style,
        ref: (element: HTMLDivElement) => {
          setContentElement(element);
          assignRef(props.ref, element);
          queueMicrotask(floating.update);
        },
      };
    },
    getPositionerProps: (props) => {
      const floatingProps = floating.getFloatingProps({ style: props.style });
      return {
        ...props,
        ...partProps("positioner"),
        "data-side": floating.side(),
        "data-align": floating.align(),
        style: floatingProps.style,
        ref: (element: HTMLDivElement) => {
          setPositionerElement(element);
          assignRef(props.ref, element);
          queueMicrotask(floating.update);
        },
      };
    },
    getTriggerProps: (props) => ({
      ...props,
      id: triggerId(),
      type: "button",
      "aria-controls": contentId(),
      "aria-expanded": open(),
      "aria-haspopup": "dialog",
      ...partProps("trigger"),
      ref: (element: HTMLButtonElement) => {
        setTriggerElement(element);
        assignRef(props.ref, element);
      },
      onClick: composeEventHandlers(props.onClick, (event) => {
        setOpen(!open(), { event, reason: "trigger" });
      }),
    }),
    open,
  };
}

function usePopover(part: string) {
  const popover = useContext(PopoverContext);
  if (!popover) throw new Error(`Popover.${part} must be used within Popover.Root`);
  return popover;
}

function Root(props: PopoverRootProps) {
  const popover = createPopover({
    defaultOpen: props.defaultOpen,
    modal: () => props.modal,
    onOpenChange: props.onOpenChange,
    open: () => props.open,
    placement: () => props.placement,
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
    <Show when={props.forceMount || popover.open()}>
      <Portal mount={props.mount}>{props.children}</Portal>
    </Show>
  );
}

function Positioner(props: PopoverPositionerProps) {
  const popover = usePopover("Positioner");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);
  return (
    <div {...popover.getPositionerProps({ ...others, ref: local.ref, style: local.style })}>
      {local.children}
    </div>
  );
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
  return (
    <div
      {...popover.getContentProps({
        ...others,
        onEscapeKeyDown: local.onEscapeKeyDown,
        onFocusOutside: local.onFocusOutside,
        onInteractOutside: local.onInteractOutside,
        onPointerDownOutside: local.onPointerDownOutside,
        ref: local.ref,
        style: local.style,
      })}
    >
      {local.children}
    </div>
  );
}

export const Popover = {
  Root,
  Trigger,
  Portal: PortalPart,
  Positioner,
  Content,
};
