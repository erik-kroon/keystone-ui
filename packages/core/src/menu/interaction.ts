import { createMemo, splitProps } from "solid-js";
import { createListInteractionKernel } from "../collection/interaction-kernel";
import { focusWithoutScrolling } from "../overlay/dom";
import { createOverlayController } from "../overlay/controller";
import { getFloatingArrowProps, type FloatingAdapter } from "../overlay/index";
import { composeEventHandlers, dataBoolean, scheduleMicrotask } from "../utils/index";
import { getContextMenuTriggerProps } from "./context-menu-adapter";
import type {
  CreateMenuOptions,
  MenuApi,
  MenuItemData,
  MenuOpenChangeDetail,
  MenuSelectDetail,
} from "./types";

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

export function createScopedMenu(
  options: CreateMenuOptions,
  rootRole: "menu" | "menubar",
): MenuApi {
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
  const submenuRegistrations = new Map<string, Parameters<MenuApi["registerSubmenu"]>[0]>();
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
    getArrowProps: (props) => getFloatingArrowProps(floating, props, floatingPartProps("arrow")),
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
        get hidden() {
          return overlay.hidden();
        },
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

          if (rootRole === "menubar" && event.key === "ArrowRight") {
            event.preventDefault();
            list.highlight("next");
            return;
          }

          if (rootRole === "menubar" && event.key === "ArrowLeft") {
            event.preventDefault();
            list.highlight("previous");
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
        "hidden",
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
        hidden: Boolean(local.hidden),
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
        hidden: local.hidden,
        ...partProps("item"),
        "data-disabled": dataBoolean(local.disabled),
        "data-hidden": dataBoolean(Boolean(local.hidden)),
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
          if (!local.disabled && !local.hidden) {
            list.setHighlightedValue(local.value);
          }
        }),
        onClick: composeEventHandlers<MouseEvent>(local.onClick, (event) => {
          if (local.disabled || Boolean(local.hidden)) {
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
      get hidden() {
        return overlay.hidden();
      },
      ...floatingPartProps("positioner"),
    }),
    getSeparatorProps: (props) => ({
      ...props,
      role: "separator",
      ...partProps("separator"),
    }),
    getTriggerProps: (props) =>
      overlay.getTriggerProps(
        scope === "context-menu" ? getContextMenuTriggerProps(props, overlay) : props,
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
