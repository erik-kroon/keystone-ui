import { splitProps, type JSX } from "solid-js";
import { partDataAttributes, renderPolymorphic, type PolymorphicProps } from "../utils/index";

export type LabelPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type LabelRootProps = LabelPartProps<HTMLLabelElement> &
  PolymorphicProps<HTMLLabelElement> &
  Omit<JSX.LabelHTMLAttributes<HTMLLabelElement>, "children" | "ref">;

export type CreateLabelOptions = {
  scope?: string;
};

export function createLabel(options: CreateLabelOptions = {}) {
  const scope = options.scope ?? "label";

  return {
    getRootProps(
      props: Omit<JSX.LabelHTMLAttributes<HTMLLabelElement>, "children" | "ref"> = {},
    ): JSX.LabelHTMLAttributes<HTMLLabelElement> {
      return {
        ...props,
        ...partDataAttributes(scope, "root"),
      };
    },
  };
}

function Root(props: LabelRootProps) {
  const [local, others] = splitProps(props, ["as", "children"]);
  const label = createLabel();

  return renderPolymorphic(local.as, "label", {
    ...label.getRootProps(others),
    children: local.children,
  });
}

export const Label = {
  Root,
};
