import {
  Checkbox,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxIndicatorIcon,
  type CheckboxProps,
} from "@/components/ui/checkbox";
import { TanStackField, type TanStackFieldProps } from "@/components/ui/tanstack-field";
import { cn } from "@/lib/cn";

type CheckboxFieldValidatorContext = {
  value: boolean;
};

export type CheckboxFieldValidators = {
  onChange?: (context: CheckboxFieldValidatorContext) => unknown;
  onBlur?: (context: CheckboxFieldValidatorContext) => unknown;
  onSubmit?: (context: CheckboxFieldValidatorContext) => unknown;
};

type CheckboxFieldControlProps = Omit<
  CheckboxProps,
  | "checked"
  | "defaultChecked"
  | "disabled"
  | "form"
  | "id"
  | "invalid"
  | "name"
  | "readOnly"
  | "required"
>;

export type CheckboxFieldProps = Omit<
  TanStackFieldProps<boolean, HTMLButtonElement>,
  "children" | "validators"
> & {
  validators?: CheckboxFieldValidators;
  checkboxProps?: CheckboxFieldControlProps;
  checkboxClass?: string;
};

export function CheckboxField(props: CheckboxFieldProps) {
  return (
    <TanStackField<boolean, HTMLButtonElement>
      class={cn("ui-checkbox-field", props.class)}
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
        <Checkbox
          {...props.checkboxProps}
          checked={context.value() === true}
          data-scope="ui-checkbox-field"
          data-part="checkbox-root"
          data-slot="checkbox-field-root"
          disabled={props.disabled}
          form={props.formId}
          invalid={context.invalid()}
          name={context.field().name}
          readOnly={props.readOnly}
          required={props.required}
          onBlur={() => {
            context.setFocused(false);
            context.field().handleBlur();
          }}
          onCheckedChange={(checked, detail) => {
            props.checkboxProps?.onCheckedChange?.(checked, detail);
            context.field().handleChange(checked === true);
          }}
          class={cn("ui-checkbox-field-root", props.checkboxProps?.class, props.checkboxClass)}
        >
          {props.checkboxProps?.children ?? (
            <>
              <CheckboxControl
                {...context.control.getControlProps<HTMLButtonElement>()}
                data-scope="ui-checkbox-field"
                data-part="checkbox"
                data-slot="checkbox-field-control"
                onBlur={() => {
                  context.setFocused(false);
                  context.field().handleBlur();
                }}
                onFocus={() => context.setFocused(true)}
              >
                <CheckboxIndicator>
                  <CheckboxIndicatorIcon />
                </CheckboxIndicator>
              </CheckboxControl>
              <CheckboxHiddenInput />
            </>
          )}
        </Checkbox>
      )}
    </TanStackField>
  );
}
