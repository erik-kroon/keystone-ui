import { describe, expect, test } from "vitest";
import { NavigationMenu } from "../src/navigation-menu/index";
import { getByPart, keyDown, render } from "./harness";

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
});
