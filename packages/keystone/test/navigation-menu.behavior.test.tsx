import { describe, expect, test } from "vitest";
import { NavigationMenu } from "../src/navigation-menu/index";
import { click, getByPart, keyDown, render, settled } from "./harness";

describe("NavigationMenu behavior", () => {
  test("exposes a navigation-menu scoped menubar contract over the menu kernel", () => {
    render(() => (
      <NavigationMenu.Root defaultOpen>
        <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Item value="primitives">Primitives</NavigationMenu.Item>
          <NavigationMenu.Separator />
          <NavigationMenu.Group>
            <NavigationMenu.GroupLabel>Resources</NavigationMenu.GroupLabel>
            <NavigationMenu.Item value="docs">Docs</NavigationMenu.Item>
          </NavigationMenu.Group>
        </NavigationMenu.Content>
      </NavigationMenu.Root>
    ));

    const trigger = getByPart("navigation-menu", "trigger");
    const content = getByPart("navigation-menu", "content");
    const separator = getByPart("navigation-menu", "separator");
    const group = getByPart("navigation-menu", "group");

    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(content.getAttribute("role")).toBe("menubar");
    expect(separator.getAttribute("role")).toBe("separator");
    expect(group.getAttribute("role")).toBe("group");
  });

  test("keeps core navigation menu keyboard and typeahead behavior", () => {
    render(() => (
      <NavigationMenu.Root defaultOpen>
        <NavigationMenu.Trigger>Explore</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Item value="alpha">Alpha</NavigationMenu.Item>
          <NavigationMenu.Item value="beta" disabled>
            Beta
          </NavigationMenu.Item>
          <NavigationMenu.Item value="bravo">Bravo</NavigationMenu.Item>
        </NavigationMenu.Content>
      </NavigationMenu.Root>
    ));

    const content = getByPart("navigation-menu", "content");

    keyDown(content, "ArrowDown");
    expect(
      document.querySelector('[data-scope="navigation-menu"][data-part="item"][data-highlighted]')
        ?.textContent,
    ).toBe("Alpha");

    keyDown(content, "b");
    expect(
      document.querySelector('[data-scope="navigation-menu"][data-part="item"][data-highlighted]')
        ?.textContent,
    ).toBe("Bravo");
  });

  test("exposes routed link behavior with navigation-menu scoped metadata", async () => {
    const selected: string[] = [];

    render(() => (
      <NavigationMenu.Root defaultOpen onOpenChange={(open) => selected.push(String(open))}>
        <NavigationMenu.Trigger>Explore</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Link href="/docs" value="docs" onSelect={() => selected.push("docs")}>
            Docs
          </NavigationMenu.Link>
          <NavigationMenu.Link
            href="/disabled"
            value="disabled"
            disabled
            onSelect={() => selected.push("disabled")}
          >
            Disabled
          </NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Root>
    ));

    const trigger = getByPart("navigation-menu", "trigger");
    const links = Array.from(
      document.body.querySelectorAll<HTMLAnchorElement>(
        '[data-scope="navigation-menu"][data-part="link"]',
      ),
    );

    expect(links[0].getAttribute("role")).toBe("menuitem");
    expect(links[0].getAttribute("href")).toBe("/docs");
    expect(links[1].getAttribute("aria-disabled")).toBe("true");

    click(links[1]);
    await settled();

    expect(selected).not.toContain("disabled");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    click(links[0]);
    await settled();

    expect(selected).toContain("docs");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
