import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  "data-part"?: string;
  "data-scope"?: string;
  "data-slot"?: string;
  invalid?: boolean;
};

export function Textarea(props: TextareaProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "data-part",
    "data-scope",
    "data-slot",
    "invalid",
  ]);

  return (
    <textarea
      {...rest}
      aria-invalid={local.invalid || undefined}
      data-scope={local["data-scope"] ?? "ui-textarea"}
      data-part={local["data-part"] ?? "root"}
      data-slot={local["data-slot"]}
      data-invalid={local.invalid ? "" : undefined}
      class={cn("ui-textarea", local.class)}
    />
  );
}
