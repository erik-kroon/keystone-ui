import { createComponent, mergeProps, type JSX, type ValidComponent } from "solid-js";
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

  return createComponent(
    Dynamic as unknown as (props: Props & { component: ValidComponent | undefined }) => JSX.Element,
    mergeProps({ component: (as ?? fallback) as ValidComponent }, props) as Props & {
      component: ValidComponent | undefined;
    },
  );
}
