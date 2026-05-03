import {
  Toolbar as KeystoneToolbar,
  type ToolbarButtonProps as KeystoneToolbarButtonProps,
  type ToolbarLinkProps as KeystoneToolbarLinkProps,
  type ToolbarRootProps as KeystoneToolbarRootProps,
  type ToolbarSeparatorProps as KeystoneToolbarSeparatorProps,
} from "@keystone-ui/keystone/toolbar";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type ToolbarProps = KeystoneToolbarRootProps;
export type ToolbarButtonProps = KeystoneToolbarButtonProps;
export type ToolbarLinkProps = KeystoneToolbarLinkProps;
export type ToolbarSeparatorProps = KeystoneToolbarSeparatorProps;

export function Toolbar(props: ToolbarProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneToolbar.Root {...rest} class={cn("mason-toolbar", local.class)} />;
}

export function ToolbarButton(props: ToolbarButtonProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneToolbar.Button {...rest} class={cn("mason-toolbar-button", local.class)} />;
}

export function ToolbarLink(props: ToolbarLinkProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneToolbar.Link {...rest} class={cn("mason-toolbar-link", local.class)} />;
}

export function ToolbarSeparator(props: ToolbarSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneToolbar.Separator {...rest} class={cn("mason-toolbar-separator", local.class)} />;
}
