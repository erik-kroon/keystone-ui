import { createContext, createSignal, splitProps, useContext, type JSX } from "solid-js";
import { getPartDataAttributes } from "../metadata/index";
import {
  OverlayLayerProvider,
  type DismissableLayerOutsideEvent,
  type OverlayPresenceCompleteDetail,
} from "../overlay/index";
import { createOverlayController } from "../overlay/controller";
import { assignRef } from "../overlay/dom";
import { Portal } from "../portal/index";
import { renderPolymorphic, type PolymorphicProps } from "../utils/index";

export type AlertDialogChangeDetail = {
  event?: Event;
  reason: "trigger" | "cancel" | "action" | "escape" | "programmatic";
};

export type AlertDialogRootProps = {
  children?: JSX.Element;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, detail: AlertDialogChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
};

export type AlertDialogPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  id?: string;
  ref?: T | ((element: T) => void);
  class?: string;
  style?: JSX.CSSProperties | string;
};

export type AlertDialogTriggerProps = AlertDialogPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type AlertDialogCancelProps = AlertDialogPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type AlertDialogActionProps = AlertDialogPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type AlertDialogPortalProps = {
  children?: JSX.Element;
  forceMount?: boolean;
  mount?: Node;
};
export type AlertDialogContentProps = AlertDialogPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: DismissableLayerOutsideEvent) => void;
    onFocusOutside?: (event: DismissableLayerOutsideEvent) => void;
    onInteractOutside?: (event: DismissableLayerOutsideEvent) => void;
    onMountAutoFocus?: (event: Event) => void;
    onUnmountAutoFocus?: (event: Event) => void;
  };
export type AlertDialogTitleProps = AlertDialogPartProps<HTMLHeadingElement> &
  Omit<JSX.HTMLAttributes<HTMLHeadingElement>, "children" | "ref">;
export type AlertDialogDescriptionProps = AlertDialogPartProps<HTMLParagraphElement> &
  Omit<JSX.HTMLAttributes<HTMLParagraphElement>, "children" | "ref">;

export type AlertDialogTriggerContractProps = Omit<AlertDialogTriggerProps, "as" | "children">;
export type AlertDialogCancelContractProps = Omit<AlertDialogCancelProps, "as" | "children">;
export type AlertDialogActionContractProps = Omit<AlertDialogActionProps, "as" | "children">;
export type AlertDialogContentContractProps = Omit<AlertDialogContentProps, "children">;
export type AlertDialogBackdropContractProps = Omit<AlertDialogContentProps, "children">;
export type AlertDialogPositionerContractProps = Omit<AlertDialogContentProps, "children">;
export type AlertDialogTitleContractProps = Omit<AlertDialogTitleProps, "children">;
export type AlertDialogDescriptionContractProps = Omit<AlertDialogDescriptionProps, "children">;

export type AlertDialogApi = {
  contentId: string;
  descriptionId: string;
  getActionProps: (props: AlertDialogActionContractProps) => Record<string, unknown>;
  getBackdropProps: (props: AlertDialogBackdropContractProps) => Record<string, unknown>;
  getCancelProps: (props: AlertDialogCancelContractProps) => Record<string, unknown>;
  getContentProps: (props: AlertDialogContentContractProps) => Record<string, unknown>;
  getDescriptionProps: (props: AlertDialogDescriptionContractProps) => Record<string, unknown>;
  getPositionerProps: (props: AlertDialogPositionerContractProps) => Record<string, unknown>;
  getTitleProps: (props: AlertDialogTitleContractProps) => Record<string, unknown>;
  getTriggerProps: (props: AlertDialogTriggerContractProps) => Record<string, unknown>;
  open: () => boolean;
  setOpen: (open: boolean, detail: AlertDialogChangeDetail) => void;
  hidden: (forceMount?: boolean) => boolean;
  shouldMount: (forceMount?: boolean) => boolean;
  titleId: string;
};

export type CreateAlertDialogOptions = {
  open?: () => boolean | undefined;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, detail: AlertDialogChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
};

const AlertDialogContext = createContext<AlertDialogApi>();

export function createAlertDialog(options: CreateAlertDialogOptions = {}): AlertDialogApi {
  const [cancelElement, setCancelElement] = createSignal<HTMLElement>();
  const overlay = createOverlayController<AlertDialogChangeDetail["reason"]>({
    scope: "alert-dialog",
    open: options.open,
    defaultOpen: options.defaultOpen,
    modal: () => true,
    onOpenChange: (open, detail) => options.onOpenChange?.(open, detail),
    onOpenChangeComplete: options.onOpenChangeComplete,
  });
  const focusDefaultCancel = (event: Event) => {
    const target =
      cancelElement() ??
      overlay
        .contentElement()
        ?.querySelector<HTMLElement>('[data-scope="alert-dialog"][data-part="cancel"]');

    if (!target) {
      return;
    }

    event.preventDefault();
    target.focus({ preventScroll: true });
  };

  return {
    contentId: overlay.contentId,
    descriptionId: overlay.descriptionId,
    getActionProps: (props) => ({
      ...overlay.getCloseProps(props, "action"),
      ...getPartDataAttributes("alert-dialog", "action"),
    }),
    getBackdropProps: (props) => ({
      ...props,
      get hidden() {
        return overlay.hidden();
      },
      ...overlay.getPartProps("backdrop"),
    }),
    getCancelProps: (props) => {
      const cancelProps = overlay.getCloseProps(props, "cancel");

      return {
        ...cancelProps,
        ...getPartDataAttributes("alert-dialog", "cancel"),
        ref: (element: HTMLButtonElement) => {
          setCancelElement(() => element);
          assignRef(props.ref, element);
        },
      };
    },
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
      const preventOutsideInteraction = (event: DismissableLayerOutsideEvent) => {
        if (!event.defaultPrevented) {
          event.preventDefault();
        }
      };
      const layerProps = overlay.getContentLayerProps<HTMLDivElement>(
        {
          ref: local.ref,
          onEscapeKeyDown: local.onEscapeKeyDown,
          onFocusOutside: (event) => {
            local.onFocusOutside?.(event);
            preventOutsideInteraction(event);
          },
          onInteractOutside: (event) => {
            local.onInteractOutside?.(event);
            preventOutsideInteraction(event);
          },
          onMountAutoFocus: (event) => {
            local.onMountAutoFocus?.(event);

            if (!event.defaultPrevented) {
              focusDefaultCancel(event);
            }
          },
          onPointerDownOutside: (event) => {
            local.onPointerDownOutside?.(event);
            preventOutsideInteraction(event);
          },
          onUnmountAutoFocus: local.onUnmountAutoFocus,
        },
        {
          containsTrigger: true,
          modal: () => true,
          disableOutsidePointerEvents: () => true,
          trapFocus: () => true,
          dismissReason: (event) => (event.type === "keydown" ? "escape" : "programmatic"),
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
        role: "alertdialog",
        "aria-modal": "true",
        "aria-labelledby": overlay.titleId,
        "aria-describedby": overlay.descriptionId,
        ...overlay.getPartProps("content"),
      };
    },
    getDescriptionProps: (props) => ({
      ...props,
      id: overlay.descriptionId,
      ...getPartDataAttributes("alert-dialog", "description"),
    }),
    getPositionerProps: (props) => ({
      ...props,
      get hidden() {
        return overlay.hidden();
      },
      ...overlay.getPartProps("positioner"),
    }),
    getTitleProps: (props) => ({
      ...props,
      id: overlay.titleId,
      ...getPartDataAttributes("alert-dialog", "title"),
    }),
    getTriggerProps: (props) =>
      overlay.getTriggerProps(props, {
        action: "open",
        reason: "trigger",
      }) as Record<string, unknown>,
    open: overlay.open,
    setOpen: overlay.setOpen,
    hidden: overlay.hidden,
    shouldMount: overlay.shouldMount,
    titleId: overlay.titleId,
  };
}

function useAlertDialog(part: string) {
  const alertDialog = useContext(AlertDialogContext);

  if (!alertDialog) {
    throw new Error(`AlertDialog.${part} must be used within AlertDialog.Root`);
  }

  return alertDialog;
}

function Root(props: AlertDialogRootProps) {
  const alertDialog = createAlertDialog({
    open: () => props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
    onOpenChangeComplete: props.onOpenChangeComplete,
  });

  return (
    <OverlayLayerProvider>
      <AlertDialogContext.Provider value={alertDialog}>
        {props.children}
      </AlertDialogContext.Provider>
    </OverlayLayerProvider>
  );
}

function Trigger(props: AlertDialogTriggerProps) {
  const alertDialog = useAlertDialog("Trigger");
  const [local, others] = splitProps(props, ["as", "children"]);
  const triggerProps = alertDialog.getTriggerProps(others);

  if (!local.as) {
    return <button {...triggerProps}>{local.children}</button>;
  }

  return renderPolymorphic(local.as, "button", {
    ...triggerProps,
    children: local.children,
  });
}

function PortalPart(props: AlertDialogPortalProps) {
  const alertDialog = useAlertDialog("Portal");

  return (
    <Portal
      forceMount={props.forceMount}
      mount={props.mount}
      present={alertDialog.shouldMount(props.forceMount)}
    >
      {props.children}
    </Portal>
  );
}

function Backdrop(props: AlertDialogContentProps) {
  const alertDialog = useAlertDialog("Backdrop");
  const [local, others] = splitProps(props, ["children"]);

  return <div {...alertDialog.getBackdropProps(others)}>{local.children}</div>;
}

function Positioner(props: AlertDialogContentProps) {
  const alertDialog = useAlertDialog("Positioner");
  const [local, others] = splitProps(props, ["children"]);
  const positionerProps = alertDialog.getPositionerProps(others);

  return <div {...positionerProps}>{local.children}</div>;
}

function Content(props: AlertDialogContentProps) {
  const alertDialog = useAlertDialog("Content");
  const [local, others] = splitProps(props, ["children"]);
  const contentProps = alertDialog.getContentProps(others);

  return <div {...contentProps}>{local.children}</div>;
}

function Title(props: AlertDialogTitleProps) {
  const alertDialog = useAlertDialog("Title");
  const [local, others] = splitProps(props, ["children"]);

  return <h2 {...alertDialog.getTitleProps(others)}>{local.children}</h2>;
}

function Description(props: AlertDialogDescriptionProps) {
  const alertDialog = useAlertDialog("Description");
  const [local, others] = splitProps(props, ["children"]);

  return <p {...alertDialog.getDescriptionProps(others)}>{local.children}</p>;
}

function Cancel(props: AlertDialogCancelProps) {
  const alertDialog = useAlertDialog("Cancel");
  const [local, others] = splitProps(props, ["as", "children"]);
  const cancelProps = alertDialog.getCancelProps(others);

  if (!local.as) {
    return <button {...cancelProps}>{local.children}</button>;
  }

  return renderPolymorphic(local.as, "button", {
    ...cancelProps,
    children: local.children,
  });
}

function Action(props: AlertDialogActionProps) {
  const alertDialog = useAlertDialog("Action");
  const [local, others] = splitProps(props, ["as", "children"]);
  const actionProps = alertDialog.getActionProps(others);

  if (!local.as) {
    return <button {...actionProps}>{local.children}</button>;
  }

  return renderPolymorphic(local.as, "button", {
    ...actionProps,
    children: local.children,
  });
}

export const AlertDialog = {
  Root,
  Trigger,
  Portal: PortalPart,
  Backdrop,
  Positioner,
  Content,
  Title,
  Description,
  Cancel,
  Action,
};
