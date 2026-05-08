import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerTrigger,
  type DatePickerCalendarProps,
  type DatePickerContentProps,
  type DatePickerProps,
  type DatePickerTriggerProps,
} from "@/components/ui/date-picker";
import { TanStackField, type TanStackFieldProps } from "@/components/ui/tanstack-field";
import { cn } from "@/lib/cn";

type DatePickerFieldValidatorContext = {
  value: string;
};

export type DatePickerFieldValidators = {
  onChange?: (context: DatePickerFieldValidatorContext) => unknown;
  onBlur?: (context: DatePickerFieldValidatorContext) => unknown;
  onSubmit?: (context: DatePickerFieldValidatorContext) => unknown;
};

type DatePickerFieldRootProps = Omit<
  DatePickerProps,
  "children" | "defaultOpen" | "defaultValue" | "disabled" | "value"
>;

export type DatePickerFieldProps = Omit<
  TanStackFieldProps<string, HTMLButtonElement>,
  "children" | "validators"
> & {
  validators?: DatePickerFieldValidators;
  placeholder?: string;
  datePickerProps?: DatePickerFieldRootProps;
  triggerProps?: Omit<DatePickerTriggerProps, "children" | "class" | "placeholder">;
  contentProps?: Omit<DatePickerContentProps, "children" | "class">;
  calendarProps?: Omit<DatePickerCalendarProps, "children" | "class">;
  triggerClass?: string;
  contentClass?: string;
  calendarClass?: string;
};

export function DatePickerField(props: DatePickerFieldProps) {
  return (
    <TanStackField<string, HTMLButtonElement>
      class={cn("ui-date-picker-field", props.class)}
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
        <DatePicker
          {...props.datePickerProps}
          data-scope="ui-date-picker-field"
          data-part="date-picker"
          data-slot="date-picker-field-root"
          disabled={props.disabled}
          value={
            typeof context.value() === "string" && context.value().length > 0
              ? context.value()
              : undefined
          }
          onOpenChange={(open, detail) => {
            props.datePickerProps?.onOpenChange?.(open, detail);
            context.setFocused(open);
            if (!open) {
              context.field().handleBlur();
            }
          }}
          onValueChange={(next, detail) => {
            props.datePickerProps?.onValueChange?.(next, detail);
            context.field().handleChange(next ?? "");
          }}
          class={cn("ui-date-picker-field-root", props.datePickerProps?.class)}
        >
          <DatePickerTrigger
            {...context.control.getControlProps<HTMLButtonElement>()}
            {...props.triggerProps}
            aria-describedby={[
              props.description ? context.descriptionId() : undefined,
              context.invalid() && context.firstError() ? context.errorId() : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
            aria-invalid={context.invalid() || undefined}
            data-scope="ui-date-picker-field"
            data-part="trigger"
            data-slot="date-picker-field-trigger"
            placeholder={props.placeholder}
            onBlur={(event) => {
              const onBlur = props.triggerProps?.onBlur as
                | ((event: FocusEvent & { currentTarget: HTMLButtonElement }) => void)
                | undefined;
              onBlur?.(event);
              context.setFocused(false);
              if (!event.defaultPrevented) context.field().handleBlur(event);
            }}
            onFocus={(event) => {
              const onFocus = props.triggerProps?.onFocus as
                | ((event: FocusEvent & { currentTarget: HTMLButtonElement }) => void)
                | undefined;
              onFocus?.(event);
              if (!event.defaultPrevented) context.setFocused(true);
            }}
            class={cn("ui-date-picker-field-trigger", props.triggerClass)}
          />
          <input
            type="hidden"
            form={props.formId}
            name={context.field().name}
            value={context.value() ?? ""}
            disabled={props.disabled}
            required={props.required}
            data-scope="ui-date-picker-field"
            data-part="hidden-input"
            data-slot="date-picker-field-hidden-input"
          />
          <DatePickerContent
            {...props.contentProps}
            data-scope="ui-date-picker-field"
            data-part="content"
            data-slot="date-picker-field-content"
            class={cn("ui-date-picker-field-content", props.contentClass)}
          >
            <DatePickerCalendar
              {...props.calendarProps}
              data-scope="ui-date-picker-field"
              data-part="calendar"
              data-slot="date-picker-field-calendar"
              class={cn("ui-date-picker-field-calendar", props.calendarClass)}
            />
          </DatePickerContent>
        </DatePicker>
      )}
    </TanStackField>
  );
}
