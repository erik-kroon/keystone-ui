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
  bordered: "text-muted-foreground",
  plain: "text-muted-foreground",
  surface: "text-muted-foreground",
};

const emptySizeClass: Record<EmptySize, string> = {
  compact: classes("gap-5", "px-6", "py-10"),
  default: classes("gap-6", "px-6", "py-12", "md:py-20"),
  lg: classes("gap-6", "px-6", "py-16", "md:py-24"),
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
          "flex-1",
          "flex-col",
          "items-center",
          "justify-center",
          "text-balance",
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
          "relative",
          "mb-6",
          "flex",
          "shrink-0",
          "items-center",
          "justify-center",
          "[&_svg]:pointer-events-none",
          "[&_svg]:shrink-0",
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
          "relative",
          "flex",
          "size-9",
          "shrink-0",
          "items-center",
          "justify-center",
          "rounded-md",
          "border",
          "bg-card",
          "not-dark:bg-clip-padding",
          "text-foreground",
          "shadow-sm/5",
          "before:pointer-events-none",
          "before:absolute",
          "before:inset-0",
          "before:rounded-[calc(var(--radius-md)-1px)]",
          "before:shadow-[0_1px_--theme(--color-black/4%)]",
          "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
          "[&_svg:not([class*='size-'])]:size-4.5",
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
      class={cn("ui-empty-body flex max-w-sm flex-col items-center text-center", local.class)}
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
      class={cn("ui-empty-title font-heading font-semibold text-xl", local.class)}
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
        "ui-empty-description text-muted-foreground text-sm [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4 [[data-slot=empty-title]+&]:mt-1",
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
      class={cn(
        "ui-empty-action flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
        local.class,
      )}
    />
  );
}
