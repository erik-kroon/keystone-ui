import { For, Show, createContext, createEffect, splitProps, useContext } from "solid-js";
import { Portal } from "solid-js/web";
import { renderPolymorphic } from "../utils/index";
import {
  createSelect,
  type SelectApi,
  type SelectContentProps,
  type SelectGroupLabelProps,
  type SelectGroupProps,
  type SelectItemIndicatorProps,
  type SelectItemProps,
  type SelectItemTextProps,
  type SelectListboxProps,
  type SelectPortalProps,
  type SelectPositionerProps,
  type SelectRootProps,
  type SelectTriggerProps,
  type SelectValueProps,
} from "./controller";

const SelectContext = createContext<SelectApi>();
const SelectGroupContext = createContext<{ disabled?: boolean; value: string }>();

function useSelect(part: string) {
  const select = useContext(SelectContext);

  if (!select) {
    throw new Error(`Select.${part} must be used within Select.Root`);
  }

  return select;
}

function Root(props: SelectRootProps) {
  const select = createSelect({
    arrowPadding: () => props.arrowPadding,
    collisionBoundary: () => props.collisionBoundary,
    collisionPadding: () => props.collisionPadding,
    open: () => props.open,
    defaultOpen: props.defaultOpen,
    value: () => props.value,
    defaultValue: props.defaultValue,
    disabled: () => props.disabled,
    fitViewport: () => props.fitViewport,
    form: () => props.form,
    gutter: () => props.gutter,
    invalid: () => props.invalid,
    multiple: () => props.multiple,
    name: () => props.name,
    placeholder: () => props.placeholder,
    placement: () => props.placement,
    readOnly: () => props.readOnly,
    required: () => props.required,
    rootBoundary: () => props.rootBoundary,
    sameWidth: () => props.sameWidth,
    sticky: () => props.sticky,
    strategy: () => props.strategy,
    onOpenChange: props.onOpenChange,
    onValueChange: props.onValueChange,
    onValuesChange: props.onValuesChange,
  });

  return (
    <SelectContext.Provider value={select}>
      <Show when={props.name}>
        <For each={select.formValue.hiddenInputs()}>
          {(input) => <HiddenInput input={input} select={select} />}
        </For>
      </Show>
      {props.children}
    </SelectContext.Provider>
  );
}

function HiddenInput(props: {
  input: ReturnType<SelectApi["formValue"]["hiddenInputs"]>[number];
  select: SelectApi;
}) {
  let inputElement: HTMLInputElement | undefined;

  createEffect(() => {
    if (inputElement) {
      inputElement.value = props.input.value;
    }
  });

  return (
    <input
      {...props.select.formControl.getHiddenInputProps({
        name: props.input.name,
        disabled: props.input.disabled,
        ref: (element) => {
          inputElement = element;
          element.value = props.input.value;
          props.select.formControl.registerFormReset(() => element);
          props.select.formControl.registerFormValueSync(
            () => element,
            props.select.formValue.syncInputValue,
          );
        },
      })}
    />
  );
}

function Trigger(props: SelectTriggerProps) {
  const select = useSelect("Trigger");
  const [local, others] = splitProps(props, ["as", "children", "onClick", "onKeyDown", "ref"]);

  const triggerProps = select.getTriggerProps({
    ...others,
    onClick: local.onClick,
    onKeyDown: local.onKeyDown,
    ref: local.ref,
  });

  if (!local.as) {
    return <button {...triggerProps}>{local.children}</button>;
  }

  return renderPolymorphic(local.as, "button", {
    ...triggerProps,
    children: local.children,
  });
}

function Value(props: SelectValueProps) {
  const select = useSelect("Value");
  const [local, others] = splitProps(props, ["children", "placeholder"]);
  const text = () =>
    local.children ??
    select.listbox.selection.selectedItem()?.label ??
    local.placeholder ??
    select.placeholder();

  return <span {...select.getValueProps(others)}>{text()}</span>;
}

function PortalPart(props: SelectPortalProps) {
  const select = useSelect("Portal");

  return (
    <Show when={props.forceMount || select.open()}>
      <Portal mount={props.mount}>{props.children}</Portal>
    </Show>
  );
}

function Content(props: SelectContentProps) {
  const select = useSelect("Content");
  const [local, others] = splitProps(props, ["children", "onKeyDown", "ref", "style"]);

  return (
    <div
      {...select.getContentProps({
        ...others,
        onKeyDown: local.onKeyDown,
        ref: local.ref,
        style: local.style,
      })}
    >
      {local.children}
    </div>
  );
}

function Positioner(props: SelectPositionerProps) {
  const select = useSelect("Positioner");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);

  return (
    <div
      {...select.getPositionerProps({
        ...others,
        ref: local.ref,
        style: local.style,
      })}
    >
      {local.children}
    </div>
  );
}

function Listbox(props: SelectListboxProps) {
  const select = useSelect("Listbox");
  const [local, others] = splitProps(props, ["children", "onKeyDown"]);

  return (
    <div {...select.getListboxProps({ ...others, onKeyDown: local.onKeyDown })}>
      {local.children}
    </div>
  );
}

function Group(props: SelectGroupProps) {
  const select = useSelect("Group");
  const [local, others] = splitProps(props, ["children", "disabled", "label", "value"]);

  return (
    <SelectGroupContext.Provider value={{ disabled: local.disabled, value: local.value }}>
      <div
        {...select.getGroupProps({
          ...others,
          disabled: local.disabled,
          label: local.label,
          value: local.value,
        })}
      >
        {local.children}
      </div>
    </SelectGroupContext.Provider>
  );
}

function GroupLabel(props: SelectGroupLabelProps) {
  const select = useSelect("GroupLabel");
  const group = useContext(SelectGroupContext);
  const [local, others] = splitProps(props, ["children", "id"]);
  const id = () => local.id ?? (group ? select.groupLabelId(group.value) : undefined);

  return (
    <div
      {...select.getGroupLabelProps({
        ...others,
        id: id(),
      })}
    >
      {local.children}
    </div>
  );
}

function Item(props: SelectItemProps) {
  const select = useSelect("Item");
  const group = useContext(SelectGroupContext);
  const [local, others] = splitProps(props, [
    "children",
    "disabled",
    "group",
    "label",
    "onClick",
    "onPointerMove",
    "value",
  ]);
  const label = () => local.label ?? String(local.children ?? local.value);

  return (
    <div
      {...select.getItemProps({
        ...others,
        disabled: local.disabled ?? group?.disabled,
        group: local.group ?? group?.value,
        label: label(),
        onClick: local.onClick,
        onPointerMove: local.onPointerMove,
        value: local.value,
      })}
    >
      {local.children}
    </div>
  );
}

function ItemText(props: SelectItemTextProps) {
  const select = useSelect("ItemText");
  const [local, others] = splitProps(props, ["children"]);

  return <span {...select.getItemTextProps(others)}>{local.children}</span>;
}

function ItemIndicator(props: SelectItemIndicatorProps) {
  const select = useSelect("ItemIndicator");
  const [local, others] = splitProps(props, ["children"]);

  return <span {...select.getItemIndicatorProps(others)}>{local.children}</span>;
}

export const Select = {
  Root,
  Trigger,
  Value,
  Portal: PortalPart,
  Positioner,
  Content,
  Listbox,
  Group,
  GroupLabel,
  Item,
  ItemText,
  ItemIndicator,
};
