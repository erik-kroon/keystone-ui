import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type BadgeProps = ParentProps<
  JSX.HTMLAttributes<HTMLSpanElement> & {
    variant?: "solid" | "muted" | "outline";
  }
>;

export function Badge(props: BadgeProps) {
  const [local, rest] = splitProps(props, ["class", "variant"]);
  const variant = () => local.variant ?? "solid";

  return (
    <span
      {...rest}
      data-scope="ui-badge"
      data-part="root"
      data-variant={variant()}
      class={cn("ui-badge", `ui-badge-${variant()}`, local.class)}
    />
  );
}
