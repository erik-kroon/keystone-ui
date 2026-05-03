import {
  Show,
  createContext,
  createMemo,
  createSignal,
  splitProps,
  useContext,
  type JSX,
} from "solid-js";
import { Portal } from "solid-js/web";
import type { CollectionItem } from "../listbox/collection-registry";
import { createListInteractionKernel } from "../listbox/interaction-kernel";
import {
  OverlayLayerProvider,
  type FloatingAdapter,
  type FloatingCollisionBoundary,
  type FloatingPlacement,
  type FloatingRootBoundary,
  type FloatingSticky,
  type FloatingStrategy,
  type OverlayLayerOutsideEvent,
  type OverlayPresenceCompleteDetail,
} from "../overlay/index";
import { createOverlayController } from "../overlay/controller";
import {
  composeEventHandlers,
  createControllableBooleanSignal,
  dataBoolean,
  renderPolymorphic,
  type PolymorphicProps,
} from "../utils/index";

export type MenuOpenChangeDetail = {
  event?: Event;
  reason: "trigger" | "keyboard" | "item" | "escape" | "outside" | "programmatic";
};

export type MenuSelectDetail = {
  event?: Event;
  reason: "item" | "keyboard" | "programmatic";
};

export type MenuItemData = CollectionItem & {
  checked?: boolean;
  type: "item" | "checkbox" | "radio";
};

export type MenuRootProps = {
  children?: JSX.Element;
  arrowPadding?: number;
  collisionBoundary?: FloatingCollisionBoundary;
  collisionPadding?: number;
  defaultOpen?: boolean;
  fitViewport?: boolean;
  gutter?: number;
  modal?: boolean;
  onOpenChange?: (open: boolean, detail: MenuOpenChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open?: boolean;
  placement?: FloatingPlacement;
  rootBoundary?: FloatingRootBoundary;
  sameWidth?: boolean;
  sticky?: FloatingSticky;
  strategy?: FloatingStrategy;
};

export type MenuPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type MenuTriggerProps = MenuPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type MenuPortalProps = {
  children?: JSX.Element;
  forceMount?: boolean;
  mount?: Node;
};
export type MenuPositionerProps = MenuPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type MenuContentProps = MenuPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onFocusOutside?: (event: OverlayLayerOutsideEvent) => void;
    onInteractOutside?: (event: OverlayLayerOutsideEvent) => void;
    onPointerDownOutside?: (event: OverlayLayerOutsideEvent) => void;
  };
export type MenuGroupProps = MenuPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type MenuGroupLabelProps = MenuPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type MenuSeparatorProps = MenuPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type MenuItemProps = MenuPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref" | "onSelect" | "role"> & {
    disabled?: boolean;
    label?: string;
    onSelect?: (detail: MenuSelectDetail) => void;
    value: string;
  };
export type MenuCheckboxItemProps = MenuItemProps & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, detail: MenuSelectDetail) => void;
};
export type MenuRadioGroupProps = {
  children?: JSX.Element;
  defaultValue?: string;
  onValueChange?: (value: string, detail: MenuSelectDetail) => void;
  value?: string;
};
export type MenuRadioItemProps = MenuItemProps;

export type CreateMenuOptions = {
  arrowPadding?: () => number | undefined;
  collisionBoundary?: () => FloatingCollisionBoundary | undefined;
  collisionPadding?: () => number | undefined;
  defaultOpen?: boolean;
  fitViewport?: () => boolean | undefined;
  gutter?: () => number | undefined;
  modal?: () => boolean | undefined;
  onOpenChange?: (open: boolean, detail: MenuOpenChangeDetail) => void;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open?: () => boolean | undefined;
  placement?: () => FloatingPlacement | undefined;
  rootBoundary?: () => FloatingRootBoundary | undefined;
  sameWidth?: () => boolean | undefined;
  scope?: string;
  sticky?: () => FloatingSticky | undefined;
  strategy?: () => FloatingStrategy | undefined;
};

export type MenuApi = {
  close: (event: Event | undefined, reason: MenuOpenChangeDetail["reason"]) => void;
  contentId: string;
  floating: FloatingAdapter;
  getContentProps: (props: Omit<MenuContentProps, "children">) => Record<string, unknown>;
  getGroupLabelProps: (props: Omit<MenuGroupLabelProps, "children">) => Record<string, unknown>;
  getGroupProps: (props: Omit<MenuGroupProps, "children">) => Record<string, unknown>;
  getItemIndicatorProps: (
    props: Omit<MenuPartProps<HTMLSpanElement>, "children">,
  ) => Record<string, unknown>;
  getItemProps: (
    props: Omit<MenuItemProps, "children" | "label"> & {
      checked?: boolean;
      label: string;
      role?: "menuitem" | "menuitemcheckbox" | "menuitemradio";
      type?: MenuItemData["type"];
    },
  ) => Record<string, unknown>;
  getPositionerProps: (props: Omit<MenuPositionerProps, "children">) => Record<string, unknown>;
  getSeparatorProps: (props: Omit<MenuSeparatorProps, "children">) => Record<string, unknown>;
  getTriggerProps: (props: Omit<MenuTriggerProps, "as" | "children">) => Record<string, unknown>;
  highlightedValue: () => string | undefined;
  itemId: (value: string) => string;
  open: () => boolean;
  rootRole: () => "menu" | "menubar";
  scope: string;
  shouldMount: (forceMount?: boolean) => boolean;
};

type MenuFactoryOptions = {
  rootRole?: "menu" | "menubar";
  scope: string;
};

type MenuContextValue = MenuApi;

type RadioGroupContextValue = {
  isChecked: (value: string) => boolean;
  setValue: (value: string, detail: MenuSelectDetail) => void;
};

const MenuContext = createContext<MenuContextValue>();
const RadioGroupContext = createContext<RadioGroupContextValue>();

export function createMenu(options: CreateMenuOptions = {}): MenuApi {
  return createScopedMenu({ ...options, scope: options.scope ?? "menu" }, "menu");
}

export function createDropdownMenu(options: CreateMenuOptions = {}): MenuApi {
  return createScopedMenu({ ...options, scope: options.scope ?? "dropdown-menu" }, "menu");
}

export function createContextMenu(options: CreateMenuOptions = {}): MenuApi {
  return createScopedMenu({ ...options, scope: options.scope ?? "context-menu" }, "menu");
}

export function createMenubar(options: CreateMenuOptions = {}): MenuApi {
  return createScopedMenu({ ...options, scope: options.scope ?? "menubar" }, "menubar");
}

function createScopedMenu(options: CreateMenuOptions, rootRole: "menu" | "menubar"): MenuApi {
  const scope = options.scope ?? "menu";
  const overlay = createOverlayController<MenuOpenChangeDetail["reason"]>({
    scope,
    defaultOpen: options.defaultOpen,
    modal: () => options.modal?.() ?? false,
    onOpenChange: (open, detail) => options.onOpenChange?.(open, detail),
    onOpenChangeComplete: options.onOpenChangeComplete,
    open: options.open,
    floating: {
      arrowPadding: options.arrowPadding,
      collisionBoundary: options.collisionBoundary,
      collisionPadding: options.collisionPadding,
      fitViewport: () => options.fitViewport?.() ?? true,
      gutter: options.gutter,
      placement: options.placement,
      rootBoundary: options.rootBoundary,
      sameWidth: options.sameWidth,
      sticky: options.sticky,
      strategy: options.strategy,
    },
  });
  const floating = overlay.floating as FloatingAdapter;
  const itemId = (value: string) => `${overlay.contentId}-${value}`;
  const list = createListInteractionKernel<MenuItemData, MenuSelectDetail>({
    loop: true,
    onValueSelect: (item, detail) => {
      if (item.type === "item") {
        overlay.close(detail.event, detail.reason === "keyboard" ? "keyboard" : "item");
      }
    },
    programmaticDetail: { reason: "programmatic" },
    selectionMode: "single",
    selectionBehavior: "replace",
  });
  const activeDescendantId = createMemo(() => {
    const highlighted = list.highlightedValue();
    return highlighted ? itemId(highlighted) : undefined;
  });
  const partProps = (part: string) => overlay.getPartProps(part);
  const floatingPartProps = (part: string) => ({
    ...partProps(part),
    get "data-side"() {
      return floating.side();
    },
    get "data-align"() {
      return floating.align();
    },
  });

  return {
    close: overlay.close,
    contentId: overlay.contentId,
    floating,
    getContentProps: (props) => {
      const [local, others] = splitProps(props, [
        "onEscapeKeyDown",
        "onFocusOutside",
        "onInteractOutside",
        "onKeyDown",
        "onPointerDownOutside",
        "ref",
        "style",
      ]);
      const layerProps = overlay.getContentLayerProps<HTMLDivElement>(
        {
          onEscapeKeyDown: local.onEscapeKeyDown,
          onFocusOutside: local.onFocusOutside,
          onInteractOutside: local.onInteractOutside,
          onPointerDownOutside: local.onPointerDownOutside,
        },
        {
          containsTrigger: true,
          modal: overlay.modal,
          disableOutsidePointerEvents: overlay.modal,
          dismissReason: (event) => (event.type === "keydown" ? "escape" : "outside"),
        },
      );
      const floatingProps = overlay.getFloatingContentProps<HTMLDivElement>({
        ref: local.ref,
        style: local.style,
      });

      return {
        ...others,
        ...layerProps,
        ...floatingProps,
        id: overlay.contentId,
        role: rootRole,
        tabindex: -1,
        get "aria-activedescendant"() {
          return activeDescendantId();
        },
        ...floatingPartProps("content"),
        onKeyDown: composeEventHandlers<KeyboardEvent>(local.onKeyDown, (event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            overlay.close(event, "escape");
            return;
          }

          list.handleKeyDown(event, {
            selectDetail: (keyboardEvent) => ({
              event: keyboardEvent,
              reason: "keyboard",
            }),
          });
        }),
      };
    },
    getGroupLabelProps: (props) => ({
      ...props,
      ...partProps("group-label"),
    }),
    getGroupProps: (props) => ({
      ...props,
      role: "group",
      ...partProps("group"),
    }),
    getItemIndicatorProps: (props) => ({
      ...props,
      ...partProps("item-indicator"),
    }),
    getItemProps: (props) => {
      const [local, others] = splitProps(props, [
        "checked",
        "disabled",
        "label",
        "onClick",
        "onPointerMove",
        "onSelect",
        "role",
        "type",
        "value",
      ]);
      list.registerItem({
        checked: local.checked,
        disabled: local.disabled,
        label: local.label,
        type: local.type ?? "item",
        value: local.value,
      });

      return {
        ...others,
        id: itemId(local.value),
        role: local.role ?? "menuitem",
        "aria-disabled": local.disabled ? "true" : undefined,
        "aria-checked":
          local.role === "menuitemcheckbox" || local.role === "menuitemradio"
            ? Boolean(local.checked)
            : undefined,
        ...partProps("item"),
        "data-disabled": dataBoolean(local.disabled),
        get "data-highlighted"() {
          return dataBoolean(list.isHighlighted(local.value));
        },
        get "data-checked"() {
          return dataBoolean(local.checked);
        },
        "data-value": local.value,
        onPointerMove: composeEventHandlers<PointerEvent>(local.onPointerMove, () => {
          if (!local.disabled) {
            list.setHighlightedValue(local.value);
          }
        }),
        onClick: composeEventHandlers<MouseEvent>(local.onClick, (event) => {
          if (local.disabled) {
            event.preventDefault();
            return;
          }

          const detail: MenuSelectDetail = { event, reason: "item" };
          local.onSelect?.(detail);
          list.selectValue(local.value, detail);

          if (local.role === "menuitem") {
            overlay.close(event, "item");
          }
        }),
      };
    },
    getPositionerProps: (props) => ({
      ...overlay.getFloatingPositionerProps<HTMLDivElement>(props),
      ...floatingPartProps("positioner"),
    }),
    getSeparatorProps: (props) => ({
      ...props,
      role: "separator",
      ...partProps("separator"),
    }),
    getTriggerProps: (props) =>
      overlay.getTriggerProps(
        scope === "context-menu"
          ? {
              ...props,
              onContextMenu: composeEventHandlers<MouseEvent>(props.onContextMenu, (event) => {
                event.preventDefault();
                overlay.setOpen(true, { event, reason: "trigger" });
              }),
            }
          : props,
        {
          action: "toggle",
          ariaHasPopup: "menu",
          reason: "trigger",
        },
      ) as Record<string, unknown>,
    highlightedValue: list.highlightedValue,
    itemId,
    open: overlay.open,
    rootRole: () => rootRole,
    scope,
    shouldMount: overlay.shouldMount,
  };
}

function useMenu(part: string) {
  const menu = useContext(MenuContext);
  if (!menu) throw new Error(`Menu.${part} must be used within Menu.Root`);
  return menu;
}

function createMenuNamespace(factoryOptions: MenuFactoryOptions) {
  function Root(props: MenuRootProps) {
    const menu = createScopedMenu(
      {
        arrowPadding: () => props.arrowPadding,
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
      <Show when={menu.shouldMount(props.forceMount)}>
        <Portal mount={props.mount}>{props.children}</Portal>
      </Show>
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
      "onPointerDownOutside",
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
          onPointerDownOutside: local.onPointerDownOutside,
          ref: local.ref,
          style: local.style,
        })}
      >
        {local.children}
      </div>
    );
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
      "disabled",
      "label",
      "onClick",
      "onPointerMove",
      "onSelect",
      "value",
    ]);
    const label = () => local.label ?? String(local.children ?? local.value);

    return (
      <div
        {...menu.getItemProps({
          ...others,
          disabled: local.disabled,
          label: label(),
          onClick: local.onClick,
          onPointerMove: local.onPointerMove,
          onSelect: local.onSelect,
          value: local.value,
        })}
      >
        {local.children}
      </div>
    );
  }

  function CheckboxItem(props: MenuCheckboxItemProps) {
    const menu = useMenu("CheckboxItem");
    const [local, others] = splitProps(props, [
      "checked",
      "children",
      "defaultChecked",
      "disabled",
      "label",
      "onCheckedChange",
      "onClick",
      "onPointerMove",
      "onSelect",
      "value",
    ]);
    const [checked, setChecked] = createControllableBooleanSignal({
      value: () => local.checked,
      defaultValue: local.defaultChecked ?? false,
    });
    const label = () => local.label ?? String(local.children ?? local.value);

    return (
      <div
        {...menu.getItemProps({
          ...others,
          checked: checked(),
          disabled: local.disabled,
          label: label(),
          onClick: composeEventHandlers<MouseEvent>(local.onClick, (event) => {
            const detail: MenuSelectDetail = { event, reason: "item" };
            const next = !checked();
            setChecked(next);
            local.onCheckedChange?.(next, detail);
          }),
          onPointerMove: local.onPointerMove,
          onSelect: local.onSelect,
          role: "menuitemcheckbox",
          type: "checkbox",
          value: local.value,
        })}
      >
        {local.children}
      </div>
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
      "disabled",
      "label",
      "onClick",
      "onPointerMove",
      "onSelect",
      "value",
    ]);
    const checked = () => group?.isChecked(local.value) ?? false;
    const label = () => local.label ?? String(local.children ?? local.value);

    return (
      <div
        {...menu.getItemProps({
          ...others,
          checked: checked(),
          disabled: local.disabled,
          label: label(),
          onClick: composeEventHandlers<MouseEvent>(local.onClick, (event) => {
            group?.setValue(local.value, { event, reason: "item" });
          }),
          onPointerMove: local.onPointerMove,
          onSelect: local.onSelect,
          role: "menuitemradio",
          type: "radio",
          value: local.value,
        })}
      >
        {local.children}
      </div>
    );
  }

  function ItemIndicator(props: MenuPartProps<HTMLSpanElement>) {
    const menu = useMenu("ItemIndicator");
    const [local, others] = splitProps(props, ["children"]);
    return <span {...menu.getItemIndicatorProps(others)}>{local.children}</span>;
  }

  function SubRoot(props: MenuRootProps) {
    return <Root {...props} />;
  }

  function SubTrigger(props: MenuTriggerProps) {
    return <Trigger {...props} />;
  }

  function SubContent(props: MenuContentProps) {
    return <Content {...props} />;
  }

  return {
    Root,
    Trigger,
    Portal: PortalPart,
    Positioner,
    Content,
    Group,
    GroupLabel,
    Separator,
    Item,
    CheckboxItem,
    RadioGroup,
    RadioItem,
    ItemIndicator,
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
  const [uncontrolled, setUncontrolled] = createSignal(options.defaultValue);
  const value = createMemo(() => options.value?.() ?? uncontrolled());
  const setValue = (next: string, detail: MenuSelectDetail) => {
    if (options.value?.() === undefined) {
      setUncontrolled(next);
    }
    options.onChange?.(next, detail);
  };

  return [value, setValue] as const;
}

export const Menu = createMenuNamespace({ scope: "menu" });
export const DropdownMenu = createMenuNamespace({ scope: "dropdown-menu" });
export const ContextMenu = createMenuNamespace({ scope: "context-menu" });
export const Menubar = createMenuNamespace({ rootRole: "menubar", scope: "menubar" });
