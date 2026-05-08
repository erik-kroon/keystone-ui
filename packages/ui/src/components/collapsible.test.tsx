import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";

describe("Collapsible", () => {
  test("keeps caller spacing on inner content instead of the measured panel", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent class="mt-4 rounded-md">Panel content</CollapsibleContent>
        </Collapsible>
      ),
      host,
    );

    const panel = host.querySelector<HTMLElement>("[data-slot='collapsible-panel']");
    const content = host.querySelector<HTMLElement>("[data-slot='collapsible-content']");

    expect(panel?.className).toContain("ui-collapsible-panel");
    expect(panel?.className).toContain("overflow-hidden");
    expect(panel?.className).not.toContain("mt-4");
    expect(content?.getAttribute("data-part")).toBe("content-inner");
    expect(content?.className).toContain("ui-collapsible-content");
    expect(content?.className).toContain("mt-4");
    expect(content?.textContent).toBe("Panel content");

    dispose();
  });
});
