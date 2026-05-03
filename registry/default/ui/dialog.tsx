import {
  Dialog as KeystoneDialog,
  type DialogCloseProps as KeystoneDialogCloseProps,
  type DialogContentProps as KeystoneDialogContentProps,
  type DialogDescriptionProps as KeystoneDialogDescriptionProps,
  type DialogPortalProps as KeystoneDialogPortalProps,
  type DialogRootProps as KeystoneDialogRootProps,
  type DialogTitleProps as KeystoneDialogTitleProps,
  type DialogTriggerProps as KeystoneDialogTriggerProps,
} from "@keystone-ui/keystone/dialog";
import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type DialogProps = KeystoneDialogRootProps;
export type DialogTriggerProps = KeystoneDialogTriggerProps;
export type DialogPortalProps = KeystoneDialogPortalProps;
export type DialogBackdropProps = JSX.HTMLAttributes<HTMLDivElement>;
export type DialogPositionerProps = JSX.HTMLAttributes<HTMLDivElement>;
export type DialogContentProps = KeystoneDialogContentProps & {
  backdropClass?: string;
  portal?: DialogPortalProps;
  positionerClass?: string;
};
export type DialogHeaderProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type DialogFooterProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type DialogTitleProps = KeystoneDialogTitleProps;
export type DialogDescriptionProps = KeystoneDialogDescriptionProps;
export type DialogCloseProps = KeystoneDialogCloseProps;

export function Dialog(props: DialogProps) {
  return <KeystoneDialog.Root {...props} />;
}

export function DialogTrigger(props: DialogTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneDialog.Trigger {...rest} class={cn("mason-dialog-trigger", local.class)} />;
}

export function DialogPortal(props: DialogPortalProps) {
  return <KeystoneDialog.Portal {...props} />;
}

export function DialogBackdrop(props: DialogBackdropProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneDialog.Backdrop {...rest} class={cn("mason-dialog-backdrop", local.class)} />;
}

export function DialogPositioner(props: DialogPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneDialog.Positioner {...rest} class={cn("mason-dialog-positioner", local.class)} />;
}

export function DialogContent(props: DialogContentProps) {
  const [local, rest] = splitProps(props, [
    "backdropClass",
    "children",
    "class",
    "portal",
    "positionerClass",
  ]);

  return (
    <DialogPortal {...local.portal}>
      <DialogBackdrop class={local.backdropClass} />
      <DialogPositioner class={local.positionerClass}>
        <KeystoneDialog.Content {...rest} class={cn("mason-dialog-content", local.class)}>
          {local.children}
        </KeystoneDialog.Content>
      </DialogPositioner>
    </DialogPortal>
  );
}

export function DialogHeader(props: DialogHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="mason-dialog"
      data-part="header"
      class={cn("mason-dialog-header", local.class)}
    />
  );
}

export function DialogFooter(props: DialogFooterProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="mason-dialog"
      data-part="footer"
      class={cn("mason-dialog-footer", local.class)}
    />
  );
}

export function DialogTitle(props: DialogTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneDialog.Title {...rest} class={cn("mason-dialog-title", local.class)} />;
}

export function DialogDescription(props: DialogDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <KeystoneDialog.Description {...rest} class={cn("mason-dialog-description", local.class)} />
  );
}

export function DialogClose(props: DialogCloseProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneDialog.Close {...rest} class={cn("mason-dialog-close", local.class)} />;
}
