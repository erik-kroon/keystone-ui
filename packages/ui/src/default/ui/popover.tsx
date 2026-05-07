import {
  Popover as CorePopover,
  type PopoverArrowProps as CorePopoverArrowProps,
  type PopoverContentProps as CorePopoverContentProps,
  type PopoverPortalProps as CorePopoverPortalProps,
  type PopoverPositionerProps as CorePopoverPositionerProps,
  type PopoverRootProps as CorePopoverRootProps,
  type PopoverTriggerProps as CorePopoverTriggerProps,
} from "@keystone-ui/core/popover";
import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type PopoverProps = CorePopoverRootProps;
export type PopoverTriggerProps = CorePopoverTriggerProps;
export type PopoverPortalProps = CorePopoverPortalProps;
export type PopoverPositionerProps = CorePopoverPositionerProps;
export type PopoverContentProps = CorePopoverContentProps & {
  portal?: PopoverPortalProps;
  positionerClass?: string;
  tooltipStyle?: boolean;
  viewportClass?: string;
};
export type PopoverArrowProps = CorePopoverArrowProps;
export type PopoverHeaderProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type PopoverFooterProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type PopoverTitleProps = ParentProps<JSX.HTMLAttributes<HTMLHeadingElement>>;
export type PopoverDescriptionProps = ParentProps<JSX.HTMLAttributes<HTMLParagraphElement>>;

const classes = (...tokens: string[]) => tokens.join(" ");

export function Popover(props: PopoverProps) {
  return <CorePopover.Root {...props} />;
}

export function PopoverTrigger(props: PopoverTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CorePopover.Trigger
      {...rest}
      data-slot="popover-trigger"
      class={cn("ui-popover-trigger", local.class)}
    />
  );
}

export function PopoverPortal(props: PopoverPortalProps) {
  return <CorePopover.Portal {...props} />;
}

export function PopoverPositioner(props: PopoverPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CorePopover.Positioner
      {...rest}
      data-slot="popover-positioner"
      class={cn(
        classes(
          "ui-popover-positioner",
          "z-50",
          "h-(--positioner-height)",
          "w-(--positioner-width)",
          "max-w-(--available-width)",
          "transition-[top,left,right,bottom,transform]",
          "data-instant:transition-none",
        ),
        local.class,
      )}
    />
  );
}

export function PopoverContent(props: PopoverContentProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "portal",
    "positionerClass",
    "tooltipStyle",
    "viewportClass",
  ]);

  return (
    <PopoverPortal {...local.portal}>
      <PopoverPositioner class={local.positionerClass}>
        <CorePopover.Content
          {...rest}
          data-slot="popover-content"
          class={cn(
            classes(
              "ui-popover-content",
              "relative",
              "flex",
              "h-(--popup-height,auto)",
              "w-(--popup-width,auto)",
              "origin-(--transform-origin)",
              "rounded-lg",
              "border",
              "bg-popover",
              "not-dark:bg-clip-padding",
              "text-popover-foreground",
              "shadow-lg/5",
              "outline-none",
              "transition-[width,height,scale,opacity]",
              "duration-150",
              "ease-[cubic-bezier(0.23,1,0.32,1)]",
              "will-change-[scale,opacity]",
              "before:pointer-events-none",
              "before:absolute",
              "before:inset-0",
              "before:rounded-[calc(var(--radius-lg)-1px)]",
              "before:shadow-[0_1px_--theme(--color-black/4%)]",
              "has-data-[slot=calendar]:rounded-xl",
              "has-data-[slot=calendar]:before:rounded-[calc(var(--radius-xl)-1px)]",
              "data-ending-style:scale-98",
              "data-starting-style:scale-98",
              "data-ending-style:opacity-0",
              "data-starting-style:opacity-0",
              "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            ),
            local.tooltipStyle &&
              classes(
                "w-fit",
                "text-balance",
                "rounded-md",
                "text-xs",
                "shadow-md/5",
                "before:rounded-[calc(var(--radius-md)-1px)]",
              ),
            local.class,
          )}
        >
          <div
            data-scope="ui-popover"
            data-part="viewport"
            data-slot="popover-viewport"
            class={cn(
              classes(
                "ui-popover-viewport",
                "relative",
                "size-full",
                "max-h-(--available-height)",
                "overflow-clip",
                "px-(--viewport-inline-padding)",
                "py-4",
                "[--viewport-inline-padding:--spacing(4)]",
                "has-data-[slot=calendar]:p-2",
                "data-instant:transition-none",
                "**:data-current:data-ending-style:opacity-0",
                "**:data-current:data-starting-style:opacity-0",
                "**:data-previous:data-ending-style:opacity-0",
                "**:data-previous:data-starting-style:opacity-0",
                "**:data-current:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)]",
                "**:data-previous:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)]",
                "**:data-current:opacity-100",
                "**:data-previous:opacity-100",
                "**:data-current:transition-opacity",
                "**:data-previous:transition-opacity",
              ),
              local.tooltipStyle
                ? classes("py-1", "[--viewport-inline-padding:--spacing(2)]")
                : "not-data-transitioning:overflow-y-auto",
              local.viewportClass,
            )}
          >
            {local.children}
          </div>
        </CorePopover.Content>
      </PopoverPositioner>
    </PopoverPortal>
  );
}

export const PopoverPopup = PopoverContent;

export function PopoverArrow(props: PopoverArrowProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CorePopover.Arrow
      {...rest}
      data-slot="popover-arrow"
      class={cn("ui-popover-arrow", local.class)}
    />
  );
}

export function PopoverHeader(props: PopoverHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-popover"
      data-part="header"
      data-slot="popover-header"
      class={cn(classes("ui-popover-header", "mb-3", "flex", "flex-col", "gap-1.5"), local.class)}
    />
  );
}

export function PopoverFooter(props: PopoverFooterProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-popover"
      data-part="footer"
      data-slot="popover-footer"
      class={cn(classes("ui-popover-footer", "mt-3", "flex", "justify-end", "gap-2"), local.class)}
    />
  );
}

export function PopoverTitle(props: PopoverTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <h3
      {...rest}
      data-scope="ui-popover"
      data-part="title"
      data-slot="popover-title"
      class={cn(
        classes("ui-popover-title", "font-semibold", "text-lg", "leading-none"),
        local.class,
      )}
    />
  );
}

export function PopoverDescription(props: PopoverDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <p
      {...rest}
      data-scope="ui-popover"
      data-part="description"
      data-slot="popover-description"
      class={cn(classes("ui-popover-description", "text-muted-foreground", "text-sm"), local.class)}
    />
  );
}

export const PopoverPrimitive = CorePopover;
