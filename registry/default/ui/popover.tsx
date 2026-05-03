import {
  Popover as KeystonePopover,
  type PopoverContentProps as KeystonePopoverContentProps,
  type PopoverPortalProps as KeystonePopoverPortalProps,
  type PopoverPositionerProps as KeystonePopoverPositionerProps,
  type PopoverRootProps as KeystonePopoverRootProps,
  type PopoverTriggerProps as KeystonePopoverTriggerProps,
} from "@keystone-ui/keystone/popover";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type PopoverProps = KeystonePopoverRootProps;
export type PopoverTriggerProps = KeystonePopoverTriggerProps;
export type PopoverPortalProps = KeystonePopoverPortalProps;
export type PopoverPositionerProps = KeystonePopoverPositionerProps;
export type PopoverContentProps = KeystonePopoverContentProps & {
  portal?: PopoverPortalProps;
  positionerClass?: string;
};

export function Popover(props: PopoverProps) {
  return <KeystonePopover.Root {...props} />;
}

export function PopoverTrigger(props: PopoverTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystonePopover.Trigger {...rest} class={cn("mason-popover-trigger", local.class)} />;
}

export function PopoverPortal(props: PopoverPortalProps) {
  return <KeystonePopover.Portal {...props} />;
}

export function PopoverPositioner(props: PopoverPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystonePopover.Positioner {...rest} class={cn("mason-popover-positioner", local.class)} />
  );
}

export function PopoverContent(props: PopoverContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);

  return (
    <PopoverPortal {...local.portal}>
      <PopoverPositioner class={local.positionerClass}>
        <KeystonePopover.Content {...rest} class={cn("mason-popover-content", local.class)}>
          {local.children}
        </KeystonePopover.Content>
      </PopoverPositioner>
    </PopoverPortal>
  );
}
