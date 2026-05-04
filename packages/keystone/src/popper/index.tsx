import {
  createContext,
  createSignal,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import { assignRef } from "../overlay/dom";
import {
  createFloatingAdapter,
  type FloatingAdapter,
  type FloatingAlign,
  type FloatingCollisionBoundary,
  type FloatingPlacement,
  type FloatingReferenceElement,
  type FloatingRootBoundary,
  type FloatingSide,
  type FloatingSticky,
  type FloatingStrategy,
} from "../overlay/floating";
import { getPartDataAttributes } from "../metadata/index";
import { renderPolymorphic, type PolymorphicProps } from "../utils/index";

export type {
  FloatingAlign as PopperAlign,
  FloatingCollisionBoundary as PopperCollisionBoundary,
  FloatingPlacement as PopperPlacement,
  FloatingReferenceElement as PopperAnchorElement,
  FloatingRootBoundary as PopperRootBoundary,
  FloatingSide as PopperSide,
  FloatingSticky as PopperSticky,
  FloatingStrategy as PopperStrategy,
};

export type CreatePopperOptions = {
  anchor?: Accessor<FloatingReferenceElement | undefined>;
  arrowPadding?: Accessor<number | undefined>;
  collisionBoundary?: Accessor<FloatingCollisionBoundary | undefined>;
  collisionPadding?: Accessor<number | undefined>;
  enabled?: Accessor<boolean | undefined>;
  fitViewport?: Accessor<boolean | undefined>;
  gutter?: Accessor<number | undefined>;
  placement?: Accessor<FloatingPlacement | undefined>;
  rootBoundary?: Accessor<FloatingRootBoundary | undefined>;
  sameWidth?: Accessor<boolean | undefined>;
  sticky?: Accessor<FloatingSticky | undefined>;
  strategy?: Accessor<FloatingStrategy | undefined>;
};

export type PopperApi = {
  align: Accessor<FloatingAlign>;
  side: Accessor<FloatingSide>;
  getAnchorProps: <T extends HTMLElement = HTMLElement>(
    props?: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T>;
  getArrowProps: <T extends HTMLElement = HTMLElement>(
    props?: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T>;
  getPositionerProps: <T extends HTMLElement = HTMLElement>(
    props?: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T>;
  setAnchor: (anchor: FloatingReferenceElement | undefined) => void;
  update: FloatingAdapter["update"];
};

export type PopperRootProps = {
  children?: JSX.Element;
  anchor?: FloatingReferenceElement;
  arrowPadding?: number;
  collisionBoundary?: FloatingCollisionBoundary;
  collisionPadding?: number;
  enabled?: boolean;
  fitViewport?: boolean;
  gutter?: number;
  placement?: FloatingPlacement;
  rootBoundary?: FloatingRootBoundary;
  sameWidth?: boolean;
  sticky?: FloatingSticky;
  strategy?: FloatingStrategy;
};

export type PopperPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type PopperAnchorProps = PopperPartProps<HTMLDivElement> &
  PolymorphicProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type PopperPositionerProps = PopperPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type PopperArrowProps = PopperPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;

const PopperContext = createContext<PopperApi>();

export function createPopper(options: CreatePopperOptions = {}): PopperApi {
  const [anchorElement, setAnchorElement] = createSignal<FloatingReferenceElement>();
  const [positionerElement, setPositionerElement] = createSignal<HTMLElement>();
  const partProps = (part: string) => getPartDataAttributes("popper", part);
  const floating = createFloatingAdapter({
    anchor: () => options.anchor?.() ?? anchorElement(),
    arrowPadding: options.arrowPadding,
    collisionBoundary: options.collisionBoundary,
    collisionPadding: options.collisionPadding,
    enabled: () => options.enabled?.() ?? true,
    fitViewport: options.fitViewport,
    floating: positionerElement,
    gutter: options.gutter,
    placement: options.placement,
    rootBoundary: options.rootBoundary,
    sameWidth: options.sameWidth,
    sticky: options.sticky,
    strategy: options.strategy,
  });

  return {
    align: floating.align,
    side: floating.side,
    getAnchorProps: <T extends HTMLElement = HTMLElement>(
      props: JSX.HTMLAttributes<T> = {},
    ): JSX.HTMLAttributes<T> => ({
      ...props,
      ...partProps("anchor"),
      ref: (element: T) => {
        setAnchorElement(() => element);
        assignRef(props.ref, element);
      },
    }),
    getArrowProps: <T extends HTMLElement = HTMLElement>(
      props: JSX.HTMLAttributes<T> = {},
    ): JSX.HTMLAttributes<T> => ({
      ...floating.getArrowProps(props),
      ...partProps("arrow"),
      "aria-hidden": "true",
      get "data-side"() {
        return floating.side();
      },
      get "data-align"() {
        return floating.align();
      },
    }),
    getPositionerProps: <T extends HTMLElement = HTMLElement>(
      props: JSX.HTMLAttributes<T> = {},
    ): JSX.HTMLAttributes<T> => ({
      ...floating.getFloatingProps(props),
      ...partProps("positioner"),
      ref: (element: T) => {
        setPositionerElement(() => element);
        assignRef(props.ref, element);
      },
    }),
    setAnchor: (anchor) => {
      setAnchorElement(() => anchor);
    },
    update: floating.update,
  };
}

function usePopper(part: string) {
  const popper = useContext(PopperContext);
  if (!popper) throw new Error(`Popper.${part} must be used within Popper.Root`);
  return popper;
}

function Root(props: PopperRootProps) {
  const popper = createPopper({
    anchor: () => props.anchor,
    arrowPadding: () => props.arrowPadding,
    collisionBoundary: () => props.collisionBoundary,
    collisionPadding: () => props.collisionPadding,
    enabled: () => props.enabled,
    fitViewport: () => props.fitViewport,
    gutter: () => props.gutter,
    placement: () => props.placement,
    rootBoundary: () => props.rootBoundary,
    sameWidth: () => props.sameWidth,
    sticky: () => props.sticky,
    strategy: () => props.strategy,
  });

  return <PopperContext.Provider value={popper}>{props.children}</PopperContext.Provider>;
}

function Anchor(props: PopperAnchorProps) {
  const popper = usePopper("Anchor");
  const [local, others] = splitProps(props, ["as", "children", "ref"]);
  const anchorProps = popper.getAnchorProps<HTMLDivElement>({
    ...others,
    ref: local.ref,
  });

  if (!local.as) return <div {...anchorProps}>{local.children}</div>;
  return renderPolymorphic(local.as, "div", { ...anchorProps, children: local.children });
}

function Positioner(props: PopperPositionerProps) {
  const popper = usePopper("Positioner");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);
  const positionerProps = popper.getPositionerProps({
    ...others,
    ref: local.ref,
    style: local.style,
  });

  return <div {...positionerProps}>{local.children}</div>;
}

function Arrow(props: PopperArrowProps) {
  const popper = usePopper("Arrow");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);
  const arrowProps = popper.getArrowProps({
    ...others,
    ref: local.ref,
    style: local.style,
  });

  return <div {...arrowProps}>{local.children}</div>;
}

export const Popper = {
  Root,
  Anchor,
  Positioner,
  Arrow,
};
