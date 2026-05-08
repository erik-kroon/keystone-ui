import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { SearchInput } from "./search-input";

describe("SearchInput", () => {
  test("renders a native search input with stable parts and loading state", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => <SearchInput aria-label="Search projects" loading placeholder="Search" />,
      host,
    );

    const input = host.querySelector<HTMLInputElement>("[data-slot='search-input-control']");
    const status = host.querySelector("[data-slot='search-input-loading-indicator']");

    expect(input?.type).toBe("search");
    expect(input?.getAttribute("aria-label")).toBe("Search projects");
    expect(host.querySelector("[data-slot='search-input-icon']")).not.toBeNull();
    expect(status?.getAttribute("role")).toBe("status");
    expect(status?.getAttribute("aria-label")).toBe("Searching");

    dispose();
  });

  test("clears uncontrolled values after user clear handlers run", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const calls: string[] = [];
    const dispose = render(
      () => (
        <SearchInput
          aria-label="Filter invoices"
          defaultValue="invoice"
          onClear={() => calls.push("clear")}
          onInput={(event) => calls.push(event.currentTarget.value)}
        />
      ),
      host,
    );

    const input = host.querySelector<HTMLInputElement>("[data-slot='search-input-control']");
    const clear = host.querySelector<HTMLButtonElement>("[data-slot='search-input-clear']");

    expect(clear).not.toBeNull();
    clear?.click();

    expect(calls).toEqual(["clear", ""]);
    expect(input?.value).toBe("");
    expect(document.activeElement).toBe(input);

    dispose();
    host.remove();
  });

  test("honors defaultPrevented clear handlers", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <SearchInput
          aria-label="Filter"
          defaultValue="keystone"
          onClear={(event) => event.preventDefault()}
        />
      ),
      host,
    );

    const input = host.querySelector<HTMLInputElement>("[data-slot='search-input-control']");
    host.querySelector<HTMLButtonElement>("[data-slot='search-input-clear']")?.click();

    expect(input?.value).toBe("keystone");

    dispose();
  });
});
