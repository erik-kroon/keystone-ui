import { createContext, createSignal, splitProps, useContext, type JSX } from "solid-js";
import { getPartDataAttributes } from "../metadata/index";
import { assignRef } from "../overlay/dom";
import {
  OverlayLayerProvider,
  type OverlayLayerOutsideEvent,
  type OverlayPresenceCompleteDetail,
} from "../overlay/index";
import { createOverlayController } from "../overlay/controller";
import { Portal } from "../portal/index";
import { renderPolymorphic, type PolymorphicProps } from "../utils/index";

export type DrawerChangeDetail = {
  event?: Event;
  reason: "trigger" | "close" | "escape" | "outside" | "programmatic";
};

export type DrawerSide = "top" | "right" | "bottom" | "left";

export type DrawerRootProps = {
  children?: JSX.Element;
  defaultOpen?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean, detail: DrawerChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open?: boolean;
  side?: DrawerSide;
};

export type DrawerPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type DrawerTriggerProps = DrawerPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type DrawerCloseProps = DrawerPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type DrawerPortalProps = {
  children?: JSX.Element;
  forceMount?: boolean;
  mount?: Node;
};
export type DrawerBackdropProps = DrawerPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type DrawerPositionerProps = DrawerPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type DrawerContentProps = DrawerPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: OverlayLayerOutsideEvent) => void;
    onFocusOutside?: (event: OverlayLayerOutsideEvent) => void;
    onInteractOutside?: (event: OverlayLayerOutsideEvent) => void;
    onMountAutoFocus?: (event: Event) => void;
    onUnmountAutoFocus?: (event: Event) => void;
  };
export type DrawerTitleProps = DrawerPartProps<HTMLHeadingElement> &
  Omit<JSX.HTMLAttributes<HTMLHeadingElement>, "children" | "ref">;
export type DrawerDescriptionProps = DrawerPartProps<HTMLParagraphElement> &
  Omit<JSX.HTMLAttributes<HTMLParagraphElement>, "children" | "ref">;

export type DrawerTriggerContractProps = Omit<DrawerTriggerProps, "as" | "children">;
export type DrawerCloseContractProps = Omit<DrawerCloseProps, "as" | "children">;
export type DrawerContentContractProps = Omit<DrawerContentProps, "children">;
export type DrawerBackdropContractProps = Omit<DrawerBackdropProps, "children">;
export type DrawerPositionerContractProps = Omit<DrawerPositionerProps, "children">;
export type DrawerTitleContractProps = Omit<DrawerTitleProps, "children">;
export type DrawerDescriptionContractProps = Omit<DrawerDescriptionProps, "children">;

export type DrawerApi = {
  contentId: string;
  descriptionId: string;
  getBackdropProps: (props: DrawerBackdropContractProps) => Record<string, unknown>;
  getCloseProps: (props: DrawerCloseContractProps) => Record<string, unknown>;
  getContentProps: (props: DrawerContentContractProps) => Record<string, unknown>;
  getDescriptionProps: (props: DrawerDescriptionContractProps) => Record<string, unknown>;
  getPositionerProps: (props: DrawerPositionerContractProps) => Record<string, unknown>;
  getTitleProps: (props: DrawerTitleContractProps) => Record<string, unknown>;
  getTriggerProps: (props: DrawerTriggerContractProps) => Record<string, unknown>;
  modal: () => boolean;
  open: () => boolean;
  setOpen: (open: boolean, detail: DrawerChangeDetail) => void;
  hidden: (forceMount?: boolean) => boolean;
  shouldMount: (forceMount?: boolean) => boolean;
  side: () => DrawerSide;
  titleId: string;
};

export type CreateDrawerOptions = {
  defaultOpen?: boolean;
  modal?: () => boolean | undefined;
  onOpenChange?: (open: boolean, detail: DrawerChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open?: () => boolean | undefined;
  side?: () => DrawerSide | undefined;
};

const DrawerContext = createContext<DrawerApi>();

export function createDrawer(options: CreateDrawerOptions = {}): DrawerApi {
  const [backdropElement, setBackdropElement] = createSignal<HTMLDivElement>();
  const [positionerElement, setPositionerElement] = createSignal<HTMLDivElement>();
  const outsidePointerElements = () =>
    [backdropElement(), positionerElement()].filter(
      (element): element is HTMLDivElement => element !== undefined,
    );
  const overlay = createOverlayController<DrawerChangeDetail["reason"]>({
    scope: "drawer",
    open: options.open,
    defaultOpen: options.defaultOpen,
    modal: () => options.modal?.() ?? true,
    onOpenChange: (open, detail) => options.onOpenChange?.(open, detail),
    onOpenChangeComplete: options.onOpenChangeComplete,
  });
  const side = () => options.side?.() ?? "right";
  const partProps = (part: string) => ({
    ...overlay.getPartProps(part),
    "data-side": side(),
  });

  return {
    contentId: overlay.contentId,
    descriptionId: overlay.descriptionId,
    getBackdropProps: (props) => ({
      ...props,
      ref: (element: HTMLDivElement) => {
        setBackdropElement(() => element);
        assignRef(props.ref, element);
      },
      get hidden() {
        return overlay.hidden();
      },
      ...partProps("backdrop"),
    }),
    getCloseProps: (props) => ({
      ...overlay.getCloseProps(props, "close"),
      ...partProps("close"),
    }),
    getContentProps: (props) => {
      const [local, others] = splitProps(props, [
        "ref",
        "onEscapeKeyDown",
        "onPointerDownOutside",
        "onFocusOutside",
        "onInteractOutside",
        "onMountAutoFocus",
        "onUnmountAutoFocus",
      ]);
      const layerProps = overlay.getContentLayerProps<HTMLDivElement>(
        {
          ref: local.ref,
          onEscapeKeyDown: local.onEscapeKeyDown,
          onFocusOutside: local.onFocusOutside,
          onInteractOutside: local.onInteractOutside,
          onMountAutoFocus: local.onMountAutoFocus,
          onPointerDownOutside: local.onPointerDownOutside,
          onUnmountAutoFocus: local.onUnmountAutoFocus,
        },
        {
          containsTrigger: true,
          modal: overlay.modal,
          disableOutsidePointerEvents: overlay.modal,
          outsidePointerElements,
          trapFocus: overlay.modal,
          dismissReason: (event) => (event.type === "keydown" ? "escape" : "outside"),
        },
      );

      return {
        ...others,
        ...layerProps,
        id: overlay.contentId,
        get hidden() {
          return overlay.hidden();
        },
        tabIndex: -1,
        role: "dialog",
        "aria-modal": overlay.modal() ? "true" : undefined,
        "aria-labelledby": overlay.titleId,
        "aria-describedby": overlay.descriptionId,
        ...partProps("content"),
      };
    },
    getDescriptionProps: (props) => ({
      ...props,
      id: overlay.descriptionId,
      ...getPartDataAttributes("drawer", "description"),
    }),
    getPositionerProps: (props) => ({
      ...props,
      ref: (element: HTMLDivElement) => {
        setPositionerElement(() => element);
        assignRef(props.ref, element);
      },
      get hidden() {
        return overlay.hidden();
      },
      ...partProps("positioner"),
    }),
    getTitleProps: (props) => ({
      ...props,
      id: overlay.titleId,
      ...getPartDataAttributes("drawer", "title"),
    }),
    getTriggerProps: (props) => ({
      ...overlay.getTriggerProps(props, {
        action: "open",
        reason: "trigger",
      }),
      ...partProps("trigger"),
    }),
    modal: overlay.modal,
    open: overlay.open,
    setOpen: overlay.setOpen,
    hidden: overlay.hidden,
    shouldMount: overlay.shouldMount,
    side,
    titleId: overlay.titleId,
  };
}

function useDrawer(part: string) {
  const drawer = useContext(DrawerContext);
  if (!drawer) throw new Error(`Drawer.${part} must be used within Drawer.Root`);
  return drawer;
}

function Root(props: DrawerRootProps) {
  const drawer = createDrawer({
    defaultOpen: props.defaultOpen,
    modal: () => props.modal,
    onOpenChange: props.onOpenChange,
    onOpenChangeComplete: props.onOpenChangeComplete,
    open: () => props.open,
    side: () => props.side,
  });

  return (
    <OverlayLayerProvider>
      <DrawerContext.Provider value={drawer}>{props.children}</DrawerContext.Provider>
    </OverlayLayerProvider>
  );
}

function Trigger(props: DrawerTriggerProps) {
  const drawer = useDrawer("Trigger");
  const [local, others] = splitProps(props, ["as", "children"]);
  const triggerProps = drawer.getTriggerProps(others);
  if (!local.as) return <button {...triggerProps}>{local.children}</button>;
  return renderPolymorphic(local.as, "button", { ...triggerProps, children: local.children });
}

function PortalPart(props: DrawerPortalProps) {
  const drawer = useDrawer("Portal");
  return (
    <Portal
      forceMount={props.forceMount}
      mount={props.mount}
      present={drawer.shouldMount(props.forceMount)}
    >
      {props.children}
    </Portal>
  );
}

function Backdrop(props: DrawerBackdropProps) {
  const drawer = useDrawer("Backdrop");
  const [local, others] = splitProps(props, ["children"]);
  return <div {...drawer.getBackdropProps(others)}>{local.children}</div>;
}

function Positioner(props: DrawerPositionerProps) {
  const drawer = useDrawer("Positioner");
  const [local, others] = splitProps(props, ["children"]);
  const positionerProps = drawer.getPositionerProps(others);
  return <div {...positionerProps}>{local.children}</div>;
}

function Content(props: DrawerContentProps) {
  const drawer = useDrawer("Content");
  const [local, others] = splitProps(props, ["children"]);
  const contentProps = drawer.getContentProps(others);

  return <div {...contentProps}>{local.children}</div>;
}

function Title(props: DrawerTitleProps) {
  const drawer = useDrawer("Title");
  const [local, others] = splitProps(props, ["children"]);
  return <h2 {...drawer.getTitleProps(others)}>{local.children}</h2>;
}

function Description(props: DrawerDescriptionProps) {
  const drawer = useDrawer("Description");
  const [local, others] = splitProps(props, ["children"]);
  return <p {...drawer.getDescriptionProps(others)}>{local.children}</p>;
}

function Close(props: DrawerCloseProps) {
  const drawer = useDrawer("Close");
  const [local, others] = splitProps(props, ["as", "children"]);
  const closeProps = drawer.getCloseProps(others);
  if (!local.as) return <button {...closeProps}>{local.children}</button>;
  return renderPolymorphic(local.as, "button", { ...closeProps, children: local.children });
}

export const Drawer = {
  Root,
  Trigger,
  Portal: PortalPart,
  Backdrop,
  Positioner,
  Content,
  Title,
  Description,
  Close,
};
