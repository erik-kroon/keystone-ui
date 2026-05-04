import { createMenuNamespace } from "./namespace";

export type {
  CreateMenuOptions,
  MenuApi,
  MenuArrowProps,
  MenuCheckboxItemProps,
  MenuContentProps,
  MenuGroupLabelProps,
  MenuGroupProps,
  MenuItemData,
  MenuItemProps,
  MenuLinkProps,
  MenuOpenChangeDetail,
  MenuPartProps,
  MenuPortalProps,
  MenuPositionerProps,
  MenuRadioGroupProps,
  MenuRadioItemProps,
  MenuRootProps,
  MenuSelectDetail,
  MenuSeparatorProps,
  MenuTriggerProps,
} from "./types";
export {
  createContextMenu,
  createDropdownMenu,
  createMenu,
  createMenubar,
  createNavigationMenu,
} from "./interaction";

export const Menu = createMenuNamespace({ scope: "menu" });
export const DropdownMenu = createMenuNamespace({ scope: "dropdown-menu" });
export const ContextMenu = createMenuNamespace({ scope: "context-menu" });
export const Menubar = createMenuNamespace({ rootRole: "menubar", scope: "menubar" });
export const NavigationMenu = createMenuNamespace({
  rootRole: "menubar",
  scope: "navigation-menu",
});
