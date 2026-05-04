import { createComponent, type JSX, type ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";

export type CoreAs<Props> =
  | ValidComponent
  | keyof JSX.HTMLElementTags
  | ((props: Props) => JSX.Element);

export type PolymorphicProps<T extends HTMLElement = HTMLElement> = {
  as?: CoreAs<JSX.HTMLAttributes<T>>;
};

export function renderPolymorphic<Props extends Record<string, unknown>>(
  as: CoreAs<Props> | undefined,
  fallback: keyof JSX.HTMLElementTags,
  props: Props,
): JSX.Element {
  if (typeof as === "function") {
    return createComponent(as as (props: Props) => JSX.Element, props);
  }

  return createComponent(Dynamic, { component: as ?? fallback, ...props });
}
