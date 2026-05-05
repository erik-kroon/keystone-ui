import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type LabelProps = ParentProps<JSX.LabelHTMLAttributes<HTMLLabelElement>>;

export function Label(props: LabelProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <label
      {...rest}
      data-scope="ui-label"
      data-part="root"
      data-slot="label"
      class={cn(
        "ui-label inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground sm:text-sm/4",
        local.class,
      )}
    />
  );
}
