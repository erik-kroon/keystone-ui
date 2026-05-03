import { expect } from "vitest";
import { keyDown, settled } from "./harness";

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

export type ReducedMotionOptions = {
  reduce?: boolean;
};

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
  options: ReducedMotionOptions = {},
): Promise<T> {
  const previous = globalThis.matchMedia;
  const reduce = options.reduce ?? true;

  Object.defineProperty(globalThis, "matchMedia", {
    configurable: true,
    value: (query: string) => {
      const matches = query.includes("prefers-reduced-motion") ? reduce : false;

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
    },
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
