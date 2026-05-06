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
  createSpinButtonController,
  type SpinButtonApi,
  type SpinButtonInputContractProps,
  type SpinButtonRootContractProps,
  type SpinButtonTriggerContractProps,
  type SpinButtonValueChangeDetail,
} from "./controller";

export type {
  SpinButtonApi,
  SpinButtonValueChangeDetail,
  SpinButtonValueChangeReason,
} from "./controller";

export type CreateSpinButtonOptions = Parameters<typeof createSpinButtonController>[0];

export type SpinButtonPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type SpinButtonRootProps = SpinButtonPartProps<HTMLSpanElement> &
  SpinButtonRootContractProps & {
    defaultValue?: number;
    disabled?: boolean;
    format?: (value: number) => string;
    form?: string;
    getValueText?: (value: number) => string;
    invalid?: boolean;
    largeStep?: number;
    max?: number;
    min?: number;
    name?: string;
    onValueChange?: (value: number | undefined, detail: SpinButtonValueChangeDetail) => void;
    parse?: (value: string) => number | undefined;
    readOnly?: boolean;
    required?: boolean;
    step?: number;
    value?: number;
  };

export type SpinButtonInputProps = SpinButtonPartProps<HTMLInputElement> &
  SpinButtonInputContractProps;
export type SpinButtonIncrementTriggerProps = SpinButtonPartProps<HTMLButtonElement> &
  SpinButtonTriggerContractProps;
export type SpinButtonDecrementTriggerProps = SpinButtonPartProps<HTMLButtonElement> &
  SpinButtonTriggerContractProps;

const SpinButtonContext = createContext<SpinButtonApi>();

export function createSpinButton(options: CreateSpinButtonOptions = {}): SpinButtonApi {
  return createSpinButtonController(options);
}

function useSpinButton(part: string) {
  const spinButton = useContext(SpinButtonContext);

  if (!spinButton) {
    throw new Error(`SpinButton.${part} must be used within SpinButton.Root`);
  }

  return spinButton;
}

function Root(props: SpinButtonRootProps) {
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
  const spinButton = createSpinButton({
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
  const rootProps = spinButton.getRootProps(others);

  return (
    <SpinButtonContext.Provider value={spinButton}>
      <span {...rootProps}>{local.children}</span>
    </SpinButtonContext.Provider>
  );
}

function Input(props: SpinButtonInputProps) {
  const spinButton = useSpinButton("Input");
  let input: HTMLInputElement | undefined;

  onMount(() => {
    const form = input?.form;
    if (!form) return;

    const onReset = () => spinButton.reset();
    form.addEventListener("reset", onReset);
    onCleanup(() => form.removeEventListener("reset", onReset));
  });

  const inputProps = spinButton.getInputProps({
    ...props,
    ref: (element) => {
      input = element;
      if (typeof props.ref === "function") props.ref(element);
    },
  });

  return <input {...inputProps} />;
}

function IncrementTrigger(props: SpinButtonIncrementTriggerProps) {
  const spinButton = useSpinButton("IncrementTrigger");
  const [local, others] = splitProps(props, ["children"]);
  const triggerProps = spinButton.getIncrementTriggerProps(others);

  return <button {...triggerProps}>{local.children}</button>;
}

function DecrementTrigger(props: SpinButtonDecrementTriggerProps) {
  const spinButton = useSpinButton("DecrementTrigger");
  const [local, others] = splitProps(props, ["children"]);
  const triggerProps = spinButton.getDecrementTriggerProps(others);

  return <button {...triggerProps}>{local.children}</button>;
}

export const SpinButton = {
  Root,
  Input,
  IncrementTrigger,
  DecrementTrigger,
};
