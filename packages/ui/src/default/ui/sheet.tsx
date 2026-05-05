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
  closeProps?: SheetCloseProps;
  portal?: SheetPortalProps;
  positionerClass?: string;
  showCloseButton?: boolean;
  variant?: "default" | "inset";
};
export type SheetHeaderProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type SheetFooterProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "bare";
  }
>;
export type SheetTitleProps = CoreSheetTitleProps;
export type SheetDescriptionProps = CoreSheetDescriptionProps;
export type SheetCloseProps = CoreSheetCloseProps;
export type SheetPanelProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    scrollFade?: boolean;
  }
>;

const classes = (...tokens: string[]) => tokens.join(" ");

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function Sheet(props: SheetProps) {
  return <CoreSheet.Root {...props} />;
}

export function SheetTrigger(props: SheetTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreSheet.Trigger
      {...rest}
      data-slot="sheet-trigger"
      class={cn("ui-sheet-trigger", local.class)}
    />
  );
}

export function SheetPortal(props: SheetPortalProps) {
  return <CoreSheet.Portal {...props} />;
}

export function SheetBackdrop(props: SheetBackdropProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreSheet.Backdrop
      {...rest}
      data-slot="sheet-backdrop"
      class={cn(
        "ui-sheet-backdrop fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-[transition-status=ending]:opacity-0 data-[transition-status=starting]:opacity-0",
        local.class,
      )}
    />
  );
}

export function SheetPositioner(props: SheetPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreSheet.Positioner
      {...rest}
      data-slot="sheet-positioner"
      class={cn(
        "ui-sheet-positioner fixed inset-0 z-50 grid data-[side=bottom]:grid-rows-[1fr_auto] data-[side=bottom]:pt-12 data-[side=top]:grid-rows-[auto_1fr] data-[side=top]:pb-12 data-[side=left]:flex data-[side=left]:justify-start data-[side=right]:flex data-[side=right]:justify-end",
        local.class,
      )}
    />
  );
}

export function SheetContent(props: SheetContentProps) {
  const [local, rest] = splitProps(props, [
    "backdropClass",
    "children",
    "class",
    "closeProps",
    "portal",
    "positionerClass",
    "showCloseButton",
    "variant",
  ]);
  const showCloseButton = () => local.showCloseButton ?? true;
  const variant = () => local.variant ?? "default";

  return (
    <SheetPortal {...local.portal}>
      <SheetBackdrop class={local.backdropClass} />
      <SheetPositioner class={cn(variant() === "inset" && "sm:p-4", local.positionerClass)}>
        <CoreSheet.Content
          {...rest}
          data-slot="sheet-content"
          class={cn(
            classes(
              "ui-sheet-content",
              "relative",
              "flex",
              "max-h-full",
              "min-h-0",
              "w-full",
              "min-w-0",
              "flex-col",
              "bg-popover",
              "not-dark:bg-clip-padding",
              "text-popover-foreground",
              "shadow-lg/5",
              "transition-[opacity,translate]",
              "duration-200",
              "ease-in-out",
              "will-change-transform",
              "before:pointer-events-none",
              "before:absolute",
              "before:inset-0",
              "before:shadow-[0_1px_--theme(--color-black/4%)]",
              "data-[transition-status=ending]:opacity-0",
              "data-[transition-status=starting]:opacity-0",
              "max-sm:before:hidden",
              "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
              "data-[side=bottom]:row-start-2",
              "data-[side=bottom]:border-t",
              "data-[side=bottom]:data-[transition-status=ending]:translate-y-8",
              "data-[side=bottom]:data-[transition-status=starting]:translate-y-8",
              "data-[side=top]:border-b",
              "data-[side=top]:data-[transition-status=ending]:-translate-y-8",
              "data-[side=top]:data-[transition-status=starting]:-translate-y-8",
              "data-[side=left]:w-[calc(100%-(--spacing(12)))]",
              "data-[side=left]:max-w-md",
              "data-[side=left]:border-e",
              "data-[side=left]:data-[transition-status=ending]:-translate-x-8",
              "data-[side=left]:data-[transition-status=starting]:-translate-x-8",
              "data-[side=right]:col-start-2",
              "data-[side=right]:w-[calc(100%-(--spacing(12)))]",
              "data-[side=right]:max-w-md",
              "data-[side=right]:border-s",
              "data-[side=right]:data-[transition-status=ending]:translate-x-8",
              "data-[side=right]:data-[transition-status=starting]:translate-x-8",
            ),
            variant() === "inset" &&
              classes(
                "before:hidden",
                "sm:rounded-2xl",
                "sm:border",
                "sm:before:rounded-[calc(var(--radius-2xl)-1px)]",
                "sm:**:data-[slot=sheet-footer]:rounded-b-[calc(var(--radius-2xl)-1px)]",
              ),
            local.class,
          )}
        >
          {local.children}
          {showCloseButton() && (
            <SheetClose
              aria-label="Close"
              {...local.closeProps}
              class={cn(
                "absolute end-2 top-2 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 sm:size-8 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                local.closeProps?.class,
              )}
            >
              {local.closeProps?.children ?? <CloseIcon />}
            </SheetClose>
          )}
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
      data-slot="sheet-header"
      class={cn(
        "ui-sheet-header flex flex-col gap-2 p-6 in-[[data-slot=sheet-content]:has([data-slot=sheet-panel])]:pb-3 max-sm:pb-4",
        local.class,
      )}
    />
  );
}

export function SheetFooter(props: SheetFooterProps) {
  const [local, rest] = splitProps(props, ["class", "variant"]);
  const variant = () => local.variant ?? "default";
  return (
    <div
      {...rest}
      data-scope="ui-sheet"
      data-part="footer"
      data-slot="sheet-footer"
      class={cn(
        "ui-sheet-footer flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end",
        variant() === "default" && "border-t bg-muted/72 py-4",
        variant() === "bare" &&
          "in-[[data-slot=sheet-content]:has([data-slot=sheet-panel])]:pt-3 pt-4 pb-6",
        local.class,
      )}
    />
  );
}

export function SheetTitle(props: SheetTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreSheet.Title
      {...rest}
      data-slot="sheet-title"
      class={cn("ui-sheet-title font-heading font-semibold text-xl leading-none", local.class)}
    />
  );
}

export function SheetDescription(props: SheetDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreSheet.Description
      {...rest}
      data-slot="sheet-description"
      class={cn("ui-sheet-description text-muted-foreground text-sm", local.class)}
    />
  );
}

export function SheetClose(props: SheetCloseProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreSheet.Close {...rest} data-slot="sheet-close" class={cn("ui-sheet-close", local.class)} />
  );
}

export function SheetPanel(props: SheetPanelProps) {
  const [local, rest] = splitProps(props, ["class", "scrollFade"]);

  return (
    <div
      {...rest}
      data-scope="ui-sheet"
      data-part="panel"
      data-scroll-fade={(local.scrollFade ?? true) ? "" : undefined}
      data-slot="sheet-panel"
      class={cn(
        "ui-sheet-panel min-h-0 overflow-y-auto p-6 in-[[data-slot=sheet-content]:has([data-slot=sheet-header])]:pt-1 in-[[data-slot=sheet-content]:has([data-slot=sheet-footer]:not(.border-t))]:pb-1",
        (local.scrollFade ?? true) &&
          "[mask-image:linear-gradient(to_bottom,transparent_0,black_1rem,black_calc(100%-1rem),transparent_100%)] [mask-size:100%_100%]",
        local.class,
      )}
    />
  );
}

export const SheetPopup = SheetContent;
