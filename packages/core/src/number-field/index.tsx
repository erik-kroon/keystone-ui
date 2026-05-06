import {
  createContext,
  createUniqueId,
  onCleanup,
  onMount,
  splitProps,
  useContext,
  type JSX,
} from "solid-js";
import {
  createSpinButton,
  type CreateSpinButtonOptions,
  type SpinButtonApi,
  type SpinButtonInputProps,
  type SpinButtonRootProps,
  type SpinButtonValueChangeDetail,
  type SpinButtonIncrementTriggerProps,
  type SpinButtonDecrementTriggerProps,
} from "../spin-button/index";

export type NumberFieldValueChangeDetail = SpinButtonValueChangeDetail;
export type CreateNumberFieldOptions = CreateSpinButtonOptions;

export type NumberFieldPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type NumberFieldRootProps = NumberFieldPartProps<HTMLSpanElement> & SpinButtonRootProps;
export type NumberFieldInputProps = NumberFieldPartProps<HTMLInputElement> & SpinButtonInputProps;
export type NumberFieldIncrementTriggerProps = NumberFieldPartProps<HTMLButtonElement> &
  SpinButtonIncrementTriggerProps;
export type NumberFieldDecrementTriggerProps = NumberFieldPartProps<HTMLButtonElement> &
  SpinButtonDecrementTriggerProps;

const NumberFieldContext = createContext<SpinButtonApi>();

export function createNumberField(options: CreateNumberFieldOptions = {}): SpinButtonApi {
  return createSpinButton(options);
}

function useNumberField(part: string) {
  const numberField = useContext(NumberFieldContext);

  if (!numberField) {
    throw new Error(`NumberField.${part} must be used within NumberField.Root`);
  }

  return numberField;
}

function Root(props: NumberFieldRootProps) {
  const fallbackId = createUniqueId();
  const [local, others] = splitProps(props, [
    "children",
    "defaultValue",
    "disabled",
    "format",
    "form",
    "getValueText",
    "id",
    "invalid",
    "largeStep",
    "max",
    "min",
    "name",
    "onValueChange",
    "parse",
    "readOnly",
    "required",
    "step",
    "value",
  ]);
  const numberField = createNumberField({
    defaultValue: local.defaultValue,
    disabled: () => local.disabled,
    format: local.format,
    form: () => local.form,
    getValueText: local.getValueText,
    id: () => local.id ?? fallbackId,
    invalid: () => local.invalid,
    largeStep: () => local.largeStep,
    max: () => local.max,
    min: () => local.min,
    name: () => local.name,
    onValueChange: local.onValueChange,
    parse: local.parse,
    readOnly: () => local.readOnly,
    required: () => local.required,
    step: () => local.step,
    value: () => local.value,
  });
  const rootProps = numberField.getRootProps(others, "root");

  return (
    <NumberFieldContext.Provider value={numberField}>
      <span {...rootProps} data-scope="number-field">
        {local.children}
      </span>
    </NumberFieldContext.Provider>
  );
}

function Input(props: NumberFieldInputProps) {
  const numberField = useNumberField("Input");
  let input: HTMLInputElement | undefined;

  onMount(() => {
    const form = input?.form;
    if (!form) return;

    const onReset = () => numberField.reset();
    form.addEventListener("reset", onReset);
    onCleanup(() => form.removeEventListener("reset", onReset));
  });

  const inputProps = numberField.getInputProps(
    {
      ...props,
      ref: (element) => {
        input = element;
        if (typeof props.ref === "function") props.ref(element);
      },
    },
    "input",
  );

  return <input {...inputProps} data-scope="number-field" />;
}

function IncrementTrigger(props: NumberFieldIncrementTriggerProps) {
  const numberField = useNumberField("IncrementTrigger");
  const [local, others] = splitProps(props, ["children"]);
  const triggerProps = numberField.getIncrementTriggerProps(others, "increment-trigger");

  return (
    <button {...triggerProps} data-scope="number-field">
      {local.children}
    </button>
  );
}

function DecrementTrigger(props: NumberFieldDecrementTriggerProps) {
  const numberField = useNumberField("DecrementTrigger");
  const [local, others] = splitProps(props, ["children"]);
  const triggerProps = numberField.getDecrementTriggerProps(others, "decrement-trigger");

  return (
    <button {...triggerProps} data-scope="number-field">
      {local.children}
    </button>
  );
}

export const NumberField = {
  Root,
  Input,
  IncrementTrigger,
  DecrementTrigger,
};
