import { expect } from "vitest";
import { keyDown, pointerDown, settled } from "./harness";

type MaybePromise<T> = T | Promise<T>;
type ElementTarget<T extends HTMLElement = HTMLElement> = T | (() => T);
type AttributeTarget =
  | HTMLElement
  | Record<string, unknown>
  | (() => HTMLElement | Record<string, unknown>);

export type KeyboardSpecStep = {
  after?: () => MaybePromise<void>;
  before?: () => MaybePromise<void>;
  defaultPrevented?: boolean;
  handler?: (event: KeyboardEvent) => void;
  key: string;
  target?: ElementTarget;
};

export type AriaRelationshipSpec = {
  attribute: string;
  source: AttributeTarget;
  targets: Array<ElementTarget | string>;
};

export type FormValueSpec = Record<string, string | readonly string[] | null>;

export type MediaQueryOptions = {
  matches?: boolean;
};

export type StablePartSpec = {
  part: string;
  scope: string;
  target: AttributeTarget;
  attributes?: readonly string[];
};

export type FocusTrapSpec = {
  container: ElementTarget;
  first: ElementTarget;
  last: ElementTarget;
};

export type FocusRestoreSpec = {
  close: () => MaybePromise<void>;
  open: () => MaybePromise<void>;
  trigger: ElementTarget;
};

export type OutsideDismissalSpec = {
  assertDismissed: () => void;
  open: () => MaybePromise<void>;
  outside: ElementTarget;
};

export type FormResetSpec = {
  afterReset: FormValueSpec;
  beforeReset: FormValueSpec;
  form: HTMLFormElement;
};

export type SsrSmokeSpec = {
  expectedText?: string;
  html: string;
};

export type HydrationSmokeSpec = SsrSmokeSpec;

export function resolveElement<T extends HTMLElement>(target: ElementTarget<T>): T {
  return typeof target === "function" ? (target as () => T)() : target;
}

export async function runKeyboardTable(steps: readonly KeyboardSpecStep[]) {
  for (const step of steps) {
    await step.before?.();
    const event = step.handler
      ? dispatchKeyboardHandler(step.handler, step.key)
      : keyDown(resolveElement(requiredTarget(step)), step.key);

    if (step.defaultPrevented !== undefined) {
      expect(event.defaultPrevented).toBe(step.defaultPrevented);
    }

    await settled();
    await step.after?.();
  }
}

export function expectRole(target: AttributeTarget, role: string) {
  expect(attributeValue(target, "role")).toBe(role);
}

export function expectPart(target: AttributeTarget, scope: string, part: string) {
  expect(attributeValue(target, "data-scope")).toBe(scope);
  expect(attributeValue(target, "data-part")).toBe(part);
}

export function expectStablePartAttributes(spec: StablePartSpec) {
  expectPart(spec.target, spec.scope, spec.part);

  for (const attribute of spec.attributes ?? []) {
    expect(attributeValue(spec.target, attribute)).not.toBeNull();
  }
}

export function expectAriaRelationship(spec: AriaRelationshipSpec) {
  const actual = tokenSet(attributeValue(spec.source, spec.attribute));
  const expected = spec.targets.map((target) =>
    typeof target === "string" ? target : resolveElement(target).id,
  );

  for (const id of expected) {
    expect(id).not.toBe("");
    expect(actual.has(id)).toBe(true);
    expect(document.getElementById(id)).not.toBeNull();
  }
}

export function expectNoAriaRelationship(source: AttributeTarget, attribute: string) {
  expect(attributeValue(source, attribute)).toBeNull();
}

export function expectAriaState(
  target: AttributeTarget,
  attribute: string,
  value: string | boolean | null,
) {
  const expected = typeof value === "boolean" ? String(value) : value;
  expect(attributeValue(target, attribute)).toBe(expected);
}

export function expectFocus(target: ElementTarget) {
  expect(document.activeElement).toBe(resolveElement(target));
}

export function expectFocusWithin(target: ElementTarget) {
  expect(resolveElement(target).contains(document.activeElement)).toBe(true);
}

export function expectFocusTrap(spec: FocusTrapSpec) {
  const container = resolveElement(spec.container);
  const first = resolveElement(spec.first);
  const last = resolveElement(spec.last);

  last.focus();
  keyDown(
    document.activeElement instanceof HTMLElement ? document.activeElement : container,
    "Tab",
  );
  expectFocus(first);

  first.focus();
  (document.activeElement instanceof HTMLElement
    ? document.activeElement
    : container
  ).dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Tab",
      shiftKey: true,
    }),
  );
  expectFocus(last);
}

export async function expectFocusRestore(spec: FocusRestoreSpec) {
  const trigger = resolveElement(spec.trigger);
  trigger.focus();
  await spec.open();
  await settled();

  expectFocusWithin(document.body);

  await spec.close();
  await settled();

  expectFocus(trigger);
}

export async function expectOutsideDismissal(spec: OutsideDismissalSpec) {
  await spec.open();
  await settled();

  pointerDown(resolveElement(spec.outside));
  await settled();

  spec.assertDismissed();
}

export function expectFormValues(form: HTMLFormElement, expected: FormValueSpec) {
  const data = new FormData(form);

  for (const [name, value] of Object.entries(expected)) {
    if (Array.isArray(value)) {
      expect(data.getAll(name)).toEqual([...value]);
    } else {
      expect(data.get(name)).toBe(value);
    }
  }
}

export async function expectFormReset(spec: FormResetSpec) {
  expectFormValues(spec.form, spec.beforeReset);

  spec.form.reset();
  await settled();

  expectFormValues(spec.form, spec.afterReset);
}

export function expectSsrSmoke(spec: SsrSmokeSpec) {
  expect(spec.html.length).toBeGreaterThan(0);

  if (spec.expectedText) {
    expect(spec.html).toContain(spec.expectedText);
  }

  return spec.html;
}

export function expectHydrationSmoke(spec: HydrationSmokeSpec) {
  const container = document.createElement("div");
  container.innerHTML = expectSsrSmoke(spec);
  document.body.append(container);

  expect(container.childNodes.length).toBeGreaterThan(0);
  container.remove();

  return spec.html;
}

export async function withDirection<T>(
  direction: "ltr" | "rtl",
  callback: () => MaybePromise<T>,
): Promise<T> {
  const previous = document.documentElement.getAttribute("dir");
  document.documentElement.setAttribute("dir", direction);

  try {
    return await callback();
  } finally {
    if (previous === null) {
      document.documentElement.removeAttribute("dir");
    } else {
      document.documentElement.setAttribute("dir", previous);
    }
  }
}

export async function withReducedMotion<T>(
  callback: () => MaybePromise<T>,
  options: MediaQueryOptions = {},
): Promise<T> {
  return withMediaQuery("prefers-reduced-motion", callback, options);
}

export async function withForcedColors<T>(
  callback: () => MaybePromise<T>,
  options: MediaQueryOptions = {},
): Promise<T> {
  return withMediaQuery("forced-colors", callback, options);
}

async function withMediaQuery<T>(
  pattern: string,
  callback: () => MaybePromise<T>,
  options: MediaQueryOptions = {},
): Promise<T> {
  const previous = globalThis.matchMedia;
  const expected = options.matches ?? true;

  Object.defineProperty(globalThis, "matchMedia", {
    configurable: true,
    value: (query: string) =>
      createMediaQueryList(query, query.includes(pattern) ? expected : false),
  });

  try {
    return await callback();
  } finally {
    if (previous === undefined) {
      delete (globalThis as Partial<typeof globalThis>).matchMedia;
    } else {
      Object.defineProperty(globalThis, "matchMedia", {
        configurable: true,
        value: previous,
      });
    }
  }
}

function createMediaQueryList(query: string, matches: boolean): MediaQueryList {
  return {
    addEventListener: () => undefined,
    addListener: () => undefined,
    dispatchEvent: () => false,
    matches,
    media: query,
    onchange: null,
    removeEventListener: () => undefined,
    removeListener: () => undefined,
  } satisfies MediaQueryList;
}

function tokenSet(value: string | null) {
  return new Set(value?.split(/\s+/).filter(Boolean) ?? []);
}

function dispatchKeyboardHandler(handler: (event: KeyboardEvent) => void, key: string) {
  const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key });
  handler(event);
  return event;
}

function requiredTarget(step: KeyboardSpecStep): ElementTarget {
  if (!step.target) {
    throw new Error(`Keyboard step for "${step.key}" must include target or handler`);
  }

  return step.target;
}

function resolveAttributeTarget(target: AttributeTarget) {
  return typeof target === "function" ? target() : target;
}

function attributeValue(target: AttributeTarget, attribute: string) {
  const resolved = resolveAttributeTarget(target);
  const value =
    resolved instanceof HTMLElement ? resolved.getAttribute(attribute) : resolved[attribute];

  return value === undefined ? null : String(value);
}
