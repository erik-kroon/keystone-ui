import {
  Popover as CorePopover,
  type PopoverContentProps as CorePopoverContentProps,
  type PopoverPortalProps as CorePopoverPortalProps,
  type PopoverPositionerProps as CorePopoverPositionerProps,
  type PopoverRootProps as CorePopoverRootProps,
  type PopoverTriggerProps as CorePopoverTriggerProps,
} from "@keystone-ui/core/popover";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type PopoverProps = CorePopoverRootProps;
export type PopoverTriggerProps = CorePopoverTriggerProps;
export type PopoverPortalProps = CorePopoverPortalProps;
export type PopoverPositionerProps = CorePopoverPositionerProps;
export type PopoverContentProps = CorePopoverContentProps & {
  portal?: PopoverPortalProps;
  positionerClass?: string;
};

export function Popover(props: PopoverProps) {
  return <CorePopover.Root {...props} />;
}

export function PopoverTrigger(props: PopoverTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CorePopover.Trigger {...rest} class={cn("ui-popover-trigger", local.class)} />;
}

export function PopoverPortal(props: PopoverPortalProps) {
  return <CorePopover.Portal {...props} />;
}

export function PopoverPositioner(props: PopoverPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CorePopover.Positioner {...rest} class={cn("ui-popover-positioner", local.class)} />;
}

export function PopoverContent(props: PopoverContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);

  return (
    <PopoverPortal {...local.portal}>
      <PopoverPositioner class={local.positionerClass}>
        <CorePopover.Content {...rest} class={cn("ui-popover-content", local.class)}>
          {local.children}
        </CorePopover.Content>
      </PopoverPositioner>
    </PopoverPortal>
  );
}
