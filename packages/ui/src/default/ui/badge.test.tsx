import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { Badge, badgeClass } from "./badge";

describe("Badge", () => {
  test("renders presentational inline status text with stable data attributes", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <Badge id="service-status" variant="success" size="sm">
          Healthy
        </Badge>
      ),
      host,
    );

    const badge = host.querySelector<HTMLSpanElement>("[data-slot='badge']");

    expect(badge?.tagName).toBe("SPAN");
    expect(badge?.getAttribute("id")).toBe("service-status");
    expect(badge?.getAttribute("data-scope")).toBe("ui-badge");
    expect(badge?.getAttribute("data-part")).toBe("root");
    expect(badge?.getAttribute("data-variant")).toBe("success");
    expect(badge?.getAttribute("data-size")).toBe("sm");
    expect(badge?.getAttribute("role")).toBeNull();
    expect(badge?.className).toContain("inline-flex");
    expect(badge?.className).toContain("text-emerald-700");

    dispose();
  });

  test("defaults to the primary visual contract and allows caller-owned semantics", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <Badge role="status" aria-label="Build status" class="custom-badge">
          Queued
        </Badge>
      ),
      host,
    );

    const badge = host.querySelector("[data-slot='badge']");

    expect(badge?.getAttribute("role")).toBe("status");
    expect(badge?.getAttribute("aria-label")).toBe("Build status");
    expect(badge?.getAttribute("data-variant")).toBe("default");
    expect(badge?.getAttribute("data-size")).toBe("default");
    expect(badge?.className).toContain("bg-primary");
    expect(badge?.className).toContain("custom-badge");

    dispose();
  });

  test("keeps existing solid and muted variants as compatibility aliases", () => {
    expect(badgeClass({ variant: "solid" })).toContain("bg-primary");
    expect(badgeClass({ variant: "muted" })).toContain("bg-muted");
  });
});
