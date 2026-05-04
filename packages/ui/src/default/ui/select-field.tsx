import { For, Show, type JSX } from "solid-js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SelectContentProps,
  type SelectGroupProps,
  type SelectItemProps,
  type SelectProps,
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
  textValue?: string;
  value: string;
};

export type SelectFieldOptionGroup = {
  disabled?: boolean;
  label: JSX.Element;
  textValue?: string;
  value: string;
  options: readonly SelectFieldOption[];
};

type SelectFieldRootProps = Omit<
  SelectProps,
  | "children"
  | "defaultValue"
  | "disabled"
  | "form"
  | "invalid"
  | "multiple"
  | "name"
  | "onValueChange"
  | "onValuesChange"
  | "placeholder"
  | "readOnly"
  | "required"
  | "value"
>;

export type SelectFieldProps = Omit<
  TanStackFieldProps<string, HTMLButtonElement>,
  "children" | "validators"
> & {
  options: readonly (SelectFieldOption | SelectFieldOptionGroup)[];
  validators?: SelectFieldValidators;
  empty?: JSX.Element;
  placeholder?: string;
  selectProps?: SelectFieldRootProps;
  triggerClass?: string;
  contentClass?: string;
  listboxClass?: string;
  itemClass?: string;
  groupClass?: string;
  groupLabelClass?: string;
  triggerProps?: Omit<SelectTriggerProps, "children" | "class">;
  contentProps?: Omit<SelectContentProps, "children" | "class" | "listboxClass">;
  groupProps?: Omit<SelectGroupProps, "children" | "class" | "disabled" | "label" | "value">;
  itemProps?: Omit<SelectItemProps, "children" | "class" | "disabled" | "indicator" | "value">;
};

function optionText(option: SelectFieldOption) {
  return option.textValue ?? (typeof option.label === "string" ? option.label : option.value);
}

function groupText(group: SelectFieldOptionGroup) {
  return group.textValue ?? (typeof group.label === "string" ? group.label : group.value);
}

function isOptionGroup(
  option: SelectFieldOption | SelectFieldOptionGroup,
): option is SelectFieldOptionGroup {
  return "options" in option;
}

function hasOptions(options: readonly (SelectFieldOption | SelectFieldOptionGroup)[]) {
  return options.some((option) => (isOptionGroup(option) ? option.options.length > 0 : true));
}

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
          describedBy={[
            props.description ? context.descriptionId() : undefined,
            context.invalid() && context.firstError() ? context.errorId() : undefined,
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={props.disabled}
          empty={props.empty}
          field={context.field}
          formId={props.formId}
          groupClass={props.groupClass}
          groupLabelClass={props.groupLabelClass}
          groupProps={props.groupProps}
          invalid={context.invalid()}
          itemClass={props.itemClass}
          itemProps={props.itemProps}
          labelledBy={props.label ? context.labelId() : undefined}
          listboxClass={props.listboxClass}
          options={props.options}
          placeholder={props.placeholder}
          readOnly={props.readOnly}
          required={props.required}
          selectProps={props.selectProps}
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
  describedBy?: string;
  disabled?: boolean;
  empty?: JSX.Element;
  field: () => TanStackFieldApi<string, HTMLButtonElement>;
  formId?: string;
  groupClass?: string;
  groupLabelClass?: string;
  groupProps?: Omit<SelectGroupProps, "children" | "class" | "disabled" | "label" | "value">;
  invalid: boolean;
  itemClass?: string;
  itemProps?: Omit<SelectItemProps, "children" | "class" | "disabled" | "indicator" | "value">;
  labelledBy?: string;
  listboxClass?: string;
  options: readonly (SelectFieldOption | SelectFieldOptionGroup)[];
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  selectProps?: SelectFieldRootProps;
  setFocused: (focused: boolean) => void;
  triggerClass?: string;
  triggerProps?: Omit<SelectTriggerProps, "children" | "class">;
  value: string;
}) {
  return (
    <Select
      {...props.selectProps}
      disabled={props.disabled}
      form={props.formId}
      invalid={props.invalid}
      name={props.field().name}
      readOnly={props.readOnly}
      required={props.required}
      value={typeof props.value === "string" && props.value.length > 0 ? props.value : undefined}
      placeholder={props.placeholder}
      onOpenChange={(open, detail) => {
        props.selectProps?.onOpenChange?.(open, detail);
        props.setFocused(open);
        if (!open) {
          props.field().handleBlur();
        }
      }}
      onValueChange={(next) => props.field().handleChange(next ?? "")}
    >
      <SelectTrigger
        {...props.triggerProps}
        aria-describedby={props.describedBy || undefined}
        aria-invalid={props.invalid || undefined}
        aria-labelledby={props.labelledBy}
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
        <Show
          when={hasOptions(props.options)}
          fallback={
            <div
              data-scope="ui-select-field"
              data-part="empty"
              data-slot="select-field-empty"
              class="ui-select-field-empty px-2 py-1.5 text-muted-foreground text-sm"
            >
              {props.empty ?? "No options"}
            </div>
          }
        >
          <For each={props.options}>
            {(option) => (
              <Show
                when={isOptionGroup(option) ? option : undefined}
                fallback={
                  <SelectFieldItem
                    itemClass={props.itemClass}
                    itemProps={props.itemProps}
                    option={option as SelectFieldOption}
                  />
                }
              >
                {(group) => (
                  <SelectGroup
                    {...props.groupProps}
                    value={group().value}
                    label={groupText(group())}
                    disabled={group().disabled}
                    data-scope="ui-select-field"
                    data-part="group"
                    data-slot="select-field-group"
                    class={cn("ui-select-field-group", props.groupClass)}
                  >
                    <SelectGroupLabel
                      data-scope="ui-select-field"
                      data-part="group-label"
                      data-slot="select-field-group-label"
                      class={cn("ui-select-field-group-label", props.groupLabelClass)}
                    >
                      {group().label}
                    </SelectGroupLabel>
                    <For each={group().options}>
                      {(groupOption) => (
                        <SelectFieldItem
                          itemClass={props.itemClass}
                          itemProps={props.itemProps}
                          option={groupOption}
                        />
                      )}
                    </For>
                  </SelectGroup>
                )}
              </Show>
            )}
          </For>
        </Show>
      </SelectContent>
    </Select>
  );
}

function SelectFieldItem(props: {
  itemClass?: string;
  itemProps?: Omit<SelectItemProps, "children" | "class" | "disabled" | "indicator" | "value">;
  option: SelectFieldOption;
}) {
  return (
    <SelectItem
      {...props.itemProps}
      value={props.option.value}
      label={optionText(props.option)}
      disabled={props.option.disabled}
      indicator={props.option.indicator}
      data-scope="ui-select-field"
      data-part="item"
      data-slot="select-field-item"
      class={cn("ui-select-field-item", props.itemClass)}
    >
      {props.option.label}
    </SelectItem>
  );
}
