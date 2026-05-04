import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function Textarea(props: TextareaProps) {
  const [local, rest] = splitProps(props, ["class", "invalid"]);

  return (
    <textarea
      {...rest}
      aria-invalid={local.invalid || undefined}
      data-scope="ui-textarea"
      data-part="root"
      data-invalid={local.invalid ? "" : undefined}
      class={cn("ui-textarea", local.class)}
    />
  );
}
