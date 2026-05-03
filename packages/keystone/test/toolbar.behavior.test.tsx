import { describe, expect, test } from "vitest";
import { Toolbar } from "../src/toolbar/index";
import { getByPart, keyDown, render } from "./harness";

describe("Toolbar behavior", () => {
  test("exposes the core toolbar ARIA, parts, orientation, and pressed state contract", () => {
    render(() => (
      <Toolbar.Root aria-label="Editor formatting" orientation="vertical">
        <Toolbar.Button pressed>Bold</Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Link href="/docs">Docs</Toolbar.Link>
      </Toolbar.Root>
    ));

    const root = getByPart("toolbar", "root");
    const button = getByPart("toolbar", "button");
    const link = getByPart("toolbar", "link");
    const separator = getByPart("toolbar", "separator");

    expect(root.getAttribute("role")).toBe("toolbar");
    expect(root.getAttribute("aria-orientation")).toBe("vertical");
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.getAttribute("data-pressed")).toBe("");
    expect(link.getAttribute("href")).toBe("/docs");
    expect(separator.getAttribute("role")).toBe("separator");
    expect(separator.getAttribute("aria-orientation")).toBe("vertical");
  });

  test("moves focus across enabled controls and skips disabled controls", () => {
    render(() => (
      <Toolbar.Root>
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Button disabled>Italic</Toolbar.Button>
        <Toolbar.Link href="/docs">Docs</Toolbar.Link>
      </Toolbar.Root>
    ));

    const controls = Array.from(
      document.body.querySelectorAll<HTMLElement>(
        '[data-scope="toolbar"][data-part="button"], [data-scope="toolbar"][data-part="link"]',
      ),
    );

    expect(controls.map((control) => control.tabIndex)).toEqual([0, -1, -1]);

    controls[0].focus();
    keyDown(controls[0], "ArrowRight");

    expect(document.activeElement).toBe(controls[2]);
    expect(controls.map((control) => control.tabIndex)).toEqual([-1, -1, 0]);

    keyDown(controls[2], "Home");
    expect(document.activeElement).toBe(controls[0]);
  });

  test("uses RTL-aware horizontal arrow navigation", () => {
    render(() => (
      <Toolbar.Root dir="rtl">
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Button>Italic</Toolbar.Button>
        <Toolbar.Link href="/docs">Docs</Toolbar.Link>
      </Toolbar.Root>
    ));

    const controls = Array.from(
      document.body.querySelectorAll<HTMLElement>(
        '[data-scope="toolbar"][data-part="button"], [data-scope="toolbar"][data-part="link"]',
      ),
    );

    controls[0].focus();
    keyDown(controls[0], "ArrowLeft");
    expect(document.activeElement).toBe(controls[1]);

    keyDown(controls[1], "ArrowRight");
    expect(document.activeElement).toBe(controls[0]);
  });

  test("respects prevented keyboard events and non-looping focus boundaries", () => {
    render(() => (
      <Toolbar.Root loopFocus={false}>
        <Toolbar.Button onKeyDown={(event) => event.preventDefault()}>Bold</Toolbar.Button>
        <Toolbar.Button>Italic</Toolbar.Button>
      </Toolbar.Root>
    ));

    const controls = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>(
        '[data-scope="toolbar"][data-part="button"]',
      ),
    );

    controls[0].focus();
    keyDown(controls[0], "ArrowRight");
    expect(document.activeElement).toBe(controls[0]);

    controls[1].focus();
    keyDown(controls[1], "ArrowRight");
    expect(document.activeElement).toBe(controls[1]);
  });
});
