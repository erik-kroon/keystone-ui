import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input(props: InputProps) {
  const [local, rest] = splitProps(props, ["class", "invalid"]);

  return (
    <input
      {...rest}
      aria-invalid={local.invalid || undefined}
      data-scope="mason-input"
      data-part="root"
      data-invalid={local.invalid ? "" : undefined}
      class={cn("mason-input", local.class)}
    />
  );
}
