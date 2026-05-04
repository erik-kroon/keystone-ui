import { getPartDataAttributes } from "../metadata/index";

export type DataBooleanAttribute = "" | undefined;
export type DataOpenClosedState = "open" | "closed";
export type DataCheckedState = "checked" | "unchecked";
export type DataSelectionState = DataCheckedState | "indeterminate";

export function dataBoolean(value: boolean | null | undefined): DataBooleanAttribute {
  return value ? "" : undefined;
}

export function getOpenClosedState(open: boolean): DataOpenClosedState {
  return open ? "open" : "closed";
}

export function getCheckedState(checked: boolean): DataCheckedState {
  return checked ? "checked" : "unchecked";
}

export function getSelectionState(checked: boolean | "indeterminate"): DataSelectionState {
  if (checked === "indeterminate") return "indeterminate";
  return getCheckedState(checked);
}

export function partDataAttributes(scope: string, part: string): Record<string, string> {
  return getPartDataAttributes(scope, part);
}
