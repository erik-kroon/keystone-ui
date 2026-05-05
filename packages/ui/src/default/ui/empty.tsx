import { Show, splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type EmptyVariant = "bordered" | "plain" | "surface";
export type EmptySize = "default" | "compact" | "lg";

export type EmptyProps = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLElement>, "title"> & {
    action?: JSX.Element;
    description?: JSX.Element;
    icon?: JSX.Element;
    media?: JSX.Element;
    size?: EmptySize;
    title?: JSX.Element;
    variant?: EmptyVariant;
  }
>;
export type EmptyRootProps = ParentProps<
  JSX.HTMLAttributes<HTMLElement> & {
    size?: EmptySize;
    variant?: EmptyVariant;
  }
>;
export type EmptyMediaProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type EmptyIconProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type EmptyBodyProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type EmptyTitleProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type EmptyDescriptionProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type EmptyActionProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

const classes = (...tokens: string[]) => tokens.join(" ");

const emptyVariantClass: Record<EmptyVariant, string> = {
  bordered: classes(
    "border",
    "border-dashed",
    "border-input",
    "bg-muted/28",
    "text-muted-foreground",
  ),
  plain: "bg-transparent text-muted-foreground",
  surface: classes("border", "border-input", "bg-card", "text-muted-foreground", "shadow-xs/5"),
};

const emptySizeClass: Record<EmptySize, string> = {
  compact: classes("min-h-32", "gap-3", "p-4"),
  default: classes("min-h-44", "gap-4", "p-6"),
  lg: classes("min-h-60", "gap-5", "p-8"),
};

export function Empty(props: EmptyProps) {
  const [local, rest] = splitProps(props, [
    "action",
    "children",
    "description",
    "icon",
    "media",
    "size",
    "title",
    "variant",
  ]);

  return (
    <EmptyRoot {...rest} size={local.size} variant={local.variant}>
      <Show when={local.media}>
        <EmptyMedia>{local.media}</EmptyMedia>
      </Show>
      <Show when={!local.media && local.icon}>
        <EmptyIcon>{local.icon}</EmptyIcon>
      </Show>
      <Show when={local.title || local.description || local.children}>
        <EmptyBody>
          <Show when={local.title}>
            <EmptyTitle>{local.title}</EmptyTitle>
          </Show>
          <Show when={local.description}>
            <EmptyDescription>{local.description}</EmptyDescription>
          </Show>
          {local.children}
        </EmptyBody>
      </Show>
      <Show when={local.action}>
        <EmptyAction>{local.action}</EmptyAction>
      </Show>
    </EmptyRoot>
  );
}

export function EmptyRoot(props: EmptyRootProps) {
  const [local, rest] = splitProps(props, ["class", "size", "variant"]);
  const size = () => local.size ?? "default";
  const variant = () => local.variant ?? "bordered";

  return (
    <section
      {...rest}
      role={rest.role ?? "status"}
      data-scope="ui-empty"
      data-part="root"
      data-slot="empty"
      data-size={size()}
      data-variant={variant()}
      class={cn(
        classes(
          "ui-empty",
          "flex",
          "min-w-0",
          "flex-col",
          "items-center",
          "justify-center",
          "rounded-xl",
          "text-center",
          emptyVariantClass[variant()],
          emptySizeClass[size()],
        ),
        local.class,
      )}
    />
  );
}

export function EmptyMedia(props: EmptyMediaProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      aria-hidden={rest["aria-hidden"] ?? "true"}
      data-scope="ui-empty"
      data-part="media"
      data-slot="empty-media"
      class={cn(
        classes(
          "ui-empty-media",
          "flex",
          "max-h-28",
          "w-full",
          "max-w-56",
          "items-center",
          "justify-center",
          "overflow-hidden",
          "rounded-lg",
          "text-muted-foreground",
          "[&_img]:max-h-28",
          "[&_img]:w-auto",
          "[&_img]:max-w-full",
          "[&_svg]:max-h-28",
          "[&_svg]:max-w-full",
        ),
        local.class,
      )}
    />
  );
}

export function EmptyIcon(props: EmptyIconProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      aria-hidden={rest["aria-hidden"] ?? "true"}
      data-scope="ui-empty"
      data-part="icon"
      data-slot="empty-icon"
      class={cn(
        classes(
          "ui-empty-icon",
          "flex",
          "size-10",
          "items-center",
          "justify-center",
          "rounded-md",
          "border",
          "border-input",
          "bg-background",
          "text-muted-foreground",
          "shadow-xs/5",
          "[&_svg:not([class*='size-'])]:size-5",
          "[&_svg]:shrink-0",
        ),
        local.class,
      )}
    />
  );
}

export function EmptyBody(props: EmptyBodyProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-empty"
      data-part="body"
      data-slot="empty-body"
      class={cn("ui-empty-body flex max-w-sm flex-col items-center gap-1.5", local.class)}
    />
  );
}

export function EmptyTitle(props: EmptyTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-empty"
      data-part="title"
      data-slot="empty-title"
      class={cn("ui-empty-title font-medium text-foreground text-sm", local.class)}
    />
  );
}

export function EmptyDescription(props: EmptyDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-empty"
      data-part="description"
      data-slot="empty-description"
      class={cn(
        "ui-empty-description max-w-prose text-balance text-muted-foreground text-sm leading-6",
        local.class,
      )}
    />
  );
}

export function EmptyAction(props: EmptyActionProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-empty"
      data-part="action"
      data-slot="empty-action"
      class={cn("ui-empty-action flex flex-wrap items-center justify-center gap-2", local.class)}
    />
  );
}
