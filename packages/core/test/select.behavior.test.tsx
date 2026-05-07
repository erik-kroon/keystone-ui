import { describe, expect, test } from "vitest";
import { Show, createSignal, type Setter } from "solid-js";
import { Select } from "../src/select/index";
import { click, getByPart, keyDown, pointerDown, queryByPart, render, settled } from "./harness";

describe("Select behavior harness", () => {
  test("navigates enabled items, supports typeahead, and selects from the keyboard", async () => {
    const changes: string[] = [];

    render(() => (
      <Select.Root defaultOpen onValueChange={(value) => changes.push(value ?? "")}>
        <Select.Trigger>Choose project</Select.Trigger>
        <Select.Content>
          <Select.Listbox>
            <Select.Item value="alpha">Alpha</Select.Item>
            <Select.Item value="beta" disabled>
              Beta
            </Select.Item>
            <Select.Item value="bravo">Bravo</Select.Item>
          </Select.Listbox>
        </Select.Content>
      </Select.Root>
    ));

    const listbox = getByPart("select", "listbox");

    keyDown(listbox, "ArrowDown");
    expect(document.querySelector('[data-part="item"][data-highlighted]')?.textContent).toBe(
      "Alpha",
    );

    keyDown(listbox, "b");
    expect(document.querySelector('[data-part="item"][data-highlighted]')?.textContent).toBe(
      "Bravo",
    );

    keyDown(listbox, "Enter");
    await settled();

    expect(changes).toEqual(["bravo"]);
    expect(getByPart("select", "trigger").getAttribute("aria-expanded")).toBe("false");
  });

  test("submits and resets through the form-control kernel hidden input", async () => {
    render(() => (
      <form>
        <Select.Root name="project" defaultValue="alpha">
          <Select.Trigger>Choose project</Select.Trigger>
          <Select.Value />
          <Select.Content>
            <Select.Listbox>
              <Select.Item value="alpha">Alpha</Select.Item>
              <Select.Item value="bravo">Bravo</Select.Item>
            </Select.Listbox>
          </Select.Content>
        </Select.Root>
      </form>
    ));

    click(getByPart("select", "trigger"));
    await settled();
    const bravo = Array.from(document.querySelectorAll<HTMLElement>('[data-part="item"]')).find(
      (item) => item.textContent === "Bravo",
    )!;
    click(bravo);
    await settled();

    const form = document.querySelector("form")!;
    expect(new FormData(form).get("project")).toBe("bravo");

    form.reset();
    await settled();

    expect(new FormData(form).get("project")).toBe("alpha");
  });

  test("serializes multiple selected values as repeated hidden inputs", async () => {
    const changes: readonly string[][] = [];

    render(() => (
      <form>
        <Select.Root
          multiple
          name="project"
          defaultValue={["alpha"]}
          onValuesChange={(values) => changes.push(values)}
        >
          <Select.Trigger>Choose project</Select.Trigger>
          <Select.Content>
            <Select.Listbox>
              <Select.Item value="alpha">Alpha</Select.Item>
              <Select.Item value="bravo">Bravo</Select.Item>
            </Select.Listbox>
          </Select.Content>
        </Select.Root>
      </form>
    ));

    click(getByPart("select", "trigger"));
    await settled();
    const bravo = Array.from(document.querySelectorAll<HTMLElement>('[data-part="item"]')).find(
      (item) => item.textContent === "Bravo",
    )!;
    click(bravo);
    await settled();

    const form = document.querySelector("form")!;
    expect(new FormData(form).getAll("project")).toEqual(["alpha", "bravo"]);
    expect(getByPart("select", "listbox").getAttribute("aria-multiselectable")).toBe("true");
    expect(changes).toEqual([["alpha", "bravo"]]);
  });

  test("resets through an external form owner", async () => {
    render(() => (
      <>
        <form id="external-form" />
        <Select.Root form="external-form" name="project" defaultValue="alpha">
          <Select.Trigger>Choose project</Select.Trigger>
          <Select.Content>
            <Select.Listbox>
              <Select.Item value="alpha">Alpha</Select.Item>
              <Select.Item value="bravo">Bravo</Select.Item>
            </Select.Listbox>
          </Select.Content>
        </Select.Root>
      </>
    ));

    click(getByPart("select", "trigger"));
    await settled();
    const bravo = Array.from(document.querySelectorAll<HTMLElement>('[data-part="item"]')).find(
      (item) => item.textContent === "Bravo",
    )!;
    click(bravo);
    await settled();

    const form = document.querySelector<HTMLFormElement>("#external-form")!;
    expect(new FormData(form).get("project")).toBe("bravo");

    form.reset();
    await settled();

    expect(new FormData(form).get("project")).toBe("alpha");
  });

  test("syncs value changes dispatched from the hidden input", async () => {
    render(() => (
      <form>
        <Select.Root name="project" defaultValue="alpha">
          <Select.Trigger>Choose project</Select.Trigger>
          <Select.Value />
          <Select.Content>
            <Select.Listbox>
              <Select.Item value="alpha">Alpha</Select.Item>
              <Select.Item value="bravo">Bravo</Select.Item>
            </Select.Listbox>
          </Select.Content>
        </Select.Root>
      </form>
    ));

    const input = document.querySelector<HTMLInputElement>(
      '[data-scope="form-control"][data-part="hidden-input"]',
    )!;
    input.value = "bravo";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await settled();

    expect(new FormData(document.querySelector("form")!).get("project")).toBe("bravo");
    expect(getByPart("select", "value").textContent).toBe("Bravo");
  });

  test("read-only select exposes state and blocks value changes", async () => {
    const changes: string[] = [];

    render(() => (
      <form>
        <Select.Root
          readOnly
          name="project"
          defaultValue="alpha"
          onValueChange={(value) => changes.push(value ?? "")}
        >
          <Select.Trigger>Choose project</Select.Trigger>
          <Select.Value />
          <Select.Content>
            <Select.Listbox>
              <Select.Item value="alpha">Alpha</Select.Item>
              <Select.Item value="bravo">Bravo</Select.Item>
            </Select.Listbox>
          </Select.Content>
        </Select.Root>
      </form>
    ));

    const trigger = getByPart("select", "trigger");
    expect(trigger.getAttribute("aria-readonly")).toBe("true");
    expect(trigger.getAttribute("data-readonly")).toBe("");

    click(trigger);
    await settled();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    const bravo = Array.from(document.querySelectorAll<HTMLElement>('[data-part="item"]')).find(
      (item) => item.textContent === "Bravo",
    )!;
    click(bravo);
    await settled();

    expect(new FormData(document.querySelector("form")!).get("project")).toBe("alpha");
    expect(changes).toEqual([]);
  });

  test("supports grouped options without changing single-selection behavior", async () => {
    render(() => (
      <Select.Root defaultOpen>
        <Select.Trigger>Choose project</Select.Trigger>
        <Select.Content>
          <Select.Listbox>
            <Select.Group value="recent" disabled>
              <Select.GroupLabel>Recent</Select.GroupLabel>
              <Select.Item value="alpha">Alpha</Select.Item>
            </Select.Group>
          </Select.Listbox>
        </Select.Content>
      </Select.Root>
    ));

    const group = getByPart("select", "group");
    const label = getByPart("select", "group-label");
    const item = getByPart("select", "item");

    expect(group.getAttribute("role")).toBe("group");
    expect(group.getAttribute("aria-labelledby")).toBe(label.id);
    expect(item.getAttribute("data-group")).toBe("recent");
    expect(item.getAttribute("data-disabled")).toBe("");
    expect(getByPart("select", "listbox").getAttribute("aria-multiselectable")).toBeNull();
  });

  test("exposes selected state and protects disabled and hidden options", async () => {
    const changes: string[] = [];

    render(() => (
      <Select.Root
        defaultOpen
        defaultValue="alpha"
        onValueChange={(value) => changes.push(value ?? "")}
      >
        <Select.Trigger>Choose project</Select.Trigger>
        <Select.Value />
        <Select.Content>
          <Select.Listbox>
            <Select.Item value="alpha">Alpha</Select.Item>
            <Select.Item value="beta" disabled>
              Beta
            </Select.Item>
            <Select.Item value="bravo" hidden>
              Bravo
            </Select.Item>
            <Select.Item value="charlie">Charlie</Select.Item>
          </Select.Listbox>
        </Select.Content>
      </Select.Root>
    ));

    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-part="item"]'));
    const alpha = items.find((item) => item.textContent === "Alpha")!;
    const beta = items.find((item) => item.textContent === "Beta")!;
    const bravo = items.find((item) => item.textContent === "Bravo")!;
    const charlie = items.find((item) => item.textContent === "Charlie")!;

    expect(alpha.getAttribute("aria-selected")).toBe("true");
    expect(alpha.getAttribute("data-selected")).toBe("");
    expect(beta.getAttribute("aria-disabled")).toBe("true");
    expect(beta.getAttribute("data-disabled")).toBe("");
    expect(bravo.hidden).toBe(true);
    expect(bravo.getAttribute("data-hidden")).toBe("");

    click(beta);
    await settled();
    expect(getByPart("select", "value").textContent).toBe("Alpha");
    expect(changes).toEqual([]);

    const listbox = getByPart("select", "listbox");
    keyDown(listbox, "ArrowDown");
    expect(document.querySelector('[data-part="item"][data-highlighted]')?.textContent).toBe(
      "Alpha",
    );

    keyDown(listbox, "b");
    expect(document.querySelector('[data-part="item"][data-highlighted]')?.textContent).toBe(
      "Alpha",
    );

    keyDown(listbox, "ArrowDown");
    expect(document.querySelector('[data-part="item"][data-highlighted]')?.textContent).toBe(
      "Charlie",
    );

    keyDown(listbox, "Enter");
    await settled();

    expect(charlie.getAttribute("aria-selected")).toBe("true");
    expect(charlie.getAttribute("data-selected")).toBe("");
    expect(getByPart("select", "value").textContent).toBe("Charlie");
    expect(changes).toEqual(["charlie"]);
  });

  test("only renders the item indicator for selected values", async () => {
    render(() => (
      <Select.Root defaultOpen defaultValue="alpha">
        <Select.Trigger>Choose project</Select.Trigger>
        <Select.Content>
          <Select.Listbox>
            <Select.Item value="alpha">
              <Select.ItemIndicator>Selected</Select.ItemIndicator>
              Alpha
            </Select.Item>
            <Select.Item value="bravo">
              <Select.ItemIndicator>Selected</Select.ItemIndicator>
              Bravo
            </Select.Item>
          </Select.Listbox>
        </Select.Content>
      </Select.Root>
    ));

    expect(document.querySelectorAll('[data-part="item-indicator"]')).toHaveLength(1);
    expect(document.querySelector('[data-part="item-indicator"]')?.parentElement?.textContent).toBe(
      "SelectedAlpha",
    );
  });

  test("opening an empty select does not select the first item", async () => {
    const changes: string[] = [];

    render(() => (
      <Select.Root onValueChange={(value) => changes.push(value ?? "")}>
        <Select.Trigger>
          <Select.Value placeholder="Choose project" />
        </Select.Trigger>
        <Select.Content>
          <Select.Listbox>
            <Select.Item value="alpha">
              <Select.ItemIndicator>Selected</Select.ItemIndicator>
              Alpha
            </Select.Item>
            <Select.Item value="bravo">
              <Select.ItemIndicator>Selected</Select.ItemIndicator>
              Bravo
            </Select.Item>
          </Select.Listbox>
        </Select.Content>
      </Select.Root>
    ));

    click(getByPart("select", "trigger"));
    await settled();

    expect(getByPart("select", "value").textContent).toBe("Choose project");
    expect(document.querySelectorAll('[data-part="item-indicator"]')).toHaveLength(0);
    expect(changes).toEqual([]);
  });

  test("keeps the selected label after portaled items unmount on close", async () => {
    render(() => (
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Choose project" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Listbox>
              <Select.Item value="alpha">Alpha</Select.Item>
              <Select.Item value="bravo">Bravo</Select.Item>
            </Select.Listbox>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    ));

    click(getByPart("select", "trigger"));
    await settled();
    click(getByPart("select", "item"));
    await settled();

    expect(queryByPart("select", "content")).toBeNull();
    expect(getByPart("select", "value").textContent).toBe("Alpha");
  });

  test("dismisses on the first outside pointer and blocks outside pointer events while open", async () => {
    const changes: string[] = [];

    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <Select.Root onOpenChange={(_open, detail) => changes.push(detail.reason)}>
          <Select.Trigger>Choose project</Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Listbox>
                  <Select.Item value="alpha">Alpha</Select.Item>
                  <Select.Item value="bravo">Bravo</Select.Item>
                </Select.Listbox>
              </Select.Content>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </>
    ));

    click(getByPart("select", "trigger"));
    await settled();

    expect(queryByPart("select", "content")).not.toBeNull();
    expect(document.body.style.pointerEvents).toBe("none");
    expect(getByPart("select", "content").style.pointerEvents).toBe("auto");

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();

    expect(queryByPart("select", "content")).toBeNull();
    expect(document.body.style.pointerEvents).toBe("");
    expect(changes).toEqual(["trigger", "outside"]);
  });

  test("keeps duplicate value replacements after stale option cleanup", async () => {
    let setShowOldAlpha!: Setter<boolean>;

    render(() => {
      const [showOldAlpha, setShowOldAlphaSignal] = createSignal(true);
      setShowOldAlpha = setShowOldAlphaSignal;

      return (
        <Select.Root defaultValue="alpha">
          <Select.Trigger>Choose project</Select.Trigger>
          <Select.Value />
          <Select.Content>
            <Select.Listbox>
              <Show when={showOldAlpha()}>
                <Select.Item value="alpha">Old Alpha</Select.Item>
              </Show>
              <Select.Item value="alpha">Updated Alpha</Select.Item>
              <Select.Item value="bravo">Bravo</Select.Item>
            </Select.Listbox>
          </Select.Content>
        </Select.Root>
      );
    });

    await settled();

    expect(getByPart("select", "value").textContent).toBe("Updated Alpha");

    setShowOldAlpha(false);
    await settled();

    expect(getByPart("select", "value").textContent).toBe("Updated Alpha");
  });

  test("keeps dynamic options in DOM order and removes stale unmounted items", async () => {
    let setShowAlpha!: Setter<boolean>;
    const changes: string[] = [];

    render(() => {
      const [showAlpha, setShowAlphaSignal] = createSignal(false);
      setShowAlpha = setShowAlphaSignal;

      return (
        <Select.Root defaultOpen onValueChange={(value) => changes.push(value ?? "")}>
          <Select.Trigger>Choose project</Select.Trigger>
          <Select.Content>
            <Select.Listbox>
              <Show when={showAlpha()}>
                <Select.Item value="alpha">Alpha</Select.Item>
              </Show>
              <Select.Item value="bravo">Bravo</Select.Item>
            </Select.Listbox>
          </Select.Content>
        </Select.Root>
      );
    });

    setShowAlpha(true);
    await settled();

    const listbox = getByPart("select", "listbox");
    keyDown(listbox, "ArrowDown");

    expect(document.querySelector('[data-part="item"][data-highlighted]')?.textContent).toBe(
      "Alpha",
    );
    expect(getByPart("select", "item").getAttribute("data-scope")).toBe("select");

    setShowAlpha(false);
    await settled();

    keyDown(listbox, "ArrowDown");
    expect(document.querySelector('[data-part="item"][data-highlighted]')?.textContent).toBe(
      "Bravo",
    );

    keyDown(listbox, "Enter");
    await settled();

    expect(changes).toEqual(["bravo"]);
  });

  test("exposes floating geometry variables on the positioner", async () => {
    render(() => (
      <Select.Root defaultOpen placement="bottom-start">
        <Select.Trigger>Choose project</Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Content>
              <Select.Listbox>
                <Select.Item value="alpha">Alpha</Select.Item>
              </Select.Listbox>
            </Select.Content>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    ));

    const trigger = getByPart("select", "trigger");
    const positioner = getByPart("select", "positioner");

    trigger.getBoundingClientRect = () =>
      ({
        bottom: 48,
        height: 32,
        left: 12,
        right: 132,
        top: 16,
        width: 120,
      }) as DOMRect;
    positioner.getBoundingClientRect = () =>
      ({
        bottom: 0,
        height: 64,
        left: 0,
        right: 0,
        top: 0,
        width: 180,
      }) as DOMRect;

    window.dispatchEvent(new Event("resize"));
    await settled();
    await settled();

    expect(positioner.getAttribute("data-side")).toBe("bottom");
    expect(positioner.getAttribute("data-align")).toBe("start");
    expect(positioner.style.getPropertyValue("--keystone-anchor-width")).toBe("120px");
    expect(positioner.style.getPropertyValue("--anchor-width")).toBe("120px");
  });

  test("keeps nested content unpositioned across positioner remounts", async () => {
    let setOpen!: Setter<boolean>;

    render(() => {
      const [open, setOpenSignal] = createSignal(true);
      setOpen = setOpenSignal;

      return (
        <Select.Root open={open()} onOpenChange={setOpen}>
          <Select.Trigger>Choose project</Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Listbox>
                  <Select.Item value="alpha">Alpha</Select.Item>
                </Select.Listbox>
              </Select.Content>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      );
    });

    const trigger = getByPart("select", "trigger");
    trigger.getBoundingClientRect = () =>
      ({
        bottom: 48,
        height: 32,
        left: 12,
        right: 132,
        top: 16,
        width: 120,
      }) as DOMRect;

    let positioner = getByPart("select", "positioner");
    positioner.getBoundingClientRect = () =>
      ({
        bottom: 0,
        height: 64,
        left: 0,
        right: 0,
        top: 0,
        width: 180,
      }) as DOMRect;

    window.dispatchEvent(new Event("resize"));
    await settled();

    expect(positioner.style.left).toBe("12px");
    expect(getByPart("select", "content").style.left).toBe("");

    setOpen(false);
    await settled();
    expect(queryByPart("select", "content")).toBeNull();

    setOpen(true);
    await settled();
    positioner = getByPart("select", "positioner");
    positioner.getBoundingClientRect = () =>
      ({
        bottom: 0,
        height: 64,
        left: 0,
        right: 0,
        top: 0,
        width: 180,
      }) as DOMRect;
    window.dispatchEvent(new Event("resize"));
    await settled();

    expect(positioner.style.left).toBe("12px");
    expect(getByPart("select", "content").style.left).toBe("");
  });
});
