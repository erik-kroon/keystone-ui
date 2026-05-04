import { createContext, splitProps, useContext, type JSX } from "solid-js";
import { getPartDataAttributes } from "../metadata/index";
import {
  OverlayLayerProvider,
  type OverlayLayerOutsideEvent,
  type OverlayPresenceCompleteDetail,
} from "../overlay/index";
import { createOverlayController } from "../overlay/controller";
import { Portal } from "../portal/index";
import { renderPolymorphic, type PolymorphicProps } from "../utils/index";

export type SheetChangeDetail = {
  event?: Event;
  reason: "trigger" | "close" | "escape" | "outside" | "programmatic";
};

export type SheetSide = "top" | "right" | "bottom" | "left";

export type SheetRootProps = {
  children?: JSX.Element;
  defaultOpen?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean, detail: SheetChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open?: boolean;
  side?: SheetSide;
};

export type SheetPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type SheetTriggerProps = SheetPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type SheetCloseProps = SheetPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type SheetPortalProps = {
  children?: JSX.Element;
  forceMount?: boolean;
  mount?: Node;
};
export type SheetBackdropProps = SheetPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type SheetPositionerProps = SheetPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type SheetContentProps = SheetPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: OverlayLayerOutsideEvent) => void;
    onFocusOutside?: (event: OverlayLayerOutsideEvent) => void;
    onInteractOutside?: (event: OverlayLayerOutsideEvent) => void;
    onMountAutoFocus?: (event: Event) => void;
    onUnmountAutoFocus?: (event: Event) => void;
  };
export type SheetTitleProps = SheetPartProps<HTMLHeadingElement> &
  Omit<JSX.HTMLAttributes<HTMLHeadingElement>, "children" | "ref">;
export type SheetDescriptionProps = SheetPartProps<HTMLParagraphElement> &
  Omit<JSX.HTMLAttributes<HTMLParagraphElement>, "children" | "ref">;

export type SheetTriggerContractProps = Omit<SheetTriggerProps, "as" | "children">;
export type SheetCloseContractProps = Omit<SheetCloseProps, "as" | "children">;
export type SheetContentContractProps = Omit<SheetContentProps, "children">;
export type SheetBackdropContractProps = Omit<SheetBackdropProps, "children">;
export type SheetPositionerContractProps = Omit<SheetPositionerProps, "children">;
export type SheetTitleContractProps = Omit<SheetTitleProps, "children">;
export type SheetDescriptionContractProps = Omit<SheetDescriptionProps, "children">;

type SheetApi = {
  contentId: string;
  descriptionId: string;
  getBackdropProps: (props: SheetBackdropContractProps) => Record<string, unknown>;
  getCloseProps: (props: SheetCloseContractProps) => Record<string, unknown>;
  getContentProps: (props: SheetContentContractProps) => Record<string, unknown>;
  getDescriptionProps: (props: SheetDescriptionContractProps) => Record<string, unknown>;
  getPositionerProps: (props: SheetPositionerContractProps) => Record<string, unknown>;
  getTitleProps: (props: SheetTitleContractProps) => Record<string, unknown>;
  getTriggerProps: (props: SheetTriggerContractProps) => Record<string, unknown>;
  modal: () => boolean;
  open: () => boolean;
  setOpen: (open: boolean, detail: SheetChangeDetail) => void;
  shouldMount: (forceMount?: boolean) => boolean;
  side: () => SheetSide;
  titleId: string;
};

export type CreateSheetOptions = {
  defaultOpen?: boolean;
  modal?: () => boolean | undefined;
  onOpenChange?: (open: boolean, detail: SheetChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open?: () => boolean | undefined;
  side?: () => SheetSide | undefined;
};

const SheetContext = createContext<SheetApi>();

export function createSheet(options: CreateSheetOptions = {}): SheetApi {
  const overlay = createOverlayController<SheetChangeDetail["reason"]>({
    scope: "sheet",
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
          trapFocus: overlay.modal,
          dismissReason: (event) => (event.type === "keydown" ? "escape" : "outside"),
        },
      );

      return {
        ...others,
        ...layerProps,
        id: overlay.contentId,
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
      ...getPartDataAttributes("sheet", "description"),
    }),
    getPositionerProps: (props) => ({
      ...props,
      ...partProps("positioner"),
    }),
    getTitleProps: (props) => ({
      ...props,
      id: overlay.titleId,
      ...getPartDataAttributes("sheet", "title"),
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
    shouldMount: overlay.shouldMount,
    side,
    titleId: overlay.titleId,
  };
}

function useSheet(part: string) {
  const sheet = useContext(SheetContext);
  if (!sheet) throw new Error(`Sheet.${part} must be used within Sheet.Root`);
  return sheet;
}

function Root(props: SheetRootProps) {
  const sheet = createSheet({
    defaultOpen: props.defaultOpen,
    modal: () => props.modal,
    onOpenChange: props.onOpenChange,
    onOpenChangeComplete: props.onOpenChangeComplete,
    open: () => props.open,
    side: () => props.side,
  });

  return (
    <OverlayLayerProvider>
      <SheetContext.Provider value={sheet}>{props.children}</SheetContext.Provider>
    </OverlayLayerProvider>
  );
}

function Trigger(props: SheetTriggerProps) {
  const sheet = useSheet("Trigger");
  const [local, others] = splitProps(props, ["as", "children"]);
  const triggerProps = sheet.getTriggerProps(others);
  if (!local.as) return <button {...triggerProps}>{local.children}</button>;
  return renderPolymorphic(local.as, "button", { ...triggerProps, children: local.children });
}

function PortalPart(props: SheetPortalProps) {
  const sheet = useSheet("Portal");
  return (
    <Portal
      forceMount={props.forceMount}
      mount={props.mount}
      present={sheet.shouldMount(props.forceMount)}
    >
      {props.children}
    </Portal>
  );
}

function Backdrop(props: SheetBackdropProps) {
  const sheet = useSheet("Backdrop");
  const [local, others] = splitProps(props, ["children"]);
  return <div {...sheet.getBackdropProps(others)}>{local.children}</div>;
}

function Positioner(props: SheetPositionerProps) {
  const sheet = useSheet("Positioner");
  const [local, others] = splitProps(props, ["children"]);
  const positionerProps = sheet.getPositionerProps(others);
  return <div {...positionerProps}>{local.children}</div>;
}

function Content(props: SheetContentProps) {
  const sheet = useSheet("Content");
  const [local, others] = splitProps(props, ["children"]);
  const contentProps = sheet.getContentProps(others);

  return <div {...contentProps}>{local.children}</div>;
}

function Title(props: SheetTitleProps) {
  const sheet = useSheet("Title");
  const [local, others] = splitProps(props, ["children"]);
  return <h2 {...sheet.getTitleProps(others)}>{local.children}</h2>;
}

function Description(props: SheetDescriptionProps) {
  const sheet = useSheet("Description");
  const [local, others] = splitProps(props, ["children"]);
  return <p {...sheet.getDescriptionProps(others)}>{local.children}</p>;
}

function Close(props: SheetCloseProps) {
  const sheet = useSheet("Close");
  const [local, others] = splitProps(props, ["as", "children"]);
  const closeProps = sheet.getCloseProps(others);
  if (!local.as) return <button {...closeProps}>{local.children}</button>;
  return renderPolymorphic(local.as, "button", { ...closeProps, children: local.children });
}

export const Sheet = {
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
