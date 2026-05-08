import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  test("forwards defaultValue to the native input", () => {
    const host = document.createElement("div");
    const dispose = render(() => <Input defaultValue="Margaret Welsh" />, host);

    const input = host.querySelector<HTMLInputElement>("[data-slot='input']");

    expect(input?.value).toBe("Margaret Welsh");

    dispose();
  });
});
