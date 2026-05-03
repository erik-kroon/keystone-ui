import { Show, createContext, splitProps, useContext, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import {
  OverlayLayerProvider,
  type FloatingAdapter,
  type FloatingPlacement,
  type OverlayLayerOutsideEvent,
} from "../overlay/index";
import { createOverlayController } from "../overlay/controller";
import { renderPolymorphic, type PolymorphicProps } from "../utils/index";

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
  const overlay = createOverlayController<PopoverOpenChangeDetail["reason"]>({
    scope: "popover",
    open: options.open,
    defaultOpen: options.defaultOpen,
    modal: () => options.modal?.() ?? false,
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
        role: "dialog",
        tabindex: -1,
        ...partProps("content"),
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
      overlay.getTriggerProps(props, {
        action: "toggle",
        ariaHasPopup: "dialog",
        reason: "trigger",
      }) as Record<string, unknown>,
    open: overlay.open,
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

export const Popover = {
  Root,
  Trigger,
  Portal: PortalPart,
  Positioner,
  Content,
};
