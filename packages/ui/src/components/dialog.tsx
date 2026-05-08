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
  bottomStickOnMobile?: boolean;
  closeProps?: DialogCloseProps;
  portal?: DialogPortalProps;
  positionerClass?: string;
  showCloseButton?: boolean;
};
export type DialogPanelProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    scrollFade?: boolean;
  }
>;
export type DialogHeaderProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type DialogFooterProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "bare";
  }
>;
export type DialogTitleProps = CoreDialogTitleProps;
export type DialogDescriptionProps = CoreDialogDescriptionProps;
export type DialogCloseProps = CoreDialogCloseProps;

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

export function Dialog(props: DialogProps) {
  return <CoreDialog.Root {...props} />;
}

export function DialogTrigger(props: DialogTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreDialog.Trigger
      {...rest}
      data-slot="dialog-trigger"
      class={cn("ui-dialog-trigger cursor-pointer", local.class)}
    />
  );
}

export function DialogPortal(props: DialogPortalProps) {
  return <CoreDialog.Portal {...props} />;
}

export function DialogBackdrop(props: DialogBackdropProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreDialog.Backdrop
      {...rest}
      data-slot="dialog-backdrop"
      class={cn(
        classes(
          "ui-dialog-backdrop",
          "fixed",
          "inset-0",
          "z-50",
          "bg-black/32",
          "backdrop-blur-sm",
          "transition-all",
          "duration-200",
          "data-ending-style:opacity-0",
          "data-starting-style:opacity-0",
        ),
        local.class,
      )}
    />
  );
}

export function DialogPositioner(props: DialogPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreDialog.Positioner
      {...rest}
      data-slot="dialog-positioner"
      class={cn(
        classes(
          "ui-dialog-positioner",
          "fixed",
          "inset-0",
          "z-50",
          "grid",
          "grid-rows-[1fr_auto_3fr]",
          "justify-items-center",
          "p-4",
        ),
        local.class,
      )}
    />
  );
}

export function DialogContent(props: DialogContentProps) {
  const [local, rest] = splitProps(props, [
    "backdropClass",
    "bottomStickOnMobile",
    "children",
    "class",
    "closeProps",
    "portal",
    "positionerClass",
    "showCloseButton",
  ]);
  const bottomStickOnMobile = () => local.bottomStickOnMobile ?? true;
  const showCloseButton = () => local.showCloseButton ?? true;

  return (
    <DialogPortal {...local.portal}>
      <DialogBackdrop class={local.backdropClass} />
      <DialogPositioner
        class={cn(
          bottomStickOnMobile() &&
            classes("max-sm:grid-rows-[1fr_auto]", "max-sm:p-0", "max-sm:pt-12"),
          local.positionerClass,
        )}
      >
        <CoreDialog.Content
          {...rest}
          data-slot="dialog-content"
          class={cn(
            classes(
              "ui-dialog-content",
              "relative",
              "row-start-2",
              "flex",
              "max-h-full",
              "min-h-0",
              "w-full",
              "min-w-0",
              "max-w-lg",
              "origin-center",
              "flex-col",
              "rounded-2xl",
              "border",
              "bg-popover",
              "not-dark:bg-clip-padding",
              "text-popover-foreground",
              "shadow-lg/5",
              "outline-none",
              "transition-[scale,opacity,translate]",
              "duration-200",
              "ease-in-out",
              "will-change-transform",
              "before:pointer-events-none",
              "before:absolute",
              "before:inset-0",
              "before:rounded-[calc(var(--radius-2xl)-1px)]",
              "before:shadow-[0_1px_--theme(--color-black/4%)]",
              "data-ending-style:opacity-0",
              "data-starting-style:opacity-0",
              "sm:data-ending-style:scale-98",
              "sm:data-starting-style:scale-98",
              "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            ),
            bottomStickOnMobile() &&
              classes(
                "max-sm:max-w-none",
                "max-sm:origin-bottom",
                "max-sm:rounded-none",
                "max-sm:border-x-0",
                "max-sm:border-t",
                "max-sm:border-b-0",
                "max-sm:data-ending-style:translate-y-4",
                "max-sm:data-starting-style:translate-y-4",
                "max-sm:before:hidden",
                "max-sm:before:rounded-none",
              ),
            local.class,
          )}
        >
          {local.children}
          {showCloseButton() && (
            <DialogClose
              aria-label="Close"
              {...local.closeProps}
              class={cn(
                classes(
                  "absolute",
                  "end-2",
                  "top-2",
                  "inline-flex",
                  "size-9",
                  "shrink-0",
                  "cursor-pointer",
                  "items-center",
                  "justify-center",
                  "rounded-lg",
                  "border",
                  "border-transparent",
                  "text-foreground",
                  "outline-none",
                  "transition-colors",
                  "hover:bg-accent",
                  "focus-visible:ring-2",
                  "focus-visible:ring-ring",
                  "focus-visible:ring-offset-1",
                  "focus-visible:ring-offset-background",
                  "disabled:pointer-events-none",
                  "disabled:opacity-64",
                  "sm:size-8",
                  "[&_svg:not([class*='size-'])]:size-4.5",
                  "sm:[&_svg:not([class*='size-'])]:size-4",
                  "[&_svg]:pointer-events-none",
                  "[&_svg]:shrink-0",
                ),
                local.closeProps?.class,
              )}
            >
              {local.closeProps?.children ?? <CloseIcon />}
            </DialogClose>
          )}
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
      data-slot="dialog-header"
      class={cn(
        classes(
          "ui-dialog-header",
          "flex",
          "flex-col",
          "gap-2",
          "p-6",
          "in-[[data-slot=dialog-content]:has([data-slot=dialog-panel])]:pb-3",
          "max-sm:pb-4",
        ),
        local.class,
      )}
    />
  );
}

export function DialogFooter(props: DialogFooterProps) {
  const [local, rest] = splitProps(props, ["class", "variant"]);
  const variant = () => local.variant ?? "default";

  return (
    <div
      {...rest}
      data-scope="ui-dialog"
      data-part="footer"
      data-slot="dialog-footer"
      class={cn(
        classes(
          "ui-dialog-footer",
          "flex",
          "flex-col-reverse",
          "gap-2",
          "px-6",
          "sm:flex-row",
          "sm:justify-end",
          "sm:rounded-b-[calc(var(--radius-2xl)-1px)]",
        ),
        variant() === "default" && classes("border-t", "bg-muted/72", "py-4"),
        variant() === "bare" &&
          classes(
            "pt-4",
            "pb-6",
            "in-[[data-slot=dialog-content]:has([data-slot=dialog-panel])]:pt-3",
          ),
        local.class,
      )}
    />
  );
}

export function DialogTitle(props: DialogTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreDialog.Title
      {...rest}
      data-slot="dialog-title"
      class={cn(
        classes("ui-dialog-title", "font-heading", "font-semibold", "text-xl", "leading-none"),
        local.class,
      )}
    />
  );
}

export function DialogDescription(props: DialogDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreDialog.Description
      {...rest}
      data-slot="dialog-description"
      class={cn(classes("ui-dialog-description", "text-muted-foreground", "text-sm"), local.class)}
    />
  );
}

export function DialogClose(props: DialogCloseProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreDialog.Close
      {...rest}
      data-slot="dialog-close"
      class={cn("ui-dialog-close", local.class)}
    />
  );
}

export function DialogPanel(props: DialogPanelProps) {
  const [local, rest] = splitProps(props, ["class", "scrollFade"]);

  return (
    <div
      {...rest}
      data-scope="ui-dialog"
      data-part="panel"
      data-scroll-fade={(local.scrollFade ?? true) ? "" : undefined}
      data-slot="dialog-panel"
      class={cn(
        classes(
          "ui-dialog-panel",
          "min-h-0",
          "overflow-y-auto",
          "p-6",
          "in-[[data-slot=dialog-content]:has([data-slot=dialog-header])]:pt-1",
          "in-[[data-slot=dialog-content]:has([data-slot=dialog-footer]:not(.border-t))]:pb-1",
        ),
        (local.scrollFade ?? true) &&
          classes(
            "[mask-image:linear-gradient(to_bottom,transparent_0,black_1rem,black_calc(100%-1rem),transparent_100%)]",
            "[mask-size:100%_100%]",
          ),
        local.class,
      )}
    />
  );
}

export const DialogPrimitive = CoreDialog;
