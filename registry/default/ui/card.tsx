import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type CardProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

const classes = (...tokens: string[]) => tokens.join(" ");

function cardPart(part: string, className: string, props: CardProps, slot?: string) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-card"
      data-part={part}
      data-slot={slot ?? (part === "root" ? "card" : `card-${part}`)}
      class={cn(className, local.class)}
    />
  );
}

export function Card(props: CardProps) {
  return cardPart(
    "root",
    classes(
      "ui-card",
      "relative",
      "flex",
      "flex-col",
      "rounded-2xl",
      "border",
      "bg-card",
      "not-dark:bg-clip-padding",
      "text-card-foreground",
      "shadow-xs/5",
      "before:pointer-events-none",
      "before:absolute",
      "before:inset-0",
      "before:rounded-[calc(var(--radius-2xl)-1px)]",
      "before:shadow-[0_1px_--theme(--color-black/4%)]",
      "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
    ),
    props,
  );
}

export function CardFrame(props: CardProps) {
  return cardPart(
    "frame",
    classes(
      "ui-card-frame",
      "relative",
      "flex",
      "flex-col",
      "rounded-2xl",
      "border",
      "bg-card",
      "not-dark:bg-clip-padding",
      "text-card-foreground",
      "shadow-xs/5",
      "[--clip-bottom:-1rem]",
      "[--clip-top:-1rem]",
      "before:pointer-events-none",
      "before:absolute",
      "before:inset-0",
      "before:rounded-[calc(var(--radius-2xl)-1px)]",
      "before:bg-muted/72",
      "before:shadow-[0_1px_--theme(--color-black/4%)]",
      "has-data-[slot=table-container]:overflow-hidden",
      "*:data-[slot=card]:-m-px",
      "*:data-[slot=table-container]:-m-px",
      "*:data-[slot=table-container]:w-[calc(100%+2px)]",
      "*:not-first:data-[slot=card]:rounded-t-xl",
      "*:not-last:data-[slot=card]:rounded-b-xl",
      "*:data-[slot=card]:bg-clip-padding",
      "*:data-[slot=card]:shadow-none",
      "*:data-[slot=card]:before:hidden",
      "*:not-first:data-[slot=card]:before:rounded-t-[calc(var(--radius-xl)-1px)]",
      "*:not-last:data-[slot=card]:before:rounded-b-[calc(var(--radius-xl)-1px)]",
      "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      "*:data-[slot=card]:[clip-path:inset(var(--clip-top)_1px_var(--clip-bottom)_1px_round_calc(var(--radius-2xl)-1px))]",
      "*:data-[slot=card]:last:[--clip-bottom:1px]",
      "*:data-[slot=card]:first:[--clip-top:1px]",
    ),
    props,
  );
}

export function CardFrameHeader(props: CardProps) {
  return cardPart(
    "frame-header",
    classes(
      "ui-card-frame-header",
      "relative",
      "grid",
      "auto-rows-min",
      "grid-rows-[auto_auto]",
      "items-start",
      "gap-x-4",
      "px-6",
      "py-4",
      "has-data-[slot=card-frame-action]:grid-cols-[1fr_auto]",
    ),
    props,
  );
}

export function CardFrameTitle(props: CardProps) {
  return cardPart(
    "frame-title",
    classes("ui-card-frame-title", "self-center", "font-semibold", "text-sm"),
    props,
  );
}

export function CardFrameDescription(props: CardProps) {
  return cardPart(
    "frame-description",
    classes("ui-card-frame-description", "self-center", "text-muted-foreground", "text-sm"),
    props,
  );
}

export function CardFrameAction(props: CardProps) {
  return cardPart(
    "frame-action",
    classes(
      "ui-card-frame-action",
      "col-start-2",
      "nth-3:row-span-2",
      "nth-3:row-start-1",
      "inline-flex",
      "self-center",
      "justify-self-end",
    ),
    props,
  );
}

export function CardFrameFooter(props: CardProps) {
  return cardPart("frame-footer", classes("ui-card-frame-footer", "px-6", "py-4"), props);
}

export function CardHeader(props: CardProps) {
  return cardPart(
    "header",
    classes(
      "ui-card-header",
      "grid",
      "auto-rows-min",
      "grid-rows-[auto_auto]",
      "items-start",
      "gap-1.5",
      "p-6",
      "in-[[data-slot=card]:has(>[data-slot=card-panel])]:pb-4",
      "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
    ),
    props,
  );
}

export function CardTitle(props: CardProps) {
  return cardPart(
    "title",
    classes("ui-card-title", "font-semibold", "text-lg", "leading-none"),
    props,
  );
}

export function CardDescription(props: CardProps) {
  return cardPart(
    "description",
    classes("ui-card-description", "text-muted-foreground", "text-sm"),
    props,
  );
}

export function CardAction(props: CardProps) {
  return cardPart(
    "action",
    classes(
      "ui-card-action",
      "col-start-2",
      "row-span-2",
      "row-start-1",
      "inline-flex",
      "self-start",
      "justify-self-end",
    ),
    props,
  );
}

export function CardPanel(props: CardProps) {
  return cardPart(
    "panel",
    classes(
      "ui-card-panel",
      "flex-1",
      "p-6",
      "in-[[data-slot=card]:has(>[data-slot=card-header]:not(.border-b))]:pt-0",
      "in-[[data-slot=card]:has(>[data-slot=card-footer]:not(.border-t))]:pb-0",
    ),
    props,
  );
}

export function CardContent(props: CardProps) {
  return cardPart(
    "content",
    classes(
      "ui-card-content",
      "ui-card-panel",
      "flex-1",
      "p-6",
      "in-[[data-slot=card]:has(>[data-slot=card-header]:not(.border-b))]:pt-0",
      "in-[[data-slot=card]:has(>[data-slot=card-footer]:not(.border-t))]:pb-0",
    ),
    props,
    "card-content",
  );
}

export function CardFooter(props: CardProps) {
  return cardPart(
    "footer",
    classes(
      "ui-card-footer",
      "flex",
      "items-center",
      "p-6",
      "in-[[data-slot=card]:has(>[data-slot=card-panel])]:pt-4",
    ),
    props,
  );
}
