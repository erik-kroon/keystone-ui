import { createContext, createMemo, onCleanup, splitProps, useContext, type JSX } from "solid-js";
import { focusWithoutScrolling } from "../overlay/dom";
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
import { Portal } from "../portal/index";
import {
  composeEventHandlers,
  createControllableSignal,
  dataBoolean,
  renderPolymorphic,
  scheduleMicrotask,
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
  checked?: boolean | "indeterminate";
  closeOnSelect?: boolean;
  type: "item" | "checkbox" | "radio";
};

export type MenuRootProps = {
  children?: JSX.Element;
  arrowPadding?: number;
  closeOnSelect?: boolean;
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
    onMountAutoFocus?: (event: Event) => void;
    onPointerDownOutside?: (event: OverlayLayerOutsideEvent) => void;
    onUnmountAutoFocus?: (event: Event) => void;
  };
export type MenuGroupProps = MenuPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type MenuGroupLabelProps = MenuPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type MenuSeparatorProps = MenuPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type MenuItemProps = MenuPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref" | "onSelect" | "role"> & {
    closeOnSelect?: boolean;
    description?: string;
    disabled?: boolean;
    label?: string;
    onSelect?: (detail: MenuSelectDetail) => void;
    textValue?: string;
    value: string;
  };
export type MenuLinkProps = MenuPartProps<HTMLAnchorElement> &
  Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "ref" | "onSelect" | "role"> & {
    closeOnSelect?: boolean;
    description?: string;
    disabled?: boolean;
    label?: string;
    onSelect?: (detail: MenuSelectDetail) => void;
    textValue?: string;
    value: string;
  };
export type MenuCheckboxItemProps = MenuItemProps & {
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean | "indeterminate";
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
  closeOnSelect?: () => boolean | undefined;
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
  closeOnSelect: () => boolean;
  closeSubmenus: (except?: string) => void;
  contentId: string;
  contentElement: () => HTMLElement | undefined;
  focusTrigger: () => void;
  floating: FloatingAdapter;
  getContentProps: (props: Omit<MenuContentProps, "children">) => Record<string, unknown>;
  getGroupLabelProps: (props: Omit<MenuGroupLabelProps, "children">) => Record<string, unknown>;
  getGroupProps: (props: Omit<MenuGroupProps, "children">) => Record<string, unknown>;
  getItemIndicatorProps: (
    props: Omit<MenuPartProps<HTMLSpanElement>, "children">,
  ) => Record<string, unknown>;
  getItemProps: (
    props: Omit<MenuItemProps, "children" | "label"> & {
      checked?: boolean | "indeterminate";
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
  registerSubmenu: (submenu: SubmenuRegistration) => () => void;
  scope: string;
  setOpen: (open: boolean, detail: MenuOpenChangeDetail) => void;
  setVirtualAnchor: (
    anchor: { contextElement?: Element; getBoundingClientRect: () => DOMRect } | undefined,
  ) => void;
  shouldMount: (forceMount?: boolean) => boolean;
  triggerElement: () => HTMLElement | undefined;
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

type SubmenuRegistration = {
  close: () => void;
  id: string;
};

type SubmenuContextValue = {
  child: MenuApi;
  parent: MenuApi;
};

type MenuItemContextValue = {
  descriptionId: string;
  labelId: string;
};

const MenuContext = createContext<MenuContextValue>();
const RadioGroupContext = createContext<RadioGroupContextValue>();
const SubmenuContext = createContext<SubmenuContextValue>();
const MenuItemContext = createContext<MenuItemContextValue>();

const contextMenuLongPressStart = { x: 0, y: 0 };
let contextMenuLongPressTimeout: ReturnType<typeof setTimeout> | undefined;

function createPointAnchor(x: number, y: number, contextElement?: Element) {
  return {
    contextElement,
    getBoundingClientRect: () =>
      ({
        bottom: y,
        height: 0,
        left: x,
        right: x,
        top: y,
        width: 0,
        x,
        y,
        toJSON: () => undefined,
      }) as DOMRect,
  };
}

function clearContextMenuLongPress() {
  if (contextMenuLongPressTimeout !== undefined) {
    clearTimeout(contextMenuLongPressTimeout);
    contextMenuLongPressTimeout = undefined;
  }
}

function scheduleContextMenuLongPress(
  event: PointerEvent,
  menu: Pick<MenuApi, "setOpen" | "setVirtualAnchor">,
) {
  clearContextMenuLongPress();
  contextMenuLongPressStart.x = event.clientX;
  contextMenuLongPressStart.y = event.clientY;
  const target = event.currentTarget as Element | null;

  contextMenuLongPressTimeout = setTimeout(() => {
    menu.setVirtualAnchor(createPointAnchor(event.clientX, event.clientY, target ?? undefined));
    menu.setOpen(true, { event, reason: "trigger" });
  }, 700);
}

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

export function createNavigationMenu(options: CreateMenuOptions = {}): MenuApi {
  return createScopedMenu({ ...options, scope: options.scope ?? "navigation-menu" }, "menubar");
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
  const itemLabelId = (value: string) => `${itemId(value)}-label`;
  const itemDescriptionId = (value: string) => `${itemId(value)}-description`;
  const closeOnSelect = () => options.closeOnSelect?.() ?? true;
  const submenuRegistrations = new Map<string, SubmenuRegistration>();
  const list = createListInteractionKernel<MenuItemData, MenuSelectDetail>({
    loop: true,
    onValueSelect: (item, detail) => {
      const shouldClose = item.closeOnSelect ?? (item.type === "item" ? closeOnSelect() : false);

      if (shouldClose) {
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
    closeOnSelect,
    closeSubmenus: (except) => {
      for (const submenu of submenuRegistrations.values()) {
        if (submenu.id !== except) {
          submenu.close();
        }
      }
    },
    contentElement: overlay.contentElement,
    contentId: overlay.contentId,
    focusTrigger: () => {
      const trigger = overlay.triggerElement();
      if (trigger) {
        focusWithoutScrolling(trigger);
      }
    },
    floating,
    getContentProps: (props) => {
      const [local, others] = splitProps(props, [
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
      const layerProps = overlay.getContentLayerProps<HTMLDivElement>(
        {
          onEscapeKeyDown: local.onEscapeKeyDown,
          onFocusOutside: local.onFocusOutside,
          onInteractOutside: local.onInteractOutside,
          onMountAutoFocus: local.onMountAutoFocus,
          onPointerDownOutside: local.onPointerDownOutside,
          onUnmountAutoFocus: local.onUnmountAutoFocus,
        },
        {
          containsTrigger: true,
          modal: overlay.modal,
          disableOutsidePointerEvents: overlay.modal,
          restoreFocus: () => true,
          trapFocus: overlay.modal,
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
            scheduleMicrotask(() => {
              if (!overlay.open()) {
                return;
              }

              const trigger = overlay.triggerElement();
              if (trigger) {
                focusWithoutScrolling(trigger);
              }
            });
            return;
          }

          if (event.key === "Tab") {
            event.preventDefault();
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
        "closeOnSelect",
        "description",
        "disabled",
        "label",
        "onClick",
        "onPointerMove",
        "onSelect",
        "role",
        "textValue",
        "type",
        "value",
      ]);
      const isCheckedItem = local.role === "menuitemcheckbox" || local.role === "menuitemradio";
      const checked = local.checked === "indeterminate" ? "mixed" : Boolean(local.checked);
      const itemRole = local.role ?? "menuitem";
      const itemCloseOnSelect =
        local.closeOnSelect ?? (itemRole === "menuitem" ? closeOnSelect() : false);
      list.registerItem({
        checked: local.checked,
        closeOnSelect: itemCloseOnSelect,
        disabled: local.disabled,
        label: local.textValue ?? local.label,
        type: local.type ?? "item",
        value: local.value,
      });

      return {
        ...others,
        id: itemId(local.value),
        role: itemRole,
        "aria-disabled": local.disabled ? "true" : undefined,
        "aria-checked": isCheckedItem ? checked : undefined,
        "aria-labelledby": itemLabelId(local.value),
        "aria-describedby": local.description ? itemDescriptionId(local.value) : undefined,
        ...partProps("item"),
        "data-disabled": dataBoolean(local.disabled),
        get "data-highlighted"() {
          return dataBoolean(list.isHighlighted(local.value));
        },
        get "data-checked"() {
          return dataBoolean(local.checked === true);
        },
        get "data-indeterminate"() {
          return dataBoolean(local.checked === "indeterminate");
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

          if (itemCloseOnSelect) {
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
                overlay.setVirtualAnchor(
                  createPointAnchor(event.clientX, event.clientY, event.currentTarget as Element),
                );
                overlay.setOpen(true, { event, reason: "trigger" });
              }),
              onPointerCancel: composeEventHandlers<PointerEvent>(props.onPointerCancel, () => {
                clearContextMenuLongPress();
              }),
              onPointerDown: composeEventHandlers<PointerEvent>(props.onPointerDown, (event) => {
                if (event.pointerType !== "touch" && event.pointerType !== "pen") {
                  return;
                }

                scheduleContextMenuLongPress(event, overlay);
              }),
              onPointerMove: composeEventHandlers<PointerEvent>(props.onPointerMove, (event) => {
                if (
                  Math.abs(event.clientX - contextMenuLongPressStart.x) > 8 ||
                  Math.abs(event.clientY - contextMenuLongPressStart.y) > 8
                ) {
                  clearContextMenuLongPress();
                }
              }),
              onPointerUp: composeEventHandlers<PointerEvent>(props.onPointerUp, () => {
                clearContextMenuLongPress();
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
    registerSubmenu: (submenu) => {
      submenuRegistrations.set(submenu.id, submenu);

      return () => {
        submenuRegistrations.delete(submenu.id);
      };
    },
    rootRole: () => rootRole,
    scope,
    setOpen: overlay.setOpen,
    setVirtualAnchor: overlay.setVirtualAnchor,
    shouldMount: overlay.shouldMount,
    triggerElement: overlay.triggerElement,
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

export const Menu = createMenuNamespace({ scope: "menu" });
export const DropdownMenu = createMenuNamespace({ scope: "dropdown-menu" });
export const ContextMenu = createMenuNamespace({ scope: "context-menu" });
export const Menubar = createMenuNamespace({ rootRole: "menubar", scope: "menubar" });
export const NavigationMenu = createMenuNamespace({
  rootRole: "menubar",
  scope: "navigation-menu",
});
