import {
  RadioGroup as KeystoneRadioGroup,
  type RadioGroupHiddenInputProps as KeystoneRadioGroupHiddenInputProps,
  type RadioGroupItemIndicatorProps as KeystoneRadioGroupItemIndicatorProps,
  type RadioGroupItemProps as KeystoneRadioGroupItemProps,
  type RadioGroupRootProps as KeystoneRadioGroupRootProps,
} from "@keystone-ui/keystone/radio-group";
import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type RadioGroupProps = KeystoneRadioGroupRootProps;
export type RadioGroupItemProps = KeystoneRadioGroupItemProps & {
  indicator?: JSX.Element;
};
export type RadioGroupItemIndicatorProps = KeystoneRadioGroupItemIndicatorProps;
export type RadioGroupHiddenInputProps = KeystoneRadioGroupHiddenInputProps;

export function RadioGroup(props: RadioGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneRadioGroup.Root {...rest} class={cn("mason-radio-group", local.class)} />;
}

export function RadioGroupItem(props: RadioGroupItemProps) {
  const [local, rest] = splitProps(props, ["children", "class", "indicator"]);

  return (
    <KeystoneRadioGroup.Item {...rest} class={cn("mason-radio-group-item", local.class)}>
      <span data-scope="mason-radio-group" data-part="item-control">
        <RadioGroupItemIndicator>{local.indicator ?? ""}</RadioGroupItemIndicator>
      </span>
      <span data-scope="mason-radio-group" data-part="item-label">
        {local.children}
      </span>
      <RadioGroupHiddenInput />
    </KeystoneRadioGroup.Item>
  );
}

export function RadioGroupItemIndicator(props: RadioGroupItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <KeystoneRadioGroup.ItemIndicator
      {...rest}
      class={cn("mason-radio-group-item-indicator", local.class)}
    />
  );
}

export function RadioGroupHiddenInput(props: RadioGroupHiddenInputProps) {
  return <KeystoneRadioGroup.HiddenInput {...props} class="mason-radio-group-input" />;
}
