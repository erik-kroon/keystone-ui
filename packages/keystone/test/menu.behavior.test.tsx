import { describe, expect, test } from "vitest";
import { ContextMenu, DropdownMenu, Menu, Menubar } from "../src/menu/index";
import { click, getByPart, keyDown, render, settled } from "./harness";

describe("Menu behavior harness", () => {
  test("navigates enabled items, supports typeahead, and closes on keyboard selection", async () => {
    render(() => (
      <Menu.Root defaultOpen>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content>
          <Menu.Item value="alpha">Alpha</Menu.Item>
          <Menu.Item value="beta" disabled>
            Beta
          </Menu.Item>
          <Menu.Item value="bravo">Bravo</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    ));

    const content = getByPart("menu", "content");

    keyDown(content, "ArrowDown");
    expect(
      document.querySelector('[data-scope="menu"][data-part="item"][data-highlighted]')
        ?.textContent,
    ).toBe("Alpha");

    keyDown(content, "b");
    expect(
      document.querySelector('[data-scope="menu"][data-part="item"][data-highlighted]')
        ?.textContent,
    ).toBe("Bravo");

    keyDown(content, "Enter");
    await settled();

    expect(getByPart("menu", "trigger").getAttribute("aria-expanded")).toBe("false");
  });

  test("tracks checkbox and radio item state with menu roles and data attributes", async () => {
    const checkedChanges: boolean[] = [];
    const radioChanges: string[] = [];

    render(() => (
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>View</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.CheckboxItem
            value="line-numbers"
            defaultChecked
            onCheckedChange={(checked) => checkedChanges.push(checked)}
          >
            Line numbers
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.RadioGroup
            defaultValue="comfortable"
            onValueChange={(value) => radioChanges.push(value)}
          >
            <DropdownMenu.RadioItem value="compact">Compact</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="comfortable">Comfortable</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    ));

    const checkbox = document.querySelector<HTMLElement>(
      '[data-scope="dropdown-menu"][data-part="item"][data-value="line-numbers"]',
    )!;
    const compact = document.querySelector<HTMLElement>(
      '[data-scope="dropdown-menu"][data-part="item"][data-value="compact"]',
    )!;
    const comfortable = document.querySelector<HTMLElement>(
      '[data-scope="dropdown-menu"][data-part="item"][data-value="comfortable"]',
    )!;

    expect(checkbox.getAttribute("role")).toBe("menuitemcheckbox");
    expect(checkbox.getAttribute("aria-checked")).toBe("true");
    expect(checkbox.getAttribute("data-checked")).toBe("");
    expect(comfortable.getAttribute("role")).toBe("menuitemradio");
    expect(comfortable.getAttribute("aria-checked")).toBe("true");

    click(checkbox);
    click(compact);
    await settled();

    expect(checkedChanges).toEqual([false]);
    expect(radioChanges).toEqual(["compact"]);
    expect(compact.getAttribute("aria-checked")).toBe("true");
  });

  test("exposes nested submenu parts and dismisses with Escape", async () => {
    render(() => (
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>File</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item value="new">New</ContextMenu.Item>
          <ContextMenu.SubRoot defaultOpen>
            <ContextMenu.SubTrigger>Open recent</ContextMenu.SubTrigger>
            <ContextMenu.SubContent>
              <ContextMenu.Item value="alpha">Alpha</ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.SubRoot>
        </ContextMenu.Content>
      </ContextMenu.Root>
    ));

    expect(getByPart("context-menu", "trigger").getAttribute("aria-haspopup")).toBe("menu");
    expect(getByPart("context-menu", "content").getAttribute("role")).toBe("menu");

    keyDown(getByPart("context-menu", "content"), "Escape");
    await settled();
    expect(getByPart("context-menu", "trigger").getAttribute("aria-expanded")).toBe("false");
  });

  test("opens context menus from the native contextmenu event", async () => {
    render(() => (
      <ContextMenu.Root>
        <ContextMenu.Trigger>File</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item value="new">New</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    ));

    const trigger = getByPart("context-menu", "trigger");
    trigger.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
    await settled();

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  test("menubar shares the menu module with menubar scope and root role", () => {
    render(() => (
      <Menubar.Root defaultOpen>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item value="new">New</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Group>
            <Menubar.GroupLabel>Recent</Menubar.GroupLabel>
            <Menubar.Item value="alpha">Alpha</Menubar.Item>
          </Menubar.Group>
        </Menubar.Content>
      </Menubar.Root>
    ));

    expect(getByPart("menubar", "content").getAttribute("role")).toBe("menubar");
    expect(getByPart("menubar", "separator").getAttribute("role")).toBe("separator");
    expect(getByPart("menubar", "group").getAttribute("role")).toBe("group");
  });
});
