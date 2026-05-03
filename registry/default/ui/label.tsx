import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type LabelProps = ParentProps<JSX.LabelHTMLAttributes<HTMLLabelElement>>;

export function Label(props: LabelProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <label
      {...rest}
      data-scope="mason-label"
      data-part="root"
      class={cn("mason-label", local.class)}
    />
  );
}
