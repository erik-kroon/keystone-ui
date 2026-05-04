import { splitProps, type JSX } from "solid-js";
import { partDataAttributes, renderPolymorphic, type PolymorphicProps } from "../utils/index";

const scope = "visually-hidden";

const visuallyHiddenStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  "clip-path": "inset(50%)",
  "white-space": "nowrap",
  border: "0",
} as const satisfies JSX.CSSProperties;

export type VisuallyHiddenProps = PolymorphicProps<HTMLElement> &
  Omit<JSX.HTMLAttributes<HTMLElement>, "ref"> & {
    children?: JSX.Element;
    ref?: HTMLElement | ((element: HTMLElement) => void);
  };

function mergeStyle(style: VisuallyHiddenProps["style"]): JSX.CSSProperties | string {
  if (typeof style === "string") {
    return `${styleFromObject(visuallyHiddenStyle)}${style}`;
  }

  return {
    ...visuallyHiddenStyle,
    ...style,
  };
}

function Root(props: VisuallyHiddenProps) {
  const [local, others] = splitProps(props, ["as", "children", "style"]);

  return renderPolymorphic(local.as, "span", {
    ...others,
    ...partDataAttributes(scope, "root"),
    style: mergeStyle(local.style),
    children: local.children,
  });
}

function styleFromObject(style: JSX.CSSProperties): string {
  return Object.entries(style)
    .map(([property, value]) => `${property}:${value};`)
    .join("");
}

export const VisuallyHidden = {
  Root,
};
