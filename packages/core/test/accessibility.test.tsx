import { describe, expect, test } from "vitest";
import { render } from "./harness";
import {
  expectAriaRelationship,
  expectAriaState,
  expectFocus,
  expectFocusTrap,
  expectFormValues,
  expectHydrationSmoke,
  expectPart,
  expectRole,
  expectSsrSmoke,
  expectStablePartAttributes,
  runKeyboardTable,
  withDirection,
  withForcedColors,
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
    expectStablePartAttributes({
      target: trigger,
      scope: "select",
      part: "trigger",
      attributes: ["aria-controls", "aria-expanded"],
    });
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

  test("asserts focus traps and hydration smoke output", () => {
    const first = document.createElement("button");
    const last = document.createElement("button");
    const container = document.createElement("div");
    container.append(first, last);
    document.body.append(container);

    container.addEventListener("keydown", (event) => {
      if (event.key === "Tab" && event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (event.key === "Tab" && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    expectFocusTrap({ container, first, last });
    expectSsrSmoke({
      html: `<button data-scope="button">Rendered</button>`,
      expectedText: "Rendered",
    });
    expectHydrationSmoke({
      html: `<label for="project">Project</label>`,
      expectedText: "Project",
    });
  });

  test("scopes direction, reduced-motion, and forced-colors hooks", async () => {
    await withDirection("rtl", () => {
      expect(document.documentElement.dir).toBe("rtl");
    });
    expect(document.documentElement.getAttribute("dir")).toBeNull();

    await withReducedMotion(() => {
      expect(matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(true);
    });

    await withForcedColors(() => {
      expect(matchMedia("(forced-colors: active)").matches).toBe(true);
    });
  });
});
