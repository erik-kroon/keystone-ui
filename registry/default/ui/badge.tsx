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
      data-scope="mason-badge"
      data-part="root"
      data-variant={variant()}
      class={cn("mason-badge", `mason-badge-${variant()}`, local.class)}
    />
  );
}
