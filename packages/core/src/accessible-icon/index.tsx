import { splitProps, type JSX } from "solid-js";
import { partDataAttributes, renderPolymorphic, type PolymorphicProps } from "../utils/index";

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

export type AccessibleIconRootProps = AccessibleIconPartProps<HTMLSpanElement> &
  PolymorphicProps<HTMLSpanElement> &
  Omit<
    JSX.HTMLAttributes<HTMLSpanElement>,
    "aria-hidden" | "aria-label" | "children" | "ref" | "role"
  > & {
    children?: JSX.Element;
    label: string;
  };

export type AccessibleIconLabelProps = AccessibleIconPartProps<HTMLSpanElement> &
  Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children" | "ref">;

export type AccessibleIconPartProps<T extends HTMLElement = HTMLElement> = {
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type CreateAccessibleIconOptions = {
  label: () => string;
};

export function createAccessibleIcon(options: CreateAccessibleIconOptions) {
  return {
    getRootProps(props: Omit<JSX.HTMLAttributes<HTMLElement>, "children" | "ref"> = {}) {
      return {
        ...props,
        "aria-label": options.label(),
        role: "img",
        ...partDataAttributes("accessible-icon", "root"),
      };
    },
    getLabelProps(props: Omit<JSX.HTMLAttributes<HTMLElement>, "children" | "ref"> = {}) {
      return {
        ...props,
        style: mergeVisuallyHiddenStyle(props.style),
        ...partDataAttributes("accessible-icon", "label"),
      };
    },
  };
}

function Root(props: AccessibleIconRootProps) {
  const [local, others] = splitProps(props, ["as", "children", "label"]);
  const icon = createAccessibleIcon({ label: () => local.label });

  return renderPolymorphic(local.as, "span", {
    ...icon.getRootProps(others),
    children: (
      <>
        {local.children}
        <span {...icon.getLabelProps()}>{local.label}</span>
      </>
    ),
  });
}

function mergeVisuallyHiddenStyle(
  style: JSX.CSSProperties | string | undefined,
): JSX.CSSProperties | string {
  if (typeof style === "string") {
    return `${styleFromObject(visuallyHiddenStyle)}${style}`;
  }

  return {
    ...visuallyHiddenStyle,
    ...style,
  };
}

function styleFromObject(style: JSX.CSSProperties): string {
  return Object.entries(style)
    .map(([property, value]) => `${property}:${value};`)
    .join("");
}

export const AccessibleIcon = {
  Root,
};
