import {
  Show,
  createContext,
  createMemo,
  createSignal,
  createUniqueId,
  onCleanup,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import {
  callEventHandler,
  createControllableSignal,
  dataBoolean,
  partDataAttributes,
  renderPolymorphic,
  type PolymorphicProps,
} from "../utils/index";
import { useDirection, type Direction as KeystoneDirection } from "../i18n/direction";

export type TabsActivationMode = "automatic" | "manual";
export type TabsDirection = KeystoneDirection;
export type TabsOrientation = "horizontal" | "vertical";
export type TabsValueChangeDetail = {
  event?: Event;
  reason: "trigger" | "programmatic";
};

export type TabsPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type TabsRootProps = TabsPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    activationMode?: TabsActivationMode;
    defaultValue?: string;
    dir?: TabsDirection;
    disabled?: boolean;
    loopFocus?: boolean;
    onValueChange?: (value: string, detail: TabsValueChangeDetail) => void;
    orientation?: TabsOrientation;
    value?: string;
  };

export type TabsListProps = TabsPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type TabsTriggerProps = TabsPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref"> & {
    value: string;
  };
export type TabsIndicatorProps = TabsPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type TabsContentProps = TabsPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    forceMount?: boolean;
    value: string;
  };

type TriggerRecord = {
  disabled: Accessor<boolean>;
  element: HTMLButtonElement;
  value: string;
};

export type CreateTabsOptions = {
  activationMode?: () => TabsActivationMode | undefined;
  defaultValue?: string;
  dir?: () => TabsDirection | undefined;
  disabled?: () => boolean | undefined;
  loopFocus?: () => boolean | undefined;
  onValueChange?: (value: string, detail: TabsValueChangeDetail) => void;
  orientation?: () => TabsOrientation | undefined;
  value?: () => string | undefined;
};

export type TabsApi = {
  activationMode: () => TabsActivationMode;
  dir: () => TabsDirection;
  disabled: () => boolean;
  getContentId: (value: string) => string;
  getTriggerId: (value: string) => string;
  highlightedValue: () => string | undefined;
  loopFocus: () => boolean;
  orientation: () => TabsOrientation;
  registerTrigger: (
    element: HTMLButtonElement,
    value: string,
    disabled: Accessor<boolean>,
  ) => () => void;
  selectValue: (value: string, detail: TabsValueChangeDetail) => string;
  selectedValue: () => string | undefined;
  setHighlightedValue: (value: string | undefined) => void;
  triggers: () => TriggerRecord[];
};

const TabsContext = createContext<TabsApi>();

export function createTabs(options: CreateTabsOptions = {}): TabsApi {
  const [value, setValueState] = createControllableSignal<
    string | undefined,
    TabsValueChangeDetail
  >({
    value: options.value,
    defaultValue: options.defaultValue,
    defaultDetail: { reason: "programmatic" },
    onChange: (nextValue, detail) => {
      if (nextValue === undefined) return;
      options.onValueChange?.(nextValue, detail);
    },
  });
  const [highlightedValue, setHighlightedValue] = createSignal<string | undefined>();
  const [registryVersion, setRegistryVersion] = createSignal(0);
  const disabled = createMemo(() => options.disabled?.() ?? false);
  const dir = createMemo(() => options.dir?.() ?? "ltr");
  const activationMode = createMemo(() => options.activationMode?.() ?? "automatic");
  const loopFocus = createMemo(() => options.loopFocus?.() ?? true);
  const orientation = createMemo(() => options.orientation?.() ?? "horizontal");
  const triggerRecords: TriggerRecord[] = [];
  const triggerIds = new Map<string, string>();
  const contentIds = new Map<string, string>();

  const firstEnabledValue = createMemo(() => {
    registryVersion();
    return triggerRecords.find((record) => !record.disabled())?.value;
  });
  const selectedValue = createMemo(() => value() ?? firstEnabledValue());

  const getTriggerId = (triggerValue: string) => {
    const current = triggerIds.get(triggerValue);
    if (current) return current;
    const next = `keystone-tabs-trigger-${createUniqueId()}`;
    triggerIds.set(triggerValue, next);
    return next;
  };

  const getContentId = (contentValue: string) => {
    const current = contentIds.get(contentValue);
    if (current) return current;
    const next = `keystone-tabs-content-${createUniqueId()}`;
    contentIds.set(contentValue, next);
    return next;
  };

  const selectValue = (nextValue: string, detail: TabsValueChangeDetail) => {
    if (disabled() && detail.reason !== "programmatic") return selectedValue() ?? nextValue;

    const result = setValueState(nextValue, detail);
    return result ?? nextValue;
  };

  return {
    activationMode,
    dir,
    disabled,
    getContentId,
    getTriggerId,
    highlightedValue,
    loopFocus,
    orientation,
    registerTrigger: (element, triggerValue, triggerDisabled) => {
      const record = { disabled: triggerDisabled, element, value: triggerValue };
      triggerRecords.push(record);
      setRegistryVersion((version) => version + 1);

      return () => {
        const index = triggerRecords.indexOf(record);
        if (index >= 0) triggerRecords.splice(index, 1);
        setRegistryVersion((version) => version + 1);
      };
    },
    selectValue,
    selectedValue,
    setHighlightedValue,
    triggers: () => {
      registryVersion();
      return triggerRecords;
    },
  };
}

function useTabs(part: string) {
  const tabs = useContext(TabsContext);
  if (!tabs) throw new Error(`Tabs.${part} must be used within Tabs.Root`);
  return tabs;
}

function Root(props: TabsRootProps) {
  const inheritedDir = useDirection();
  const [local, others] = splitProps(props, [
    "activationMode",
    "children",
    "defaultValue",
    "dir",
    "disabled",
    "loopFocus",
    "onValueChange",
    "orientation",
    "value",
  ]);
  const tabs = createTabs({
    activationMode: () => local.activationMode,
    defaultValue: local.defaultValue,
    dir: () => local.dir ?? inheritedDir(),
    disabled: () => local.disabled,
    loopFocus: () => local.loopFocus,
    onValueChange: local.onValueChange,
    orientation: () => local.orientation,
    value: () => local.value,
  });

  return (
    <TabsContext.Provider value={tabs}>
      <div
        {...others}
        data-disabled={dataBoolean(tabs.disabled())}
        data-dir={tabs.dir()}
        data-orientation={tabs.orientation()}
        dir={tabs.dir()}
        {...partDataAttributes("tabs", "root")}
      >
        {local.children}
      </div>
    </TabsContext.Provider>
  );
}

function List(props: TabsListProps) {
  const tabs = useTabs("List");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <div
      {...others}
      role="tablist"
      aria-orientation={tabs.orientation()}
      data-disabled={dataBoolean(tabs.disabled())}
      data-dir={tabs.dir()}
      data-orientation={tabs.orientation()}
      {...partDataAttributes("tabs", "list")}
    >
      {local.children}
    </div>
  );
}

function Trigger(props: TabsTriggerProps) {
  const tabs = useTabs("Trigger");
  const [local, others] = splitProps(props, [
    "as",
    "children",
    "disabled",
    "onClick",
    "onFocus",
    "onKeyDown",
    "ref",
    "value",
  ]);
  const triggerDisabled = createMemo(() => tabs.disabled() || (local.disabled ?? false));
  const selected = createMemo(() => tabs.selectedValue() === local.value);
  const highlighted = createMemo(() => tabs.highlightedValue() === local.value);
  let unregisterTrigger: (() => void) | undefined;

  onCleanup(() => unregisterTrigger?.());

  const triggerProps = {
    ...others,
    id: tabs.getTriggerId(local.value),
    role: "tab" as const,
    type: others.type ?? "button",
    get disabled() {
      return triggerDisabled();
    },
    "aria-controls": tabs.getContentId(local.value),
    get "aria-selected"() {
      return selected();
    },
    get tabIndex() {
      return selected() ? 0 : -1;
    },
    get "data-disabled"() {
      return dataBoolean(triggerDisabled());
    },
    get "data-highlighted"() {
      return dataBoolean(highlighted());
    },
    get "data-orientation"() {
      return tabs.orientation();
    },
    get "data-selected"() {
      return dataBoolean(selected());
    },
    ...partDataAttributes("tabs", "trigger"),
    onClick: (event: MouseEvent) => {
      callEventHandler(local.onClick, event);
      if (event.defaultPrevented || triggerDisabled()) return;
      tabs.selectValue(local.value, { event, reason: "trigger" });
    },
    onFocus: (event: FocusEvent) => {
      callEventHandler(local.onFocus, event);
      if (event.defaultPrevented || triggerDisabled()) return;
      tabs.setHighlightedValue(local.value);
      if (tabs.activationMode() === "automatic") {
        tabs.selectValue(local.value, { event, reason: "trigger" });
      }
    },
    onKeyDown: (event: KeyboardEvent) => {
      callEventHandler(local.onKeyDown, event);
      if (!event.defaultPrevented) moveFocus(event, tabs);
    },
    ref: (element: HTMLButtonElement) => {
      if (typeof local.ref === "function") local.ref(element);
      unregisterTrigger?.();
      unregisterTrigger = tabs.registerTrigger(element, local.value, triggerDisabled);
    },
  };

  if (!local.as) return <button {...triggerProps}>{local.children}</button>;

  return renderPolymorphic(local.as, "button", {
    ...triggerProps,
    children: local.children,
  });
}

function Indicator(props: TabsIndicatorProps) {
  const tabs = useTabs("Indicator");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <div
      {...others}
      data-disabled={dataBoolean(tabs.disabled())}
      data-orientation={tabs.orientation()}
      {...partDataAttributes("tabs", "indicator")}
    >
      {local.children}
    </div>
  );
}

function Content(props: TabsContentProps) {
  const tabs = useTabs("Content");
  const [local, others] = splitProps(props, ["children", "forceMount", "value"]);
  const selected = createMemo(() => tabs.selectedValue() === local.value);

  return (
    <Show when={local.forceMount || selected()}>
      <div
        {...others}
        id={tabs.getContentId(local.value)}
        role="tabpanel"
        tabIndex={0}
        hidden={selected() ? undefined : true}
        aria-labelledby={tabs.getTriggerId(local.value)}
        data-disabled={dataBoolean(tabs.disabled())}
        data-orientation={tabs.orientation()}
        data-selected={dataBoolean(selected())}
        {...partDataAttributes("tabs", "content")}
      >
        {local.children}
      </div>
    </Show>
  );
}

function moveFocus(event: KeyboardEvent, tabs: TabsApi) {
  const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End", "Enter", " "];
  if (!keys.includes(event.key)) return;

  if (event.key === "Enter" || event.key === " ") {
    const target = event.currentTarget as HTMLButtonElement;
    const record = tabs.triggers().find((candidate) => candidate.element === target);
    if (record && tabs.activationMode() === "manual") {
      event.preventDefault();
      tabs.selectValue(record.value, { event, reason: "trigger" });
    }
    return;
  }

  const horizontal = tabs.orientation() === "horizontal";
  const nextKey = horizontal ? (tabs.dir() === "rtl" ? "ArrowLeft" : "ArrowRight") : "ArrowDown";
  const previousKey = horizontal ? (tabs.dir() === "rtl" ? "ArrowRight" : "ArrowLeft") : "ArrowUp";

  if (![nextKey, previousKey, "Home", "End"].includes(event.key)) return;

  const triggers = tabs.triggers().filter((record) => !record.disabled());
  const currentIndex = triggers.findIndex(
    (record) => record.element === (event.currentTarget as HTMLButtonElement),
  );
  if (currentIndex < 0) return;

  event.preventDefault();

  const lastIndex = triggers.length - 1;
  let nextIndex = currentIndex;

  if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = lastIndex;
  else if (event.key === nextKey) nextIndex = currentIndex + 1;
  else if (event.key === previousKey) nextIndex = currentIndex - 1;

  if (nextIndex > lastIndex) nextIndex = tabs.loopFocus() ? 0 : lastIndex;
  if (nextIndex < 0) nextIndex = tabs.loopFocus() ? lastIndex : 0;

  const next = triggers[nextIndex];
  if (!next) return;
  tabs.setHighlightedValue(next.value);
  next.element.focus();
}

export const Tabs = {
  Root,
  List,
  Trigger,
  Indicator,
  Content,
};
