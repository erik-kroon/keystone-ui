import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type ScrollAreaOrientation = "both" | "horizontal" | "vertical";

export type ScrollAreaProps = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> & {
    viewportClass?: string;
    orientation?: ScrollAreaOrientation;
  }
>;
export type ScrollAreaRootProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type ScrollAreaViewportProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    orientation?: ScrollAreaOrientation;
  }
>;
export type ScrollAreaScrollbarProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    orientation?: Exclude<ScrollAreaOrientation, "both">;
  }
>;
export type ScrollAreaThumbProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ScrollAreaCornerProps = JSX.HTMLAttributes<HTMLDivElement>;

const classes = (...tokens: string[]) => tokens.join(" ");

const viewportOrientationClass: Record<ScrollAreaOrientation, string> = {
  both: "overflow-auto",
  horizontal: "overflow-x-auto overflow-y-hidden",
  vertical: "overflow-x-hidden overflow-y-auto",
};

export function ScrollArea(props: ScrollAreaProps) {
  const [local, rest] = splitProps(props, ["children", "class", "orientation", "viewportClass"]);

  return (
    <ScrollAreaRoot {...rest} class={local.class}>
      <ScrollAreaViewport class={local.viewportClass} orientation={local.orientation}>
        {local.children}
      </ScrollAreaViewport>
    </ScrollAreaRoot>
  );
}

export function ScrollAreaRoot(props: ScrollAreaRootProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-scroll-area"
      data-part="root"
      data-slot="scroll-area"
      class={cn("ui-scroll-area relative min-h-0 min-w-0 overflow-hidden", local.class)}
    />
  );
}

export function ScrollAreaViewport(props: ScrollAreaViewportProps) {
  const [local, rest] = splitProps(props, ["class", "orientation"]);
  const orientation = () => local.orientation ?? "vertical";

  return (
    <div
      {...rest}
      data-scope="ui-scroll-area"
      data-part="viewport"
      data-slot="scroll-area-viewport"
      data-orientation={orientation()}
      class={cn(
        classes(
          "ui-scroll-area-viewport",
          "h-full",
          "w-full",
          "min-h-0",
          "min-w-0",
          "overscroll-contain",
          "scroll-smooth",
          "[scrollbar-color:var(--color-muted-foreground,var(--muted-foreground))_transparent]",
          "[scrollbar-width:thin]",
          "[&::-webkit-scrollbar]:h-2",
          "[&::-webkit-scrollbar]:w-2",
          "[&::-webkit-scrollbar-corner]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/35",
          "[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/50",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          viewportOrientationClass[orientation()],
        ),
        local.class,
      )}
    />
  );
}

export function ScrollAreaScrollbar(props: ScrollAreaScrollbarProps) {
  const [local, rest] = splitProps(props, ["class", "orientation"]);
  const orientation = () => local.orientation ?? "vertical";

  return (
    <div
      {...rest}
      aria-hidden="true"
      data-scope="ui-scroll-area"
      data-part="scrollbar"
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation()}
      class={cn(
        classes(
          "ui-scroll-area-scrollbar",
          "pointer-events-none",
          "absolute",
          "select-none",
          "touch-none",
          "opacity-0",
          "data-[orientation=horizontal]:inset-x-1",
          "data-[orientation=horizontal]:bottom-1",
          "data-[orientation=horizontal]:h-2",
          "data-[orientation=vertical]:top-1",
          "data-[orientation=vertical]:right-1",
          "data-[orientation=vertical]:bottom-1",
          "data-[orientation=vertical]:w-2",
        ),
        local.class,
      )}
    />
  );
}

export function ScrollAreaThumb(props: ScrollAreaThumbProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      aria-hidden="true"
      data-scope="ui-scroll-area"
      data-part="thumb"
      data-slot="scroll-area-thumb"
      class={cn("ui-scroll-area-thumb rounded-full bg-border", local.class)}
    />
  );
}

export function ScrollAreaCorner(props: ScrollAreaCornerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      aria-hidden="true"
      data-scope="ui-scroll-area"
      data-part="corner"
      data-slot="scroll-area-corner"
      class={cn(
        "ui-scroll-area-corner absolute right-1 bottom-1 size-2 bg-transparent",
        local.class,
      )}
    />
  );
}
