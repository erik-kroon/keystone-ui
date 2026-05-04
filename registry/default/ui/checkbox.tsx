import {
  Checkbox as CoreCheckbox,
  type CheckboxControlProps as CoreCheckboxControlProps,
  type CheckboxHiddenInputProps as CoreCheckboxHiddenInputProps,
  type CheckboxIndicatorProps as CoreCheckboxIndicatorProps,
  type CheckboxRootProps as CoreCheckboxRootProps,
} from "@keystone-ui/core/checkbox";
import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type CheckboxProps = CoreCheckboxRootProps & {
  indicator?: JSX.Element;
};
export type CheckboxControlProps = CoreCheckboxControlProps;
export type CheckboxIndicatorProps = CoreCheckboxIndicatorProps;
export type CheckboxHiddenInputProps = CoreCheckboxHiddenInputProps;

export function Checkbox(props: CheckboxProps) {
  const [local, rest] = splitProps(props, ["children", "class", "indicator"]);

  return (
    <CoreCheckbox.Root {...rest} class={cn("ui-checkbox", local.class)}>
      {local.children ?? (
        <>
          <CheckboxControl>
            <CheckboxIndicator>{local.indicator ?? "✓"}</CheckboxIndicator>
          </CheckboxControl>
          <CheckboxHiddenInput />
        </>
      )}
    </CoreCheckbox.Root>
  );
}

export function CheckboxControl(props: CheckboxControlProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreCheckbox.Control {...rest} class={cn("ui-checkbox-control", local.class)} />;
}

export function CheckboxIndicator(props: CheckboxIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreCheckbox.Indicator {...rest} class={cn("ui-checkbox-indicator", local.class)} />;
}

export function CheckboxHiddenInput(props: CheckboxHiddenInputProps) {
  return <CoreCheckbox.HiddenInput {...props} class="ui-checkbox-input" />;
}
