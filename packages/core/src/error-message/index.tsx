import { splitProps, type JSX } from "solid-js";
import { partDataAttributes, renderPolymorphic, type PolymorphicProps } from "../utils/index";

export type ErrorMessagePartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type ErrorMessageRootProps = ErrorMessagePartProps<HTMLDivElement> &
  PolymorphicProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;

export type CreateErrorMessageOptions = {
  scope?: string;
};

export function createErrorMessage(options: CreateErrorMessageOptions = {}) {
  const scope = options.scope ?? "error-message";

  return {
    getRootProps(
      props: Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> = {},
    ): JSX.HTMLAttributes<HTMLDivElement> {
      return {
        role: "alert",
        ...props,
        ...partDataAttributes(scope, "root"),
      };
    },
  };
}

function Root(props: ErrorMessageRootProps) {
  const [local, others] = splitProps(props, ["as", "children"]);
  const errorMessage = createErrorMessage();

  return renderPolymorphic(local.as, "div", {
    ...errorMessage.getRootProps(others),
    children: local.children,
  });
}

export const ErrorMessage = {
  Root,
};
