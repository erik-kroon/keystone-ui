import type { JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
};

export function Button(props: ButtonProps) {
  const variant = () => props.variant ?? "solid";
  return (
    <button
      {...props}
      data-scope="button"
      data-part="root"
      class={cn("ui-button", `ui-button-${variant()}`, props.class)}
    />
  );
}
