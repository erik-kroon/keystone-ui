import { createSignal, type Accessor, type JSX } from "solid-js";
import { render } from "solid-js/web";
import { describe, expect, test, vi } from "vitest";
import {
  FieldArray,
  FieldArrayAdd,
  FieldArrayItem,
  FieldArrayItems,
  FieldArrayMove,
  FieldArrayRemove,
  type FieldArrayApi,
} from "./field-array";

function createArrayForm(initial: string[]) {
  const [items, setItems] = createSignal(initial);
  const field = () =>
    ({
      name: "people",
      state: {
        value: items(),
        meta: {
          errors: items().length === 0 ? ["Add at least one person"] : [],
          isDirty: true,
          isTouched: true,
        },
      },
      handleChange: (value: readonly string[]) => setItems([...value]),
      moveValue: (fromIndex: number, toIndex: number) => {
        const next = [...items()];
        const [item] = next.splice(fromIndex, 1);
        if (item === undefined) return;
        next.splice(toIndex, 0, item);
        setItems(next);
      },
      pushValue: (value: string) => setItems([...items(), value]),
      removeValue: (index: number) =>
        setItems(items().filter((_, itemIndex) => itemIndex !== index)),
      swapValues: (firstIndex: number, secondIndex: number) => {
        const next = [...items()];
        [next[firstIndex], next[secondIndex]] = [
          next[secondIndex] as string,
          next[firstIndex] as string,
        ];
        setItems(next);
      },
    }) satisfies FieldArrayApi<string>;

  return {
    Field: (props: {
      name: string;
      mode: "array";
      children: (field: Accessor<FieldArrayApi<string>>) => JSX.Element;
    }) => props.children(field),
  };
}

describe("FieldArray", () => {
  test("renders stable array anatomy, item names, and non-submit action buttons", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const form = createArrayForm(["Ada", "Grace"]);

    const dispose = render(
      () => (
        <FieldArray form={form} name="people" label="People" defaultValue="New person">
          {(context) => (
            <>
              <FieldArrayItems context={context}>
                {(item, index) => (
                  <FieldArrayItem data-name={context.itemName(index, "name")}>
                    {item()}
                  </FieldArrayItem>
                )}
              </FieldArrayItems>
              <FieldArrayAdd context={context}>Add person</FieldArrayAdd>
              <FieldArrayRemove context={context} index={0}>
                Remove first
              </FieldArrayRemove>
              <FieldArrayMove context={context} fromIndex={1} toIndex={0}>
                Move second up
              </FieldArrayMove>
            </>
          )}
        </FieldArray>
      ),
      host,
    );

    const root = host.querySelector("[data-slot='field-array']");
    const actions = host.querySelectorAll("button");

    expect(root?.getAttribute("role")).toBe("group");
    expect(root?.getAttribute("data-count")).toBe("2");
    expect(host.querySelector("[data-name='people[0].name']")?.textContent).toBe("Ada");
    expect([...actions].every((action) => action.getAttribute("type") === "button")).toBe(true);

    actions[0]?.click();
    expect(root?.getAttribute("data-count")).toBe("3");

    actions[1]?.click();
    expect(host.querySelector("[data-name='people[0].name']")?.textContent).toBe("Grace");

    actions[2]?.click();
    expect(host.querySelector("[data-name='people[0].name']")?.textContent).toBe("New person");

    dispose();
    host.remove();
  });

  test("lets user click handlers prevent internal mutations", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const form = createArrayForm(["Ada"]);
    const onClick = vi.fn((event: MouseEvent) => event.preventDefault());

    const dispose = render(
      () => (
        <FieldArray form={form} name="people" defaultValue="Grace">
          {(context) => <FieldArrayAdd context={context} onClick={onClick} />}
        </FieldArray>
      ),
      host,
    );

    host.querySelector("button")?.click();

    expect(onClick).toHaveBeenCalledOnce();
    expect(host.querySelector("[data-slot='field-array']")?.getAttribute("data-count")).toBe("1");

    dispose();
    host.remove();
  });
});
