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

export function Switch(props: SwitchProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <CoreSwitch.Root {...rest} class={cn("ui-switch", local.class)}>
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

  return <CoreSwitch.Control {...rest} class={cn("ui-switch-control", local.class)} />;
}

export function SwitchThumb(props: SwitchThumbProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreSwitch.Thumb {...rest} class={cn("ui-switch-thumb", local.class)} />;
}

export function SwitchHiddenInput(props: SwitchHiddenInputProps) {
  return <CoreSwitch.HiddenInput {...props} class="ui-switch-input" />;
}
