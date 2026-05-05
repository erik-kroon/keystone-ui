import { createRoot, createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { AlertDialog, createAlertDialog } from "../src/alert-dialog/index";
import { click, getByPart, keyDown, pointerDown, queryByPart, render, settled } from "./harness";

describe("AlertDialog behavior harness", () => {
  test("renders alertdialog semantics and focuses the cancel action by default", async () => {
    render(() => (
      <AlertDialog.Root>
        <AlertDialog.Trigger>Delete project</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Content>
            <AlertDialog.Title>Delete project?</AlertDialog.Title>
            <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
            <AlertDialog.Action>Delete</AlertDialog.Action>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    ));

    const trigger = getByPart("alert-dialog", "trigger");

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(queryByPart("alert-dialog", "content")).toBeNull();

    click(trigger);
    await settled();

    const content = getByPart("alert-dialog", "content");
    const title = getByPart("alert-dialog", "title");
    const description = getByPart("alert-dialog", "description");
    const cancel = getByPart("alert-dialog", "cancel");

    expect(content.getAttribute("role")).toBe("alertdialog");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.getAttribute("aria-labelledby")).toBe(title.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id);
    expect(content.getAttribute("data-state")).toBe("open");
    expect(document.activeElement).toBe(cancel);
  });

  test("keeps outside pointer interactions from dismissing while still notifying handlers", async () => {
    const outsideEvents: string[] = [];

    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <AlertDialog.Root>
          <AlertDialog.Trigger>Delete project</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Content
              onPointerDownOutside={(event) => {
                outsideEvents.push(event.type);
                expect(event.defaultPrevented).toBe(false);
              }}
              onInteractOutside={(event) => outsideEvents.push(event.type)}
            >
              <AlertDialog.Title>Delete project?</AlertDialog.Title>
              <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Delete</AlertDialog.Action>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </>
    ));

    click(getByPart("alert-dialog", "trigger"));
    await settled();

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();

    expect(queryByPart("alert-dialog", "content")).not.toBeNull();
    expect(outsideEvents).toEqual(["keystone.pointerDownOutside", "keystone.pointerDownOutside"]);
  });

  test("closes with Escape as a cancel path and returns focus to the trigger", async () => {
    const changes: string[] = [];

    render(() => (
      <AlertDialog.Root onOpenChange={(_open, detail) => changes.push(detail.reason)}>
        <AlertDialog.Trigger>Delete project</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Content>
            <AlertDialog.Title>Delete project?</AlertDialog.Title>
            <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action>Delete</AlertDialog.Action>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    ));

    const trigger = getByPart("alert-dialog", "trigger");

    trigger.focus();
    click(trigger);
    await settled();

    keyDown(getByPart("alert-dialog", "content"), "Escape");
    await settled();

    expect(queryByPart("alert-dialog", "content")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(changes).toEqual(["trigger", "escape"]);
  });

  test("does not dismiss when Escape is prevented", async () => {
    render(() => (
      <AlertDialog.Root>
        <AlertDialog.Trigger>Delete project</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Content onEscapeKeyDown={(event) => event.preventDefault()}>
            <AlertDialog.Title>Delete project?</AlertDialog.Title>
            <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action>Delete</AlertDialog.Action>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    ));

    click(getByPart("alert-dialog", "trigger"));
    await settled();

    keyDown(getByPart("alert-dialog", "content"), "Escape");
    await settled();

    expect(queryByPart("alert-dialog", "content")).not.toBeNull();
  });

  test("distinguishes cancel and action close reasons without submitting forms accidentally", async () => {
    const reasons: string[] = [];
    const submissions: string[] = [];

    render(() => (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submissions.push("submit");
        }}
      >
        <AlertDialog.Root onOpenChange={(_open, detail) => reasons.push(detail.reason)}>
          <AlertDialog.Trigger>Delete project</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Content>
              <AlertDialog.Title>Delete project?</AlertDialog.Title>
              <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Delete</AlertDialog.Action>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </form>
    ));

    click(getByPart("alert-dialog", "trigger"));
    await settled();
    click(getByPart("alert-dialog", "cancel"));
    await settled();

    click(getByPart("alert-dialog", "trigger"));
    await settled();
    click(getByPart("alert-dialog", "action"));
    await settled();

    expect(reasons).toEqual(["trigger", "cancel", "trigger", "action"]);
    expect(submissions).toEqual([]);
  });

  test("supports controlled open state and force-mounted hidden content", async () => {
    function Controlled() {
      const [open, setOpen] = createSignal(false);

      return (
        <AlertDialog.Root open={open()} onOpenChange={setOpen}>
          <AlertDialog.Trigger>Delete project</AlertDialog.Trigger>
          <AlertDialog.Portal forceMount>
            <AlertDialog.Content>
              <AlertDialog.Title>Delete project?</AlertDialog.Title>
              <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Delete</AlertDialog.Action>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      );
    }

    render(() => <Controlled />);

    const trigger = getByPart("alert-dialog", "trigger");
    const content = getByPart("alert-dialog", "content");

    expect(content.hidden).toBe(true);
    expect(content.getAttribute("data-state")).toBe("closed");

    click(trigger);
    await settled();

    expect(content.hidden).toBe(false);
    expect(content.getAttribute("data-state")).toBe("open");
  });

  test("exposes the low-level createAlertDialog contract", () => {
    createRoot((dispose) => {
      const api = createAlertDialog({ defaultOpen: true });

      expect(api.open()).toBe(true);
      expect(api.getContentProps({}).role).toBe("alertdialog");
      expect(api.getTitleProps({})["data-scope"]).toBe("alert-dialog");

      dispose();
    });
  });
});
