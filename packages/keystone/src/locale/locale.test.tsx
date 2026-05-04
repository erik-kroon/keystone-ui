import { createRoot, createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { createLocale, getLocaleDirection, type LocaleMessages } from "./index";

describe("Locale provider kernel", () => {
  test("creates stable locale, direction, and message accessors", () => {
    createRoot((dispose) => {
      const [locale, setLocale] = createSignal("en-US");
      const [messages, setMessages] = createSignal<LocaleMessages>({
        "datePicker.selectDate": "Choose date",
      });
      const api = createLocale({ locale, messages });

      expect(api.locale()).toBe("en-US");
      expect(api.direction()).toBe("ltr");
      expect(api.getMessage("datePicker.selectDate")).toBe("Choose date");
      expect(api.getMessage("calendar.nextMonth")).toBe("Next month");

      setLocale("ar-EG");
      setMessages({ "calendar.nextMonth": "Next" });

      expect(api.locale()).toBe("ar-EG");
      expect(api.direction()).toBe("rtl");
      expect(api.getMessage("calendar.nextMonth")).toBe("Next");
      expect(api.getMessage("datePicker.selectDate")).toBe("Select date");

      dispose();
    });
  });

  test("infers text direction from Intl.Locale or rtl language fallbacks", () => {
    expect(getLocaleDirection("en-US")).toBe("ltr");
    expect(getLocaleDirection("he-IL")).toBe("rtl");
    expect(getLocaleDirection("not a locale")).toBe("ltr");
  });

  test("allows explicit direction to override locale inference", () => {
    createRoot((dispose) => {
      const api = createLocale({
        direction: () => "ltr",
        locale: () => "ar-EG",
      });

      expect(api.direction()).toBe("ltr");
      dispose();
    });
  });
});
