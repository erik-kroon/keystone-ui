import {
  Checkbox as KeystoneCheckbox,
  type CheckboxControlProps as KeystoneCheckboxControlProps,
  type CheckboxHiddenInputProps as KeystoneCheckboxHiddenInputProps,
  type CheckboxIndicatorProps as KeystoneCheckboxIndicatorProps,
  type CheckboxRootProps as KeystoneCheckboxRootProps,
} from "@keystone-ui/keystone/checkbox";
import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type CheckboxProps = KeystoneCheckboxRootProps & {
  indicator?: JSX.Element;
};
export type CheckboxControlProps = KeystoneCheckboxControlProps;
export type CheckboxIndicatorProps = KeystoneCheckboxIndicatorProps;
export type CheckboxHiddenInputProps = KeystoneCheckboxHiddenInputProps;

export function Checkbox(props: CheckboxProps) {
  const [local, rest] = splitProps(props, ["children", "class", "indicator"]);

  return (
    <KeystoneCheckbox.Root {...rest} class={cn("mason-checkbox", local.class)}>
      {local.children ?? (
        <>
          <CheckboxControl>
            <CheckboxIndicator>{local.indicator ?? "✓"}</CheckboxIndicator>
          </CheckboxControl>
          <CheckboxHiddenInput />
        </>
      )}
    </KeystoneCheckbox.Root>
  );
}

export function CheckboxControl(props: CheckboxControlProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneCheckbox.Control {...rest} class={cn("mason-checkbox-control", local.class)} />;
}

export function CheckboxIndicator(props: CheckboxIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <KeystoneCheckbox.Indicator {...rest} class={cn("mason-checkbox-indicator", local.class)} />
  );
}

export function CheckboxHiddenInput(props: CheckboxHiddenInputProps) {
  return <KeystoneCheckbox.HiddenInput {...props} class="mason-checkbox-input" />;
}
