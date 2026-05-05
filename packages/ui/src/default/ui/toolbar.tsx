import {
  Toolbar as CoreToolbar,
  type ToolbarButtonProps as CoreToolbarButtonProps,
  type ToolbarLinkProps as CoreToolbarLinkProps,
  type ToolbarRootProps as CoreToolbarRootProps,
  type ToolbarSeparatorProps as CoreToolbarSeparatorProps,
} from "@keystone-ui/core/toolbar";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type ToolbarProps = CoreToolbarRootProps;
export type ToolbarButtonProps = CoreToolbarButtonProps;
export type ToolbarLinkProps = CoreToolbarLinkProps;
export type ToolbarSeparatorProps = CoreToolbarSeparatorProps;

export function Toolbar(props: ToolbarProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreToolbar.Root
      {...rest}
      data-slot="toolbar"
      class={cn(
        "ui-toolbar relative flex gap-2 rounded-xl border bg-card not-dark:bg-clip-padding p-1 text-card-foreground",
        local.class,
      )}
    />
  );
}

export function ToolbarButton(props: ToolbarButtonProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreToolbar.Button
      {...rest}
      data-slot="toolbar-button"
      class={cn("ui-toolbar-button", local.class)}
    />
  );
}

export function ToolbarLink(props: ToolbarLinkProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreToolbar.Link
      {...rest}
      data-slot="toolbar-link"
      class={cn("ui-toolbar-link", local.class)}
    />
  );
}

export function ToolbarSeparator(props: ToolbarSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreToolbar.Separator
      {...rest}
      data-slot="toolbar-separator"
      class={cn(
        "ui-toolbar-separator shrink-0 bg-border data-[orientation=horizontal]:my-0.5 data-[orientation=vertical]:my-1.5 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch",
        local.class,
      )}
    />
  );
}
