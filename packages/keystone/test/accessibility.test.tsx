import { describe, expect, test } from "vitest";
import { render } from "./harness";
import {
  expectAriaRelationship,
  expectAriaState,
  expectFocus,
  expectFormValues,
  expectPart,
  expectRole,
  runKeyboardTable,
  withDirection,
  withReducedMotion,
} from "./accessibility";

describe("accessibility spec harness", () => {
  test("asserts roles, parts, ARIA relationships, keyboard tables, focus, and form values", async () => {
    const { container } = render(() => (
      <form>
        <button
          data-part="trigger"
          data-scope="select"
          aria-controls="listbox"
          aria-expanded="false"
          type="button"
        >
          Project
        </button>
        <div id="listbox" role="listbox" />
        <input name="project" value="alpha" />
      </form>
    ));
    const trigger = container.querySelector("button")!;
    const listbox = container.querySelector("#listbox") as HTMLDivElement;
    const form = container.querySelector("form")!;

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        trigger.setAttribute("aria-expanded", "true");
        listbox.focus();
      }
    });

    expectPart(trigger, "select", "trigger");
    expectRole(listbox, "listbox");
    expectAriaRelationship({
      source: trigger,
      attribute: "aria-controls",
      targets: [listbox],
    });

    await runKeyboardTable([
      {
        target: trigger,
        key: "ArrowDown",
        defaultPrevented: true,
        after: () => {
          expectAriaState(trigger, "aria-expanded", "true");
          expectFocus(listbox);
        },
      },
    ]);

    expectFormValues(form, { project: "alpha" });
  });

  test("scopes direction and reduced-motion hooks", async () => {
    await withDirection("rtl", () => {
      expect(document.documentElement.dir).toBe("rtl");
    });
    expect(document.documentElement.getAttribute("dir")).toBeNull();

    await withReducedMotion(() => {
      expect(matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(true);
    });
  });
});
