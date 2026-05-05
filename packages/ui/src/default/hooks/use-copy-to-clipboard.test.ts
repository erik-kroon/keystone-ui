import { describe, expect, test } from "vitest";
import { createRoot } from "solid-js";
import { createCopyToClipboard } from "./use-copy-to-clipboard";

function createTestWindow(writeText?: (value: string) => Promise<void>) {
  return {
    navigator: {
      clipboard: writeText ? { writeText } : undefined,
    },
  } as unknown as Window;
}

describe("createCopyToClipboard", () => {
  test("copies text and exposes temporary copied state", async () => {
    const values: string[] = [];

    await createRoot(async (dispose) => {
      const clipboard = createCopyToClipboard({
        copiedDuration: 1,
        window: createTestWindow(async (value) => {
          values.push(value);
        }),
      });

      await expect(clipboard.copy("npm install")).resolves.toBe(true);
      expect(values).toEqual(["npm install"]);
      expect(clipboard.status()).toBe("copied");
      expect(clipboard.copied()).toBe(true);

      dispose();
    });
  });

  test("reports unavailable clipboard APIs without throwing", async () => {
    await createRoot(async (dispose) => {
      const clipboard = createCopyToClipboard({ window: createTestWindow() });

      await expect(clipboard.copy("hello")).resolves.toBe(false);
      expect(clipboard.status()).toBe("error");
      expect(clipboard.error()).toBeInstanceOf(Error);

      dispose();
    });
  });
});
