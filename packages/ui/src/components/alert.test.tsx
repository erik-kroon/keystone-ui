import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { Alert, AlertAction, AlertDescription, AlertIcon, AlertTitle } from "./alert";

describe("Alert", () => {
  test("renders the alert anatomy with status semantics by default", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <Alert>
          <AlertIcon>i</AlertIcon>
          <AlertTitle>Project synced</AlertTitle>
          <AlertDescription>Registry metadata is up to date.</AlertDescription>
          <AlertAction>
            <button type="button">View</button>
          </AlertAction>
        </Alert>
      ),
      host,
    );

    const alert = host.querySelector("[data-slot='alert']");

    expect(alert?.getAttribute("role")).toBe("status");
    expect(alert?.getAttribute("aria-live")).toBe("polite");
    expect(alert?.getAttribute("data-scope")).toBe("ui-alert");
    expect(alert?.getAttribute("data-part")).toBe("root");
    expect(alert?.getAttribute("data-variant")).toBe("default");
    expect(host.querySelector("[data-slot='alert-icon']")).not.toBeNull();
    expect(host.querySelector("[data-slot='alert-title']")?.textContent).toBe("Project synced");
    expect(host.querySelector("[data-slot='alert-description']")?.textContent).toBe(
      "Registry metadata is up to date.",
    );
    expect(host.querySelector("[data-slot='alert-action'] button")?.textContent).toBe("View");
    expect(host.querySelector("[data-slot='alert-action']")?.className).toContain(
      "[[data-slot=alert]:has(>[data-slot=alert-icon])>_&]:col-start-3",
    );

    dispose();
  });

  test("uses assertive alert semantics for error alerts and allows role overrides", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <>
          <Alert variant="error">Deploy failed</Alert>
          <Alert variant="error" role="status" aria-live="polite">
            Retry queued
          </Alert>
        </>
      ),
      host,
    );

    const alerts = host.querySelectorAll("[data-slot='alert']");

    expect(alerts[0]?.getAttribute("role")).toBe("alert");
    expect(alerts[0]?.hasAttribute("aria-live")).toBe(false);
    expect(alerts[0]?.getAttribute("data-variant")).toBe("error");
    expect(alerts[1]?.getAttribute("role")).toBe("status");
    expect(alerts[1]?.getAttribute("aria-live")).toBe("polite");

    dispose();
  });
});
