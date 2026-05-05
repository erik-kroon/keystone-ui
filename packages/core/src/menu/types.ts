import type { JSX } from "solid-js";
import type { CollectionItem } from "../collection/collection-registry";
import type {
  FloatingAdapter,
  FloatingArrowProps,
  FloatingCollisionBoundary,
  FloatingPlacement,
  FloatingRootBoundary,
  FloatingSticky,
  FloatingStrategy,
  OverlayLayerOutsideEvent,
  OverlayPresenceCompleteDetail,
} from "../overlay/index";
import type { PolymorphicProps } from "../utils/index";

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
export type MenuArrowProps = FloatingArrowProps<HTMLSpanElement>;
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

export type SubmenuRegistration = {
  close: () => void;
  id: string;
};

export type MenuApi = {
  close: (event: Event | undefined, reason: MenuOpenChangeDetail["reason"]) => void;
  closeOnSelect: () => boolean;
  closeSubmenus: (except?: string) => void;
  contentId: string;
  contentElement: () => HTMLElement | undefined;
  focusTrigger: () => void;
  floating: FloatingAdapter;
  getArrowProps: (props: Omit<MenuArrowProps, "children">) => Record<string, unknown>;
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

export type MenuFactoryOptions = {
  rootRole?: "menu" | "menubar";
  scope: string;
};

export type RadioGroupContextValue = {
  isChecked: (value: string) => boolean;
  setValue: (value: string, detail: MenuSelectDetail) => void;
};

export type SubmenuContextValue = {
  child: MenuApi;
  clearCloseTimer: () => void;
  parent: MenuApi;
  scheduleClose: () => void;
};

export type MenuItemContextValue = {
  descriptionId: string;
  labelId: string;
};
