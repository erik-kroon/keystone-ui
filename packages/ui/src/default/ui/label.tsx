import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type LabelProps = ParentProps<JSX.LabelHTMLAttributes<HTMLLabelElement>>;

export function Label(props: LabelProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <label {...rest} data-scope="ui-label" data-part="root" class={cn("ui-label", local.class)} />
  );
}
