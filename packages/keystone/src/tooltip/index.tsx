import { Show, createContext, createSignal, splitProps, useContext, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { assignRef, contains } from "../overlay/dom";
import {
  OverlayLayerProvider,
  createFloatingAdapter,
  createOverlayLayer,
  type FloatingAdapter,
  type FloatingPlacement,
} from "../overlay/index";
import {
  composeEventHandlers,
  createControllableBooleanSignal,
  createStableId,
  renderPolymorphic,
  type PolymorphicProps,
} from "../utils/index";

export type TooltipOpenChangeDetail = {
  event?: Event;
  reason: "pointer" | "focus" | "escape" | "programmatic";
};

export type TooltipRootProps = {
  children?: JSX.Element;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, detail: TooltipOpenChangeDetail) => void;
  open?: boolean;
  placement?: FloatingPlacement;
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

type TooltipApi = {
  contentId: string;
  floating: FloatingAdapter;
  getContentProps: (props: Omit<TooltipContentProps, "children">) => Record<string, unknown>;
  getPositionerProps: (props: Omit<TooltipPositionerProps, "children">) => Record<string, unknown>;
  getTriggerProps: (props: Omit<TooltipTriggerProps, "as" | "children">) => Record<string, unknown>;
  open: () => boolean;
};

export type CreateTooltipOptions = {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, detail: TooltipOpenChangeDetail) => void;
  open?: () => boolean | undefined;
  placement?: () => FloatingPlacement | undefined;
};

const TooltipContext = createContext<TooltipApi>();

export function createTooltip(options: CreateTooltipOptions = {}): TooltipApi {
  const contentId = createStableId("tooltip-content");
  const [triggerElement, setTriggerElement] = createSignal<HTMLButtonElement>();
  const [contentElement, setContentElement] = createSignal<HTMLDivElement>();
  const [positionerElement, setPositionerElement] = createSignal<HTMLDivElement>();
  let lastDetail: TooltipOpenChangeDetail = { reason: "programmatic" };
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
  const setOpen = (next: boolean, detail: TooltipOpenChangeDetail) => {
    lastDetail = detail;
    setOpenState(next);
  };
  const state = () => (open() ? "open" : "closed");
  const partProps = (part: string) => ({
    "data-scope": "tooltip",
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
        containsTarget: (target) => contains(triggerElement(), target),
        onEscapeKeyDown: (event) => {
          event.preventDefault();
          setOpen(false, { event, reason: "escape" });
        },
      });

      const floatingProps = floating.getFloatingProps({ style: props.style });
      return {
        ...props,
        id: contentId(),
        role: "tooltip",
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
      type: "button",
      "aria-describedby": contentId(),
      ...partProps("trigger"),
      ref: (element: HTMLButtonElement) => {
        setTriggerElement(element);
        assignRef(props.ref, element);
      },
      onBlur: composeEventHandlers<FocusEvent>(props.onBlur, (event) => {
        setOpen(false, { event, reason: "focus" });
      }),
      onFocus: composeEventHandlers<FocusEvent>(props.onFocus, (event) => {
        setOpen(true, { event, reason: "focus" });
      }),
      onPointerEnter: composeEventHandlers<PointerEvent>(props.onPointerEnter, (event) => {
        setOpen(true, { event, reason: "pointer" });
      }),
      onPointerLeave: composeEventHandlers<PointerEvent>(props.onPointerLeave, (event) => {
        setOpen(false, { event, reason: "pointer" });
      }),
    }),
    open,
  };
}

function useTooltip(part: string) {
  const tooltip = useContext(TooltipContext);
  if (!tooltip) throw new Error(`Tooltip.${part} must be used within Tooltip.Root`);
  return tooltip;
}

function Root(props: TooltipRootProps) {
  const tooltip = createTooltip({
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
    open: () => props.open,
    placement: () => props.placement,
  });
  return (
    <OverlayLayerProvider>
      <TooltipContext.Provider value={tooltip}>{props.children}</TooltipContext.Provider>
    </OverlayLayerProvider>
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
    <Show when={props.forceMount || tooltip.open()}>
      <Portal mount={props.mount}>{props.children}</Portal>
    </Show>
  );
}

function Positioner(props: TooltipPositionerProps) {
  const tooltip = useTooltip("Positioner");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);
  return (
    <div {...tooltip.getPositionerProps({ ...others, ref: local.ref, style: local.style })}>
      {local.children}
    </div>
  );
}

function Content(props: TooltipContentProps) {
  const tooltip = useTooltip("Content");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);
  return (
    <div {...tooltip.getContentProps({ ...others, ref: local.ref, style: local.style })}>
      {local.children}
    </div>
  );
}

export const Tooltip = {
  Root,
  Trigger,
  Portal: PortalPart,
  Positioner,
  Content,
};
