import { createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { Slider } from "./index";
import { getByPart, keyDown, render } from "../../test/harness";

function parts(part: string) {
  return Array.from(
    document.body.querySelectorAll<HTMLElement>(`[data-scope="slider"][data-part="${part}"]`),
  );
}

function pointerDown(element: HTMLElement, init: PointerEventInit = {}) {
  const event = new PointerEvent("pointerdown", {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    ...init,
  });
  element.dispatchEvent(event);
  return event;
}

function pointerMove(init: PointerEventInit = {}) {
  document.dispatchEvent(
    new PointerEvent("pointermove", {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      ...init,
    }),
  );
}

function pointerUp(init: PointerEventInit = {}) {
  document.dispatchEvent(
    new PointerEvent("pointerup", {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      ...init,
    }),
  );
}

describe("Slider", () => {
  test("exposes root, track, range, and thumb metadata with slider ARIA", () => {
    render(() => (
      <Slider.Root defaultValue={[25, 75]} max={100} min={0} orientation="vertical" step={5}>
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb index={0}>Minimum</Slider.Thumb>
          <Slider.Thumb index={1}>Maximum</Slider.Thumb>
        </Slider.Track>
      </Slider.Root>
    ));

    expect(getByPart("slider", "root").getAttribute("data-orientation")).toBe("vertical");
    expect(getByPart("slider", "track").getAttribute("data-orientation")).toBe("vertical");
    expect(getByPart("slider", "range").getAttribute("data-orientation")).toBe("vertical");

    const [firstThumb, secondThumb] = parts("thumb");
    expect(firstThumb?.getAttribute("role")).toBe("slider");
    expect(firstThumb?.getAttribute("aria-orientation")).toBe("vertical");
    expect(firstThumb?.getAttribute("aria-valuemin")).toBe("0");
    expect(firstThumb?.getAttribute("aria-valuemax")).toBe("100");
    expect(firstThumb?.getAttribute("aria-valuenow")).toBe("25");
    expect(firstThumb?.getAttribute("data-index")).toBe("0");
    expect(secondThumb?.getAttribute("aria-valuenow")).toBe("75");
  });

  test("updates uncontrolled value with keyboard and commits each keyboard change", () => {
    const changes: Array<{ reason: string; value: readonly number[] }> = [];
    const commits: Array<{ reason: string; value: readonly number[] }> = [];

    render(() => (
      <Slider.Root
        defaultValue={[10]}
        max={100}
        min={0}
        step={5}
        onValueChange={(value, detail) => changes.push({ value, reason: detail.reason })}
        onValueCommit={(value, detail) => commits.push({ value, reason: detail.reason })}
      >
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb />
        </Slider.Track>
      </Slider.Root>
    ));

    const thumb = getByPart("slider", "thumb");

    keyDown(thumb, "ArrowRight");
    expect(thumb.getAttribute("aria-valuenow")).toBe("15");

    keyDown(thumb, "PageUp");
    expect(thumb.getAttribute("aria-valuenow")).toBe("65");

    keyDown(thumb, "Home");
    expect(thumb.getAttribute("aria-valuenow")).toBe("0");
    expect(changes.map((change) => change.reason)).toEqual(["keyboard", "keyboard", "keyboard"]);
    expect(commits.map((commit) => commit.value)).toEqual([[15], [65], [0]]);
  });

  test("supports controlled value updates", () => {
    const [value, setValue] = createSignal<readonly number[]>([20]);

    render(() => (
      <Slider.Root value={value()} min={0} max={100} step={10} onValueChange={setValue}>
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb />
        </Slider.Track>
      </Slider.Root>
    ));

    const thumb = getByPart("slider", "thumb");

    keyDown(thumb, "ArrowRight");
    expect(value()).toEqual([30]);
    expect(thumb.getAttribute("aria-valuenow")).toBe("30");
  });

  test("updates the closest thumb from track pointer input and commits on release", () => {
    const changes: Array<{ reason: string; value: readonly number[] }> = [];
    const commits: Array<{
      reason: string;
      thumbIndex: number | undefined;
      value: readonly number[];
    }> = [];

    render(() => (
      <Slider.Root
        defaultValue={[20, 80]}
        min={0}
        max={100}
        step={10}
        onValueChange={(value, detail) => changes.push({ value, reason: detail.reason })}
        onValueCommit={(value, detail) =>
          commits.push({ thumbIndex: detail.thumbIndex, value, reason: detail.reason })
        }
      >
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb index={0} />
          <Slider.Thumb index={1} />
        </Slider.Track>
      </Slider.Root>
    ));

    const track = getByPart("slider", "track");
    track.getBoundingClientRect = () =>
      ({ bottom: 20, height: 20, left: 0, right: 100, top: 0, width: 100 }) as DOMRect;

    pointerDown(track, { clientX: 70, clientY: 10 });
    pointerMove({ clientX: 60, clientY: 10 });
    pointerUp({ clientX: 60, clientY: 10 });

    const [, secondThumb] = parts("thumb");
    expect(secondThumb?.getAttribute("aria-valuenow")).toBe("60");
    expect(changes.map((change) => change.reason)).toEqual(["track", "pointer"]);
    expect(commits).toEqual([{ reason: "pointer", thumbIndex: 1, value: [20, 60] }]);
  });

  test("runs user handlers first and skips internal behavior when default is prevented", () => {
    const changes: readonly number[][] = [];

    render(() => (
      <Slider.Root
        defaultValue={[20]}
        min={0}
        max={100}
        step={10}
        onValueChange={(value) => changes.push(value)}
      >
        <Slider.Track onPointerDown={(event) => event.preventDefault()}>
          <Slider.Range />
          <Slider.Thumb onKeyDown={(event) => event.preventDefault()} />
        </Slider.Track>
      </Slider.Root>
    ));

    const track = getByPart("slider", "track");
    track.getBoundingClientRect = () =>
      ({ bottom: 20, height: 20, left: 0, right: 100, top: 0, width: 100 }) as DOMRect;
    pointerDown(track, { clientX: 90, clientY: 10 });
    keyDown(getByPart("slider", "thumb"), "ArrowRight");

    expect(getByPart("slider", "thumb").getAttribute("aria-valuenow")).toBe("20");
    expect(changes).toEqual([]);
  });
});
