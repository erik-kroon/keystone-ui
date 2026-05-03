import { createMemo, createUniqueId, type Accessor } from "solid-js";
import {
  callEventHandler,
  createControllableSignal,
  dataBoolean,
  partDataAttributes,
  type KeystoneEventHandler,
} from "../utils/index";

export type SelectionControlCheckedState = boolean | "indeterminate";
export type SelectionControlChangeReason = "control" | "programmatic";
export type SelectionControlChangeDetail = {
  reason: SelectionControlChangeReason;
};

export type SelectionControlApi = {
  checked: Accessor<SelectionControlCheckedState>;
  disabled: Accessor<boolean>;
  inputId: string;
  invalid: Accessor<boolean>;
  name: Accessor<string | undefined>;
  readOnly: Accessor<boolean>;
  required: Accessor<boolean>;
  scope: string;
  setChecked: (
    checked: SelectionControlCheckedState,
    detail: SelectionControlChangeDetail,
  ) => SelectionControlCheckedState;
  toggle: (detail: SelectionControlChangeDetail) => SelectionControlCheckedState;
  value: Accessor<string>;
};

export type CreateSelectionControlOptions = {
  checked?: Accessor<SelectionControlCheckedState | undefined>;
  defaultChecked?: SelectionControlCheckedState;
  disabled?: Accessor<boolean | undefined>;
  invalid?: Accessor<boolean | undefined>;
  name?: Accessor<string | undefined>;
  onCheckedChange?: (
    checked: SelectionControlCheckedState,
    detail: SelectionControlChangeDetail,
  ) => void;
  readOnly?: Accessor<boolean | undefined>;
  required?: Accessor<boolean | undefined>;
  scope: string;
  value?: Accessor<string | undefined>;
};

export function createSelectionControl(
  options: CreateSelectionControlOptions,
): SelectionControlApi {
  let pendingDetail: SelectionControlChangeDetail | undefined;
  const [checked, setCheckedState] = createControllableSignal<SelectionControlCheckedState>({
    value: options.checked,
    defaultValue: options.defaultChecked ?? false,
    onChange: (nextChecked) => {
      options.onCheckedChange?.(nextChecked, pendingDetail ?? { reason: "programmatic" });
      pendingDetail = undefined;
    },
  });

  const disabled = createMemo(() => options.disabled?.() ?? false);
  const invalid = createMemo(() => options.invalid?.() ?? false);
  const readOnly = createMemo(() => options.readOnly?.() ?? false);
  const required = createMemo(() => options.required?.() ?? false);
  const name = createMemo(() => options.name?.());
  const value = createMemo(() => options.value?.() ?? "on");

  const setChecked = (
    nextChecked: SelectionControlCheckedState,
    detail: SelectionControlChangeDetail,
  ) => {
    pendingDetail = detail;
    const result = setCheckedState(nextChecked);
    pendingDetail = undefined;
    return result;
  };

  return {
    checked,
    disabled,
    inputId: `keystone-${options.scope}-input-${createUniqueId()}`,
    invalid,
    name,
    readOnly,
    required,
    scope: options.scope,
    setChecked,
    toggle: (detail) => setChecked(checked() === true ? false : true, detail),
    value,
  };
}

export function getSelectionControlProps(
  control: Pick<
    SelectionControlApi,
    "checked" | "disabled" | "invalid" | "readOnly" | "required" | "scope" | "toggle"
  >,
  part: "control" | "root",
  props: {
    onClick?: KeystoneEventHandler;
    onKeyDown?: KeystoneEventHandler;
    [key: string]: unknown;
  },
): Record<string, unknown> {
  return {
    ...props,
    "aria-checked": control.checked() === "indeterminate" ? "mixed" : control.checked(),
    "aria-disabled": control.disabled() || undefined,
    "aria-invalid": control.invalid() || undefined,
    "aria-readonly": control.readOnly() || undefined,
    "aria-required": control.required() || undefined,
    "data-checked": dataBoolean(control.checked() === true),
    "data-disabled": dataBoolean(control.disabled()),
    "data-invalid": dataBoolean(control.invalid()),
    "data-readonly": dataBoolean(control.readOnly()),
    "data-required": dataBoolean(control.required()),
    "data-state": getSelectionState(control.checked()),
    role: control.scope === "switch" ? "switch" : "checkbox",
    tabIndex: control.disabled() ? undefined : 0,
    type: "button",
    ...partDataAttributes(control.scope, part),
    onClick: (event: MouseEvent) => {
      callEventHandler(props.onClick, event);
      if (event.defaultPrevented || control.disabled() || control.readOnly()) return;
      control.toggle({ reason: "control" });
    },
    onKeyDown: (event: KeyboardEvent) => {
      callEventHandler(props.onKeyDown, event);
      if (event.defaultPrevented || control.disabled() || control.readOnly()) return;
      if (event.key !== " ") return;
      event.preventDefault();
      control.toggle({ reason: "control" });
    },
  };
}

export function getSelectionState(checked: SelectionControlCheckedState) {
  if (checked === "indeterminate") return "indeterminate";
  return checked ? "checked" : "unchecked";
}
