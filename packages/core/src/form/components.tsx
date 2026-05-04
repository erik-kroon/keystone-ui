import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  splitProps,
  useContext,
  type JSX,
} from "solid-js";
import { renderPolymorphic } from "../utils/index";
import { createFormControl } from "./control-state";
import { createFieldValidity } from "./field-validity";
import type {
  FieldControlProps,
  FieldDescriptionProps,
  FieldErrorMessageProps,
  FieldHiddenInputProps,
  FieldLabelProps,
  FieldRootProps,
  FieldValidityApi,
  FormControlApi,
  FormControlControlProps,
  FormControlDescriptionProps,
  FormControlErrorMessageProps,
  FormControlHiddenInputProps,
  FormControlLabelProps,
  FormControlRootProps,
  HiddenInputDescriptor,
} from "./types";

type FormControlContextValue = {
  control: FormControlApi;
  validity?: FieldValidityApi;
};

const FormControlContext = createContext<FormControlContextValue>();
const FieldContext = createContext<FormControlContextValue>();

function useFormControl(part: string) {
  const context = useContext(FormControlContext);
  if (!context) throw new Error(`FormControl.${part} must be used within FormControl.Root`);
  return context;
}

function useField(part: string) {
  const context = useContext(FieldContext);
  if (!context) throw new Error(`Field.${part} must be used within Field.Root`);
  return context;
}

function FormControlRoot(props: FormControlRootProps) {
  const [local, others] = splitProps(props, [
    "children",
    "defaultValue",
    "disabled",
    "form",
    "invalid",
    "name",
    "onReset",
    "readOnly",
    "required",
    "value",
  ]);
  const value = createMemo(() => local.value ?? local.defaultValue);
  const control = createFormControl({
    disabled: () => local.disabled,
    form: () => local.form,
    invalid: () => local.invalid,
    name: () => local.name,
    onReset: local.onReset,
    readonly: () => local.readOnly,
    required: () => local.required,
    value,
  });

  return (
    <FormControlContext.Provider value={{ control }}>
      <span {...control.getRootProps(others)}>{local.children}</span>
    </FormControlContext.Provider>
  );
}

function FormControlLabel(props: FormControlLabelProps) {
  const { control } = useFormControl("Label");
  return <label {...control.getLabelProps(props)} />;
}

function FormControlControl<T extends HTMLElement = HTMLElement>(
  props: FormControlControlProps<T>,
) {
  const { control } = useFormControl("Control");
  const [local, others] = splitProps(props, ["as", "children"]);
  const controlProps = control.getControlProps({
    ...others,
    children: local.children,
  } as JSX.HTMLAttributes<T>);

  if (!local.as) {
    return <div {...(controlProps as unknown as JSX.HTMLAttributes<HTMLDivElement>)} />;
  }

  return renderPolymorphic(local.as, "div", controlProps as Record<string, unknown>);
}

function FormControlDescription(props: FormControlDescriptionProps) {
  const { control } = useFormControl("Description");
  let element: HTMLElement | undefined;

  onMount(() => {
    const unregister = control.registerDescription(() => element?.id);
    onCleanup(unregister);
  });

  return (
    <div
      {...control.getDescriptionProps({
        ...props,
        ref: (nextElement) => {
          element = nextElement;
          assignRef(props.ref, nextElement);
        },
      })}
    />
  );
}

function FormControlErrorMessage(props: FormControlErrorMessageProps) {
  const { control } = useFormControl("ErrorMessage");
  const [local, others] = splitProps(props, ["forceMount"]);
  let element: HTMLElement | undefined;

  onMount(() => {
    const unregister = control.registerErrorMessage(() => element?.id);
    onCleanup(unregister);
  });

  return (
    <Show when={local.forceMount || control.invalid()}>
      <div
        {...control.getErrorMessageProps({
          ...others,
          ref: (nextElement) => {
            element = nextElement;
            assignRef(others.ref, nextElement);
          },
        })}
      />
    </Show>
  );
}

function FormControlHiddenInput(props: FormControlHiddenInputProps) {
  const { control } = useFormControl("HiddenInput");

  return (
    <For each={control.hiddenInputDescriptors()}>
      {(input) => <HiddenInputElement control={control} input={input} props={props} />}
    </For>
  );
}

function FieldRoot(props: FieldRootProps) {
  const [local, others] = splitProps(props, [
    "children",
    "customError",
    "defaultValue",
    "disabled",
    "form",
    "invalid",
    "name",
    "onValidityChange",
    "readOnly",
    "required",
    "revalidationMode",
    "validate",
    "validationMode",
    "value",
  ]);
  const validity = createFieldValidity({
    customError: local.customError,
    defaultValue: local.defaultValue,
    disabled: () => local.disabled,
    invalid: () => local.invalid,
    readonly: () => local.readOnly,
    required: () => local.required,
    revalidationMode: local.revalidationMode,
    validate: local.validate,
    validationMode: local.validationMode,
    value: () => local.value,
    onValidityChange: local.onValidityChange,
  });
  const control = createFormControl({
    dirty: validity.dirty,
    disabled: () => local.disabled,
    filled: validity.filled,
    focused: validity.focused,
    form: () => local.form,
    invalid: () => local.invalid ?? validity.invalid(),
    name: () => local.name,
    readonly: () => local.readOnly,
    required: () => local.required,
    scope: "field",
    touched: validity.touched,
    validating: validity.validating,
    value: () => local.value ?? validity.value(),
  });

  return (
    <FieldContext.Provider value={{ control, validity }}>
      <div {...control.getRootProps(others)}>{local.children}</div>
    </FieldContext.Provider>
  );
}

function FieldLabel(props: FieldLabelProps) {
  const { control } = useField("Label");
  return <label {...control.getLabelProps(props)} />;
}

function FieldControl<T extends HTMLElement = HTMLInputElement>(props: FieldControlProps<T>) {
  const { control, validity } = useField("Control");
  const [local, others] = splitProps(props, ["as", "children", "ref"]);
  const [element, setElement] = createSignal<T>();

  if (validity) {
    validity.registerControl(element);
    validity.registerFormReset(element);
    validity.registerFormSubmit(element);
  }

  const controlProps = control.getControlProps(
    validity?.getControlProps({
      ...others,
      children: local.children,
      ref: (element: T) => {
        setElement(() => element);
        assignRef(local.ref, element);
      },
    } as JSX.HTMLAttributes<T>) ??
      ({ ...others, children: local.children } as JSX.HTMLAttributes<T>),
  );

  if (!local.as) {
    return <input {...(controlProps as JSX.InputHTMLAttributes<HTMLInputElement>)} />;
  }

  return renderPolymorphic(local.as, "input", controlProps as Record<string, unknown>);
}

function FieldDescription(props: FieldDescriptionProps) {
  const { control } = useField("Description");
  let element: HTMLElement | undefined;

  onMount(() => {
    const unregister = control.registerDescription(() => element?.id);
    onCleanup(unregister);
  });

  return (
    <div
      {...control.getDescriptionProps({
        ...props,
        ref: (nextElement) => {
          element = nextElement;
          assignRef(props.ref, nextElement);
        },
      })}
    />
  );
}

function FieldErrorMessage(props: FieldErrorMessageProps) {
  const { control, validity } = useField("ErrorMessage");
  const [local, others] = splitProps(props, ["children", "forceMount"]);
  let element: HTMLElement | undefined;

  onMount(() => {
    const unregister = control.registerErrorMessage(() => element?.id);
    onCleanup(unregister);
  });

  return (
    <Show when={local.forceMount || control.invalid()}>
      <div
        {...control.getErrorMessageProps({
          ...others,
          ref: (nextElement) => {
            element = nextElement;
            assignRef(others.ref, nextElement);
          },
        })}
      >
        {local.children ?? validity?.validationMessage()}
      </div>
    </Show>
  );
}

function FieldHiddenInput(props: FieldHiddenInputProps) {
  const { control } = useField("HiddenInput");

  return (
    <For each={control.hiddenInputDescriptors()}>
      {(input) => <HiddenInputElement control={control} input={input} props={props} />}
    </For>
  );
}

function HiddenInputElement(props: {
  control: FormControlApi;
  input: HiddenInputDescriptor;
  props: FormControlHiddenInputProps;
}) {
  let inputElement: HTMLInputElement | undefined;

  createEffect(() => {
    if (inputElement) {
      inputElement.value = props.input.value;
    }
  });

  return (
    <input
      {...props.control.getHiddenInputProps({
        ...props.props,
        disabled: props.props.disabled ?? props.input.disabled,
        form: props.props.form ?? props.input.form,
        name: props.props.name ?? props.input.name,
        ref: (element) => {
          inputElement = element;
          element.value = props.input.value;
          props.control.registerFormReset(() => element);
          assignRef(props.props.ref, element);
        },
        required: props.props.required ?? props.input.required,
        value: props.props.value ?? props.input.value,
      })}
    />
  );
}

function assignRef<T>(ref: unknown, element: T) {
  if (typeof ref === "function") {
    (ref as (element: T) => void)(element);
  }
}

export const FormControl = {
  Root: FormControlRoot,
  Control: FormControlControl,
  Label: FormControlLabel,
  Description: FormControlDescription,
  ErrorMessage: FormControlErrorMessage,
  HiddenInput: FormControlHiddenInput,
};

export const Field = {
  Root: FieldRoot,
  Control: FieldControl,
  Label: FieldLabel,
  Description: FieldDescription,
  ErrorMessage: FieldErrorMessage,
  HiddenInput: FieldHiddenInput,
};
