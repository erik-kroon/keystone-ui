import type { JSX } from "solid-js";
import type { FloatingAdapter } from "./floating";

export type FloatingArrowProps<T extends HTMLElement = HTMLSpanElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
} & Omit<JSX.HTMLAttributes<T>, "children" | "ref">;

export function getFloatingArrowProps<T extends HTMLElement = HTMLSpanElement>(
  floating: FloatingAdapter,
  props: FloatingArrowProps<T>,
  partProps: Record<string, unknown>,
) {
  return {
    ...floating.getArrowProps(props),
    ...partProps,
    "aria-hidden": "true",
    get "data-side"() {
      return floating.side();
    },
    get "data-align"() {
      return floating.align();
    },
  };
}
