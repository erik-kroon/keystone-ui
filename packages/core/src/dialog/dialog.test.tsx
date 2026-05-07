import { createSignal, type Setter } from "solid-js";
import { describe, expect, test } from "vitest";
import { Dialog } from "./index";
import { getByPart, render } from "../../test/harness";

describe("dialog presence attributes", () => {
  test("keeps backdrop, positioner, and content transition attributes in sync", async () => {
    let setOpen!: Setter<boolean>;

    render(() => {
      const [open, setOpenSignal] = createSignal(false);
      setOpen = setOpenSignal;

      return (
        <Dialog.Root open={open()} onOpenChange={setOpen}>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>Details</Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Portal>
        </Dialog.Root>
      );
    });

    setOpen(true);
    await Promise.resolve();

    for (const part of ["backdrop", "positioner", "content"]) {
      const element = getByPart("dialog", part);
      expect(element.getAttribute("data-state")).toBe("open");
      expect(element.getAttribute("data-transition-status")).toBe("opening");
      expect(element.hasAttribute("data-starting-style")).toBe(true);
      expect(element.hasAttribute("data-ending-style")).toBe(false);
    }

    setOpen(false);
    await Promise.resolve();

    for (const part of ["backdrop", "positioner", "content"]) {
      const element = getByPart("dialog", part);
      expect(element.getAttribute("data-state")).toBe("closed");
      expect(element.getAttribute("data-transition-status")).toBe("closing");
      expect(element.hasAttribute("data-starting-style")).toBe(false);
      expect(element.hasAttribute("data-ending-style")).toBe(true);
    }
  });
});
