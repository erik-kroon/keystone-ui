import {
  Tooltip as KeystoneTooltip,
  type TooltipContentProps as KeystoneTooltipContentProps,
  type TooltipPortalProps as KeystoneTooltipPortalProps,
  type TooltipPositionerProps as KeystoneTooltipPositionerProps,
  type TooltipRootProps as KeystoneTooltipRootProps,
  type TooltipTriggerProps as KeystoneTooltipTriggerProps,
} from "@keystone-ui/keystone/tooltip";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type TooltipProps = KeystoneTooltipRootProps;
export type TooltipTriggerProps = KeystoneTooltipTriggerProps;
export type TooltipPortalProps = KeystoneTooltipPortalProps;
export type TooltipPositionerProps = KeystoneTooltipPositionerProps;
export type TooltipContentProps = KeystoneTooltipContentProps & {
  portal?: TooltipPortalProps;
  positionerClass?: string;
};

export function Tooltip(props: TooltipProps) {
  return <KeystoneTooltip.Root {...props} />;
}

export function TooltipTrigger(props: TooltipTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneTooltip.Trigger {...rest} class={cn("mason-tooltip-trigger", local.class)} />;
}

export function TooltipPortal(props: TooltipPortalProps) {
  return <KeystoneTooltip.Portal {...props} />;
}

export function TooltipPositioner(props: TooltipPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneTooltip.Positioner {...rest} class={cn("mason-tooltip-positioner", local.class)} />
  );
}

export function TooltipContent(props: TooltipContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);

  return (
    <TooltipPortal {...local.portal}>
      <TooltipPositioner class={local.positionerClass}>
        <KeystoneTooltip.Content {...rest} class={cn("mason-tooltip-content", local.class)}>
          {local.children}
        </KeystoneTooltip.Content>
      </TooltipPositioner>
    </TooltipPortal>
  );
}
