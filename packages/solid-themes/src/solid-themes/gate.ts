import type { JSX } from "solid-js";
import { useTheme } from "./context";
import type { ThemeContextValue, ThemeGateProps } from "./types";

function resolveChildren(
  children: ThemeGateProps["children"],
  theme: ThemeContextValue
): JSX.Element {
  return typeof children === "function" ? children(theme) : children;
}

export function ThemeGate(props: ThemeGateProps): JSX.Element {
  const theme = useTheme();

  return (() =>
    theme.mounted()
      ? resolveChildren(props.children, theme)
      : props.fallback) as unknown as JSX.Element;
}
