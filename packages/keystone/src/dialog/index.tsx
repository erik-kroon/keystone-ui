import { Show, createContext, createSignal, splitProps, useContext, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import {
  OverlayLayerProvider,
  createOverlayLayer,
  type DismissableLayerOutsideEvent,
  type OverlayLayerApi,
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

export type DialogTriggerContractProps = Omit<DialogTriggerProps, "as" | "children">;
export type DialogCloseContractProps = Omit<DialogCloseProps, "as" | "children">;
export type DialogContentContractProps = Omit<DialogContentProps, "children">;
export type DialogBackdropContractProps = Omit<DialogContentProps, "children">;
export type DialogPositionerContractProps = Omit<DialogContentProps, "children">;
export type DialogTitleContractProps = Omit<DialogTitleProps, "children">;
export type DialogDescriptionContractProps = Omit<DialogDescriptionProps, "children">;

export type DialogApi = {
  contentId: string;
  descriptionId: string;
  getBackdropProps: (props: DialogBackdropContractProps) => Record<string, unknown>;
  getCloseProps: (props: DialogCloseContractProps) => Record<string, unknown>;
  getContentProps: (props: DialogContentContractProps) => Record<string, unknown>;
  getDescriptionProps: (props: DialogDescriptionContractProps) => Record<string, unknown>;
  getPositionerProps: (props: DialogPositionerContractProps) => Record<string, unknown>;
  getTitleProps: (props: DialogTitleContractProps) => Record<string, unknown>;
  getTriggerProps: (props: DialogTriggerContractProps) => Record<string, unknown>;
  modal: () => boolean;
  open: () => boolean;
  setOpen: (open: boolean, detail: DialogChangeDetail) => void;
  titleId: string;
};

export type CreateDialogOptions = {
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
  const state = () => (open() ? "open" : "closed");
  const partProps = (part: string) => ({
    "data-scope": "dialog",
    "data-part": part,
    get "data-state"() {
      return state();
    },
  });
  let contentElementSetter: ((element: HTMLDivElement) => void) | undefined;
  let contentLayer: OverlayLayerApi | undefined;
  let contentProps: DialogContentContractProps | undefined;
  const ensureContentLayer = () => {
    if (contentLayer) {
      return contentLayer;
    }

    const [content, setContent] = createSignal<HTMLDivElement>();
    contentElementSetter = setContent;
    contentLayer = createOverlayLayer({
      id: contentId(),
      element: content,
      modal: () => options.modal?.() ?? true,
      disableOutsidePointerEvents: () => options.modal?.() ?? true,
      trapFocus: () => options.modal?.() ?? true,
      restoreFocus: () => true,
      onEscapeKeyDown: (event) => contentProps?.onEscapeKeyDown?.(event),
      onPointerDownOutside: (event) => contentProps?.onPointerDownOutside?.(event),
      onFocusOutside: (event) => contentProps?.onFocusOutside?.(event),
      onInteractOutside: (event) => contentProps?.onInteractOutside?.(event),
      onDismiss: (event) => {
        setOpen(false, { event, reason: event.type === "keydown" ? "escape" : "outside" });
      },
      onMountAutoFocus: (event) => contentProps?.onMountAutoFocus?.(event),
      onUnmountAutoFocus: (event) => contentProps?.onUnmountAutoFocus?.(event),
    });

    return contentLayer;
  };

  return {
    contentId: contentId(),
    descriptionId: descriptionId(),
    getBackdropProps: (props) => ({
      ...props,
      ...partProps("backdrop"),
    }),
    getCloseProps: (props) => ({
      ...props,
      type: "button",
      ...partProps("close"),
      onClick: composeEventHandlers(props.onClick, (event) => {
        setOpen(false, { event, reason: "close" });
      }),
    }),
    getContentProps: (props) => {
      contentProps = props;
      const [local, others] = splitProps(props, [
        "ref",
        "onEscapeKeyDown",
        "onPointerDownOutside",
        "onFocusOutside",
        "onInteractOutside",
        "onMountAutoFocus",
        "onUnmountAutoFocus",
      ]);
      const layer = ensureContentLayer();

      return {
        ...others,
        id: contentId(),
        tabIndex: -1,
        role: "dialog",
        "aria-modal": (options.modal?.() ?? true) ? "true" : undefined,
        "aria-labelledby": titleId(),
        "aria-describedby": descriptionId(),
        "data-layer-id": layer.id,
        get "data-layer-index"() {
          return layer.index();
        },
        get "data-top-layer"() {
          return layer.isTopLayer() ? "" : undefined;
        },
        ...partProps("content"),
        ref: (node: HTMLDivElement) => {
          contentElementSetter?.(node);
          assignRef(local.ref, node);
        },
      };
    },
    getDescriptionProps: (props) => ({
      ...props,
      id: descriptionId(),
      "data-scope": "dialog",
      "data-part": "description",
    }),
    getPositionerProps: (props) => ({
      ...props,
      ...partProps("positioner"),
    }),
    getTitleProps: (props) => ({
      ...props,
      id: titleId(),
      "data-scope": "dialog",
      "data-part": "title",
    }),
    getTriggerProps: (props) => ({
      ...props,
      type: "button",
      "aria-controls": contentId(),
      get "aria-expanded"() {
        return open();
      },
      ...partProps("trigger"),
      onClick: composeEventHandlers(props.onClick, (event) => {
        setOpen(true, { event, reason: "trigger" });
      }),
    }),
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
  const [local, others] = splitProps(props, ["as", "children"]);
  const triggerProps = dialog.getTriggerProps(others);

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

  return <div {...dialog.getBackdropProps(others)}>{local.children}</div>;
}

function Positioner(props: DialogContentProps) {
  const dialog = useDialog("Positioner");
  const [local, others] = splitProps(props, ["children"]);

  return <div {...dialog.getPositionerProps(others)}>{local.children}</div>;
}

function Content(props: DialogContentProps) {
  const dialog = useDialog("Content");
  const [local, others] = splitProps(props, ["children"]);

  return <div {...dialog.getContentProps(others)}>{local.children}</div>;
}

function Title(props: DialogTitleProps) {
  const dialog = useDialog("Title");
  const [local, others] = splitProps(props, ["children"]);

  return <h2 {...dialog.getTitleProps(others)}>{local.children}</h2>;
}

function Description(props: DialogDescriptionProps) {
  const dialog = useDialog("Description");
  const [local, others] = splitProps(props, ["children"]);

  return <p {...dialog.getDescriptionProps(others)}>{local.children}</p>;
}

function Close(props: DialogCloseProps) {
  const dialog = useDialog("Close");
  const [local, others] = splitProps(props, ["as", "children"]);
  const closeProps = dialog.getCloseProps(others);

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
