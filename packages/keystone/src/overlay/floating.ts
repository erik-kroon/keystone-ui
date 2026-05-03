import { createEffect, createMemo, onCleanup, type Accessor, type JSX } from "solid-js";

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
  availableHeight: number;
  availableWidth: number;
  height: number;
  left: number;
  top: number;
  transformOrigin: string;
  width: number;
};

export function createFloatingAdapter(options: CreateFloatingAdapterOptions): FloatingAdapter {
  const placement = createMemo(() => options.placement?.() ?? "bottom-start");
  const side = createMemo(() => placement().split("-")[0] as FloatingSide);
  const align = createMemo(
    () => (placement().split("-")[1] as "end" | "start" | undefined) ?? "center",
  );
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

    geometry = computeFloatingGeometry({
      align: align(),
      anchorRect: anchor.getBoundingClientRect(),
      floatingRect: floating.getBoundingClientRect(),
      gutter: options.gutter?.() ?? 4,
      side: side(),
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
    });

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

function computeFloatingGeometry(options: {
  align: FloatingAlign;
  anchorRect: DOMRect;
  floatingRect: DOMRect;
  gutter: number;
  side: FloatingSide;
  viewportHeight: number;
  viewportWidth: number;
}): FloatingGeometry {
  const width = options.anchorRect.width;
  const height = options.anchorRect.height;
  const availableWidth =
    options.side === "left"
      ? options.anchorRect.left - options.gutter
      : options.viewportWidth - options.anchorRect.right - options.gutter;
  const availableHeight =
    options.side === "top"
      ? options.anchorRect.top - options.gutter
      : options.viewportHeight - options.anchorRect.bottom - options.gutter;
  let left = options.anchorRect.left;
  let top = options.anchorRect.bottom + options.gutter;

  if (options.side === "top") {
    top = options.anchorRect.top - options.floatingRect.height - options.gutter;
  }

  if (options.side === "left") {
    left = options.anchorRect.left - options.floatingRect.width - options.gutter;
    top = alignCrossAxis(
      options.align,
      options.anchorRect.top,
      options.anchorRect.height,
      options.floatingRect.height,
    );
  }

  if (options.side === "right") {
    left = options.anchorRect.right + options.gutter;
    top = alignCrossAxis(
      options.align,
      options.anchorRect.top,
      options.anchorRect.height,
      options.floatingRect.height,
    );
  }

  if (options.side === "bottom" || options.side === "top") {
    left = alignCrossAxis(
      options.align,
      options.anchorRect.left,
      options.anchorRect.width,
      options.floatingRect.width,
    );
  }

  return {
    availableHeight: Math.max(0, availableHeight),
    availableWidth: Math.max(0, availableWidth),
    height,
    left,
    top,
    transformOrigin: getTransformOrigin(options.side, options.align),
    width,
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
  element.style.setProperty("--keystone-anchor-width", `${geometry.width}px`);
  element.style.setProperty("--keystone-anchor-height", `${geometry.height}px`);
  element.style.setProperty("--keystone-available-width", `${geometry.availableWidth}px`);
  element.style.setProperty("--keystone-available-height", `${geometry.availableHeight}px`);
  element.style.setProperty("--keystone-transform-origin", geometry.transformOrigin);
  element.style.left = `${geometry.left}px`;
  element.style.top = `${geometry.top}px`;
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
    "--keystone-transform-origin": geometry?.transformOrigin,
  } as JSX.CSSProperties;

  if (!style || typeof style === "string") {
    return style ? `${style}; position: ${strategy}` : floatingStyle;
  }

  return {
    ...floatingStyle,
    ...style,
  };
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
