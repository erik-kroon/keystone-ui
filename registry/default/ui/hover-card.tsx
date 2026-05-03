import {
  HoverCard as KeystoneHoverCard,
  type HoverCardContentProps as KeystoneHoverCardContentProps,
  type HoverCardPortalProps as KeystoneHoverCardPortalProps,
  type HoverCardPositionerProps as KeystoneHoverCardPositionerProps,
  type HoverCardRootProps as KeystoneHoverCardRootProps,
  type HoverCardTriggerProps as KeystoneHoverCardTriggerProps,
} from "@keystone-ui/keystone/hover-card";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type HoverCardProps = KeystoneHoverCardRootProps;
export type HoverCardTriggerProps = KeystoneHoverCardTriggerProps;
export type HoverCardPortalProps = KeystoneHoverCardPortalProps;
export type HoverCardPositionerProps = KeystoneHoverCardPositionerProps;
export type HoverCardContentProps = KeystoneHoverCardContentProps & {
  portal?: HoverCardPortalProps;
  positionerClass?: string;
};

export function HoverCard(props: HoverCardProps) {
  return <KeystoneHoverCard.Root {...props} />;
}

export function HoverCardTrigger(props: HoverCardTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneHoverCard.Trigger {...rest} class={cn("mason-hover-card-trigger", local.class)} />
  );
}

export function HoverCardPortal(props: HoverCardPortalProps) {
  return <KeystoneHoverCard.Portal {...props} />;
}

export function HoverCardPositioner(props: HoverCardPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneHoverCard.Positioner
      {...rest}
      class={cn("mason-hover-card-positioner", local.class)}
    />
  );
}

export function HoverCardContent(props: HoverCardContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);

  return (
    <HoverCardPortal {...local.portal}>
      <HoverCardPositioner class={local.positionerClass}>
        <KeystoneHoverCard.Content {...rest} class={cn("mason-hover-card-content", local.class)}>
          {local.children}
        </KeystoneHoverCard.Content>
      </HoverCardPositioner>
    </HoverCardPortal>
  );
}
