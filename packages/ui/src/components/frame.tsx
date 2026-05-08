import { Show, splitProps, type JSX, type ParentProps } from "solid-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";

export type FrameVariant = "bordered" | "elevated" | "flush" | "inset";
export type FrameAspect = "auto" | "portrait" | "square" | "video" | "wide";

export type FrameProps = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLElement>, "title"> & {
    actions?: JSX.Element;
    aspect?: FrameAspect;
    description?: JSX.Element;
    empty?: JSX.Element;
    error?: JSX.Element;
    footer?: JSX.Element;
    loading?: boolean;
    loadingLabel?: JSX.Element;
    title?: JSX.Element;
    variant?: FrameVariant;
  }
>;

export type FrameRootProps = ParentProps<
  JSX.HTMLAttributes<HTMLElement> & {
    aspect?: FrameAspect;
    variant?: FrameVariant;
  }
>;
export type FrameHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;
export type FrameTitleProps = JSX.HTMLAttributes<HTMLDivElement>;
export type FrameDescriptionProps = JSX.HTMLAttributes<HTMLDivElement>;
export type FrameActionsProps = JSX.HTMLAttributes<HTMLDivElement>;
export type FrameViewportProps = JSX.HTMLAttributes<HTMLDivElement> & {
  aspect?: FrameAspect;
};
export type FrameContentProps = JSX.HTMLAttributes<HTMLDivElement>;
export type FrameFooterProps = JSX.HTMLAttributes<HTMLDivElement>;
export type FrameStatusProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    tone?: "empty" | "error" | "loading";
  }
>;
export type FrameLoadingProps = Omit<FrameStatusProps, "tone">;
export type FrameEmptyProps = Omit<FrameStatusProps, "tone">;
export type FrameErrorProps = Omit<FrameStatusProps, "tone"> & {
  action?: JSX.Element;
  retryLabel?: JSX.Element;
  onRetry?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
};

const classes = (...tokens: string[]) => tokens.join(" ");

const frameVariantClass: Record<FrameVariant, string> = {
  bordered: classes("border", "bg-card", "text-card-foreground", "shadow-xs/5"),
  elevated: classes("border", "bg-card", "text-card-foreground", "shadow-lg/5"),
  flush: classes("bg-transparent", "text-foreground", "shadow-none"),
  inset: classes("border", "bg-muted/40", "p-2", "text-foreground", "shadow-inner"),
};

const frameAspectClass: Record<FrameAspect, string> = {
  auto: "",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[21/9]",
};

export function Frame(props: FrameProps) {
  const [local, rest] = splitProps(props, [
    "actions",
    "aspect",
    "children",
    "description",
    "empty",
    "error",
    "footer",
    "loading",
    "loadingLabel",
    "title",
    "variant",
  ]);
  const hasHeader = () => Boolean(local.title || local.description || local.actions);

  return (
    <FrameRoot {...rest} aspect={local.aspect} variant={local.variant}>
      <Card class="min-h-0 min-w-0 flex-1 overflow-hidden rounded-[inherit] border-0 bg-transparent shadow-none before:hidden">
        <Show when={hasHeader()}>
          <FrameHeader>
            <div class="min-w-0">
              <Show when={local.title}>
                <FrameTitle>{local.title}</FrameTitle>
              </Show>
              <Show when={local.description}>
                <FrameDescription>{local.description}</FrameDescription>
              </Show>
            </div>
            <Show when={local.actions}>
              <FrameActions>{local.actions}</FrameActions>
            </Show>
          </FrameHeader>
          <FrameSeparator />
        </Show>
        <FrameViewport aspect={local.aspect}>
          <Show
            when={!local.loading && !local.error && !local.empty}
            fallback={
              <>
                <Show when={local.loading}>
                  <FrameLoading>{local.loadingLabel ?? "Loading"}</FrameLoading>
                </Show>
                <Show when={!local.loading && local.error}>
                  <FrameError>{local.error}</FrameError>
                </Show>
                <Show when={!local.loading && !local.error && local.empty}>
                  <FrameEmpty>{local.empty}</FrameEmpty>
                </Show>
              </>
            }
          >
            <FrameContent>{local.children}</FrameContent>
          </Show>
        </FrameViewport>
        <Show when={local.footer}>
          <FrameSeparator />
          <FrameFooter>{local.footer}</FrameFooter>
        </Show>
      </Card>
    </FrameRoot>
  );
}

export function FrameRoot(props: FrameRootProps) {
  const [local, rest] = splitProps(props, ["aspect", "class", "variant"]);
  const variant = () => local.variant ?? "bordered";
  const aspect = () => local.aspect ?? "auto";

  return (
    <section
      {...rest}
      data-scope="ui-frame"
      data-part="root"
      data-aspect={aspect()}
      data-variant={variant()}
      class={cn(
        classes(
          "ui-frame",
          "relative",
          "flex",
          "min-w-0",
          "flex-col",
          "overflow-hidden",
          "rounded-xl",
          "not-dark:bg-clip-padding",
          "data-[aspect=auto]:min-h-0",
          "before:pointer-events-none",
          "before:absolute",
          "before:inset-0",
          "before:rounded-[calc(var(--radius-xl)-1px)]",
          "before:shadow-[0_1px_--theme(--color-black/4%)]",
          "data-[variant=flush]:before:hidden",
          "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        ),
        frameVariantClass[variant()],
        local.class,
      )}
    />
  );
}

export function FrameHeader(props: FrameHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-frame"
      data-part="header"
      class={cn(
        "ui-frame-header grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-4 py-3",
        local.class,
      )}
    />
  );
}

export function FrameTitle(props: FrameTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-frame"
      data-part="title"
      class={cn("ui-frame-title truncate font-semibold text-sm", local.class)}
    />
  );
}

export function FrameDescription(props: FrameDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-frame"
      data-part="description"
      class={cn("ui-frame-description mt-0.5 truncate text-muted-foreground text-xs", local.class)}
    />
  );
}

export function FrameActions(props: FrameActionsProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-frame"
      data-part="actions"
      class={cn("ui-frame-actions flex shrink-0 items-center gap-1.5", local.class)}
    />
  );
}

export function FrameSeparator() {
  return (
    <div data-scope="ui-frame" data-part="separator" class="ui-frame-separator">
      <Separator />
    </div>
  );
}

export function FrameViewport(props: FrameViewportProps) {
  const [local, rest] = splitProps(props, ["aspect", "class"]);
  const aspect = () => local.aspect ?? "auto";

  return (
    <div
      {...rest}
      data-scope="ui-frame"
      data-part="viewport"
      data-aspect={aspect()}
      class={cn(
        classes(
          "ui-frame-viewport",
          "relative",
          "min-h-0",
          "min-w-0",
          "flex-1",
          "overflow-auto",
          "bg-background",
          "data-[aspect=auto]:min-h-24",
        ),
        frameAspectClass[aspect()],
        local.class,
      )}
    />
  );
}

export function FrameContent(props: FrameContentProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-frame"
      data-part="content"
      class={cn("ui-frame-content min-h-full min-w-0", local.class)}
    />
  );
}

export function FrameFooter(props: FrameFooterProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-frame"
      data-part="footer"
      class={cn(
        "ui-frame-footer flex min-w-0 items-center justify-between gap-3 px-4 py-3 text-muted-foreground text-xs",
        local.class,
      )}
    />
  );
}

export function FrameStatus(props: FrameStatusProps) {
  const [local, rest] = splitProps(props, ["class", "tone"]);
  const tone = () => local.tone ?? "empty";

  return (
    <div
      {...rest}
      data-scope="ui-frame"
      data-part="status"
      data-tone={tone()}
      role={tone() === "error" ? "alert" : "status"}
      class={cn(
        classes(
          "ui-frame-status",
          "flex",
          "min-h-24",
          "min-w-0",
          "flex-col",
          "items-center",
          "justify-center",
          "gap-2",
          "p-6",
          "text-center",
          "text-muted-foreground",
          "text-sm",
          "data-[tone=error]:text-destructive-foreground",
        ),
        local.class,
      )}
    />
  );
}

export function FrameLoading(props: FrameLoadingProps) {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <FrameStatus {...rest} tone="loading" class={local.class}>
      <span
        aria-hidden="true"
        data-scope="ui-frame"
        data-part="loading-indicator"
        class="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      />
      <span>{local.children}</span>
    </FrameStatus>
  );
}

export function FrameEmpty(props: FrameEmptyProps) {
  return <FrameStatus {...props} tone="empty" />;
}

export function FrameError(props: FrameErrorProps) {
  const [local, rest] = splitProps(props, ["action", "children", "onRetry", "retryLabel"]);

  return (
    <FrameStatus {...rest} tone="error">
      <span>{local.children}</span>
      <Show when={local.action ?? local.onRetry}>
        {local.action ?? (
          <Button variant="outline" size="sm" onClick={local.onRetry}>
            {local.retryLabel ?? "Retry"}
          </Button>
        )}
      </Show>
    </FrameStatus>
  );
}
