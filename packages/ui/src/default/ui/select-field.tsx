import { For, type JSX } from "solid-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SelectContentProps,
  type SelectItemProps,
  type SelectTriggerProps,
} from "@/components/ui/select";
import {
  TanStackField,
  type TanStackFieldApi,
  type TanStackFieldProps,
} from "@/components/ui/tanstack-field";
import { cn } from "@/lib/cn";

type SelectFieldValidatorContext = {
  value: string;
};

export type SelectFieldValidators = {
  onChange?: (context: SelectFieldValidatorContext) => unknown;
  onBlur?: (context: SelectFieldValidatorContext) => unknown;
  onSubmit?: (context: SelectFieldValidatorContext) => unknown;
};

export type SelectFieldOption = {
  disabled?: boolean;
  indicator?: JSX.Element;
  label: JSX.Element;
  value: string;
};

export type SelectFieldProps = Omit<
  TanStackFieldProps<string, HTMLButtonElement>,
  "children" | "validators"
> & {
  options: readonly SelectFieldOption[];
  validators?: SelectFieldValidators;
  placeholder?: string;
  triggerClass?: string;
  contentClass?: string;
  listboxClass?: string;
  itemClass?: string;
  triggerProps?: Omit<SelectTriggerProps, "children" | "class">;
  contentProps?: Omit<SelectContentProps, "children" | "class" | "listboxClass">;
  itemProps?: Omit<SelectItemProps, "children" | "class" | "disabled" | "indicator" | "value">;
};

export function SelectField(props: SelectFieldProps) {
  return (
    <TanStackField<string, HTMLButtonElement>
      class={cn("ui-select-field", props.class)}
      description={props.description}
      descriptionClass={props.descriptionClass}
      disabled={props.disabled}
      error={props.error}
      errorClass={props.errorClass}
      form={props.form}
      formId={props.formId}
      id={props.id}
      invalid={props.invalid}
      label={props.label}
      labelClass={props.labelClass}
      name={props.name}
      readOnly={props.readOnly}
      required={props.required}
      validators={props.validators}
    >
      {(context) => (
        <SelectFieldControl
          contentClass={props.contentClass}
          contentProps={props.contentProps}
          field={context.field}
          invalid={context.invalid()}
          itemClass={props.itemClass}
          itemProps={props.itemProps}
          listboxClass={props.listboxClass}
          options={props.options}
          placeholder={props.placeholder}
          setFocused={context.setFocused}
          triggerClass={props.triggerClass}
          triggerProps={props.triggerProps}
          value={context.value()}
        />
      )}
    </TanStackField>
  );
}

function SelectFieldControl(props: {
  contentClass?: string;
  contentProps?: Omit<SelectContentProps, "children" | "class" | "listboxClass">;
  field: () => TanStackFieldApi<string, HTMLButtonElement>;
  invalid: boolean;
  itemClass?: string;
  itemProps?: Omit<SelectItemProps, "children" | "class" | "disabled" | "indicator" | "value">;
  listboxClass?: string;
  options: readonly SelectFieldOption[];
  placeholder?: string;
  setFocused: (focused: boolean) => void;
  triggerClass?: string;
  triggerProps?: Omit<SelectTriggerProps, "children" | "class">;
  value: string;
}) {
  return (
    <Select
      name={props.field().name}
      value={typeof props.value === "string" ? props.value : undefined}
      placeholder={props.placeholder}
      invalid={props.invalid}
      onOpenChange={(open) => {
        props.setFocused(open);
        if (!open) {
          props.field().handleBlur();
        }
      }}
      onValueChange={(next) => props.field().handleChange(next ?? "")}
    >
      <SelectTrigger
        {...props.triggerProps}
        aria-invalid={props.invalid || undefined}
        data-scope="ui-select-field"
        data-part="trigger"
        data-slot="select-field-trigger"
        class={cn("ui-select-field-trigger", props.triggerClass)}
      >
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent
        {...props.contentProps}
        data-scope="ui-select-field"
        data-part="content"
        data-slot="select-field-content"
        listboxClass={cn("ui-select-field-listbox", props.listboxClass)}
        class={cn("ui-select-field-content", props.contentClass)}
      >
        <For each={props.options}>
          {(option) => (
            <SelectItem
              {...props.itemProps}
              value={option.value}
              disabled={option.disabled}
              indicator={option.indicator}
              data-scope="ui-select-field"
              data-part="item"
              data-slot="select-field-item"
              class={cn("ui-select-field-item", props.itemClass)}
            >
              {option.label}
            </SelectItem>
          )}
        </For>
      </SelectContent>
    </Select>
  );
}
