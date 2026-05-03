import { Show, createContext, createSignal, splitProps, useContext, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import {
  OverlayLayerProvider,
  createDismissableLayer,
  createFocusScope,
  createOverlayLayer,
  type DismissableLayerOutsideEvent,
} from "../overlay/index";
import { assignRef } from "../overlay/dom";
import {
  composeEventHandlers,
  createControllableBooleanSignal,
  createStableId,
  renderPolymorphic,
  type PolymorphicProps,
} from "../utils/index";

export type DialogChangeDetail = {
  event?: Event;
  reason: "trigger" | "close" | "escape" | "outside" | "programmatic";
};

export type DialogRootProps = {
  children?: JSX.Element;
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean, detail: DialogChangeDetail) => void;
};

export type DialogPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  id?: string;
  ref?: T | ((element: T) => void);
  class?: string;
  style?: JSX.CSSProperties | string;
};

export type DialogTriggerProps = DialogPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type DialogCloseProps = DialogPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type DialogPortalProps = {
  children?: JSX.Element;
  forceMount?: boolean;
  mount?: Node;
};
export type DialogContentProps = DialogPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: DismissableLayerOutsideEvent) => void;
    onFocusOutside?: (event: DismissableLayerOutsideEvent) => void;
    onInteractOutside?: (event: DismissableLayerOutsideEvent) => void;
    onMountAutoFocus?: (event: Event) => void;
    onUnmountAutoFocus?: (event: Event) => void;
  };
export type DialogTitleProps = DialogPartProps<HTMLHeadingElement> &
  Omit<JSX.HTMLAttributes<HTMLHeadingElement>, "children" | "ref">;
export type DialogDescriptionProps = DialogPartProps<HTMLParagraphElement> &
  Omit<JSX.HTMLAttributes<HTMLParagraphElement>, "children" | "ref">;

type DialogApi = {
  contentId: string;
  descriptionId: string;
  modal: () => boolean;
  open: () => boolean;
  setOpen: (open: boolean, detail: DialogChangeDetail) => void;
  titleId: string;
};

type CreateDialogOptions = {
  open?: () => boolean | undefined;
  defaultOpen?: boolean;
  modal?: () => boolean | undefined;
  onOpenChange?: (open: boolean, detail: DialogChangeDetail) => void;
};

const DialogContext = createContext<DialogApi>();

export function createDialog(options: CreateDialogOptions = {}): DialogApi {
  const titleId = createStableId("dialog-title");
  const descriptionId = createStableId("dialog-description");
  const contentId = createStableId("dialog-content");
  let lastDetail: DialogChangeDetail = { reason: "programmatic" };
  const [open, setOpenState] = createControllableBooleanSignal({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: (next) => {
      options.onOpenChange?.(next, lastDetail);
    },
  });

  const setOpen = (next: boolean, detail: DialogChangeDetail) => {
    lastDetail = detail;
    setOpenState(next);
  };

  return {
    contentId: contentId(),
    descriptionId: descriptionId(),
    modal: () => options.modal?.() ?? true,
    open,
    setOpen,
    titleId: titleId(),
  };
}

function useDialog(part: string) {
  const dialog = useContext(DialogContext);

  if (!dialog) {
    throw new Error(`Dialog.${part} must be used within Dialog.Root`);
  }

  return dialog;
}

function Root(props: DialogRootProps) {
  const dialog = createDialog({
    open: () => props.open,
    defaultOpen: props.defaultOpen,
    modal: () => props.modal,
    onOpenChange: props.onOpenChange,
  });

  return (
    <OverlayLayerProvider>
      <DialogContext.Provider value={dialog}>{props.children}</DialogContext.Provider>
    </OverlayLayerProvider>
  );
}

function Trigger(props: DialogTriggerProps) {
  const dialog = useDialog("Trigger");
  const [local, others] = splitProps(props, ["as", "children", "onClick"]);
  const triggerProps = {
    ...others,
    type: "button",
    "aria-controls": dialog.contentId,
    "aria-expanded": dialog.open(),
    "data-scope": "dialog",
    "data-part": "trigger",
    "data-state": dialog.open() ? "open" : "closed",
    onClick: composeEventHandlers(local.onClick, (event) => {
      dialog.setOpen(true, { event, reason: "trigger" });
    }),
  } as const;

  if (!local.as) {
    return <button {...triggerProps}>{local.children}</button>;
  }

  return renderPolymorphic(local.as, "button", {
    ...triggerProps,
    children: local.children,
  });
}

function PortalPart(props: DialogPortalProps) {
  const dialog = useDialog("Portal");

  return (
    <Show when={props.forceMount || dialog.open()}>
      <Portal mount={props.mount}>{props.children}</Portal>
    </Show>
  );
}

function Backdrop(props: DialogContentProps) {
  const dialog = useDialog("Backdrop");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <div
      data-scope="dialog"
      data-part="backdrop"
      data-state={dialog.open() ? "open" : "closed"}
      {...others}
    >
      {local.children}
    </div>
  );
}

function Positioner(props: DialogContentProps) {
  const dialog = useDialog("Positioner");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <div
      data-scope="dialog"
      data-part="positioner"
      data-state={dialog.open() ? "open" : "closed"}
      {...others}
    >
      {local.children}
    </div>
  );
}

function Content(props: DialogContentProps) {
  const dialog = useDialog("Content");
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
    id: dialog.contentId,
    modal: dialog.modal,
  });

  createDismissableLayer({
    element: content,
    disableOutsidePointerEvents: dialog.modal,
    onEscapeKeyDown: local.onEscapeKeyDown,
    onPointerDownOutside: local.onPointerDownOutside,
    onFocusOutside: local.onFocusOutside,
    onInteractOutside: local.onInteractOutside,
    onDismiss: (event) => {
      dialog.setOpen(false, { event, reason: event.type === "keydown" ? "escape" : "outside" });
    },
  });

  createFocusScope({
    element: content,
    trapFocus: dialog.modal,
    restoreFocus: () => true,
    onMountAutoFocus: local.onMountAutoFocus,
    onUnmountAutoFocus: local.onUnmountAutoFocus,
  });

  return (
    <div
      id={dialog.contentId}
      tabIndex={-1}
      role="dialog"
      aria-modal={dialog.modal() ? "true" : undefined}
      aria-labelledby={dialog.titleId}
      aria-describedby={dialog.descriptionId}
      data-scope="dialog"
      data-part="content"
      data-layer-id={layer.id}
      data-layer-index={layer.index()}
      data-top-layer={layer.isTopLayer() ? "" : undefined}
      data-state={dialog.open() ? "open" : "closed"}
      {...others}
      ref={(node) => {
        setContent(node);
        assignRef(local.ref, node);
      }}
    >
      {local.children}
    </div>
  );
}

function Title(props: DialogTitleProps) {
  const dialog = useDialog("Title");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <h2 id={dialog.titleId} data-scope="dialog" data-part="title" {...others}>
      {local.children}
    </h2>
  );
}

function Description(props: DialogDescriptionProps) {
  const dialog = useDialog("Description");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <p id={dialog.descriptionId} data-scope="dialog" data-part="description" {...others}>
      {local.children}
    </p>
  );
}

function Close(props: DialogCloseProps) {
  const dialog = useDialog("Close");
  const [local, others] = splitProps(props, ["as", "children", "onClick"]);
  const closeProps = {
    ...others,
    type: "button",
    "data-scope": "dialog",
    "data-part": "close",
    "data-state": dialog.open() ? "open" : "closed",
    onClick: composeEventHandlers(local.onClick, (event) => {
      dialog.setOpen(false, { event, reason: "close" });
    }),
  } as const;

  if (!local.as) {
    return <button {...closeProps}>{local.children}</button>;
  }

  return renderPolymorphic(local.as, "button", {
    ...closeProps,
    children: local.children,
  });
}

export const Dialog = {
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
