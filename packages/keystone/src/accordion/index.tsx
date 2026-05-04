import {
  Show,
  createContext,
  createMemo,
  createUniqueId,
  onCleanup,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import { createDisclosureController, type DisclosureChangeDetail } from "../disclosure/controller";
import {
  createControllableSignal,
  callEventHandler,
  dataBoolean,
  partDataAttributes,
  renderPolymorphic,
  type PolymorphicProps,
} from "../utils/index";

export type AccordionValue = string[];
export type AccordionOrientation = "horizontal" | "vertical";
export type AccordionValueChangeDetail = DisclosureChangeDetail<
  "trigger" | "programmatic" | "browser-find"
>;

export type AccordionRootProps = AccordionPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    children?: JSX.Element;
    defaultValue?: AccordionValue;
    disabled?: boolean;
    loopFocus?: boolean;
    multiple?: boolean;
    onValueChange?: (value: AccordionValue, detail: AccordionValueChangeDetail) => void;
    orientation?: AccordionOrientation;
    value?: AccordionValue;
  };

export type AccordionPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type AccordionItemProps = AccordionPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    disabled?: boolean;
    value: string;
  };
export type AccordionHeaderProps = AccordionPartProps<HTMLHeadingElement> &
  Omit<JSX.HTMLAttributes<HTMLHeadingElement>, "children" | "ref">;
export type AccordionTriggerProps = AccordionPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type AccordionContentProps = AccordionPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    forceMount?: boolean;
    hiddenUntilFound?: boolean;
  };

type TriggerRecord = {
  disabled: Accessor<boolean>;
  element: HTMLButtonElement;
};

type AccordionApi = {
  disabled: () => boolean;
  loopFocus: () => boolean;
  multiple: () => boolean;
  openValue: (value: string) => boolean;
  orientation: () => AccordionOrientation;
  registerTrigger: (element: HTMLButtonElement, disabled: Accessor<boolean>) => () => void;
  setItemOpen: (value: string, open: boolean, detail: AccordionValueChangeDetail) => AccordionValue;
  triggers: () => TriggerRecord[];
  value: () => AccordionValue;
};

type AccordionItemApi = {
  contentId: string;
  disabled: () => boolean;
  getContentProps: (
    props: Omit<AccordionContentProps, "children" | "forceMount">,
  ) => Record<string, unknown>;
  getTriggerProps: (
    props: Omit<AccordionTriggerProps, "as" | "children">,
  ) => Record<string, unknown>;
  headerId: string;
  open: () => boolean;
  setTriggerElement: (element: HTMLButtonElement) => void;
  triggerId: string;
  value: string;
};

const AccordionContext = createContext<AccordionApi>();
const AccordionItemContext = createContext<AccordionItemApi>();

export function createAccordion(
  options: {
    defaultValue?: AccordionValue;
    disabled?: () => boolean | undefined;
    loopFocus?: () => boolean | undefined;
    multiple?: () => boolean | undefined;
    onValueChange?: (value: AccordionValue, detail: AccordionValueChangeDetail) => void;
    orientation?: () => AccordionOrientation | undefined;
    value?: () => AccordionValue | undefined;
  } = {},
): AccordionApi {
  const [value, setValueState] = createControllableSignal<
    AccordionValue,
    AccordionValueChangeDetail
  >({
    value: options.value,
    defaultValue: options.defaultValue ?? [],
    defaultDetail: { reason: "programmatic" },
    onChange: options.onValueChange,
  });
  const disabled = createMemo(() => options.disabled?.() ?? false);
  const loopFocus = createMemo(() => options.loopFocus?.() ?? true);
  const multiple = createMemo(() => options.multiple?.() ?? false);
  const orientation = createMemo(() => options.orientation?.() ?? "vertical");
  const triggerRecords: TriggerRecord[] = [];

  return {
    disabled,
    loopFocus,
    multiple,
    openValue: (itemValue) => value().includes(itemValue),
    orientation,
    registerTrigger: (element, triggerDisabled) => {
      const record = { disabled: triggerDisabled, element };
      triggerRecords.push(record);

      return () => {
        const index = triggerRecords.indexOf(record);
        if (index >= 0) triggerRecords.splice(index, 1);
      };
    },
    setItemOpen: (itemValue, open, detail) => {
      const nextValue = setValueState((currentValue) => {
        if (multiple()) {
          if (open)
            return currentValue.includes(itemValue) ? currentValue : [...currentValue, itemValue];
          return currentValue.filter((candidate) => candidate !== itemValue);
        }

        if (open) return [itemValue];
        return currentValue.includes(itemValue) ? [] : currentValue;
      }, detail);
      return nextValue;
    },
    triggers: () => triggerRecords,
    value,
  };
}

function useAccordion(part: string) {
  const accordion = useContext(AccordionContext);
  if (!accordion) throw new Error(`Accordion.${part} must be used within Accordion.Root`);
  return accordion;
}

function useAccordionItem(part: string) {
  const item = useContext(AccordionItemContext);
  if (!item) throw new Error(`Accordion.${part} must be used within Accordion.Item`);
  return item;
}

function Root(props: AccordionRootProps) {
  const [local, others] = splitProps(props, [
    "children",
    "defaultValue",
    "disabled",
    "loopFocus",
    "multiple",
    "onValueChange",
    "orientation",
    "value",
  ]);
  const accordion = createAccordion({
    defaultValue: local.defaultValue,
    disabled: () => local.disabled,
    loopFocus: () => local.loopFocus,
    multiple: () => local.multiple,
    onValueChange: local.onValueChange,
    orientation: () => local.orientation,
    value: () => local.value,
  });

  return (
    <AccordionContext.Provider value={accordion}>
      <div
        {...others}
        data-disabled={dataBoolean(accordion.disabled())}
        data-orientation={accordion.orientation()}
        {...partDataAttributes("accordion", "root")}
      >
        {local.children}
      </div>
    </AccordionContext.Provider>
  );
}

function Item(props: AccordionItemProps) {
  const accordion = useAccordion("Item");
  const [local, others] = splitProps(props, ["children", "disabled", "value"]);
  const itemDisabled = createMemo(() => accordion.disabled() || (local.disabled ?? false));
  const open = createMemo(() => accordion.openValue(local.value));
  const contentId = `keystone-accordion-content-${createUniqueId()}`;
  const triggerId = `keystone-accordion-trigger-${createUniqueId()}`;
  const headerId = `keystone-accordion-header-${createUniqueId()}`;
  let unregisterTrigger: (() => void) | undefined;

  const disclosure = createDisclosureController({
    scope: "accordion",
    contentId: () => contentId,
    disabled: itemDisabled,
    open,
    onOpenChange: (nextOpen, detail) => accordion.setItemOpen(local.value, nextOpen, detail),
  });

  const itemApi: AccordionItemApi = {
    contentId,
    disabled: itemDisabled,
    getContentProps: (contentProps) => {
      const props = disclosure.getContentProps(contentProps);
      Object.defineProperties(props, {
        "aria-labelledby": { configurable: true, enumerable: true, value: triggerId },
        role: { configurable: true, enumerable: true, value: "region" },
        "data-orientation": {
          configurable: true,
          enumerable: true,
          get: () => accordion.orientation(),
        },
      });
      return props;
    },
    getTriggerProps: (triggerProps) => {
      const props = disclosure.getTriggerProps(triggerProps);
      Object.defineProperties(props, {
        id: { configurable: true, enumerable: true, value: triggerId },
        "data-orientation": {
          configurable: true,
          enumerable: true,
          get: () => accordion.orientation(),
        },
      });
      return props;
    },
    headerId,
    open,
    setTriggerElement: (element) => {
      unregisterTrigger?.();
      unregisterTrigger = accordion.registerTrigger(element, itemDisabled);
    },
    triggerId,
    value: local.value,
  };

  onCleanup(() => unregisterTrigger?.());

  return (
    <AccordionItemContext.Provider value={itemApi}>
      <div
        {...others}
        data-disabled={dataBoolean(itemDisabled())}
        data-orientation={accordion.orientation()}
        data-state={open() ? "open" : "closed"}
        {...partDataAttributes("accordion", "item")}
      >
        {local.children}
      </div>
    </AccordionItemContext.Provider>
  );
}

function Header(props: AccordionHeaderProps) {
  const item = useAccordionItem("Header");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <h3
      {...others}
      id={item.headerId}
      data-disabled={dataBoolean(item.disabled())}
      data-state={item.open() ? "open" : "closed"}
      {...partDataAttributes("accordion", "header")}
    >
      {local.children}
    </h3>
  );
}

function Trigger(props: AccordionTriggerProps) {
  const accordion = useAccordion("Trigger");
  const item = useAccordionItem("Trigger");
  const [local, others] = splitProps(props, ["as", "children", "onKeyDown", "ref"]);
  const triggerProps = item.getTriggerProps({
    ...others,
    onKeyDown: (event) => {
      callEventHandler(local.onKeyDown, event);
      if (!event.defaultPrevented) moveFocus(event, accordion);
    },
    ref: (element) => {
      if (typeof local.ref === "function") local.ref(element);
      item.setTriggerElement(element);
    },
  });

  if (!local.as) return <button {...triggerProps}>{local.children}</button>;

  return renderPolymorphic(local.as, "button", {
    ...triggerProps,
    children: local.children,
  });
}

function Content(props: AccordionContentProps) {
  const item = useAccordionItem("Content");
  const [local, others] = splitProps(props, ["children", "forceMount", "hiddenUntilFound"]);
  const contentProps = item.getContentProps({
    ...others,
    hiddenUntilFound: local.hiddenUntilFound,
  });

  return (
    <Show when={local.forceMount || local.hiddenUntilFound || item.open()}>
      <div {...contentProps}>{local.children}</div>
    </Show>
  );
}

function moveFocus(event: KeyboardEvent, accordion: AccordionApi) {
  const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
  if (!keys.includes(event.key)) return;

  const horizontal = accordion.orientation() === "horizontal";
  const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
  const previousKey = horizontal ? "ArrowLeft" : "ArrowUp";

  if (![nextKey, previousKey, "Home", "End"].includes(event.key)) return;

  const triggers = accordion
    .triggers()
    .filter((record) => !record.disabled())
    .map((record) => record.element);
  const currentIndex = triggers.indexOf(event.currentTarget as HTMLButtonElement);
  if (currentIndex < 0) return;

  event.preventDefault();

  const lastIndex = triggers.length - 1;
  let nextIndex = currentIndex;

  if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = lastIndex;
  else if (event.key === nextKey) nextIndex = currentIndex + 1;
  else if (event.key === previousKey) nextIndex = currentIndex - 1;

  if (nextIndex > lastIndex) nextIndex = accordion.loopFocus() ? 0 : lastIndex;
  if (nextIndex < 0) nextIndex = accordion.loopFocus() ? lastIndex : 0;

  triggers[nextIndex]?.focus();
}

export const Accordion = {
  Root,
  Item,
  Header,
  Trigger,
  Content,
};
