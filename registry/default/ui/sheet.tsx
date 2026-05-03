import {
  Sheet as KeystoneSheet,
  type SheetBackdropProps as KeystoneSheetBackdropProps,
  type SheetCloseProps as KeystoneSheetCloseProps,
  type SheetContentProps as KeystoneSheetContentProps,
  type SheetDescriptionProps as KeystoneSheetDescriptionProps,
  type SheetPortalProps as KeystoneSheetPortalProps,
  type SheetPositionerProps as KeystoneSheetPositionerProps,
  type SheetRootProps as KeystoneSheetRootProps,
  type SheetTitleProps as KeystoneSheetTitleProps,
  type SheetTriggerProps as KeystoneSheetTriggerProps,
} from "@keystone-ui/keystone/sheet";
import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type SheetProps = KeystoneSheetRootProps;
export type SheetTriggerProps = KeystoneSheetTriggerProps;
export type SheetPortalProps = KeystoneSheetPortalProps;
export type SheetBackdropProps = KeystoneSheetBackdropProps;
export type SheetPositionerProps = KeystoneSheetPositionerProps;
export type SheetContentProps = KeystoneSheetContentProps & {
  backdropClass?: string;
  portal?: SheetPortalProps;
  positionerClass?: string;
};
export type SheetHeaderProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type SheetFooterProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type SheetTitleProps = KeystoneSheetTitleProps;
export type SheetDescriptionProps = KeystoneSheetDescriptionProps;
export type SheetCloseProps = KeystoneSheetCloseProps;

export function Sheet(props: SheetProps) {
  return <KeystoneSheet.Root {...props} />;
}

export function SheetTrigger(props: SheetTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneSheet.Trigger {...rest} class={cn("mason-sheet-trigger", local.class)} />;
}

export function SheetPortal(props: SheetPortalProps) {
  return <KeystoneSheet.Portal {...props} />;
}

export function SheetBackdrop(props: SheetBackdropProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneSheet.Backdrop {...rest} class={cn("mason-sheet-backdrop", local.class)} />;
}

export function SheetPositioner(props: SheetPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneSheet.Positioner {...rest} class={cn("mason-sheet-positioner", local.class)} />;
}

export function SheetContent(props: SheetContentProps) {
  const [local, rest] = splitProps(props, [
    "backdropClass",
    "children",
    "class",
    "portal",
    "positionerClass",
  ]);

  return (
    <SheetPortal {...local.portal}>
      <SheetBackdrop class={local.backdropClass} />
      <SheetPositioner class={local.positionerClass}>
        <KeystoneSheet.Content {...rest} class={cn("mason-sheet-content", local.class)}>
          {local.children}
        </KeystoneSheet.Content>
      </SheetPositioner>
    </SheetPortal>
  );
}

export function SheetHeader(props: SheetHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="mason-sheet"
      data-part="header"
      class={cn("mason-sheet-header", local.class)}
    />
  );
}

export function SheetFooter(props: SheetFooterProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="mason-sheet"
      data-part="footer"
      class={cn("mason-sheet-footer", local.class)}
    />
  );
}

export function SheetTitle(props: SheetTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneSheet.Title {...rest} class={cn("mason-sheet-title", local.class)} />;
}

export function SheetDescription(props: SheetDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneSheet.Description {...rest} class={cn("mason-sheet-description", local.class)} />;
}

export function SheetClose(props: SheetCloseProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneSheet.Close {...rest} class={cn("mason-sheet-close", local.class)} />;
}
