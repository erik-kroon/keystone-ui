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

export type CreateFloatingAdapterOptions = {
  anchor: Accessor<HTMLElement | undefined>;
  floating: Accessor<HTMLElement | undefined>;
  enabled?: Accessor<boolean>;
  placement?: Accessor<FloatingPlacement | undefined>;
  gutter?: Accessor<number | undefined>;
  strategy?: Accessor<FloatingStrategy | undefined>;
};

export type FloatingAdapter = {
  align: Accessor<FloatingAlign>;
  side: Accessor<FloatingSide>;
  getFloatingProps: <T extends HTMLElement = HTMLElement>(
    props?: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T>;
  update: () => void;
};

type FloatingGeometry = {
  align: FloatingAlign;
  arrowX: number | undefined;
  arrowY: number | undefined;
  availableHeight: number;
  availableWidth: number;
  height: number;
  left: number;
  side: FloatingSide;
  top: number;
  transformOrigin: string;
  width: number;
};

type FloatingPositioningInput = {
  anchorRect: DOMRect;
  floatingRect: DOMRect;
  gutter: number;
  placement: FloatingPlacement;
  strategy: FloatingStrategy;
  viewportHeight: number;
  viewportWidth: number;
  scrollX: number;
  scrollY: number;
};

type FloatingPositioningEngine = {
  compute: (input: FloatingPositioningInput) => FloatingGeometry;
};

const collisionPadding = 4;

export function createFloatingAdapter(options: CreateFloatingAdapterOptions): FloatingAdapter {
  const placement = createMemo(() => options.placement?.() ?? "bottom-start");
  const [resolvedPlacement, setResolvedPlacement] = createSignal(parsePlacement(placement()));
  const side = createMemo(() => resolvedPlacement().side);
  const align = createMemo(() => resolvedPlacement().align);
  const engine = createGeometryPositioningEngine();
  let geometry: FloatingGeometry | undefined;

  const update = () => {
    if (options.enabled?.() === false) {
      return;
    }

    const anchor = options.anchor();
    const floating = options.floating();

    if (!anchor || !floating || typeof window === "undefined") {
      return;
    }

    geometry = engine.compute({
      anchorRect: anchor.getBoundingClientRect(),
      floatingRect: floating.getBoundingClientRect(),
      gutter: options.gutter?.() ?? 4,
      placement: placement(),
      strategy: options.strategy?.() ?? "absolute",
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    });
    setResolvedPlacement((current) =>
      current.align === geometry?.align && current.side === geometry?.side
        ? current
        : {
            align: geometry?.align ?? current.align,
            side: geometry?.side ?? current.side,
          },
    );

    applyFloatingGeometry(floating, geometry);
  };

  createEffect(() => {
    if (options.enabled?.() === false) {
      return;
    }

    options.anchor();
    options.floating();
    placement();
    options.gutter?.();
    update();
  });

  createEffect(() => {
    if (options.enabled?.() === false || typeof window === "undefined") {
      return;
    }

    const onUpdate = () => update();
    window.addEventListener("resize", onUpdate);
    window.addEventListener("scroll", onUpdate, true);
    onCleanup(() => {
      window.removeEventListener("resize", onUpdate);
      window.removeEventListener("scroll", onUpdate, true);
    });
  });

  return {
    align,
    side,
    getFloatingProps: (props = {}) => ({
      ...props,
      "data-side": side(),
      "data-align": align(),
      style: mergeFloatingStyle(props.style, options.strategy?.() ?? "absolute", geometry),
    }),
    update,
  };
}

function createGeometryPositioningEngine(): FloatingPositioningEngine {
  return {
    compute: computeFloatingGeometry,
  };
}

function computeFloatingGeometry(input: FloatingPositioningInput): FloatingGeometry {
  const requested = parsePlacement(input.placement);
  const side = resolveCollisionSide(input, requested.side);
  const availableWidth = getAvailableWidth(input, side);
  const availableHeight = getAvailableHeight(input, side);
  const raw = getRawCoordinates(input, side, requested.align);
  const shifted = shiftCoordinates(input, side, raw);
  const arrow = getArrowCoordinates(input, shifted);
  const strategyOffsetX = input.strategy === "absolute" ? input.scrollX : 0;
  const strategyOffsetY = input.strategy === "absolute" ? input.scrollY : 0;

  return {
    align: requested.align,
    arrowX: arrow.x,
    arrowY: arrow.y,
    availableHeight,
    availableWidth,
    height: input.anchorRect.height,
    left: shifted.left + strategyOffsetX,
    side,
    top: shifted.top + strategyOffsetY,
    transformOrigin: getTransformOrigin(side, requested.align),
    width: input.anchorRect.width,
  };
}

function parsePlacement(placement: FloatingPlacement): {
  align: FloatingAlign;
  side: FloatingSide;
} {
  const [side, align] = placement.split("-") as [FloatingSide, "end" | "start" | undefined];

  return {
    align: align ?? "center",
    side,
  };
}

function resolveCollisionSide(input: FloatingPositioningInput, side: FloatingSide): FloatingSide {
  const opposite = getOppositeSide(side);
  const available = getAvailableMainAxis(input, side);
  const oppositeAvailable = getAvailableMainAxis(input, opposite);
  const floatingSize = isVerticalSide(side) ? input.floatingRect.height : input.floatingRect.width;

  return available < floatingSize && oppositeAvailable > available ? opposite : side;
}

function getAvailableMainAxis(input: FloatingPositioningInput, side: FloatingSide): number {
  if (side === "top") {
    return Math.max(0, input.anchorRect.top - input.gutter - collisionPadding);
  }

  if (side === "bottom") {
    return Math.max(
      0,
      input.viewportHeight - input.anchorRect.bottom - input.gutter - collisionPadding,
    );
  }

  if (side === "left") {
    return Math.max(0, input.anchorRect.left - input.gutter - collisionPadding);
  }

  return Math.max(
    0,
    input.viewportWidth - input.anchorRect.right - input.gutter - collisionPadding,
  );
}

function getAvailableWidth(input: FloatingPositioningInput, side: FloatingSide) {
  if (side === "left") {
    return getAvailableMainAxis(input, "left");
  }

  if (side === "right") {
    return getAvailableMainAxis(input, "right");
  }

  return Math.max(0, input.viewportWidth - collisionPadding * 2);
}

function getAvailableHeight(input: FloatingPositioningInput, side: FloatingSide) {
  if (side === "top") {
    return getAvailableMainAxis(input, "top");
  }

  if (side === "bottom") {
    return getAvailableMainAxis(input, "bottom");
  }

  return Math.max(0, input.viewportHeight - collisionPadding * 2);
}

function getRawCoordinates(
  input: FloatingPositioningInput,
  side: FloatingSide,
  align: FloatingAlign,
) {
  let left = input.anchorRect.left;
  let top = input.anchorRect.bottom + input.gutter;

  if (side === "top") {
    top = input.anchorRect.top - input.floatingRect.height - input.gutter;
  }

  if (side === "left") {
    left = input.anchorRect.left - input.floatingRect.width - input.gutter;
    top = alignCrossAxis(
      align,
      input.anchorRect.top,
      input.anchorRect.height,
      input.floatingRect.height,
    );
  }

  if (side === "right") {
    left = input.anchorRect.right + input.gutter;
    top = alignCrossAxis(
      align,
      input.anchorRect.top,
      input.anchorRect.height,
      input.floatingRect.height,
    );
  }

  if (isVerticalSide(side)) {
    left = alignCrossAxis(
      align,
      input.anchorRect.left,
      input.anchorRect.width,
      input.floatingRect.width,
    );
  }

  return { left, top };
}

function shiftCoordinates(
  input: FloatingPositioningInput,
  side: FloatingSide,
  coordinates: { left: number; top: number },
) {
  if (isVerticalSide(side)) {
    return {
      left: clamp(
        coordinates.left,
        collisionPadding,
        input.viewportWidth - input.floatingRect.width - collisionPadding,
      ),
      top: coordinates.top,
    };
  }

  return {
    left: coordinates.left,
    top: clamp(
      coordinates.top,
      collisionPadding,
      input.viewportHeight - input.floatingRect.height - collisionPadding,
    ),
  };
}

function getArrowCoordinates(
  input: FloatingPositioningInput,
  coordinates: { left: number; top: number },
): { x: number; y: number } {
  return {
    x: clamp(
      input.anchorRect.left + input.anchorRect.width / 2 - coordinates.left,
      0,
      input.floatingRect.width,
    ),
    y: clamp(
      input.anchorRect.top + input.anchorRect.height / 2 - coordinates.top,
      0,
      input.floatingRect.height,
    ),
  };
}

function alignCrossAxis(
  align: FloatingAlign,
  start: number,
  anchorSize: number,
  floatingSize: number,
) {
  if (align === "start") {
    return start;
  }

  if (align === "end") {
    return start + anchorSize - floatingSize;
  }

  return start + anchorSize / 2 - floatingSize / 2;
}

function applyFloatingGeometry(element: HTMLElement, geometry: FloatingGeometry) {
  setStyleProperty(element, "--keystone-anchor-width", `${geometry.width}px`);
  setStyleProperty(element, "--keystone-anchor-height", `${geometry.height}px`);
  setStyleProperty(element, "--keystone-available-width", `${geometry.availableWidth}px`);
  setStyleProperty(element, "--keystone-available-height", `${geometry.availableHeight}px`);
  setStyleProperty(element, "--keystone-arrow-x", `${geometry.arrowX}px`);
  setStyleProperty(element, "--keystone-arrow-y", `${geometry.arrowY}px`);
  setStyleProperty(element, "--keystone-transform-origin", geometry.transformOrigin);
  setElementStyleValue(element, "left", `${geometry.left}px`);
  setElementStyleValue(element, "top", `${geometry.top}px`);
}

function setStyleProperty(element: HTMLElement, property: string, value: string) {
  if (element.style.getPropertyValue(property) !== value) {
    element.style.setProperty(property, value);
  }
}

function setElementStyleValue(element: HTMLElement, property: "left" | "top", value: string) {
  if (element.style[property] !== value) {
    element.style[property] = value;
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
    top: geometry ? `${geometry.top}px` : undefined,
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

function serializeFloatingStyle(style: JSX.CSSProperties): string {
  return Object.entries(style)
    .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
    .map(([property, value]) => `${property}: ${value}`)
    .join("; ");
}

function getTransformOrigin(side: FloatingSide, align: FloatingAlign) {
  const crossAxis = align === "center" ? "center" : align;

  if (side === "top") {
    return `${crossAxis} bottom`;
  }

  if (side === "bottom") {
    return `${crossAxis} top`;
  }

  if (side === "left") {
    return `right ${crossAxis}`;
  }

  return `left ${crossAxis}`;
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

function isVerticalSide(side: FloatingSide) {
  return side === "top" || side === "bottom";
}

function clamp(value: number, min: number, max: number) {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}
