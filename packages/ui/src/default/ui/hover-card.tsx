import {
  HoverCard as CoreHoverCard,
  type HoverCardArrowProps as CoreHoverCardArrowProps,
  type HoverCardContentProps as CoreHoverCardContentProps,
  type HoverCardPortalProps as CoreHoverCardPortalProps,
  type HoverCardPositionerProps as CoreHoverCardPositionerProps,
  type HoverCardRootProps as CoreHoverCardRootProps,
  type HoverCardTriggerProps as CoreHoverCardTriggerProps,
} from "@keystone-ui/core/hover-card";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type HoverCardProps = CoreHoverCardRootProps;
export type HoverCardTriggerProps = CoreHoverCardTriggerProps;
export type HoverCardPortalProps = CoreHoverCardPortalProps;
export type HoverCardPositionerProps = CoreHoverCardPositionerProps;
export type HoverCardArrowProps = CoreHoverCardArrowProps;
export type HoverCardContentProps = CoreHoverCardContentProps & {
  portal?: HoverCardPortalProps;
  positionerClass?: string;
};

export function HoverCard(props: HoverCardProps) {
  return <CoreHoverCard.Root {...props} />;
}

export function HoverCardTrigger(props: HoverCardTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreHoverCard.Trigger
      {...rest}
      class={cn("ui-hover-card-trigger cursor-pointer", local.class)}
    />
  );
}

export function HoverCardPortal(props: HoverCardPortalProps) {
  return <CoreHoverCard.Portal {...props} />;
}

export function HoverCardPositioner(props: HoverCardPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreHoverCard.Positioner {...rest} class={cn("ui-hover-card-positioner", local.class)} />;
}

export function HoverCardArrow(props: HoverCardArrowProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreHoverCard.Arrow {...rest} class={cn("ui-hover-card-arrow", local.class)} />;
}

export function HoverCardContent(props: HoverCardContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);

  return (
    <HoverCardPortal {...local.portal}>
      <HoverCardPositioner class={local.positionerClass}>
        <CoreHoverCard.Content
          {...rest}
          class={cn(
            "ui-hover-card-content origin-(--transform-origin) transition-[width,height,scale,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[scale,opacity] data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0",
            local.class,
          )}
        >
          {local.children}
        </CoreHoverCard.Content>
      </HoverCardPositioner>
    </HoverCardPortal>
  );
}
