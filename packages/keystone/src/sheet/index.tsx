import { Show, createContext, createSignal, splitProps, useContext, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { assignRef } from "../overlay/dom";
import {
  OverlayLayerProvider,
  createOverlayLayer,
  type OverlayLayerApi,
  type OverlayLayerOutsideEvent,
} from "../overlay/index";
import {
  composeEventHandlers,
  createControllableBooleanSignal,
  createStableId,
  renderPolymorphic,
  type PolymorphicProps,
} from "../utils/index";

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

type SheetApi = {
  contentId: string;
  descriptionId: string;
  getBackdropProps: () => Record<string, unknown>;
  getCloseProps: (props: { onClick?: SheetCloseProps["onClick"] }) => Record<string, unknown>;
  getContentProps: (options: { layer: OverlayLayerApi }) => Record<string, unknown>;
  getDescriptionProps: () => Record<string, unknown>;
  getPositionerProps: () => Record<string, unknown>;
  getTitleProps: () => Record<string, unknown>;
  getTriggerProps: (props: { onClick?: SheetTriggerProps["onClick"] }) => Record<string, unknown>;
  modal: () => boolean;
  open: () => boolean;
  setOpen: (open: boolean, detail: SheetChangeDetail) => void;
  side: () => SheetSide;
  titleId: string;
};

export type CreateSheetOptions = {
  defaultOpen?: boolean;
  modal?: () => boolean | undefined;
  onOpenChange?: (open: boolean, detail: SheetChangeDetail) => void;
  open?: () => boolean | undefined;
  side?: () => SheetSide | undefined;
};

const SheetContext = createContext<SheetApi>();

export function createSheet(options: CreateSheetOptions = {}): SheetApi {
  const titleId = createStableId("sheet-title");
  const descriptionId = createStableId("sheet-description");
  const contentId = createStableId("sheet-content");
  let lastDetail: SheetChangeDetail = { reason: "programmatic" };
  const [open, setOpenState] = createControllableBooleanSignal({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: (next) => options.onOpenChange?.(next, lastDetail),
  });
  const setOpen = (next: boolean, detail: SheetChangeDetail) => {
    lastDetail = detail;
    setOpenState(next);
  };
  const side = () => options.side?.() ?? "right";
  const modal = () => options.modal?.() ?? true;
  const state = () => (open() ? "open" : "closed");
  const partProps = (part: string) => ({
    "data-scope": "sheet",
    "data-part": part,
    "data-side": side(),
    "data-state": state(),
  });

  return {
    contentId: contentId(),
    descriptionId: descriptionId(),
    getBackdropProps: () => partProps("backdrop"),
    getCloseProps: (props) => ({
      type: "button",
      ...partProps("close"),
      onClick: composeEventHandlers(props.onClick, (event) => {
        setOpen(false, { event, reason: "close" });
      }),
    }),
    getContentProps: ({ layer }) => ({
      id: contentId(),
      tabIndex: -1,
      role: "dialog",
      "aria-modal": modal() ? "true" : undefined,
      "aria-labelledby": titleId(),
      "aria-describedby": descriptionId(),
      "data-layer-id": layer.id,
      "data-layer-index": layer.index(),
      "data-top-layer": layer.isTopLayer() ? "" : undefined,
      ...partProps("content"),
    }),
    getDescriptionProps: () => ({
      id: descriptionId(),
      "data-scope": "sheet",
      "data-part": "description",
    }),
    getPositionerProps: () => partProps("positioner"),
    getTitleProps: () => ({
      id: titleId(),
      "data-scope": "sheet",
      "data-part": "title",
    }),
    getTriggerProps: (props) => ({
      type: "button",
      "aria-controls": contentId(),
      "aria-expanded": open(),
      ...partProps("trigger"),
      onClick: composeEventHandlers(props.onClick, (event) => {
        setOpen(true, { event, reason: "trigger" });
      }),
    }),
    modal,
    open,
    setOpen,
    side,
    titleId: titleId(),
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
  const [local, others] = splitProps(props, ["as", "children", "onClick"]);
  const triggerProps = { ...others, ...sheet.getTriggerProps({ onClick: local.onClick }) };
  if (!local.as) return <button {...triggerProps}>{local.children}</button>;
  return renderPolymorphic(local.as, "button", { ...triggerProps, children: local.children });
}

function PortalPart(props: SheetPortalProps) {
  const sheet = useSheet("Portal");
  return (
    <Show when={props.forceMount || sheet.open()}>
      <Portal mount={props.mount}>{props.children}</Portal>
    </Show>
  );
}

function Backdrop(props: SheetBackdropProps) {
  const sheet = useSheet("Backdrop");
  const [local, others] = splitProps(props, ["children"]);
  return (
    <div {...others} {...sheet.getBackdropProps()}>
      {local.children}
    </div>
  );
}

function Positioner(props: SheetPositionerProps) {
  const sheet = useSheet("Positioner");
  const [local, others] = splitProps(props, ["children"]);
  return (
    <div {...others} {...sheet.getPositionerProps()}>
      {local.children}
    </div>
  );
}

function Content(props: SheetContentProps) {
  const sheet = useSheet("Content");
  const [local, others] = splitProps(props, [
    "children",
    "ref",
    "onEscapeKeyDown",
    "onPointerDownOutside",
    "onFocusOutside",
    "onInteractOutside",
    "onMountAutoFocus",
    "onUnmountAutoFocus",
  ]);
  const [content, setContent] = createSignal<HTMLDivElement>();
  const layer = createOverlayLayer({
    id: sheet.contentId,
    element: content,
    modal: sheet.modal,
    disableOutsidePointerEvents: sheet.modal,
    trapFocus: sheet.modal,
    restoreFocus: () => true,
    onEscapeKeyDown: local.onEscapeKeyDown,
    onPointerDownOutside: local.onPointerDownOutside,
    onFocusOutside: local.onFocusOutside,
    onInteractOutside: local.onInteractOutside,
    onDismiss: (event) => {
      sheet.setOpen(false, { event, reason: event.type === "keydown" ? "escape" : "outside" });
    },
    onMountAutoFocus: local.onMountAutoFocus,
    onUnmountAutoFocus: local.onUnmountAutoFocus,
  });

  return (
    <div
      {...others}
      {...sheet.getContentProps({ layer })}
      ref={(node) => {
        setContent(node);
        assignRef(local.ref, node);
      }}
    >
      {local.children}
    </div>
  );
}

function Title(props: SheetTitleProps) {
  const sheet = useSheet("Title");
  const [local, others] = splitProps(props, ["children"]);
  return (
    <h2 {...others} {...sheet.getTitleProps()}>
      {local.children}
    </h2>
  );
}

function Description(props: SheetDescriptionProps) {
  const sheet = useSheet("Description");
  const [local, others] = splitProps(props, ["children"]);
  return (
    <p {...others} {...sheet.getDescriptionProps()}>
      {local.children}
    </p>
  );
}

function Close(props: SheetCloseProps) {
  const sheet = useSheet("Close");
  const [local, others] = splitProps(props, ["as", "children", "onClick"]);
  const closeProps = { ...others, ...sheet.getCloseProps({ onClick: local.onClick }) };
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
