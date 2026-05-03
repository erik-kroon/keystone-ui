import {
  Switch as KeystoneSwitch,
  type SwitchControlProps as KeystoneSwitchControlProps,
  type SwitchHiddenInputProps as KeystoneSwitchHiddenInputProps,
  type SwitchRootProps as KeystoneSwitchRootProps,
  type SwitchThumbProps as KeystoneSwitchThumbProps,
} from "@keystone-ui/keystone/switch";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type SwitchProps = KeystoneSwitchRootProps;
export type SwitchControlProps = KeystoneSwitchControlProps;
export type SwitchThumbProps = KeystoneSwitchThumbProps;
export type SwitchHiddenInputProps = KeystoneSwitchHiddenInputProps;

export function Switch(props: SwitchProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <KeystoneSwitch.Root {...rest} class={cn("mason-switch", local.class)}>
      {local.children ?? (
        <>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchHiddenInput />
        </>
      )}
    </KeystoneSwitch.Root>
  );
}

export function SwitchControl(props: SwitchControlProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneSwitch.Control {...rest} class={cn("mason-switch-control", local.class)} />;
}

export function SwitchThumb(props: SwitchThumbProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneSwitch.Thumb {...rest} class={cn("mason-switch-thumb", local.class)} />;
}

export function SwitchHiddenInput(props: SwitchHiddenInputProps) {
  return <KeystoneSwitch.HiddenInput {...props} class="mason-switch-input" />;
}
