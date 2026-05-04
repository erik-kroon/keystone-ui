import { createRoot, createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { Direction, Tabs, Toolbar, createDirection } from "../index";
import { getByPart, keyDown, render } from "../../test/harness";

describe("Direction provider", () => {
  test("renders native direction and Keystone data attributes", () => {
    const result = render(() => <Direction.Root dir="rtl">Content</Direction.Root>);
    const root = getByPart("direction", "root", result.container);

    expect(root.getAttribute("dir")).toBe("rtl");
    expect(root.getAttribute("data-dir")).toBe("rtl");
  });

  test("supports controlled direction changes through the controller", () => {
    createRoot((dispose) => {
      const changes: string[] = [];
      const [dir, setDir] = createSignal<"ltr" | "rtl">("ltr");
      const direction = createDirection({
        dir,
        onDirectionChange: (nextDir, detail) => {
          changes.push(`${nextDir}:${detail.reason}`);
          setDir(nextDir);
        },
      });

      expect(direction.dir()).toBe("ltr");
      direction.setDir("rtl");
      expect(direction.dir()).toBe("rtl");
      expect(changes).toEqual(["rtl:programmatic"]);

      dispose();
    });
  });

  test("provides direction to tabs while explicit primitive props override context", () => {
    render(() => (
      <Direction.Root dir="rtl">
        <Tabs.Root defaultValue="one">
          <Tabs.List>
            <Tabs.Trigger value="one">One</Tabs.Trigger>
            <Tabs.Trigger value="two">Two</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <Tabs.Root defaultValue="alpha" dir="ltr">
          <Tabs.List>
            <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
            <Tabs.Trigger value="beta">Beta</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </Direction.Root>
    ));

    const roots = document.querySelectorAll<HTMLElement>('[data-scope="tabs"][data-part="root"]');

    expect(roots[0]?.getAttribute("dir")).toBe("rtl");
    expect(roots[0]?.getAttribute("data-dir")).toBe("rtl");
    expect(roots[1]?.getAttribute("dir")).toBe("ltr");
    expect(roots[1]?.getAttribute("data-dir")).toBe("ltr");
  });

  test("drives toolbar horizontal arrow order from provider direction", () => {
    render(() => (
      <Direction.Root dir="rtl">
        <Toolbar.Root>
          <Toolbar.Button>One</Toolbar.Button>
          <Toolbar.Button>Two</Toolbar.Button>
        </Toolbar.Root>
      </Direction.Root>
    ));
    const buttons = document.querySelectorAll<HTMLButtonElement>(
      '[data-scope="toolbar"][data-part="button"]',
    );

    buttons[0]?.focus();
    keyDown(buttons[0]!, "ArrowLeft");
    expect(document.activeElement).toBe(buttons[1]);

    keyDown(buttons[1]!, "ArrowRight");
    expect(document.activeElement).toBe(buttons[0]);
  });
});
