import { afterEach } from "vitest";
import type { JSX } from "solid-js";
import { render as solidRender } from "solid-js/web";

type RenderResult = {
  container: HTMLDivElement;
  cleanup: () => void;
};

const cleanups: Array<() => void> = [];

export function render(ui: () => JSX.Element): RenderResult {
  const container = document.createElement("div");
  document.body.append(container);

  const dispose = solidRender(ui, container);
  let cleaned = false;

  const cleanup = () => {
    if (cleaned) {
      return;
    }

    cleaned = true;
    dispose();
    container.remove();
  };

  cleanups.push(cleanup);

  return { container, cleanup };
}

export function getByPart(scope: string, part: string, root: ParentNode = document.body) {
  const element = root.querySelector<HTMLElement>(`[data-scope="${scope}"][data-part="${part}"]`);

  if (!element) {
    throw new Error(`Unable to find Keystone part ${scope}.${part}`);
  }

  return element;
}

export function queryByPart(scope: string, part: string, root: ParentNode = document.body) {
  return root.querySelector<HTMLElement>(`[data-scope="${scope}"][data-part="${part}"]`);
}

export function click(element: HTMLElement) {
  element.click();
}

export function keyDown(element: HTMLElement, key: string) {
  const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key });
  element.dispatchEvent(event);
  return event;
}

export function pointerDown(element: HTMLElement) {
  const event = new PointerEvent("pointerdown", { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

export async function settled() {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

afterEach(() => {
  for (const cleanup of cleanups.splice(0).reverse()) {
    cleanup();
  }

  document.body.replaceChildren();
  document.body.removeAttribute("style");
});
