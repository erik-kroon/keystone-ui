import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

describe("Breadcrumb", () => {
  test("renders nav, ordered list, separators, links, and current page semantics", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <Breadcrumb
          items={[
            { href: "/docs", label: "Docs" },
            { href: "/docs/components", label: "Components" },
            { current: true, label: "Breadcrumb" },
          ]}
        />
      ),
      host,
    );

    const nav = host.querySelector("nav");
    const links = host.querySelectorAll("[data-slot='breadcrumb-link']");
    const page = host.querySelector("[data-slot='breadcrumb-page']");

    expect(nav?.getAttribute("aria-label")).toBe("Breadcrumb");
    expect(host.querySelector("[data-slot='breadcrumb-list']")?.tagName).toBe("OL");
    expect(links).toHaveLength(2);
    expect(links[0]?.getAttribute("href")).toBe("/docs");
    expect(page?.getAttribute("aria-current")).toBe("page");
    expect(page?.textContent).toBe("Breadcrumb");
    expect(host.querySelectorAll("[data-slot='breadcrumb-separator']")).toHaveLength(2);

    dispose();
  });

  test("supports source-owned composition parts and menu ellipsis", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <Breadcrumb label="Project path">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">App</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ),
      host,
    );

    expect(host.querySelector("nav")?.getAttribute("aria-label")).toBe("Project path");
    expect(host.querySelector("[data-slot='breadcrumb-ellipsis']")?.getAttribute("type")).toBe(
      "button",
    );
    expect(
      host.querySelector("[data-slot='breadcrumb-ellipsis']")?.getAttribute("aria-label"),
    ).toBe("Show breadcrumb menu");

    dispose();
  });
});
