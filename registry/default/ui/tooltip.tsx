import {
  Tooltip as CoreTooltip,
  type TooltipContentProps as CoreTooltipContentProps,
  type TooltipPortalProps as CoreTooltipPortalProps,
  type TooltipPositionerProps as CoreTooltipPositionerProps,
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
};

export function Tooltip(props: TooltipProps) {
  return <CoreTooltip.Root {...props} />;
}

export function TooltipTrigger(props: TooltipTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreTooltip.Trigger {...rest} class={cn("ui-tooltip-trigger", local.class)} />;
}

export function TooltipPortal(props: TooltipPortalProps) {
  return <CoreTooltip.Portal {...props} />;
}

export function TooltipPositioner(props: TooltipPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreTooltip.Positioner {...rest} class={cn("ui-tooltip-positioner", local.class)} />;
}

export function TooltipContent(props: TooltipContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);

  return (
    <TooltipPortal {...local.portal}>
      <TooltipPositioner class={local.positionerClass}>
        <CoreTooltip.Content {...rest} class={cn("ui-tooltip-content", local.class)}>
          {local.children}
        </CoreTooltip.Content>
      </TooltipPositioner>
    </TooltipPortal>
  );
}
