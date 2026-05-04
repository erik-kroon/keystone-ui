import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type CardProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

function cardPart(part: string, className: string, props: CardProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <div {...rest} data-scope="ui-card" data-part={part} class={cn(className, local.class)} />;
}

export function Card(props: CardProps) {
  return cardPart("root", "ui-card", props);
}

export function CardHeader(props: CardProps) {
  return cardPart("header", "ui-card-header", props);
}

export function CardTitle(props: CardProps) {
  return cardPart("title", "ui-card-title", props);
}

export function CardDescription(props: CardProps) {
  return cardPart("description", "ui-card-description", props);
}

export function CardContent(props: CardProps) {
  return cardPart("content", "ui-card-content", props);
}

export function CardFooter(props: CardProps) {
  return cardPart("footer", "ui-card-footer", props);
}
