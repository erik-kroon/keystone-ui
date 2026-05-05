import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type SeparatorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};

const classes = (...tokens: string[]) => tokens.join(" ");

const separatorOrientationClass: Record<NonNullable<SeparatorProps["orientation"]>, string> = {
  horizontal: classes("data-[orientation=horizontal]:h-px", "data-[orientation=horizontal]:w-full"),
  vertical: classes(
    "data-[orientation=vertical]:w-px",
    "data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch",
  ),
};

export function separatorClass(props: Pick<SeparatorProps, "class" | "orientation">) {
  const orientation = props.orientation ?? "horizontal";

  return cn(
    "ui-separator",
    "shrink-0",
    "bg-border",
    separatorOrientationClass[orientation],
    props.class,
  );
}

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
      data-slot="separator"
      data-decorative={decorative() ? "" : undefined}
      data-orientation={orientation()}
      class={separatorClass({ class: local.class, orientation: orientation() })}
    />
  );
}
