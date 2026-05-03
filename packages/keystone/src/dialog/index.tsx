import { Show, createContext, splitProps, useContext, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { getPartDataAttributes } from "../metadata/index";
import { OverlayLayerProvider, type DismissableLayerOutsideEvent } from "../overlay/index";
import { createOverlayController } from "../overlay/controller";
import type { OverlayPresenceCompleteDetail } from "../overlay/index";
import { renderPolymorphic, type PolymorphicProps } from "../utils/index";

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
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
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
  shouldMount: (forceMount?: boolean) => boolean;
  titleId: string;
};

export type CreateDialogOptions = {
  open?: () => boolean | undefined;
  defaultOpen?: boolean;
  modal?: () => boolean | undefined;
  onOpenChange?: (open: boolean, detail: DialogChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
};

const DialogContext = createContext<DialogApi>();

export function createDialog(options: CreateDialogOptions = {}): DialogApi {
  const overlay = createOverlayController<DialogChangeDetail["reason"]>({
    scope: "dialog",
    open: options.open,
    defaultOpen: options.defaultOpen,
    modal: () => options.modal?.() ?? true,
    onOpenChange: (open, detail) => options.onOpenChange?.(open, detail),
    onOpenChangeComplete: options.onOpenChangeComplete,
  });

  return {
    contentId: overlay.contentId,
    descriptionId: overlay.descriptionId,
    getBackdropProps: (props) => ({
      ...props,
      ...overlay.getPartProps("backdrop"),
    }),
    getCloseProps: (props) => overlay.getCloseProps(props, "close") as Record<string, unknown>,
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
        ...overlay.getPartProps("content"),
      };
    },
    getDescriptionProps: (props) => ({
      ...props,
      id: overlay.descriptionId,
      ...getPartDataAttributes("dialog", "description"),
    }),
    getPositionerProps: (props) => ({
      ...props,
      ...overlay.getPartProps("positioner"),
    }),
    getTitleProps: (props) => ({
      ...props,
      id: overlay.titleId,
      ...getPartDataAttributes("dialog", "title"),
    }),
    getTriggerProps: (props) =>
      overlay.getTriggerProps(props, {
        action: "open",
        reason: "trigger",
      }) as Record<string, unknown>,
    modal: overlay.modal,
    open: overlay.open,
    setOpen: overlay.setOpen,
    shouldMount: overlay.shouldMount,
    titleId: overlay.titleId,
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
    onOpenChangeComplete: props.onOpenChangeComplete,
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
    <Show when={dialog.shouldMount(props.forceMount)}>
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
  const positionerProps = dialog.getPositionerProps(others);

  return <div {...positionerProps}>{local.children}</div>;
}

function Content(props: DialogContentProps) {
  const dialog = useDialog("Content");
  const [local, others] = splitProps(props, ["children"]);
  const contentProps = dialog.getContentProps(others);

  return <div {...contentProps}>{local.children}</div>;
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
