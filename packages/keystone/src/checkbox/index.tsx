import {
  createContext,
  createEffect,
  onCleanup,
  onMount,
  splitProps,
  useContext,
  type JSX,
} from "solid-js";
import {
  createSelectionControl,
  getSelectionControlProps,
  getSelectionState,
  type SelectionControlChangeDetail,
  type SelectionControlCheckedState,
} from "../selection-control/controller";
import { callEventHandler, dataBoolean, partDataAttributes } from "../utils/index";

export type CheckboxCheckedState = SelectionControlCheckedState;
export type CheckboxCheckedChangeDetail = SelectionControlChangeDetail;

export type CheckboxRootProps = CheckboxPartProps<HTMLSpanElement> &
  Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children" | "ref"> & {
    checked?: CheckboxCheckedState;
    defaultChecked?: CheckboxCheckedState;
    disabled?: boolean;
    form?: string;
    invalid?: boolean;
    name?: string;
    onCheckedChange?: (checked: CheckboxCheckedState, detail: CheckboxCheckedChangeDetail) => void;
    readOnly?: boolean;
    required?: boolean;
    value?: string;
  };

export type CheckboxPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type CheckboxControlProps = CheckboxPartProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type CheckboxIndicatorProps = CheckboxPartProps<HTMLSpanElement> &
  Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children" | "ref"> & {
    forceMount?: boolean;
  };
export type CheckboxHiddenInputProps = CheckboxPartProps<HTMLInputElement> &
  Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "children" | "checked" | "ref" | "type">;

type CheckboxApi = ReturnType<typeof createCheckbox>;

const CheckboxContext = createContext<CheckboxApi>();

export function createCheckbox(
  options: {
    checked?: () => CheckboxCheckedState | undefined;
    defaultChecked?: CheckboxCheckedState;
    disabled?: () => boolean | undefined;
    form?: () => string | undefined;
    invalid?: () => boolean | undefined;
    name?: () => string | undefined;
    onCheckedChange?: (checked: CheckboxCheckedState, detail: CheckboxCheckedChangeDetail) => void;
    readOnly?: () => boolean | undefined;
    required?: () => boolean | undefined;
    value?: () => string | undefined;
  } = {},
) {
  return createSelectionControl({
    checked: options.checked,
    defaultChecked: options.defaultChecked,
    disabled: options.disabled,
    form: options.form,
    invalid: options.invalid,
    name: options.name,
    onCheckedChange: options.onCheckedChange,
    readOnly: options.readOnly,
    required: options.required,
    scope: "checkbox",
    value: options.value,
  });
}

function useCheckbox(part: string) {
  const control = useContext(CheckboxContext);
  if (!control) throw new Error(`Checkbox.${part} must be used within Checkbox.Root`);
  return control;
}

function Root(props: CheckboxRootProps) {
  const [local, others] = splitProps(props, [
    "checked",
    "children",
    "defaultChecked",
    "disabled",
    "form",
    "invalid",
    "name",
    "onCheckedChange",
    "readOnly",
    "required",
    "value",
  ]);
  const control = createCheckbox({
    checked: () => local.checked,
    defaultChecked: local.defaultChecked,
    disabled: () => local.disabled,
    form: () => local.form,
    invalid: () => local.invalid,
    name: () => local.name,
    onCheckedChange: local.onCheckedChange,
    readOnly: () => local.readOnly,
    required: () => local.required,
    value: () => local.value,
  });

  return (
    <CheckboxContext.Provider value={control}>
      <span
        {...others}
        data-checked={dataBoolean(control.checked() === true)}
        data-disabled={dataBoolean(control.disabled())}
        data-invalid={dataBoolean(control.invalid())}
        data-readonly={dataBoolean(control.readOnly())}
        data-required={dataBoolean(control.required())}
        data-state={getSelectionState(control.checked())}
        {...partDataAttributes("checkbox", "root")}
      >
        {local.children}
      </span>
    </CheckboxContext.Provider>
  );
}

function Control(props: CheckboxControlProps) {
  const control = useCheckbox("Control");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <button {...getSelectionControlProps(control, "control", others)}>{local.children}</button>
  );
}

function Indicator(props: CheckboxIndicatorProps) {
  const control = useCheckbox("Indicator");
  const [local, others] = splitProps(props, ["children", "forceMount"]);

  if (!local.forceMount && control.checked() === false) return null;

  return (
    <span
      {...others}
      data-checked={dataBoolean(control.checked() === true)}
      data-disabled={dataBoolean(control.disabled())}
      data-state={getSelectionState(control.checked())}
      {...partDataAttributes("checkbox", "indicator")}
    >
      {local.children}
    </span>
  );
}

function HiddenInput(props: CheckboxHiddenInputProps) {
  const control = useCheckbox("HiddenInput");
  let input: HTMLInputElement | undefined;

  createEffect(() => {
    if (input) input.indeterminate = control.checked() === "indeterminate";
  });

  onMount(() => {
    const form = input?.form;
    if (!form) return;

    const onReset = () => control.reset();
    form.addEventListener("reset", onReset);
    onCleanup(() => form.removeEventListener("reset", onReset));
  });

  return (
    <input
      {...props}
      onChange={(event) => {
        callEventHandler(props.onChange, event);
        if (event.defaultPrevented || control.disabled() || control.readOnly()) return;
        control.setChecked(event.currentTarget.checked, { reason: "control" });
      }}
      ref={(element) => {
        input = element;
        if (typeof props.ref === "function") props.ref(element);
      }}
      checked={control.checked() === true}
      disabled={control.disabled()}
      form={props.form ?? control.form()}
      id={control.inputId}
      name={control.name()}
      required={control.required()}
      type="checkbox"
      value={control.value()}
      data-state={getSelectionState(control.checked())}
      {...partDataAttributes("checkbox", "hidden-input")}
    />
  );
}

export const Checkbox = {
  Root,
  Control,
  Indicator,
  HiddenInput,
};
