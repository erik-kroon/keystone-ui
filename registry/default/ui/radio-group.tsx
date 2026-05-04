import {
  RadioGroup as CoreRadioGroup,
  type RadioGroupHiddenInputProps as CoreRadioGroupHiddenInputProps,
  type RadioGroupItemIndicatorProps as CoreRadioGroupItemIndicatorProps,
  type RadioGroupItemProps as CoreRadioGroupItemProps,
  type RadioGroupRootProps as CoreRadioGroupRootProps,
} from "@keystone-ui/core/radio-group";
import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type RadioGroupProps = CoreRadioGroupRootProps;
export type RadioGroupItemProps = CoreRadioGroupItemProps & {
  indicator?: JSX.Element;
};
export type RadioGroupItemIndicatorProps = CoreRadioGroupItemIndicatorProps;
export type RadioGroupHiddenInputProps = CoreRadioGroupHiddenInputProps;

export function RadioGroup(props: RadioGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreRadioGroup.Root {...rest} class={cn("ui-radio-group", local.class)} />;
}

export function RadioGroupItem(props: RadioGroupItemProps) {
  const [local, rest] = splitProps(props, ["children", "class", "indicator"]);

  return (
    <CoreRadioGroup.Item {...rest} class={cn("ui-radio-group-item", local.class)}>
      <span data-scope="ui-radio-group" data-part="item-control">
        <RadioGroupItemIndicator>{local.indicator ?? ""}</RadioGroupItemIndicator>
      </span>
      <span data-scope="ui-radio-group" data-part="item-label">
        {local.children}
      </span>
      <RadioGroupHiddenInput />
    </CoreRadioGroup.Item>
  );
}

export function RadioGroupItemIndicator(props: RadioGroupItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreRadioGroup.ItemIndicator
      {...rest}
      class={cn("ui-radio-group-item-indicator", local.class)}
    />
  );
}

export function RadioGroupHiddenInput(props: RadioGroupHiddenInputProps) {
  return <CoreRadioGroup.HiddenInput {...props} class="ui-radio-group-input" />;
}
