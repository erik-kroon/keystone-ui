import { createRoot, createSignal, onMount } from "solid-js";
import { describe, expect, test, vi } from "vitest";
import { expectSsrSmoke } from "../../test/accessibility";
import { getByPart, render, settled } from "../../test/harness";
import { getDocsMetadata } from "../metadata/index";
import { createLiveAnnouncer, LiveAnnouncer, useLiveAnnouncer } from "./index";

describe("LiveAnnouncer", () => {
  test("announces polite and assertive messages through the controller", async () => {
    await new Promise<void>((resolve) => {
      createRoot((dispose) => {
        const announcer = createLiveAnnouncer();

        announcer.announce("Saved");
        announcer.announce("Connection lost", { politeness: "assertive" });

        queueMicrotask(() => {
          expect(announcer.politeMessage()).toBe("Saved");
          expect(announcer.assertiveMessage()).toBe("Connection lost");

          announcer.clear("polite");
          expect(announcer.politeMessage()).toBe("");
          expect(announcer.assertiveMessage()).toBe("Connection lost");

          dispose();
          resolve();
        });
      });
    });
  });

  test("clears before repeated announcements so identical messages can be announced again", async () => {
    await new Promise<void>((resolve) => {
      createRoot((dispose) => {
        const announcer = createLiveAnnouncer();

        announcer.announce("Saved");

        queueMicrotask(() => {
          expect(announcer.politeMessage()).toBe("Saved");

          announcer.announce("Saved");
          expect(announcer.politeMessage()).toBe("");

          queueMicrotask(() => {
            expect(announcer.politeMessage()).toBe("Saved");
            dispose();
            resolve();
          });
        });
      });
    });
  });

  test("renders hidden polite and assertive live regions with stable parts", () => {
    render(() => <LiveAnnouncer.Root>App shell</LiveAnnouncer.Root>);

    const root = getByPart("live-announcer", "root");
    const polite = getByPart("live-announcer", "polite");
    const assertive = getByPart("live-announcer", "assertive");

    expect(root.textContent).toContain("App shell");
    expect(polite.getAttribute("aria-live")).toBe("polite");
    expect(polite.getAttribute("aria-atomic")).toBe("true");
    expect(polite.getAttribute("role")).toBe("status");
    expect(polite.style.position).toBe("absolute");
    expect(assertive.getAttribute("aria-live")).toBe("assertive");
    expect(assertive.getAttribute("aria-atomic")).toBe("true");
    expect(assertive.getAttribute("role")).toBe("alert");
  });

  test("provides the announcer to descendants", async () => {
    function AnnouncingChild() {
      const announcer = useLiveAnnouncer();
      onMount(() => announcer?.announce("Loaded"));
      return <button type="button">Load</button>;
    }

    render(() => (
      <LiveAnnouncer.Root>
        <AnnouncingChild />
      </LiveAnnouncer.Root>
    ));
    await settled();

    expect(getByPart("live-announcer", "polite").textContent).toBe("Loaded");
  });

  test("supports caller-owned live regions inside the provider", async () => {
    function Regions() {
      const announcer = useLiveAnnouncer();
      const [message, setMessage] = createSignal("");
      onMount(() => {
        announcer?.announce("Ignored default region");
        setMessage("Custom update");
      });

      return <LiveAnnouncer.Polite id="custom-region">{message()}</LiveAnnouncer.Polite>;
    }

    render(() => (
      <LiveAnnouncer.Root>
        <Regions />
      </LiveAnnouncer.Root>
    ));
    await settled();

    const custom = document.getElementById("custom-region");

    expect(custom?.getAttribute("data-scope")).toBe("live-announcer");
    expect(custom?.getAttribute("data-part")).toBe("polite");
    expect(custom?.textContent).toBe("Custom update");
  });

  test("creates the controller without browser globals", () => {
    const previousDocument = globalThis.document;
    const previousWindow = globalThis.window;

    vi.stubGlobal("document", undefined);
    vi.stubGlobal("window", undefined);

    try {
      createRoot((dispose) => {
        const announcer = createLiveAnnouncer();

        expect(announcer.politeMessage()).toBe("");
        expect(announcer.assertiveMessage()).toBe("");

        dispose();
      });
    } finally {
      vi.stubGlobal("document", previousDocument);
      vi.stubGlobal("window", previousWindow);
    }
  });

  test("records deterministic SSR markup contract", () => {
    const html = expectSsrSmoke({
      expectedText: "App",
      html: `<div data-scope="live-announcer" data-part="root">App<span aria-atomic="true" aria-live="polite" role="status" data-scope="live-announcer" data-part="polite"></span><span aria-atomic="true" aria-live="assertive" role="alert" data-scope="live-announcer" data-part="assertive"></span></div>`,
    });

    expect(html).toContain('data-scope="live-announcer"');
    expect(html).toContain('data-part="root"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('aria-live="assertive"');
    expect(html).toContain('aria-atomic="true"');
  });

  test("publishes docs metadata for live region parts", () => {
    const metadata = getDocsMetadata("live-announcer");

    expect(metadata?.scope).toBe("live-announcer");
    expect(metadata?.parts.map((part) => part.part)).toEqual(["root", "polite", "assertive"]);
  });
});
