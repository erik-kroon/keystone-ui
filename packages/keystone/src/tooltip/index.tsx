import { Show, createContext, splitProps, useContext, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import {
  OverlayLayerProvider,
  type FloatingAdapter,
  type FloatingPlacement,
} from "../overlay/index";
import { createOverlayController } from "../overlay/controller";
import { callEventHandler, renderPolymorphic, type PolymorphicProps } from "../utils/index";

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
  const overlay = createOverlayController<TooltipOpenChangeDetail["reason"]>({
    scope: "tooltip",
    open: options.open,
    defaultOpen: options.defaultOpen,
    onOpenChange: (open, detail) => options.onOpenChange?.(open, detail),
    floating: {
      placement: options.placement,
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
      const floatingProps = overlay.getFloatingContentProps<HTMLDivElement>(props);

      return {
        ...floatingProps,
        id: overlay.contentId,
        role: "tooltip",
        ...partProps("content"),
        onKeyDown: (event: KeyboardEvent) => {
          callEventHandler(props.onKeyDown, event);
          if (event.defaultPrevented || event.key !== "Escape") {
            return;
          }

          event.preventDefault();
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
    getTriggerProps: (props) =>
      overlay.getHoverFocusTriggerProps(props, {
        focusReason: "focus",
        pointerReason: "pointer",
      }) as Record<string, unknown>,
    open: overlay.open,
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
  Root,
  Trigger,
  Portal: PortalPart,
  Positioner,
  Content,
};
