import {
  Switch,
  SwitchControl,
  SwitchHiddenInput,
  SwitchThumb,
  type SwitchProps,
} from "@/components/ui/switch";
import { TanStackField, type TanStackFieldProps } from "@/components/ui/tanstack-field";
import { cn } from "@/lib/cn";

type SwitchFieldValidatorContext = {
  value: boolean;
};

export type SwitchFieldValidators = {
  onChange?: (context: SwitchFieldValidatorContext) => unknown;
  onBlur?: (context: SwitchFieldValidatorContext) => unknown;
  onSubmit?: (context: SwitchFieldValidatorContext) => unknown;
};

type SwitchFieldControlProps = Omit<
  SwitchProps,
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

export type SwitchFieldProps = Omit<
  TanStackFieldProps<boolean, HTMLButtonElement>,
  "children" | "validators"
> & {
  validators?: SwitchFieldValidators;
  switchProps?: SwitchFieldControlProps;
  switchClass?: string;
};

export function SwitchField(props: SwitchFieldProps) {
  return (
    <TanStackField<boolean, HTMLButtonElement>
      class={cn("ui-switch-field", props.class)}
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
        <Switch
          {...props.switchProps}
          checked={context.value() === true}
          data-scope="ui-switch-field"
          data-part="switch-root"
          data-slot="switch-field-root"
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
            props.switchProps?.onCheckedChange?.(checked, detail);
            context.field().handleChange(checked);
          }}
          class={cn("ui-switch-field-root", props.switchProps?.class, props.switchClass)}
        >
          {props.switchProps?.children ?? (
            <>
              <SwitchControl
                {...context.control.getControlProps<HTMLButtonElement>()}
                data-scope="ui-switch-field"
                data-part="switch"
                data-slot="switch-field-control"
                onBlur={() => {
                  context.setFocused(false);
                  context.field().handleBlur();
                }}
                onFocus={() => context.setFocused(true)}
              >
                <SwitchThumb />
              </SwitchControl>
              <SwitchHiddenInput />
            </>
          )}
        </Switch>
      )}
    </TanStackField>
  );
}
