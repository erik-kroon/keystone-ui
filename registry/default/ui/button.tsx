import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type ButtonProps = ParentProps<
  JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "solid" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
  }
>;

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["class", "variant", "size"]);
  const variant = () => local.variant ?? "solid";
  const size = () => local.size ?? "md";

  return (
    <button
      {...rest}
      data-scope="mason-button"
      data-part="root"
      data-variant={variant()}
      data-size={size()}
      class={cn("mason-button", `mason-button-${variant()}`, `mason-button-${size()}`, local.class)}
    />
  );
}
