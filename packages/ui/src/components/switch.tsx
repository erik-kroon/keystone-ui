import {
  Switch as CoreSwitch,
  type SwitchControlProps as CoreSwitchControlProps,
  type SwitchHiddenInputProps as CoreSwitchHiddenInputProps,
  type SwitchRootProps as CoreSwitchRootProps,
  type SwitchThumbProps as CoreSwitchThumbProps,
} from "@keystone-ui/core/switch";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type SwitchProps = CoreSwitchRootProps;
export type SwitchControlProps = CoreSwitchControlProps;
export type SwitchThumbProps = CoreSwitchThumbProps;
export type SwitchHiddenInputProps = CoreSwitchHiddenInputProps;

const classes = (...tokens: string[]) => tokens.join(" ");

export function Switch(props: SwitchProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <CoreSwitch.Root
      {...rest}
      class={cn(classes("ui-switch", "inline-flex", "items-center"), local.class)}
    >
      {local.children ?? (
        <>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchHiddenInput />
        </>
      )}
    </CoreSwitch.Root>
  );
}

export function SwitchControl(props: SwitchControlProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreSwitch.Control
      {...rest}
      data-slot="switch"
      class={cn(
        classes(
          "ui-switch-control",
          "inline-flex",
          "h-[calc(var(--thumb-size)+2px)]",
          "w-[calc(var(--thumb-size)*2-2px)]",
          "shrink-0",
          "cursor-pointer",
          "items-center",
          "rounded-full",
          "p-px",
          "outline-none",
          "transition-[background-color,box-shadow]",
          "duration-200",
          "[--thumb-size:--spacing(5)]",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          "focus-visible:ring-offset-1",
          "focus-visible:ring-offset-background",
          "data-disabled:cursor-not-allowed",
          "data-checked:bg-primary",
          "data-unchecked:bg-input",
          "data-disabled:opacity-64",
          "sm:[--thumb-size:--spacing(4)]",
        ),
        local.class,
      )}
    />
  );
}

export function SwitchThumb(props: SwitchThumbProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreSwitch.Thumb
      {...rest}
      data-slot="switch-thumb"
      class={cn(
        classes(
          "ui-switch-thumb",
          "pointer-events-none",
          "block",
          "aspect-square",
          "h-full",
          "origin-left",
          "rounded-(--thumb-size)",
          "bg-background",
          "shadow-sm/5",
          "will-change-transform",
          "[transition:translate_.15s,border-radius_.15s,scale_.1s_.1s,transform-origin_.15s]",
          "in-[[role=switch]:active,[data-slot=label]:active,[data-slot=field-label]:active]:not-data-disabled:scale-x-110",
          "in-[[role=switch]:active,[data-slot=label]:active,[data-slot=field-label]:active]:rounded-[var(--thumb-size)/calc(var(--thumb-size)*1.1)]",
          "data-checked:origin-[var(--thumb-size)_50%]",
          "data-checked:translate-x-[calc(var(--thumb-size)-4px)]",
        ),
        local.class,
      )}
    />
  );
}

export function SwitchHiddenInput(props: SwitchHiddenInputProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreSwitch.HiddenInput
      {...rest}
      data-slot="switch-input"
      class={cn("ui-switch-input", local.class)}
    />
  );
}

export const SwitchPrimitive = CoreSwitch;
