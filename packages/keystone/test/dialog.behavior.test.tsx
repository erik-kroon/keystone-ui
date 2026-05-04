import { describe, expect, test } from "vitest";
import { createSignal } from "solid-js";
import { Dialog } from "../src/dialog/index";
import { click, getByPart, keyDown, pointerDown, queryByPart, render, settled } from "./harness";

function animationFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

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

  test("marks outside body content inert while modal dialogs are open and restores it on close", async () => {
    const outsideRoot = document.createElement("main");
    outsideRoot.setAttribute("data-testid", "outside-root");
    outsideRoot.setAttribute("aria-hidden", "false");
    document.body.append(outsideRoot);

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

    click(getByPart("dialog", "trigger"));
    await settled();

    expect(outsideRoot.getAttribute("aria-hidden")).toBe("true");
    expect(outsideRoot.inert).toBe(true);
    expect(outsideRoot.hasAttribute("inert")).toBe(true);

    click(getByPart("dialog", "close"));
    await settled();

    expect(outsideRoot.getAttribute("aria-hidden")).toBe("false");
    expect(outsideRoot.inert).toBe(false);
    expect(outsideRoot.hasAttribute("inert")).toBe(false);
  });

  test("marks outside body content added after opening inert and restores it on close", async () => {
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

    click(getByPart("dialog", "trigger"));
    await settled();

    const lateOutsideRoot = document.createElement("aside");
    lateOutsideRoot.setAttribute("data-testid", "late-outside-root");
    document.body.append(lateOutsideRoot);
    await settled();

    expect(lateOutsideRoot.getAttribute("aria-hidden")).toBe("true");
    expect(lateOutsideRoot.inert).toBe(true);
    expect(lateOutsideRoot.hasAttribute("inert")).toBe(true);

    click(getByPart("dialog", "close"));
    await settled();

    expect(lateOutsideRoot.getAttribute("aria-hidden")).toBeNull();
    expect(lateOutsideRoot.inert).toBe(false);
    expect(lateOutsideRoot.hasAttribute("inert")).toBe(false);
  });

  test("excludes the trigger from outside dismissal while open", async () => {
    render(() => (
      <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Project settings</Dialog.Title>
            <Dialog.Description>Change project metadata.</Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    ));

    const trigger = getByPart("dialog", "trigger");

    click(trigger);
    await settled();

    pointerDown(trigger);
    await settled();

    expect(queryByPart("dialog", "content")).not.toBeNull();
  });

  test("keeps modal dialogs open for context-menu pointer outside", async () => {
    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <Dialog.Root>
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

    document.querySelector<HTMLElement>("[data-testid='outside']")!.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        button: 2,
        cancelable: true,
      }),
    );
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

  test("keeps closed content mounted until exit transition completes", async () => {
    const complete: string[] = [];

    render(() => (
      <Dialog.Root
        onOpenChangeComplete={(open, detail) =>
          complete.push(`${open ? "open" : "closed"}:${detail.preventedUnmount}`)
        }
      >
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content style="transition-duration: 100ms;">
            <Dialog.Title>Project settings</Dialog.Title>
            <Dialog.Description>Change project metadata.</Dialog.Description>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    ));

    click(getByPart("dialog", "trigger"));
    await animationFrame();
    getByPart("dialog", "content").dispatchEvent(new Event("transitionend"));
    await settled();

    expect(complete).toEqual(["open:false"]);

    keyDown(getByPart("dialog", "content"), "Escape");
    await settled();

    const closingContent = getByPart("dialog", "content");
    expect(closingContent.getAttribute("data-state")).toBe("closed");
    expect(closingContent.getAttribute("data-transition-status")).toBe("closing");

    await animationFrame();
    closingContent.dispatchEvent(new Event("transitionend"));
    await settled();

    expect(queryByPart("dialog", "content")).toBeNull();
    expect(complete).toEqual(["open:false", "closed:false"]);
  });

  test("keeps force-mounted content present across the closed presence lifecycle", async () => {
    const complete: string[] = [];
    const outsideRoot = document.createElement("main");
    outsideRoot.setAttribute("data-testid", "outside-root");
    document.body.append(outsideRoot);

    render(() => {
      const [open, setOpen] = createSignal(false);

      return (
        <Dialog.Root
          open={open()}
          onOpenChange={setOpen}
          onOpenChangeComplete={(nextOpen, detail) =>
            complete.push(`${nextOpen ? "open" : "closed"}:${detail.preventedUnmount}`)
          }
        >
          <Dialog.Trigger>Open dialog</Dialog.Trigger>
          <Dialog.Portal forceMount>
            <Dialog.Content style="transition-duration: 100ms;">
              <Dialog.Title>Project settings</Dialog.Title>
              <Dialog.Description>Change project metadata.</Dialog.Description>
              <Dialog.Close>Close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      );
    });

    await settled();

    const content = getByPart("dialog", "content");
    expect(content.getAttribute("data-state")).toBe("closed");
    expect(content.getAttribute("data-transition-status")).toBe("closed");
    expect(outsideRoot.getAttribute("aria-hidden")).toBeNull();
    expect(outsideRoot.inert).toBe(false);

    click(getByPart("dialog", "trigger"));
    await settled();

    expect(content.getAttribute("data-state")).toBe("open");
    expect(content.getAttribute("data-transition-status")).toBe("opening");
    expect(outsideRoot.getAttribute("aria-hidden")).toBe("true");
    expect(outsideRoot.inert).toBe(true);

    await animationFrame();
    content.dispatchEvent(new Event("transitionend"));
    await settled();

    expect(content.getAttribute("data-transition-status")).toBe("open");
    expect(complete).toEqual(["open:false"]);

    keyDown(content, "Escape");
    await settled();

    expect(content.getAttribute("data-state")).toBe("closed");
    expect(content.getAttribute("data-transition-status")).toBe("closing");

    await animationFrame();
    content.dispatchEvent(new Event("transitionend"));
    await settled();

    expect(getByPart("dialog", "content")).toBe(content);
    expect(content.getAttribute("data-transition-status")).toBe("closed");
    expect(outsideRoot.getAttribute("aria-hidden")).toBeNull();
    expect(outsideRoot.inert).toBe(false);
    expect(complete).toEqual(["open:false", "closed:true"]);
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

  test("does not restore non-modal focus after outside interaction dismissal", async () => {
    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <Dialog.Root modal={false}>
          <Dialog.Trigger>Open dialog</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>Project settings</Dialog.Title>
              <Dialog.Description>Change project metadata.</Dialog.Description>
              <Dialog.Close>Close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    ));

    const trigger = getByPart("dialog", "trigger");
    const outside = document.querySelector<HTMLElement>("[data-testid='outside']")!;

    trigger.focus();
    click(trigger);
    await settled();

    pointerDown(outside);
    outside.focus();
    await settled();

    expect(queryByPart("dialog", "content")).toBeNull();
    expect(document.activeElement).toBe(outside);
  });

  test("restores non-modal focus to the trigger when closed from inside", async () => {
    render(() => (
      <Dialog.Root modal={false}>
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

    trigger.focus();
    click(trigger);
    await settled();

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

  test("allows mount autofocus to be prevented", async () => {
    render(() => (
      <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content onMountAutoFocus={(event) => event.preventDefault()}>
            <Dialog.Title>Project settings</Dialog.Title>
            <Dialog.Description>Change project metadata.</Dialog.Description>
            <button data-testid="first-field">First</button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    ));

    const trigger = getByPart("dialog", "trigger");

    trigger.focus();
    click(trigger);
    await settled();

    expect(document.activeElement).toBe(trigger);
  });

  test("allows unmount autofocus to be prevented", async () => {
    render(() => (
      <>
        <button data-testid="fallback-focus">Fallback</button>
        <Dialog.Root>
          <Dialog.Trigger>Open dialog</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content
              onUnmountAutoFocus={(event) => {
                event.preventDefault();
                queueMicrotask(() =>
                  document.querySelector<HTMLElement>("[data-testid='fallback-focus']")!.focus(),
                );
              }}
            >
              <Dialog.Title>Project settings</Dialog.Title>
              <Dialog.Description>Change project metadata.</Dialog.Description>
              <button data-testid="first-field">First</button>
              <Dialog.Close>Close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    ));

    const trigger = getByPart("dialog", "trigger");
    const fallback = document.querySelector<HTMLElement>("[data-testid='fallback-focus']")!;

    trigger.focus();
    click(trigger);
    await settled();

    click(getByPart("dialog", "close"));
    await settled();

    expect(document.activeElement).toBe(fallback);
  });

  test("restores the last focused element when modal focus leaves programmatically", async () => {
    render(() => (
      <>
        <button data-testid="outside">Outside</button>
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
      </>
    ));

    click(getByPart("dialog", "trigger"));
    await settled();

    const outside = document.querySelector<HTMLElement>("[data-testid='outside']")!;
    const last = document.querySelector<HTMLElement>("[data-testid='last-field']")!;

    last.focus();
    outside.focus();
    await settled();

    expect(document.activeElement).toBe(last);
  });
});
