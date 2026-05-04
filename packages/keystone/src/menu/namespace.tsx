import { createMemo, onCleanup, splitProps, useContext } from "solid-js";
import { OverlayLayerProvider } from "../overlay/index";
import { focusWithoutScrolling } from "../overlay/dom";
import { Portal } from "../portal/index";
import {
  composeEventHandlers,
  createControllableSignal,
  renderPolymorphic,
  scheduleMicrotask,
} from "../utils/index";
import {
  MenuContext,
  MenuItemContext,
  RadioGroupContext,
  SubmenuContext,
  useMenu,
} from "./context";
import { createScopedMenu } from "./interaction";
import type {
  MenuArrowProps,
  MenuCheckboxItemProps,
  MenuContentProps,
  MenuFactoryOptions,
  MenuGroupLabelProps,
  MenuGroupProps,
  MenuItemContextValue,
  MenuItemProps,
  MenuLinkProps,
  MenuPartProps,
  MenuPortalProps,
  MenuPositionerProps,
  MenuRadioGroupProps,
  MenuRadioItemProps,
  MenuRootProps,
  MenuSelectDetail,
  MenuSeparatorProps,
  MenuTriggerProps,
  RadioGroupContextValue,
} from "./types";

export function createMenuNamespace(factoryOptions: MenuFactoryOptions) {
  function Root(props: MenuRootProps) {
    const menu = createScopedMenu(
      {
        arrowPadding: () => props.arrowPadding,
        closeOnSelect: () => props.closeOnSelect,
        collisionBoundary: () => props.collisionBoundary,
        collisionPadding: () => props.collisionPadding,
        defaultOpen: props.defaultOpen,
        fitViewport: () => props.fitViewport,
        gutter: () => props.gutter,
        modal: () => props.modal,
        onOpenChange: props.onOpenChange,
        onOpenChangeComplete: props.onOpenChangeComplete,
        open: () => props.open,
        placement: () => props.placement,
        rootBoundary: () => props.rootBoundary,
        sameWidth: () => props.sameWidth,
        scope: factoryOptions.scope,
        sticky: () => props.sticky,
        strategy: () => props.strategy,
      },
      factoryOptions.rootRole ?? "menu",
    );

    return (
      <OverlayLayerProvider>
        <MenuContext.Provider value={menu}>{props.children}</MenuContext.Provider>
      </OverlayLayerProvider>
    );
  }

  function Trigger(props: MenuTriggerProps) {
    const menu = useMenu("Trigger");
    const [local, others] = splitProps(props, ["as", "children", "onClick", "ref"]);
    const triggerProps = menu.getTriggerProps({
      ...others,
      onClick: local.onClick,
      ref: local.ref,
    }) as Record<string, unknown>;

    if (!local.as) return <button {...triggerProps}>{local.children}</button>;
    return renderPolymorphic(local.as, "button", { ...triggerProps, children: local.children });
  }

  function PortalPart(props: MenuPortalProps) {
    const menu = useMenu("Portal");

    return (
      <Portal
        forceMount={props.forceMount}
        mount={props.mount}
        present={menu.shouldMount(props.forceMount)}
      >
        {props.children}
      </Portal>
    );
  }

  function Positioner(props: MenuPositionerProps) {
    const menu = useMenu("Positioner");
    const [local, others] = splitProps(props, ["children", "ref", "style"]);

    return (
      <div {...menu.getPositionerProps({ ...others, ref: local.ref, style: local.style })}>
        {local.children}
      </div>
    );
  }

  function Content(props: MenuContentProps) {
    const menu = useMenu("Content");
    const [local, others] = splitProps(props, [
      "children",
      "onEscapeKeyDown",
      "onFocusOutside",
      "onInteractOutside",
      "onKeyDown",
      "onMountAutoFocus",
      "onPointerDownOutside",
      "onUnmountAutoFocus",
      "ref",
      "style",
    ]);

    return (
      <div
        {...menu.getContentProps({
          ...others,
          onEscapeKeyDown: local.onEscapeKeyDown,
          onFocusOutside: local.onFocusOutside,
          onInteractOutside: local.onInteractOutside,
          onKeyDown: local.onKeyDown,
          onMountAutoFocus: local.onMountAutoFocus,
          onPointerDownOutside: local.onPointerDownOutside,
          onUnmountAutoFocus: local.onUnmountAutoFocus,
          ref: local.ref,
          style: local.style,
        })}
      >
        {local.children}
      </div>
    );
  }

  function Arrow(props: MenuArrowProps) {
    const menu = useMenu("Arrow");
    const [local, others] = splitProps(props, ["children", "ref", "style"]);
    const arrowProps = menu.getArrowProps({
      ...others,
      ref: local.ref,
      style: local.style,
    });

    return <span {...arrowProps}>{local.children}</span>;
  }

  function Group(props: MenuGroupProps) {
    const menu = useMenu("Group");
    const [local, others] = splitProps(props, ["children"]);
    return <div {...menu.getGroupProps(others)}>{local.children}</div>;
  }

  function GroupLabel(props: MenuGroupLabelProps) {
    const menu = useMenu("GroupLabel");
    const [local, others] = splitProps(props, ["children"]);
    return <div {...menu.getGroupLabelProps(others)}>{local.children}</div>;
  }

  function Separator(props: MenuSeparatorProps) {
    const menu = useMenu("Separator");
    const [local, others] = splitProps(props, ["children"]);
    return <div {...menu.getSeparatorProps(others)}>{local.children}</div>;
  }

  function Item(props: MenuItemProps) {
    const menu = useMenu("Item");
    const [local, others] = splitProps(props, [
      "children",
      "closeOnSelect",
      "description",
      "disabled",
      "label",
      "onClick",
      "onPointerMove",
      "onSelect",
      "textValue",
      "value",
    ]);
    const label = () => local.textValue ?? local.label ?? String(local.children ?? local.value);
    const itemContext = createMemo(
      () =>
        ({
          descriptionId: menu.itemId(local.value) + "-description",
          labelId: menu.itemId(local.value) + "-label",
        }) satisfies MenuItemContextValue,
    );

    return (
      <MenuItemContext.Provider value={itemContext()}>
        <div
          {...menu.getItemProps({
            ...others,
            closeOnSelect: local.closeOnSelect,
            description: local.description,
            disabled: local.disabled,
            label: label(),
            onClick: local.onClick,
            onPointerMove: local.onPointerMove,
            onSelect: local.onSelect,
            textValue: local.textValue,
            value: local.value,
          })}
        >
          {local.children}
        </div>
      </MenuItemContext.Provider>
    );
  }

  function Link(props: MenuLinkProps) {
    const menu = useMenu("Link");
    const [local, others] = splitProps(props, [
      "children",
      "closeOnSelect",
      "description",
      "disabled",
      "label",
      "onClick",
      "onPointerMove",
      "onSelect",
      "textValue",
      "value",
    ]);
    const label = () => local.textValue ?? local.label ?? String(local.children ?? local.value);
    const itemContext = createMemo(
      () =>
        ({
          descriptionId: menu.itemId(local.value) + "-description",
          labelId: menu.itemId(local.value) + "-label",
        }) satisfies MenuItemContextValue,
    );
    const linkProps = menu.getItemProps({
      ...(others as Record<string, unknown>),
      closeOnSelect: local.closeOnSelect,
      description: local.description,
      disabled: local.disabled,
      label: label(),
      onClick: local.onClick,
      onPointerMove: local.onPointerMove,
      onSelect: local.onSelect,
      textValue: local.textValue,
      value: local.value,
    } as Omit<MenuItemProps, "children" | "label"> & { label: string }) as Record<string, unknown>;

    return (
      <MenuItemContext.Provider value={itemContext()}>
        <a {...linkProps} data-scope={menu.scope} data-part="link">
          {local.children}
        </a>
      </MenuItemContext.Provider>
    );
  }

  function CheckboxItem(props: MenuCheckboxItemProps) {
    const menu = useMenu("CheckboxItem");
    const [local, others] = splitProps(props, [
      "checked",
      "children",
      "closeOnSelect",
      "defaultChecked",
      "description",
      "disabled",
      "label",
      "onCheckedChange",
      "onClick",
      "onPointerMove",
      "onSelect",
      "textValue",
      "value",
    ]);
    const [checked, setChecked] = createControllableSignal<boolean | "indeterminate">({
      value: () => local.checked,
      defaultValue: local.defaultChecked ?? false,
    });
    const label = () => local.textValue ?? local.label ?? String(local.children ?? local.value);
    const itemContext = createMemo(
      () =>
        ({
          descriptionId: menu.itemId(local.value) + "-description",
          labelId: menu.itemId(local.value) + "-label",
        }) satisfies MenuItemContextValue,
    );

    return (
      <MenuItemContext.Provider value={itemContext()}>
        <div
          {...menu.getItemProps({
            ...others,
            checked: checked(),
            closeOnSelect: local.closeOnSelect,
            description: local.description,
            disabled: local.disabled,
            label: label(),
            onClick: composeEventHandlers<MouseEvent>(local.onClick, (event) => {
              const detail: MenuSelectDetail = { event, reason: "item" };
              const next = checked() === true ? false : true;
              setChecked(next);
              local.onCheckedChange?.(next, detail);
            }),
            onPointerMove: local.onPointerMove,
            onSelect: local.onSelect,
            role: "menuitemcheckbox",
            textValue: local.textValue,
            type: "checkbox",
            value: local.value,
          })}
        >
          {local.children}
        </div>
      </MenuItemContext.Provider>
    );
  }

  function RadioGroup(props: MenuRadioGroupProps) {
    const [value, setValue] = createControllableBooleanBackedString({
      defaultValue: props.defaultValue,
      onChange: props.onValueChange,
      value: () => props.value,
    });
    const context = {
      isChecked: (candidate: string) => value() === candidate,
      setValue,
    } satisfies RadioGroupContextValue;

    return (
      <RadioGroupContext.Provider value={context}>{props.children}</RadioGroupContext.Provider>
    );
  }

  function RadioItem(props: MenuRadioItemProps) {
    const menu = useMenu("RadioItem");
    const group = useContext(RadioGroupContext);
    const [local, others] = splitProps(props, [
      "children",
      "closeOnSelect",
      "description",
      "disabled",
      "label",
      "onClick",
      "onPointerMove",
      "onSelect",
      "textValue",
      "value",
    ]);
    const checked = () => group?.isChecked(local.value) ?? false;
    const label = () => local.textValue ?? local.label ?? String(local.children ?? local.value);
    const itemContext = createMemo(
      () =>
        ({
          descriptionId: menu.itemId(local.value) + "-description",
          labelId: menu.itemId(local.value) + "-label",
        }) satisfies MenuItemContextValue,
    );

    return (
      <MenuItemContext.Provider value={itemContext()}>
        <div
          {...menu.getItemProps({
            ...others,
            checked: checked(),
            closeOnSelect: local.closeOnSelect,
            description: local.description,
            disabled: local.disabled,
            label: label(),
            onClick: composeEventHandlers<MouseEvent>(local.onClick, (event) => {
              group?.setValue(local.value, { event, reason: "item" });
            }),
            onPointerMove: local.onPointerMove,
            onSelect: local.onSelect,
            role: "menuitemradio",
            textValue: local.textValue,
            type: "radio",
            value: local.value,
          })}
        >
          {local.children}
        </div>
      </MenuItemContext.Provider>
    );
  }

  function ItemIndicator(props: MenuPartProps<HTMLSpanElement>) {
    const menu = useMenu("ItemIndicator");
    const [local, others] = splitProps(props, ["children"]);
    return <span {...menu.getItemIndicatorProps(others)}>{local.children}</span>;
  }

  function ItemLabel(props: MenuPartProps<HTMLSpanElement>) {
    const item = useContext(MenuItemContext);
    const menu = useMenu("ItemLabel");
    const [local, others] = splitProps(props, ["children"]);

    return (
      <span id={item?.labelId} {...others} data-scope={menu.scope} data-part="item-label">
        {local.children}
      </span>
    );
  }

  function ItemDescription(props: MenuPartProps<HTMLSpanElement>) {
    const item = useContext(MenuItemContext);
    const menu = useMenu("ItemDescription");
    const [local, others] = splitProps(props, ["children"]);

    return (
      <span
        id={item?.descriptionId}
        {...others}
        data-scope={menu.scope}
        data-part="item-description"
      >
        {local.children}
      </span>
    );
  }

  function SubRoot(props: MenuRootProps) {
    const parent = useMenu("SubRoot");
    const child = createScopedMenu(
      {
        arrowPadding: () => props.arrowPadding,
        closeOnSelect: () => props.closeOnSelect ?? parent.closeOnSelect(),
        collisionBoundary: () => props.collisionBoundary,
        collisionPadding: () => props.collisionPadding,
        defaultOpen: props.defaultOpen,
        fitViewport: () => props.fitViewport,
        gutter: () => props.gutter,
        modal: () => false,
        onOpenChange: props.onOpenChange,
        onOpenChangeComplete: props.onOpenChangeComplete,
        open: () => props.open,
        placement: () => props.placement ?? "right-start",
        rootBoundary: () => props.rootBoundary,
        sameWidth: () => props.sameWidth ?? false,
        scope: factoryOptions.scope,
        sticky: () => props.sticky,
        strategy: () => props.strategy,
      },
      "menu",
    );
    const unregister = parent.registerSubmenu({
      id: child.contentId,
      close: () => child.close(undefined, "programmatic"),
    });
    onCleanup(unregister);

    return (
      <SubmenuContext.Provider value={{ child, parent }}>
        <MenuContext.Provider value={child}>{props.children}</MenuContext.Provider>
      </SubmenuContext.Provider>
    );
  }

  function SubTrigger(props: MenuTriggerProps) {
    const submenu = useContext(SubmenuContext);

    if (!submenu) {
      return <Trigger {...props} />;
    }

    const [local, others] = splitProps(props, [
      "as",
      "children",
      "disabled",
      "onClick",
      "onKeyDown",
      "onPointerEnter",
      "onPointerLeave",
      "onPointerMove",
      "ref",
    ]);
    const value = submenu.child.contentId;
    const label = () => String(local.children ?? value);
    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    const clearCloseTimer = () => {
      if (closeTimer !== undefined) {
        clearTimeout(closeTimer);
        closeTimer = undefined;
      }
    };
    const scheduleClose = () => {
      clearCloseTimer();
      closeTimer = setTimeout(() => submenu.child.close(undefined, "programmatic"), 180);
    };
    onCleanup(clearCloseTimer);

    const triggerProps = submenu.parent.getItemProps({
      ...(others as Record<string, unknown>),
      closeOnSelect: false,
      disabled: local.disabled,
      label: label(),
      onClick: composeEventHandlers<MouseEvent>(local.onClick, (event) => {
        submenu.parent.closeSubmenus(submenu.child.contentId);
        submenu.child.setOpen(true, { event, reason: "trigger" });
      }),
      onKeyDown: composeEventHandlers<KeyboardEvent>(local.onKeyDown, (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          submenu.parent.closeSubmenus(submenu.child.contentId);
          submenu.child.setOpen(true, { event, reason: "keyboard" });
          scheduleMicrotask(() => {
            focusWithoutScrolling(
              submenu.child.contentElement() ?? submenu.child.triggerElement() ?? document.body,
            );
          });
        }
      }),
      onPointerEnter: composeEventHandlers<PointerEvent>(local.onPointerEnter, clearCloseTimer),
      onPointerLeave: composeEventHandlers<PointerEvent>(local.onPointerLeave, scheduleClose),
      onPointerMove: composeEventHandlers<PointerEvent>(local.onPointerMove, (event) => {
        submenu.parent.closeSubmenus(submenu.child.contentId);
        submenu.child.setOpen(true, { event, reason: "trigger" });
      }),
      ref: local.ref as HTMLDivElement | ((element: HTMLDivElement) => void) | undefined,
      role: "menuitem",
      value,
    } as Omit<MenuItemProps, "children" | "label"> & { label: string }) as Record<string, unknown>;
    const mergedProps = {
      ...triggerProps,
      "aria-controls": submenu.child.contentId,
      get "aria-expanded"() {
        return submenu.child.open();
      },
      "aria-haspopup": "menu" as const,
      "data-scope": submenu.parent.scope,
      "data-part": "sub-trigger",
    };

    if (!local.as) return <div {...mergedProps}>{local.children}</div>;
    return renderPolymorphic(local.as, "div", { ...mergedProps, children: local.children });
  }

  function SubContent(props: MenuContentProps) {
    const submenu = useContext(SubmenuContext);

    if (!submenu) {
      return <Content {...props} />;
    }

    return (
      <Content
        {...props}
        onKeyDown={composeEventHandlers<KeyboardEvent>(props.onKeyDown, (event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            submenu.child.close(event, "keyboard");
            submenu.child.focusTrigger();
          }
        })}
        onPointerEnter={composeEventHandlers<PointerEvent>(props.onPointerEnter, () => {
          submenu.parent.closeSubmenus(submenu.child.contentId);
        })}
      />
    );
  }

  return {
    Root,
    Trigger,
    Portal: PortalPart,
    Positioner,
    Arrow,
    Content,
    Group,
    GroupLabel,
    Separator,
    Item,
    Link,
    CheckboxItem,
    RadioGroup,
    RadioItem,
    ItemIndicator,
    ItemLabel,
    ItemDescription,
    SubRoot,
    SubTrigger,
    SubContent,
  };
}

function createControllableBooleanBackedString(options: {
  defaultValue?: string;
  onChange?: (value: string, detail: MenuSelectDetail) => void;
  value?: () => string | undefined;
}) {
  return createControllableSignal<string | undefined, MenuSelectDetail>({
    value: options.value,
    defaultValue: options.defaultValue,
    defaultDetail: { reason: "programmatic" },
    onChange: (next, detail) => {
      if (next !== undefined) {
        options.onChange?.(next, detail);
      }
    },
  });
}
