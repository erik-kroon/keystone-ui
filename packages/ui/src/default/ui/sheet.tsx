import {
  Sheet as CoreSheet,
  type SheetBackdropProps as CoreSheetBackdropProps,
  type SheetCloseProps as CoreSheetCloseProps,
  type SheetContentProps as CoreSheetContentProps,
  type SheetDescriptionProps as CoreSheetDescriptionProps,
  type SheetPortalProps as CoreSheetPortalProps,
  type SheetPositionerProps as CoreSheetPositionerProps,
  type SheetRootProps as CoreSheetRootProps,
  type SheetTitleProps as CoreSheetTitleProps,
  type SheetTriggerProps as CoreSheetTriggerProps,
} from "@keystone-ui/core/sheet";
import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type SheetProps = CoreSheetRootProps;
export type SheetTriggerProps = CoreSheetTriggerProps;
export type SheetPortalProps = CoreSheetPortalProps;
export type SheetBackdropProps = CoreSheetBackdropProps;
export type SheetPositionerProps = CoreSheetPositionerProps;
export type SheetContentProps = CoreSheetContentProps & {
  backdropClass?: string;
  portal?: SheetPortalProps;
  positionerClass?: string;
};
export type SheetHeaderProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type SheetFooterProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type SheetTitleProps = CoreSheetTitleProps;
export type SheetDescriptionProps = CoreSheetDescriptionProps;
export type SheetCloseProps = CoreSheetCloseProps;

export function Sheet(props: SheetProps) {
  return <CoreSheet.Root {...props} />;
}

export function SheetTrigger(props: SheetTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreSheet.Trigger {...rest} class={cn("ui-sheet-trigger", local.class)} />;
}

export function SheetPortal(props: SheetPortalProps) {
  return <CoreSheet.Portal {...props} />;
}

export function SheetBackdrop(props: SheetBackdropProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreSheet.Backdrop {...rest} class={cn("ui-sheet-backdrop", local.class)} />;
}

export function SheetPositioner(props: SheetPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreSheet.Positioner {...rest} class={cn("ui-sheet-positioner", local.class)} />;
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
        <CoreSheet.Content {...rest} class={cn("ui-sheet-content", local.class)}>
          {local.children}
        </CoreSheet.Content>
      </SheetPositioner>
    </SheetPortal>
  );
}

export function SheetHeader(props: SheetHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-sheet"
      data-part="header"
      class={cn("ui-sheet-header", local.class)}
    />
  );
}

export function SheetFooter(props: SheetFooterProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-sheet"
      data-part="footer"
      class={cn("ui-sheet-footer", local.class)}
    />
  );
}

export function SheetTitle(props: SheetTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreSheet.Title {...rest} class={cn("ui-sheet-title", local.class)} />;
}

export function SheetDescription(props: SheetDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreSheet.Description {...rest} class={cn("ui-sheet-description", local.class)} />;
}

export function SheetClose(props: SheetCloseProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreSheet.Close {...rest} class={cn("ui-sheet-close", local.class)} />;
}
