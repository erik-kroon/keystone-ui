import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type SeparatorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};

export function Separator(props: SeparatorProps) {
  const [local, rest] = splitProps(props, ["class", "orientation", "decorative"]);
  const orientation = () => local.orientation ?? "horizontal";
  const decorative = () => local.decorative ?? true;

  return (
    <div
      {...rest}
      role={decorative() ? "presentation" : "separator"}
      aria-orientation={decorative() ? undefined : orientation()}
      data-scope="ui-separator"
      data-part="root"
      data-orientation={orientation()}
      class={cn("ui-separator", `ui-separator-${orientation()}`, local.class)}
    />
  );
}
