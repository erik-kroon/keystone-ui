import { createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { Portal } from "./index";
import { render, settled } from "../../test/harness";

describe("Portal", () => {
  test("does not mount children while present is false", async () => {
    render(() => (
      <Portal present={false}>
        <div data-testid="portal-child">Hidden</div>
      </Portal>
    ));
    await settled();

    expect(document.querySelector("[data-testid='portal-child']")).toBeNull();
  });

  test("forceMount keeps children mounted when present is false", async () => {
    render(() => (
      <Portal forceMount present={false}>
        <div data-testid="portal-child">Forced</div>
      </Portal>
    ));
    await settled();

    expect(document.querySelector("[data-testid='portal-child']")).not.toBeNull();
  });

  test("mounts into a custom target and cleans it up when presence changes", async () => {
    const mount = document.createElement("section");
    document.body.append(mount);

    const result = render(() => {
      const [present, setPresent] = createSignal(true);

      return (
        <>
          <button type="button" onClick={() => setPresent(false)}>
            Hide
          </button>
          <Portal mount={mount} present={present()}>
            <div data-testid="portal-child">Mounted</div>
          </Portal>
        </>
      );
    });
    await settled();

    expect(mount.querySelector("[data-testid='portal-child']")).not.toBeNull();
    expect(result.container.querySelector("[data-testid='portal-child']")).toBeNull();

    document.querySelector("button")!.click();
    await settled();

    expect(mount.querySelector("[data-testid='portal-child']")).toBeNull();
  });
});
