import { describe, expect, test } from "vitest";
import { createSignal } from "solid-js";
import { Dialog } from "../src/dialog/index";
import { click, getByPart, keyDown, pointerDown, queryByPart, render, settled } from "./harness";

describe("Dialog behavior harness", () => {
  test("renders closed content lazily, opens from trigger, and closes on Escape", async () => {
    render(() => (
      <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Project settings</Dialog.Title>
            <Dialog.Description>Change project metadata.</Dialog.Description>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    ));

    const trigger = getByPart("dialog", "trigger");

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(queryByPart("dialog", "content")).toBeNull();

    click(trigger);
    await settled();

    const content = getByPart("dialog", "content");
    const title = getByPart("dialog", "title");
    const description = getByPart("dialog", "description");

    expect(content.getAttribute("role")).toBe("dialog");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.getAttribute("aria-labelledby")).toBe(title.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id);
    expect(content.getAttribute("data-state")).toBe("open");

    keyDown(content, "Escape");
    await settled();

    expect(queryByPart("dialog", "content")).toBeNull();
  });

  test("dismisses from outside pointer interactions with a preventable event", async () => {
    const changes: string[] = [];

    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <Dialog.Root onOpenChange={(_open, detail) => changes.push(detail.reason)}>
          <Dialog.Trigger>Open dialog</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>Project settings</Dialog.Title>
              <Dialog.Description>Change project metadata.</Dialog.Description>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    ));

    click(getByPart("dialog", "trigger"));
    await settled();

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();

    expect(queryByPart("dialog", "content")).toBeNull();
    expect(changes).toEqual(["trigger", "outside"]);
  });

  test("does not dismiss when outside interaction is prevented", async () => {
    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <Dialog.Root>
          <Dialog.Trigger>Open dialog</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content onInteractOutside={(event) => event.preventDefault()}>
              <Dialog.Title>Project settings</Dialog.Title>
              <Dialog.Description>Change project metadata.</Dialog.Description>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    ));

    click(getByPart("dialog", "trigger"));
    await settled();

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();

    expect(queryByPart("dialog", "content")).not.toBeNull();
  });

  test("does not dismiss when Escape is prevented", async () => {
    render(() => (
      <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content onEscapeKeyDown={(event) => event.preventDefault()}>
            <Dialog.Title>Project settings</Dialog.Title>
            <Dialog.Description>Change project metadata.</Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    ));

    click(getByPart("dialog", "trigger"));
    await settled();

    keyDown(getByPart("dialog", "content"), "Escape");
    await settled();

    expect(queryByPart("dialog", "content")).not.toBeNull();
  });

  test("dismisses nested dialogs in top-layer order", async () => {
    render(() => {
      const [outerOpen, setOuterOpen] = createSignal(true);
      const [innerOpen, setInnerOpen] = createSignal(true);

      return (
        <>
          <Dialog.Root open={outerOpen()} onOpenChange={setOuterOpen} modal={false}>
            <Dialog.Trigger data-testid="outer-trigger">Open outer</Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content
                data-testid="outer-content"
                onFocusOutside={(event) => event.preventDefault()}
              >
                <Dialog.Title>Outer settings</Dialog.Title>
                <Dialog.Description>Outer description.</Dialog.Description>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <Dialog.Root open={innerOpen()} onOpenChange={setInnerOpen}>
            <Dialog.Trigger data-testid="inner-trigger">Open inner</Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content data-testid="inner-content">
                <Dialog.Title>Inner settings</Dialog.Title>
                <Dialog.Description>Inner description.</Dialog.Description>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
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
  });

  test("moves focus into modal content and restores focus to the trigger", async () => {
    render(() => (
      <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Project settings</Dialog.Title>
            <Dialog.Description>Change project metadata.</Dialog.Description>
            <button data-testid="first-field">Focusable</button>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    ));

    const trigger = getByPart("dialog", "trigger");
    trigger.focus();
    click(trigger);
    await settled();

    expect(document.activeElement).toBe(document.querySelector("[data-testid='first-field']"));

    click(getByPart("dialog", "close"));
    await settled();

    expect(document.activeElement).toBe(trigger);
  });

  test("traps Tab focus within modal content", async () => {
    render(() => (
      <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Project settings</Dialog.Title>
            <Dialog.Description>Change project metadata.</Dialog.Description>
            <button data-testid="first-field">First</button>
            <button data-testid="last-field">Last</button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    ));

    click(getByPart("dialog", "trigger"));
    await settled();

    const first = document.querySelector<HTMLElement>("[data-testid='first-field']")!;
    const last = document.querySelector<HTMLElement>("[data-testid='last-field']")!;

    last.focus();
    keyDown(getByPart("dialog", "content"), "Tab");
    expect(document.activeElement).toBe(first);

    first.focus();
    getByPart("dialog", "content").dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Tab",
        shiftKey: true,
      }),
    );

    expect(document.activeElement).toBe(last);
  });
});
