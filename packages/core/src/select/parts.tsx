import { For, Show, createContext, splitProps, useContext } from "solid-js";
import { createPopupFieldHiddenInputProps } from "../collection/popup-field-kernel";
import { DismissableLayer } from "../overlay/index";
import { Portal } from "../portal/index";
import { renderPolymorphic } from "../utils/index";
import {
  createSelect,
  type SelectApi,
  type SelectArrowProps,
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
const SelectItemContext = createContext<{ value: string }>();
const SelectPositionerContext = createContext(false);
const SelectLabelHydrationContext = createContext(false);

function useSelect(part: string) {
  const select = useContext(SelectContext);

  if (!select) {
    throw new Error(`Select.${part} must be used within Select.Root`);
  }

  return select;
}

function useSelectItem(part: string) {
  const item = useContext(SelectItemContext);

  if (!item) {
    throw new Error(`Select.${part} must be used within Select.Item`);
  }

  return item;
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
  const inputProps = createPopupFieldHiddenInputProps({
    formControl: props.select.formControl,
    input: () => props.input,
    syncInputValue: props.select.formValue.syncInputValue,
  });

  return <input {...inputProps} />;
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
    local.children ?? select.selectedLabel() ?? local.placeholder ?? select.placeholder();

  return <span {...select.getValueProps(others)}>{text()}</span>;
}

function PortalPart(props: SelectPortalProps) {
  const select = useSelect("Portal");
  const hydratingLabel = () =>
    props.forceMount !== true && !select.open() && select.needsSelectedLabel();

  return (
    <Portal
      forceMount={props.forceMount}
      mount={props.mount}
      present={select.open() || hydratingLabel()}
    >
      <SelectLabelHydrationContext.Provider value={hydratingLabel()}>
        {props.children}
      </SelectLabelHydrationContext.Provider>
    </Portal>
  );
}

function Content(props: SelectContentProps) {
  const select = useSelect("Content");
  const positioned = useContext(SelectPositionerContext);
  const hydratingLabel = useContext(SelectLabelHydrationContext);
  const [local, others] = splitProps(props, ["children", "onKeyDown", "ref", "style"]);
  const contentProps = select.getContentProps({
    ...others,
    hidden: hydratingLabel ? true : others.hidden,
    onKeyDown: local.onKeyDown,
    positioned,
    ref: local.ref,
    style: local.style,
  });

  if (hydratingLabel) {
    return <div {...contentProps}>{local.children}</div>;
  }

  return (
    <DismissableLayer
      {...contentProps}
      disableOutsidePointerEvents
      onFocusOutside={(event) => event.preventDefault()}
      onDismiss={(event) => {
        select.setOpen(false, {
          event,
          reason: event.type === "keydown" ? "escape" : "outside",
        });
      }}
    >
      {local.children}
    </DismissableLayer>
  );
}

function Positioner(props: SelectPositionerProps) {
  const select = useSelect("Positioner");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);

  return (
    <SelectPositionerContext.Provider value={true}>
      <div
        {...select.getPositionerProps({
          ...others,
          ref: local.ref,
          style: local.style,
        })}
      >
        {local.children}
      </div>
    </SelectPositionerContext.Provider>
  );
}

function Arrow(props: SelectArrowProps) {
  const select = useSelect("Arrow");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);

  return (
    <span
      {...select.getArrowProps({
        ...others,
        ref: local.ref,
        style: local.style,
      })}
    >
      {local.children}
    </span>
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
    <SelectItemContext.Provider value={{ value: local.value }}>
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
    </SelectItemContext.Provider>
  );
}

function ItemText(props: SelectItemTextProps) {
  const select = useSelect("ItemText");
  const [local, others] = splitProps(props, ["children"]);

  return <span {...select.getItemTextProps(others)}>{local.children}</span>;
}

function ItemIndicator(props: SelectItemIndicatorProps) {
  const select = useSelect("ItemIndicator");
  const item = useSelectItem("ItemIndicator");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <Show when={select.listbox.selection.isSelected(item.value)}>
      <span {...select.getItemIndicatorProps(others)}>{local.children}</span>
    </Show>
  );
}

export const Select = {
  Root,
  Trigger,
  Value,
  Portal: PortalPart,
  Positioner,
  Arrow,
  Content,
  Listbox,
  Group,
  GroupLabel,
  Item,
  ItemText,
  ItemIndicator,
};
