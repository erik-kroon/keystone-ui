import {
  Tooltip as CoreTooltip,
  type TooltipArrowProps as CoreTooltipArrowProps,
  type TooltipContentProps as CoreTooltipContentProps,
  type TooltipPortalProps as CoreTooltipPortalProps,
  type TooltipPositionerProps as CoreTooltipPositionerProps,
  type TooltipProviderProps as CoreTooltipProviderProps,
  type TooltipRootProps as CoreTooltipRootProps,
  type TooltipTriggerProps as CoreTooltipTriggerProps,
} from "@keystone-ui/core/tooltip";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type TooltipProps = CoreTooltipRootProps;
export type TooltipTriggerProps = CoreTooltipTriggerProps;
export type TooltipPortalProps = CoreTooltipPortalProps;
export type TooltipPositionerProps = CoreTooltipPositionerProps;
export type TooltipContentProps = CoreTooltipContentProps & {
  portal?: TooltipPortalProps;
  positionerClass?: string;
  viewportClass?: string;
};
export type TooltipArrowProps = CoreTooltipArrowProps;
export type TooltipProviderProps = CoreTooltipProviderProps;

const classes = (...tokens: string[]) => tokens.join(" ");

export function TooltipProvider(props: TooltipProviderProps) {
  return <CoreTooltip.Provider {...props} />;
}

export function Tooltip(props: TooltipProps) {
  return <CoreTooltip.Root {...props} />;
}

export function TooltipTrigger(props: TooltipTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreTooltip.Trigger
      {...rest}
      data-slot="tooltip-trigger"
      class={cn("ui-tooltip-trigger", local.class)}
    />
  );
}

export function TooltipPortal(props: TooltipPortalProps) {
  return <CoreTooltip.Portal {...props} />;
}

export function TooltipPositioner(props: TooltipPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreTooltip.Positioner
      {...rest}
      data-slot="tooltip-positioner"
      class={cn(
        classes(
          "ui-tooltip-positioner",
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

export function TooltipContent(props: TooltipContentProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "portal",
    "positionerClass",
    "viewportClass",
  ]);

  return (
    <TooltipPortal {...local.portal}>
      <TooltipPositioner class={local.positionerClass}>
        <CoreTooltip.Content
          {...rest}
          data-slot="tooltip-content"
          class={cn(
            classes(
              "ui-tooltip-content",
              "relative",
              "flex",
              "h-(--popup-height,auto)",
              "w-(--popup-width,auto)",
              "origin-(--transform-origin)",
              "text-balance",
              "rounded-md",
              "border",
              "bg-popover",
              "not-dark:bg-clip-padding",
              "text-popover-foreground",
              "text-xs",
              "shadow-md/5",
              "transition-[width,height,scale,opacity]",
              "before:pointer-events-none",
              "before:absolute",
              "before:inset-0",
              "before:rounded-[calc(var(--radius-md)-1px)]",
              "before:shadow-[0_1px_--theme(--color-black/4%)]",
              "data-ending-style:scale-98",
              "data-starting-style:scale-98",
              "data-ending-style:opacity-0",
              "data-starting-style:opacity-0",
              "data-instant:duration-0",
              "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            ),
            local.class,
          )}
        >
          <div
            data-scope="ui-tooltip"
            data-part="viewport"
            data-slot="tooltip-viewport"
            class={cn(
              classes(
                "ui-tooltip-viewport",
                "relative",
                "size-full",
                "overflow-clip",
                "px-(--viewport-inline-padding)",
                "py-1",
                "[--viewport-inline-padding:--spacing(2)]",
                "data-instant:transition-none",
                "**:data-current:data-ending-style:opacity-0",
                "**:data-current:data-starting-style:opacity-0",
                "**:data-previous:data-ending-style:opacity-0",
                "**:data-previous:data-starting-style:opacity-0",
                "**:data-current:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)]",
                "**:data-previous:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)]",
                "**:data-previous:truncate",
                "**:data-current:opacity-100",
                "**:data-previous:opacity-100",
                "**:data-current:transition-opacity",
                "**:data-previous:transition-opacity",
              ),
              local.viewportClass,
            )}
          >
            {local.children}
          </div>
        </CoreTooltip.Content>
      </TooltipPositioner>
    </TooltipPortal>
  );
}

export function TooltipArrow(props: TooltipArrowProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreTooltip.Arrow
      {...rest}
      data-slot="tooltip-arrow"
      class={cn("ui-tooltip-arrow", local.class)}
    />
  );
}

export const TooltipPopup = TooltipContent;
export const TooltipPrimitive = CoreTooltip;
