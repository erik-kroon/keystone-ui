import { describe, expect, test } from "vitest";
import { VisuallyHidden } from "./index";
import { getByPart, render } from "../../test/harness";
import { getDocsMetadata } from "../metadata/index";

describe("VisuallyHidden", () => {
  test("renders accessible content with stable part attributes", () => {
    render(() => <VisuallyHidden.Root>Screen reader text</VisuallyHidden.Root>);

    const element = getByPart("visually-hidden", "root");

    expect(element.tagName).toBe("SPAN");
    expect(element.textContent).toBe("Screen reader text");
  });

  test("applies the visually hidden style contract", () => {
    render(() => <VisuallyHidden.Root>Hidden label</VisuallyHidden.Root>);

    const element = getByPart("visually-hidden", "root");

    expect(element.style.position).toBe("absolute");
    expect(element.style.width).toBe("1px");
    expect(element.style.height).toBe("1px");
    expect(element.style.overflow).toBe("hidden");
    expect(element.style.clip).toBe("rect(0, 0, 0, 0)");
    expect(element.style.clipPath).toBe("inset(50%)");
    expect(element.style.whiteSpace).toBe("nowrap");
    expect(element.style.border).toBe("0px");
  });

  test("supports Solid-native polymorphism and custom props", () => {
    render(() => (
      <VisuallyHidden.Root as="label" for="email" id="email-label">
        Email
      </VisuallyHidden.Root>
    ));

    const element = getByPart("visually-hidden", "root");

    expect(element.tagName).toBe("LABEL");
    expect(element.getAttribute("for")).toBe("email");
    expect(element.id).toBe("email-label");
  });

  test("allows caller styles to extend the hidden style", () => {
    render(() => (
      <VisuallyHidden.Root style={{ color: "red" }}>Styled hidden text</VisuallyHidden.Root>
    ));

    const element = getByPart("visually-hidden", "root");

    expect(element.style.position).toBe("absolute");
    expect(element.style.color).toBe("red");
  });

  test("keeps hidden styles when caller styles are strings", () => {
    render(() => <VisuallyHidden.Root style="color:red;">Styled hidden text</VisuallyHidden.Root>);

    const element = getByPart("visually-hidden", "root");

    expect(element.style.position).toBe("absolute");
    expect(element.style.clipPath).toBe("inset(50%)");
    expect(element.style.color).toBe("red");
  });

  test("publishes docs metadata for the root part", () => {
    const metadata = getDocsMetadata("visually-hidden");

    expect(metadata?.scope).toBe("visually-hidden");
    expect(metadata?.maturity).toBe("stable");
    expect(metadata?.parts.map((part) => part.part)).toEqual(["root"]);
  });
});
