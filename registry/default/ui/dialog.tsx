import {
  Dialog as CoreDialog,
  type DialogCloseProps as CoreDialogCloseProps,
  type DialogContentProps as CoreDialogContentProps,
  type DialogDescriptionProps as CoreDialogDescriptionProps,
  type DialogPortalProps as CoreDialogPortalProps,
  type DialogRootProps as CoreDialogRootProps,
  type DialogTitleProps as CoreDialogTitleProps,
  type DialogTriggerProps as CoreDialogTriggerProps,
} from "@keystone-ui/core/dialog";
import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type DialogProps = CoreDialogRootProps;
export type DialogTriggerProps = CoreDialogTriggerProps;
export type DialogPortalProps = CoreDialogPortalProps;
export type DialogBackdropProps = JSX.HTMLAttributes<HTMLDivElement>;
export type DialogPositionerProps = JSX.HTMLAttributes<HTMLDivElement>;
export type DialogContentProps = CoreDialogContentProps & {
  backdropClass?: string;
  portal?: DialogPortalProps;
  positionerClass?: string;
};
export type DialogHeaderProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type DialogFooterProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type DialogTitleProps = CoreDialogTitleProps;
export type DialogDescriptionProps = CoreDialogDescriptionProps;
export type DialogCloseProps = CoreDialogCloseProps;

export function Dialog(props: DialogProps) {
  return <CoreDialog.Root {...props} />;
}

export function DialogTrigger(props: DialogTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreDialog.Trigger {...rest} class={cn("ui-dialog-trigger", local.class)} />;
}

export function DialogPortal(props: DialogPortalProps) {
  return <CoreDialog.Portal {...props} />;
}

export function DialogBackdrop(props: DialogBackdropProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreDialog.Backdrop {...rest} class={cn("ui-dialog-backdrop", local.class)} />;
}

export function DialogPositioner(props: DialogPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreDialog.Positioner {...rest} class={cn("ui-dialog-positioner", local.class)} />;
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
        <CoreDialog.Content {...rest} class={cn("ui-dialog-content", local.class)}>
          {local.children}
        </CoreDialog.Content>
      </DialogPositioner>
    </DialogPortal>
  );
}

export function DialogHeader(props: DialogHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-dialog"
      data-part="header"
      class={cn("ui-dialog-header", local.class)}
    />
  );
}

export function DialogFooter(props: DialogFooterProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-dialog"
      data-part="footer"
      class={cn("ui-dialog-footer", local.class)}
    />
  );
}

export function DialogTitle(props: DialogTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreDialog.Title {...rest} class={cn("ui-dialog-title", local.class)} />;
}

export function DialogDescription(props: DialogDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreDialog.Description {...rest} class={cn("ui-dialog-description", local.class)} />;
}

export function DialogClose(props: DialogCloseProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreDialog.Close {...rest} class={cn("ui-dialog-close", local.class)} />;
}
