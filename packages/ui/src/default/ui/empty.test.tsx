import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { Empty, EmptyAction, EmptyDescription, EmptyIcon, EmptyRoot, EmptyTitle } from "./empty";

describe("Empty", () => {
  test("renders status semantics and stable anatomy hooks", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <Empty
          icon={<svg aria-hidden="true" />}
          title="No projects"
          description="Create a project to start tracking work."
          action={<button type="button">Create project</button>}
        />
      ),
      host,
    );

    const root = host.querySelector("[data-slot='empty']");

    expect(root?.getAttribute("role")).toBe("status");
    expect(root?.getAttribute("data-scope")).toBe("ui-empty");
    expect(root?.getAttribute("data-part")).toBe("root");
    expect(root?.getAttribute("data-variant")).toBe("bordered");
    expect(host.querySelector("[data-slot='empty-icon']")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(host.querySelector("[data-slot='empty-title']")?.textContent).toBe("No projects");
    expect(host.querySelector("[data-slot='empty-description']")?.textContent).toContain(
      "Create a project",
    );
    expect(host.querySelector("[data-slot='empty-action'] button")?.getAttribute("type")).toBe(
      "button",
    );

    dispose();
  });

  test("supports source-owned composition and caller-owned roles", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <EmptyRoot role="note" variant="plain" size="compact" aria-label="No filters matched">
          <EmptyIcon aria-hidden="false">?</EmptyIcon>
          <EmptyTitle>No matches</EmptyTitle>
          <EmptyDescription>Try another filter.</EmptyDescription>
          <EmptyAction>
            <a href="/items">View all</a>
          </EmptyAction>
        </EmptyRoot>
      ),
      host,
    );

    const root = host.querySelector("[data-slot='empty']");

    expect(root?.getAttribute("role")).toBe("note");
    expect(root?.getAttribute("aria-label")).toBe("No filters matched");
    expect(root?.getAttribute("data-size")).toBe("compact");
    expect(root?.getAttribute("data-variant")).toBe("plain");
    expect(host.querySelector("[data-slot='empty-icon']")?.getAttribute("aria-hidden")).toBe(
      "false",
    );
    expect(host.querySelector("[data-slot='empty-action'] a")?.getAttribute("href")).toBe("/items");

    dispose();
  });
});
