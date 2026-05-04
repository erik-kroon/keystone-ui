import {
  arrow,
  autoUpdate,
  type Boundary,
  computePosition,
  flip,
  hide,
  offset,
  platform as domPlatform,
  type RootBoundary,
  shift,
  size,
  type Placement,
  type Platform,
  type Strategy,
} from "@floating-ui/dom";
import { assignRef } from "./dom";
import { scheduleMicrotask } from "../utils/index";
import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  type Accessor,
  type JSX,
} from "solid-js";

export type FloatingPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";

export type FloatingStrategy = "absolute" | "fixed";
export type FloatingSide = "bottom" | "left" | "right" | "top";
export type FloatingAlign = "center" | "end" | "start";
export type FloatingCollisionBoundary = Boundary;
export type FloatingRootBoundary = RootBoundary;
export type FloatingSticky = "always" | "partial" | false;

export type CreateFloatingAdapterOptions = {
  anchor: Accessor<FloatingReferenceElement | undefined>;
  floating: Accessor<HTMLElement | undefined>;
  arrow?: Accessor<HTMLElement | undefined>;
  arrowPadding?: Accessor<number | undefined>;
  collisionBoundary?: Accessor<FloatingCollisionBoundary | undefined>;
  collisionPadding?: Accessor<number | undefined>;
  enabled?: Accessor<boolean>;
  fitViewport?: Accessor<boolean | undefined>;
  placement?: Accessor<FloatingPlacement | undefined>;
  gutter?: Accessor<number | undefined>;
  rootBoundary?: Accessor<FloatingRootBoundary | undefined>;
  sameWidth?: Accessor<boolean | undefined>;
  sticky?: Accessor<FloatingSticky | undefined>;
  strategy?: Accessor<FloatingStrategy | undefined>;
};

export type FloatingReferenceElement =
  | HTMLElement
  | {
      contextElement?: Element;
      getBoundingClientRect: () => DOMRect;
    };

export type FloatingAdapter = {
  align: Accessor<FloatingAlign>;
  side: Accessor<FloatingSide>;
  getFloatingProps: <T extends HTMLElement = HTMLElement>(
    props?: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T>;
  getArrowProps: <T extends HTMLElement = HTMLElement>(
    props?: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T> & {
    ref: (element: T) => void;
  };
  update: () => Promise<void>;
};

type FloatingGeometry = {
  align: FloatingAlign;
  arrowX: number | undefined;
  arrowY: number | undefined;
  availableHeight: number;
  availableWidth: number;
  height: number;
  isAnchorHidden: boolean;
  isEscaped: boolean;
  left: number;
  maxHeight: number | undefined;
  maxWidth: number | undefined;
  side: FloatingSide;
  top: number;
  transformOrigin: string;
  width: number;
  widthStyle: number | undefined;
};

type FloatingResolvedPlacement = {
  align: FloatingAlign;
  side: FloatingSide;
};

const defaultCollisionPadding = 4;

export function createFloatingAdapter(options: CreateFloatingAdapterOptions): FloatingAdapter {
  const placement = createMemo(() => options.placement?.() ?? "bottom-start");
  const strategy = createMemo(() => options.strategy?.() ?? "absolute");
  const collisionPadding = createMemo(
    () => options.collisionPadding?.() ?? defaultCollisionPadding,
  );
  const arrowPadding = createMemo(() => options.arrowPadding?.() ?? collisionPadding());
  const sameWidth = createMemo(() => options.sameWidth?.() ?? false);
  const fitViewport = createMemo(() => options.fitViewport?.() ?? false);
  const sticky = createMemo(() => options.sticky?.() ?? "partial");
  const [ownedArrowElement, setOwnedArrowElement] = createSignal<HTMLElement>();
  const [resolvedPlacement, setResolvedPlacement] = createSignal(parsePlacement(placement()));
  const side = createMemo(() => resolvedPlacement().side);
  const align = createMemo(() => resolvedPlacement().align);
  let geometry: FloatingGeometry | undefined;
  let updateVersion = 0;

  const update = async () => {
    if (options.enabled?.() === false) {
      return;
    }

    const anchor = options.anchor();
    const floating = options.floating();

    if (!anchor || !floating || typeof window === "undefined") {
      return;
    }

    const currentVersion = ++updateVersion;
    let availableWidth = 0;
    let availableHeight = 0;
    const arrowElement = options.arrow?.() ?? ownedArrowElement();
    const overflow = {
      boundary: options.collisionBoundary?.(),
      padding: collisionPadding(),
      rootBoundary: options.rootBoundary?.(),
    };

    const position = await computePosition(anchor, floating, {
      placement: placement() as Placement,
      platform: createCoreFloatingPlatform(strategy()),
      strategy: strategy() as Strategy,
      middleware: [
        offset(options.gutter?.() ?? 4),
        flip(overflow),
        shift(overflow),
        size({
          ...overflow,
          apply: ({ availableHeight: nextAvailableHeight, availableWidth: nextAvailableWidth }) => {
            availableHeight = Math.max(0, nextAvailableHeight);
            availableWidth = Math.max(0, nextAvailableWidth);
          },
        }),
        ...(arrowElement ? [arrow({ element: arrowElement, padding: arrowPadding() })] : []),
        ...(sticky() === false
          ? []
          : [
              hide({
                ...overflow,
                strategy: sticky() === "always" ? "escaped" : "referenceHidden",
              }),
            ]),
      ],
    });

    if (currentVersion !== updateVersion) {
      return;
    }

    const resolved = parsePlacement(position.placement as FloatingPlacement);
    const anchorRect = anchor.getBoundingClientRect();
    const floatingRect = floating.getBoundingClientRect();
    const arrowData = position.middlewareData.arrow;
    const hideData = position.middlewareData.hide;
    const arrowX = arrowData?.x ?? getArrowX(anchorRect, floatingRect, position.x, strategy());
    const arrowY = arrowData?.y ?? getArrowY(anchorRect, floatingRect, position.y, strategy());

    geometry = {
      align: resolved.align,
      arrowX,
      arrowY,
      availableHeight,
      availableWidth,
      height: anchorRect.height,
      isAnchorHidden: hideData?.referenceHidden === true,
      isEscaped: hideData?.escaped === true,
      left: position.x,
      maxHeight: fitViewport() ? availableHeight : undefined,
      maxWidth: fitViewport() ? availableWidth : undefined,
      side: resolved.side,
      top: position.y,
      transformOrigin: getTransformOrigin(resolved.side, resolved.align, arrowX, arrowY),
      width: anchorRect.width,
      widthStyle: sameWidth() ? anchorRect.width : undefined,
    };
    setResolvedPlacement((current) =>
      current.align === geometry?.align && current.side === geometry?.side
        ? current
        : {
            align: geometry?.align ?? current.align,
            side: geometry?.side ?? current.side,
          },
    );

    applyFloatingGeometry(floating, geometry);
    if (arrowElement) {
      applyArrowGeometry(arrowElement, geometry);
    }
  };

  createEffect(() => {
    if (options.enabled?.() === false) {
      return;
    }

    options.anchor();
    options.arrow?.();
    ownedArrowElement();
    options.floating();
    placement();
    options.gutter?.();
    collisionPadding();
    arrowPadding();
    options.collisionBoundary?.();
    fitViewport();
    options.rootBoundary?.();
    sameWidth();
    sticky();
    strategy();
    void update();
  });

  createEffect(() => {
    if (options.enabled?.() === false || typeof window === "undefined") {
      return;
    }

    const anchor = options.anchor();
    const floating = options.floating();

    if (!anchor || !floating) {
      return;
    }

    const cleanup = autoUpdate(anchor, floating, () => {
      void update();
    });
    const onWindowUpdate = () => {
      void update();
    };

    window.addEventListener("resize", onWindowUpdate);
    window.addEventListener("scroll", onWindowUpdate, true);
    onCleanup(() => {
      cleanup();
      window.removeEventListener("resize", onWindowUpdate);
      window.removeEventListener("scroll", onWindowUpdate, true);
    });
  });

  return {
    align,
    side,
    getFloatingProps: (props = {}) => ({
      ...props,
      "data-side": side(),
      "data-align": align(),
      "data-anchor-hidden": geometry?.isAnchorHidden ? "" : undefined,
      "data-escaped": geometry?.isEscaped ? "" : undefined,
      style: mergeFloatingStyle(props.style, strategy(), geometry),
    }),
    getArrowProps: <T extends HTMLElement = HTMLElement>(props: JSX.HTMLAttributes<T> = {}) => ({
      ...props,
      "data-side": side(),
      "data-align": align(),
      style: mergeArrowStyle(props.style, side(), geometry),
      ref: (element: T) => {
        const scheduledVersion = updateVersion;
        setOwnedArrowElement(() => element);
        assignRef(props.ref, element);
        scheduleMicrotask(() => {
          if (scheduledVersion === updateVersion) {
            void update();
          }
        });
      },
    }),
    update,
  };
}

function parsePlacement(placement: FloatingPlacement): FloatingResolvedPlacement {
  const [side, align] = placement.split("-") as [FloatingSide, "end" | "start" | undefined];

  return {
    align: align ?? "center",
    side,
  };
}

function createCoreFloatingPlatform(strategy: FloatingStrategy): Platform {
  return {
    ...domPlatform,
    getElementRects: ({ reference, floating }) => {
      const referenceRect = reference.getBoundingClientRect();
      const floatingRect = floating.getBoundingClientRect();
      const offsetX = strategy === "absolute" ? window.scrollX : 0;
      const offsetY = strategy === "absolute" ? window.scrollY : 0;

      return {
        reference: {
          x: referenceRect.left + offsetX,
          y: referenceRect.top + offsetY,
          width: referenceRect.width,
          height: referenceRect.height,
        },
        floating: {
          x: 0,
          y: 0,
          width: floatingRect.width,
          height: floatingRect.height,
        },
      };
    },
    getDimensions: (element) => {
      const rect = element.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
      };
    },
    getClippingRect: ({ boundary, rootBoundary }) =>
      getClippingRect(strategy, boundary, rootBoundary),
    convertOffsetParentRelativeRectToViewportRelativeRect: ({ rect }) => rect,
    getOffsetParent: () => window,
  };
}

function getArrowX(
  anchorRect: DOMRect,
  floatingRect: DOMRect,
  floatingLeft: number,
  strategy: FloatingStrategy,
) {
  const scrollOffset = strategy === "absolute" ? window.scrollX : 0;

  return clamp(
    anchorRect.left + scrollOffset + anchorRect.width / 2 - floatingLeft,
    0,
    floatingRect.width,
  );
}

function getArrowY(
  anchorRect: DOMRect,
  floatingRect: DOMRect,
  floatingTop: number,
  strategy: FloatingStrategy,
) {
  const scrollOffset = strategy === "absolute" ? window.scrollY : 0;

  return clamp(
    anchorRect.top + scrollOffset + anchorRect.height / 2 - floatingTop,
    0,
    floatingRect.height,
  );
}

function applyFloatingGeometry(element: HTMLElement, geometry: FloatingGeometry) {
  setAttribute(element, "data-align", geometry.align);
  setAttribute(element, "data-anchor-hidden", geometry.isAnchorHidden ? "" : undefined);
  setAttribute(element, "data-escaped", geometry.isEscaped ? "" : undefined);
  setAttribute(element, "data-side", geometry.side);
  setStyleProperty(element, "--keystone-anchor-width", `${geometry.width}px`);
  setStyleProperty(element, "--keystone-anchor-height", `${geometry.height}px`);
  setStyleProperty(element, "--keystone-available-width", `${geometry.availableWidth}px`);
  setStyleProperty(element, "--keystone-available-height", `${geometry.availableHeight}px`);
  setStyleProperty(element, "--keystone-arrow-x", `${geometry.arrowX}px`);
  setStyleProperty(element, "--keystone-arrow-y", `${geometry.arrowY}px`);
  setStyleProperty(element, "--keystone-transform-origin", geometry.transformOrigin);
  setElementStyleValue(element, "left", `${geometry.left}px`);
  setOptionalElementStyleValue(element, "maxHeight", geometry.maxHeight);
  setOptionalElementStyleValue(element, "maxWidth", geometry.maxWidth);
  setElementStyleValue(element, "top", `${geometry.top}px`);
  setOptionalElementStyleValue(element, "width", geometry.widthStyle);
}

function applyArrowGeometry(element: HTMLElement, geometry: FloatingGeometry) {
  setAttribute(element, "data-align", geometry.align);
  setAttribute(element, "data-side", geometry.side);
  setElementStyleValue(element, "position", "absolute");
  setOptionalElementStyleValue(element, "left", geometry.arrowX);
  setOptionalElementStyleValue(element, "top", geometry.arrowY);

  const staticSides =
    geometry.side === "bottom" || geometry.side === "top"
      ? (["bottom", "top"] as const)
      : (["left", "right"] as const);

  for (const side of staticSides) {
    element.style[side] = side === getOppositeSide(geometry.side) ? "0px" : "";
  }
}

function setAttribute(element: HTMLElement, name: string, value: string | undefined) {
  if (value === undefined) {
    element.removeAttribute(name);
    return;
  }

  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
}

function setStyleProperty(element: HTMLElement, property: string, value: string) {
  if (element.style.getPropertyValue(property) !== value) {
    element.style.setProperty(property, value);
  }
}

function setElementStyleValue(
  element: HTMLElement,
  property: "left" | "position" | "top",
  value: string,
) {
  if (element.style[property] !== value) {
    element.style[property] = value;
  }
}

function setOptionalElementStyleValue(
  element: HTMLElement,
  property: "left" | "maxHeight" | "maxWidth" | "top" | "width",
  value: number | undefined,
) {
  const next = value === undefined ? "" : `${value}px`;

  if (element.style[property] !== next) {
    element.style[property] = next;
  }
}

function mergeFloatingStyle(
  style: JSX.CSSProperties | string | undefined,
  strategy: FloatingStrategy,
  geometry: FloatingGeometry | undefined,
): JSX.CSSProperties | string {
  const floatingStyle: JSX.CSSProperties = {
    position: strategy,
    left: geometry ? `${geometry.left}px` : undefined,
    "max-height": geometry?.maxHeight === undefined ? undefined : `${geometry.maxHeight}px`,
    "max-width": geometry?.maxWidth === undefined ? undefined : `${geometry.maxWidth}px`,
    top: geometry ? `${geometry.top}px` : undefined,
    width: geometry?.widthStyle === undefined ? undefined : `${geometry.widthStyle}px`,
    "--keystone-anchor-width": geometry ? `${geometry.width}px` : undefined,
    "--keystone-anchor-height": geometry ? `${geometry.height}px` : undefined,
    "--keystone-available-width": geometry ? `${geometry.availableWidth}px` : undefined,
    "--keystone-available-height": geometry ? `${geometry.availableHeight}px` : undefined,
    "--keystone-arrow-x": geometry ? `${geometry.arrowX}px` : undefined,
    "--keystone-arrow-y": geometry ? `${geometry.arrowY}px` : undefined,
    "--keystone-transform-origin": geometry?.transformOrigin,
  } as JSX.CSSProperties;

  if (!style || typeof style === "string") {
    const serialized = serializeFloatingStyle(floatingStyle);
    return style ? `${style}; ${serialized}` : floatingStyle;
  }

  return {
    ...floatingStyle,
    ...style,
  };
}

function mergeArrowStyle(
  style: JSX.CSSProperties | string | undefined,
  side: FloatingSide,
  geometry: FloatingGeometry | undefined,
): JSX.CSSProperties | string {
  const arrowStyle: JSX.CSSProperties = {
    position: "absolute",
    left: geometry?.arrowX === undefined ? undefined : `${geometry.arrowX}px`,
    top: geometry?.arrowY === undefined ? undefined : `${geometry.arrowY}px`,
    [getOppositeSide(side)]: "0px",
  } as JSX.CSSProperties;

  if (!style || typeof style === "string") {
    const serialized = serializeFloatingStyle(arrowStyle);
    return style ? `${style}; ${serialized}` : arrowStyle;
  }

  return {
    ...arrowStyle,
    ...style,
  };
}

function serializeFloatingStyle(style: JSX.CSSProperties): string {
  return Object.entries(style)
    .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
    .map(([property, value]) => `${property}: ${value}`)
    .join("; ");
}

function getTransformOrigin(
  side: FloatingSide,
  align: FloatingAlign,
  arrowX: number | undefined,
  arrowY: number | undefined,
) {
  const crossAxis = align === "center" ? "center" : align;

  if (side === "top") {
    return `${arrowX === undefined ? crossAxis : `${arrowX}px`} bottom`;
  }

  if (side === "bottom") {
    return `${arrowX === undefined ? crossAxis : `${arrowX}px`} top`;
  }

  if (side === "left") {
    return `right ${arrowY === undefined ? crossAxis : `${arrowY}px`}`;
  }

  return `left ${arrowY === undefined ? crossAxis : `${arrowY}px`}`;
}

function getClippingRect(
  strategy: FloatingStrategy,
  boundary: Boundary | undefined,
  rootBoundary: RootBoundary | undefined,
) {
  const boundaryRect = getBoundaryRect(boundary);

  if (boundaryRect) {
    return boundaryRect;
  }

  if (rootBoundary && typeof rootBoundary === "object") {
    return normalizeRect(rootBoundary);
  }

  const x = strategy === "absolute" || rootBoundary === "document" ? window.scrollX : 0;
  const y = strategy === "absolute" || rootBoundary === "document" ? window.scrollY : 0;
  const width =
    rootBoundary === "document" ? document.documentElement.scrollWidth : window.innerWidth;
  const height =
    rootBoundary === "document" ? document.documentElement.scrollHeight : window.innerHeight;

  return {
    bottom: y + height,
    height,
    left: x,
    right: x + width,
    top: y,
    width,
    x,
    y,
  };
}

function getBoundaryRect(boundary: Boundary | undefined) {
  if (!boundary || boundary === "clippingAncestors") {
    return undefined;
  }

  if (Array.isArray(boundary)) {
    return boundary[0] ? normalizeRect(boundary[0].getBoundingClientRect()) : undefined;
  }

  if (boundary instanceof Element) {
    return normalizeRect(boundary.getBoundingClientRect());
  }

  return normalizeRect(boundary);
}

function normalizeRect(rect: {
  height: number;
  width: number;
  x?: number;
  y?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}) {
  const x = rect.x ?? rect.left ?? 0;
  const y = rect.y ?? rect.top ?? 0;

  return {
    bottom: rect.bottom ?? y + rect.height,
    height: rect.height,
    left: rect.left ?? x,
    right: rect.right ?? x + rect.width,
    top: rect.top ?? y,
    width: rect.width,
    x,
    y,
  };
}

function getOppositeSide(side: FloatingSide): FloatingSide {
  if (side === "top") {
    return "bottom";
  }

  if (side === "bottom") {
    return "top";
  }

  if (side === "left") {
    return "right";
  }

  return "left";
}

function clamp(value: number, min: number, max: number) {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}
