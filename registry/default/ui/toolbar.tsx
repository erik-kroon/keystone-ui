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

  return <CoreToolbar.Root {...rest} class={cn("ui-toolbar", local.class)} />;
}

export function ToolbarButton(props: ToolbarButtonProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreToolbar.Button {...rest} class={cn("ui-toolbar-button", local.class)} />;
}

export function ToolbarLink(props: ToolbarLinkProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreToolbar.Link {...rest} class={cn("ui-toolbar-link", local.class)} />;
}

export function ToolbarSeparator(props: ToolbarSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreToolbar.Separator {...rest} class={cn("ui-toolbar-separator", local.class)} />;
}
