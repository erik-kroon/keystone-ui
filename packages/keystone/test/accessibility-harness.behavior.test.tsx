import { describe, expect, test } from "vitest";
import { Dialog } from "../src/dialog/index";
import { createFormControl } from "../src/form/index";
import { Popover } from "../src/popover/index";
import { Select } from "../src/select/index";
import { Sheet } from "../src/sheet/index";
import { Tooltip } from "../src/tooltip/index";
import {
  expectAriaRelationship,
  expectFocusRestore,
  expectFormReset,
  expectFormValues,
  expectHydrationSmoke,
  expectOutsideDismissal,
  expectRole,
  expectStablePartAttributes,
  runKeyboardTable,
} from "./accessibility";
import { click, getByPart, queryByPart, render, settled } from "./harness";

describe("primitive accessibility verification harness adoption", () => {
  test("checks Dialog focus, ARIA relationships, and hydration smoke", async () => {
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
              <Dialog.Close>Close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    ));

    const trigger = getByPart("dialog", "trigger");

    await expectFocusRestore({
      trigger,
      open: () => click(trigger),
      close: () => click(getByPart("dialog", "close")),
    });

    click(trigger);
    await settled();

    const content = getByPart("dialog", "content");
    expectRole(content, "dialog");
    expectStablePartAttributes({
      target: content,
      scope: "dialog",
      part: "content",
      attributes: ["aria-labelledby", "aria-describedby", "data-state"],
    });
    expectAriaRelationship({
      source: content,
      attribute: "aria-labelledby",
      targets: [getByPart("dialog", "title")],
    });
    expectAriaRelationship({
      source: content,
      attribute: "aria-describedby",
      targets: [getByPart("dialog", "description")],
    });

    expectHydrationSmoke({
      html: `<button type="button" data-scope="dialog" data-part="trigger">Open dialog</button>`,
      expectedText: "Open dialog",
    });
  });

  test("checks outside dismissal with a Dialog fixture", async () => {
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

    await expectOutsideDismissal({
      open: () => click(getByPart("dialog", "trigger")),
      outside: document.querySelector<HTMLElement>("[data-testid='outside']")!,
      assertDismissed: () => expect(queryByPart("dialog", "content")).toBeNull(),
    });
  });

  test("checks overlay family part contracts through Popover, Tooltip, and Sheet", async () => {
    render(() => (
      <>
        <Popover.Root defaultOpen>
          <Popover.Trigger>Popover trigger</Popover.Trigger>
          <Popover.Content>Popover content</Popover.Content>
        </Popover.Root>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Tooltip trigger</Tooltip.Trigger>
          <Tooltip.Content>Tooltip content</Tooltip.Content>
        </Tooltip.Root>
        <Sheet.Root defaultOpen side="left">
          <Sheet.Trigger>Sheet trigger</Sheet.Trigger>
          <Sheet.Content>
            <Sheet.Title>Sheet title</Sheet.Title>
            <Sheet.Description>Sheet description</Sheet.Description>
          </Sheet.Content>
        </Sheet.Root>
      </>
    ));
    await settled();

    expectStablePartAttributes({
      target: getByPart("popover", "content"),
      scope: "popover",
      part: "content",
      attributes: ["role", "data-state"],
    });
    expectStablePartAttributes({
      target: getByPart("tooltip", "content"),
      scope: "tooltip",
      part: "content",
      attributes: ["role", "data-state"],
    });
    expectStablePartAttributes({
      target: getByPart("sheet", "content"),
      scope: "sheet",
      part: "content",
      attributes: ["role", "aria-labelledby", "aria-describedby", "data-side"],
    });

    expect(getByPart("sheet", "content")).not.toBeNull();
  });

  test("checks Select and Listbox keyboard, parts, form submission, and reset", async () => {
    render(() => (
      <form>
        <Select.Root name="project" defaultOpen defaultValue="alpha">
          <Select.Trigger>Choose project</Select.Trigger>
          <Select.Value />
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
      </form>
    ));

    const listbox = getByPart("select", "listbox");
    expectRole(listbox, "listbox");
    expectStablePartAttributes({
      target: listbox,
      scope: "select",
      part: "listbox",
    });

    await runKeyboardTable([
      {
        key: "ArrowDown",
        target: listbox,
        after: () => {
          expect(document.querySelector('[data-part="item"][data-highlighted]')?.textContent).toBe(
            "Alpha",
          );
        },
      },
      {
        key: "b",
        target: listbox,
        after: () => {
          expect(document.querySelector('[data-part="item"][data-highlighted]')?.textContent).toBe(
            "Bravo",
          );
        },
      },
      {
        key: "Enter",
        target: listbox,
      },
    ]);

    const form = document.querySelector("form")!;
    expectFormValues(form, { project: "bravo" });
    await expectFormReset({
      form,
      beforeReset: { project: "bravo" },
      afterReset: { project: "alpha" },
    });
  });

  test("checks Field/FormControl ARIA, data attributes, form values, and hydration smoke", () => {
    render(() => {
      const field = createFormControl({
        id: () => "project",
        name: () => "project",
        value: () => "alpha",
        invalid: () => true,
        required: () => true,
      });

      return (
        <form>
          <div {...field.getRootProps()}>
            <label {...field.getLabelProps()}>Project</label>
            <input {...field.getControlProps()} value="alpha" />
            <p {...field.getDescriptionProps()}>Choose the active project.</p>
            <p {...field.getErrorMessageProps()}>Project is required.</p>
            <input {...field.getHiddenInputProps()} />
          </div>
        </form>
      );
    });

    const control = getByPart("form-control", "control");
    const hiddenInput = getByPart("form-control", "hidden-input") as HTMLInputElement;
    const form = document.querySelector("form")!;

    expectStablePartAttributes({
      target: control,
      scope: "form-control",
      part: "control",
      attributes: ["aria-labelledby", "aria-describedby", "aria-invalid", "data-required"],
    });
    expectAriaRelationship({
      source: control,
      attribute: "aria-labelledby",
      targets: [getByPart("form-control", "label")],
    });
    expectAriaRelationship({
      source: control,
      attribute: "aria-describedby",
      targets: [
        getByPart("form-control", "description"),
        getByPart("form-control", "error-message"),
      ],
    });
    expectFormValues(form, { project: "alpha" });
    expect(hiddenInput.value).toBe("alpha");

    expectHydrationSmoke({
      html: `<form><label id="project-label" for="project" data-scope="form-control" data-part="label">Project</label><input id="project" aria-labelledby="project-label" value="alpha" data-scope="form-control" data-part="control"></form>`,
      expectedText: "Project",
    });
  });
});
