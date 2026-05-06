import { createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { Drawer } from "../src/drawer/index";
import { click, getByPart, keyDown, pointerDown, queryByPart, render, settled } from "./harness";

describe("Drawer behavior harness", () => {
  test("opens as a side-aware modal dialog and restores focus on close", async () => {
    render(() => (
      <Drawer.Root side="left">
        <Drawer.Trigger>Open drawer</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Title>Filters</Drawer.Title>
              <Drawer.Description>Choose visible filters.</Drawer.Description>
              <button data-testid="field">Focusable</button>
              <Drawer.Close>Close</Drawer.Close>
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Portal>
      </Drawer.Root>
    ));

    const trigger = getByPart("drawer", "trigger");

    trigger.focus();
    click(trigger);
    await settled();

    const content = getByPart("drawer", "content");
    const title = getByPart("drawer", "title");
    const description = getByPart("drawer", "description");

    expect(content.getAttribute("role")).toBe("dialog");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.getAttribute("aria-labelledby")).toBe(title.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id);
    expect(content.getAttribute("data-side")).toBe("left");
    expect(getByPart("drawer", "backdrop").getAttribute("data-side")).toBe("left");
    expect(getByPart("drawer", "positioner").getAttribute("data-side")).toBe("left");
    expect(document.activeElement).toBe(document.querySelector("[data-testid='field']"));
    expect(document.body.style.pointerEvents).toBe("none");

    click(getByPart("drawer", "close"));
    await settled();

    expect(queryByPart("drawer", "content")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.pointerEvents).toBe("");
  });

  test("applies side data to every overlay side", async () => {
    const sides = ["top", "right", "bottom", "left"] as const;

    render(() => (
      <>
        {sides.map((side) => (
          <Drawer.Root defaultOpen side={side}>
            <Drawer.Trigger data-testid={`${side}-trigger`}>{side}</Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Backdrop data-testid={`${side}-backdrop`} />
              <Drawer.Positioner data-testid={`${side}-positioner`}>
                <Drawer.Content data-testid={`${side}-content`}>
                  <Drawer.Title>{side} drawer</Drawer.Title>
                  <Drawer.Description>{side} description</Drawer.Description>
                  <Drawer.Close data-testid={`${side}-close`}>Close</Drawer.Close>
                </Drawer.Content>
              </Drawer.Positioner>
            </Drawer.Portal>
          </Drawer.Root>
        ))}
      </>
    ));
    await settled();

    for (const side of sides) {
      for (const part of ["trigger", "backdrop", "positioner", "content", "close"]) {
        expect(
          document
            .querySelector<HTMLElement>(`[data-testid='${side}-${part}']`)
            ?.getAttribute("data-side"),
        ).toBe(side);
      }
    }
  });

  test("renders through a custom portal mount and supports force-mounted closed state", async () => {
    const mount = document.createElement("section");
    mount.setAttribute("data-testid", "drawer-portal-mount");
    document.body.append(mount);

    render(() => (
      <Drawer.Root>
        <Drawer.Trigger>Open drawer</Drawer.Trigger>
        <Drawer.Portal mount={mount} forceMount>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Title>Portal drawer</Drawer.Title>
              <Drawer.Description>Rendered in a custom mount.</Drawer.Description>
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Portal>
      </Drawer.Root>
    ));
    await settled();

    const content = getByPart("drawer", "content", mount);
    expect(content.hidden).toBe(true);
    expect(content.getAttribute("data-state")).toBe("closed");

    click(getByPart("drawer", "trigger"));
    await settled();

    expect(getByPart("drawer", "content", mount).hidden).toBe(false);
    expect(getByPart("drawer", "content", mount).getAttribute("data-state")).toBe("open");
  });

  test("dismisses nested modal drawers in top-layer order", async () => {
    render(() => {
      const [outerOpen, setOuterOpen] = createSignal(true);
      const [innerOpen, setInnerOpen] = createSignal(true);

      return (
        <>
          <Drawer.Root open={outerOpen()} onOpenChange={setOuterOpen} side="left">
            <Drawer.Trigger>Open outer</Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Content data-testid="outer-content">
                <Drawer.Title>Outer drawer</Drawer.Title>
                <Drawer.Description>Outer description.</Drawer.Description>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>

          <Drawer.Root open={innerOpen()} onOpenChange={setInnerOpen} side="right">
            <Drawer.Trigger>Open inner</Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Content data-testid="inner-content">
                <Drawer.Title>Inner drawer</Drawer.Title>
                <Drawer.Description>Inner description.</Drawer.Description>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </>
      );
    });
    await settled();

    const outer = document.querySelector<HTMLElement>("[data-testid='outer-content']")!;
    const inner = document.querySelector<HTMLElement>("[data-testid='inner-content']")!;

    expect(inner.getAttribute("data-top-layer")).toBe("");

    keyDown(inner, "Escape");
    await settled();

    expect(document.querySelector("[data-testid='inner-content']")).toBeNull();
    expect(document.querySelector("[data-testid='outer-content']")).not.toBeNull();
    expect(outer.getAttribute("data-top-layer")).toBe("");

    keyDown(outer, "Escape");
    await settled();

    expect(document.querySelector("[data-testid='outer-content']")).toBeNull();
  });

  test("allows preventable outside and Escape dismissal", async () => {
    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <Drawer.Root>
          <Drawer.Trigger>Open drawer</Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Content
              onEscapeKeyDown={(event) => event.preventDefault()}
              onInteractOutside={(event) => event.preventDefault()}
            >
              <Drawer.Title>Filters</Drawer.Title>
              <Drawer.Description>Choose visible filters.</Drawer.Description>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </>
    ));

    click(getByPart("drawer", "trigger"));
    await settled();

    const content = getByPart("drawer", "content");
    keyDown(content, "Escape");
    await settled();
    expect(queryByPart("drawer", "content")).not.toBeNull();

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();
    expect(queryByPart("drawer", "content")).not.toBeNull();
  });
});
