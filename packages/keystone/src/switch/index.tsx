import { createContext, onCleanup, onMount, splitProps, useContext, type JSX } from "solid-js";
import {
  createSelectionControl,
  getSelectionControlProps,
  getSelectionState,
  type SelectionControlChangeDetail,
  type SelectionControlCheckedState,
} from "../selection-control/controller";
import { callEventHandler, dataBoolean, partDataAttributes } from "../utils/index";

export type SwitchCheckedChangeDetail = SelectionControlChangeDetail;

export type SwitchRootProps = SwitchPartProps<HTMLSpanElement> &
  Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children" | "ref"> & {
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    form?: string;
    invalid?: boolean;
    name?: string;
    onCheckedChange?: (checked: boolean, detail: SwitchCheckedChangeDetail) => void;
    readOnly?: boolean;
    required?: boolean;
    value?: string;
  };

export type SwitchPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type SwitchControlProps = SwitchPartProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type SwitchThumbProps = SwitchPartProps<HTMLSpanElement> &
  Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children" | "ref">;
export type SwitchHiddenInputProps = SwitchPartProps<HTMLInputElement> &
  Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "children" | "checked" | "ref" | "type">;

type SwitchApi = ReturnType<typeof createSwitch>;

const SwitchContext = createContext<SwitchApi>();

export function createSwitch(
  options: {
    checked?: () => boolean | undefined;
    defaultChecked?: boolean;
    disabled?: () => boolean | undefined;
    form?: () => string | undefined;
    invalid?: () => boolean | undefined;
    name?: () => string | undefined;
    onCheckedChange?: (checked: boolean, detail: SwitchCheckedChangeDetail) => void;
    readOnly?: () => boolean | undefined;
    required?: () => boolean | undefined;
    value?: () => string | undefined;
  } = {},
) {
  const control = createSelectionControl({
    checked: options.checked,
    defaultChecked: options.defaultChecked,
    disabled: options.disabled,
    form: options.form,
    invalid: options.invalid,
    name: options.name,
    onCheckedChange: (checked, detail) => options.onCheckedChange?.(checked === true, detail),
    readOnly: options.readOnly,
    required: options.required,
    scope: "switch",
    value: options.value,
  });

  return {
    ...control,
    checked: () => control.checked() === true,
    setChecked: (checked: boolean, detail: SwitchCheckedChangeDetail) =>
      control.setChecked(checked, detail) === true,
  };
}

function useSwitch(part: string) {
  const control = useContext(SwitchContext);
  if (!control) throw new Error(`Switch.${part} must be used within Switch.Root`);
  return control;
}

function Root(props: SwitchRootProps) {
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
  const control = createSwitch({
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
    <SwitchContext.Provider value={control}>
      <span
        {...others}
        data-checked={dataBoolean(control.checked())}
        data-disabled={dataBoolean(control.disabled())}
        data-invalid={dataBoolean(control.invalid())}
        data-readonly={dataBoolean(control.readOnly())}
        data-required={dataBoolean(control.required())}
        data-state={getSelectionState(control.checked() as SelectionControlCheckedState)}
        {...partDataAttributes("switch", "root")}
      >
        {local.children}
      </span>
    </SwitchContext.Provider>
  );
}

function Control(props: SwitchControlProps) {
  const control = useSwitch("Control");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <button {...getSelectionControlProps(control, "control", others)}>{local.children}</button>
  );
}

function Thumb(props: SwitchThumbProps) {
  const control = useSwitch("Thumb");

  return (
    <span
      {...props}
      data-checked={dataBoolean(control.checked())}
      data-disabled={dataBoolean(control.disabled())}
      data-state={getSelectionState(control.checked() as SelectionControlCheckedState)}
      {...partDataAttributes("switch", "thumb")}
    />
  );
}

function HiddenInput(props: SwitchHiddenInputProps) {
  const control = useSwitch("HiddenInput");
  let input: HTMLInputElement | undefined;

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
      checked={control.checked()}
      disabled={control.disabled()}
      form={props.form ?? control.form()}
      id={control.inputId}
      name={control.name()}
      required={control.required()}
      type="checkbox"
      value={control.value()}
      data-state={getSelectionState(control.checked() as SelectionControlCheckedState)}
      {...partDataAttributes("switch", "hidden-input")}
    />
  );
}

export const Switch = {
  Root,
  Control,
  Thumb,
  HiddenInput,
};
