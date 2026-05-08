import { For, Show, type JSX } from "solid-js";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxListbox,
  type ComboboxContentProps,
  type ComboboxGroupProps,
  type ComboboxInputProps,
  type ComboboxItemProps,
  type ComboboxListboxProps,
  type ComboboxProps,
} from "@/components/ui/combobox";
import {
  TanStackField,
  type TanStackFieldApi,
  type TanStackFieldProps,
} from "@/components/ui/tanstack-field";
import { cn } from "@/lib/cn";

type ComboboxFieldValidatorContext = {
  value: string;
};

export type ComboboxFieldValidators = {
  onChange?: (context: ComboboxFieldValidatorContext) => unknown;
  onBlur?: (context: ComboboxFieldValidatorContext) => unknown;
  onSubmit?: (context: ComboboxFieldValidatorContext) => unknown;
};

export type ComboboxFieldOption = {
  disabled?: boolean;
  indicator?: JSX.Element;
  label: JSX.Element;
  textValue?: string;
  value: string;
};

export type ComboboxFieldOptionGroup = {
  disabled?: boolean;
  label: JSX.Element;
  textValue?: string;
  value: string;
  options: readonly ComboboxFieldOption[];
};

type ComboboxFieldRootProps = Omit<
  ComboboxProps,
  | "children"
  | "defaultInputValue"
  | "defaultOpen"
  | "defaultValue"
  | "disabled"
  | "form"
  | "inputValue"
  | "invalid"
  | "name"
  | "placeholder"
  | "readOnly"
  | "required"
  | "value"
>;

export type ComboboxFieldProps = Omit<
  TanStackFieldProps<string, HTMLInputElement>,
  "children" | "validators"
> & {
  options: readonly (ComboboxFieldOption | ComboboxFieldOptionGroup)[];
  validators?: ComboboxFieldValidators;
  empty?: JSX.Element;
  placeholder?: string;
  comboboxProps?: ComboboxFieldRootProps;
  inputProps?: Omit<ComboboxInputProps, "aria-describedby" | "aria-invalid" | "id" | "value">;
  contentProps?: Omit<ComboboxContentProps, "children" | "class">;
  listboxProps?: Omit<ComboboxListboxProps, "children" | "class">;
  groupProps?: Omit<ComboboxGroupProps, "children" | "class" | "disabled" | "label" | "value">;
  itemProps?: Omit<
    ComboboxItemProps,
    "children" | "class" | "disabled" | "indicator" | "label" | "value"
  >;
  inputClass?: string;
  contentClass?: string;
  listboxClass?: string;
  groupClass?: string;
  groupLabelClass?: string;
  itemClass?: string;
};

function optionText(option: ComboboxFieldOption) {
  return option.textValue ?? (typeof option.label === "string" ? option.label : option.value);
}

function groupText(group: ComboboxFieldOptionGroup) {
  return group.textValue ?? (typeof group.label === "string" ? group.label : group.value);
}

function isOptionGroup(
  option: ComboboxFieldOption | ComboboxFieldOptionGroup,
): option is ComboboxFieldOptionGroup {
  return "options" in option;
}

function hasOptions(options: readonly (ComboboxFieldOption | ComboboxFieldOptionGroup)[]) {
  return options.some((option) => (isOptionGroup(option) ? option.options.length > 0 : true));
}

export function ComboboxField(props: ComboboxFieldProps) {
  return (
    <TanStackField<string, HTMLInputElement>
      class={cn("ui-combobox-field", props.class)}
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
        <ComboboxFieldControl
          contentClass={props.contentClass}
          contentProps={props.contentProps}
          controlId={context.controlId()}
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
          inputClass={props.inputClass}
          inputProps={props.inputProps}
          invalid={context.invalid()}
          itemClass={props.itemClass}
          itemProps={props.itemProps}
          labelledBy={props.label ? context.labelId() : undefined}
          listboxClass={props.listboxClass}
          listboxProps={props.listboxProps}
          options={props.options}
          placeholder={props.placeholder}
          readOnly={props.readOnly}
          required={props.required}
          rootProps={props.comboboxProps}
          setFocused={context.setFocused}
          value={context.value()}
        />
      )}
    </TanStackField>
  );
}

function ComboboxFieldControl(props: {
  contentClass?: string;
  contentProps?: Omit<ComboboxContentProps, "children" | "class">;
  controlId: string;
  describedBy?: string;
  disabled?: boolean;
  empty?: JSX.Element;
  field: () => TanStackFieldApi<string, HTMLInputElement>;
  formId?: string;
  groupClass?: string;
  groupLabelClass?: string;
  groupProps?: Omit<ComboboxGroupProps, "children" | "class" | "disabled" | "label" | "value">;
  inputClass?: string;
  inputProps?: Omit<ComboboxInputProps, "aria-describedby" | "aria-invalid" | "id" | "value">;
  invalid: boolean;
  itemClass?: string;
  itemProps?: Omit<
    ComboboxItemProps,
    "children" | "class" | "disabled" | "indicator" | "label" | "value"
  >;
  labelledBy?: string;
  listboxClass?: string;
  listboxProps?: Omit<ComboboxListboxProps, "children" | "class">;
  options: readonly (ComboboxFieldOption | ComboboxFieldOptionGroup)[];
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  rootProps?: ComboboxFieldRootProps;
  setFocused: (focused: boolean) => void;
  value: string;
}) {
  return (
    <Combobox
      {...props.rootProps}
      disabled={props.disabled}
      form={props.formId}
      invalid={props.invalid}
      name={props.field().name}
      placeholder={props.placeholder}
      readOnly={props.readOnly}
      required={props.required}
      value={typeof props.value === "string" && props.value.length > 0 ? props.value : undefined}
      onOpenChange={(open, detail) => {
        props.rootProps?.onOpenChange?.(open, detail);
        props.setFocused(open);
        if (!open) {
          props.field().handleBlur();
        }
      }}
      onValueChange={(next, detail) => {
        props.rootProps?.onValueChange?.(next, detail);
        props.field().handleChange(next ?? "");
      }}
    >
      <ComboboxInput
        {...props.inputProps}
        aria-describedby={props.describedBy || undefined}
        aria-invalid={props.invalid || undefined}
        aria-labelledby={props.labelledBy}
        data-scope="ui-combobox-field"
        data-part="input"
        data-slot="combobox-field-input"
        id={props.controlId}
        class={cn(!props.inputProps?.class && "w-full", props.inputProps?.class)}
        inputClass={cn("ui-combobox-field-input", props.inputProps?.inputClass, props.inputClass)}
        onBlur={(event) => {
          const onBlur = props.inputProps?.onBlur as
            | ((event: FocusEvent & { currentTarget: HTMLInputElement }) => void)
            | undefined;
          onBlur?.(event);
          props.setFocused(false);
          if (!event.defaultPrevented) props.field().handleBlur(event);
        }}
        onFocus={(event) => {
          const onFocus = props.inputProps?.onFocus as
            | ((event: FocusEvent & { currentTarget: HTMLInputElement }) => void)
            | undefined;
          onFocus?.(event);
          if (!event.defaultPrevented) props.setFocused(true);
        }}
      />
      <ComboboxContent
        {...props.contentProps}
        data-scope="ui-combobox-field"
        data-part="content"
        data-slot="combobox-field-content"
        class={cn("ui-combobox-field-content", props.contentClass)}
      >
        <ComboboxListbox
          {...props.listboxProps}
          data-scope="ui-combobox-field"
          data-part="listbox"
          data-slot="combobox-field-listbox"
          class={cn("ui-combobox-field-listbox", props.listboxClass)}
        >
          <Show
            when={hasOptions(props.options)}
            fallback={
              <ComboboxEmpty
                data-scope="ui-combobox-field"
                data-part="empty"
                data-slot="combobox-field-empty"
              >
                {props.empty ?? "No options"}
              </ComboboxEmpty>
            }
          >
            <For each={props.options}>
              {(option) => (
                <Show
                  when={isOptionGroup(option) ? option : undefined}
                  fallback={
                    <ComboboxFieldItem
                      itemClass={props.itemClass}
                      itemProps={props.itemProps}
                      option={option as ComboboxFieldOption}
                    />
                  }
                >
                  {(group) => (
                    <ComboboxGroup
                      {...props.groupProps}
                      value={group().value}
                      label={groupText(group())}
                      disabled={group().disabled}
                      data-scope="ui-combobox-field"
                      data-part="group"
                      data-slot="combobox-field-group"
                      class={cn("ui-combobox-field-group", props.groupClass)}
                    >
                      <ComboboxGroupLabel
                        data-scope="ui-combobox-field"
                        data-part="group-label"
                        data-slot="combobox-field-group-label"
                        class={cn("ui-combobox-field-group-label", props.groupLabelClass)}
                      >
                        {group().label}
                      </ComboboxGroupLabel>
                      <For each={group().options}>
                        {(groupOption) => (
                          <ComboboxFieldItem
                            itemClass={props.itemClass}
                            itemProps={props.itemProps}
                            option={groupOption}
                          />
                        )}
                      </For>
                    </ComboboxGroup>
                  )}
                </Show>
              )}
            </For>
          </Show>
        </ComboboxListbox>
      </ComboboxContent>
    </Combobox>
  );
}

function ComboboxFieldItem(props: {
  itemClass?: string;
  itemProps?: Omit<
    ComboboxItemProps,
    "children" | "class" | "disabled" | "indicator" | "label" | "value"
  >;
  option: ComboboxFieldOption;
}) {
  return (
    <ComboboxItem
      {...props.itemProps}
      value={props.option.value}
      label={optionText(props.option)}
      disabled={props.option.disabled}
      indicator={props.option.indicator}
      data-scope="ui-combobox-field"
      data-part="item"
      data-slot="combobox-field-item"
      class={cn("ui-combobox-field-item", props.itemClass)}
    >
      {props.option.label}
    </ComboboxItem>
  );
}
