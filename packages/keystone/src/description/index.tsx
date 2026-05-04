import { splitProps, type JSX } from "solid-js";
import { partDataAttributes, renderPolymorphic, type PolymorphicProps } from "../utils/index";

export type DescriptionPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type DescriptionRootProps = DescriptionPartProps<HTMLDivElement> &
  PolymorphicProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;

export type CreateDescriptionOptions = {
  scope?: string;
};

export function createDescription(options: CreateDescriptionOptions = {}) {
  const scope = options.scope ?? "description";

  return {
    getRootProps(
      props: Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> = {},
    ): JSX.HTMLAttributes<HTMLDivElement> {
      return {
        ...props,
        ...partDataAttributes(scope, "root"),
      };
    },
  };
}

function Root(props: DescriptionRootProps) {
  const [local, others] = splitProps(props, ["as", "children"]);
  const description = createDescription();

  return renderPolymorphic(local.as, "div", {
    ...description.getRootProps(others),
    children: local.children,
  });
}

export const Description = {
  Root,
};
