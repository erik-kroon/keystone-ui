import { createComponent, mapArray, splitProps } from "solid-js";
import { createDynamic } from "solid-js/web";
import { useTheme } from "./context";
import { ThemeGate } from "./gate";
import type { ThemeSelectProps } from "./types";

function formatThemeLabel(theme: string) {
  return theme.charAt(0).toUpperCase() + theme.slice(1);
}

export function ThemeSelect(props: ThemeSelectProps) {
  const theme = useTheme();
  const [local, selectProps] = splitProps(props, ["fallback", "labels", "themes", "onThemeChange"]);
  const options = mapArray(
    () => local.themes ?? theme.themes(),
    (themeName) =>
      createDynamic(() => "option", {
        value: themeName,
        get children() {
          return local.labels?.[themeName] ?? formatThemeLabel(themeName);
        }
      })
  );

  return createComponent(ThemeGate, {
    get fallback() {
      return local.fallback;
    },
    get children() {
      return createDynamic(() => "select", {
        ...selectProps,
        get value() {
          return theme.theme() ?? "";
        },
        get disabled() {
          return Boolean(selectProps.disabled || theme.forcedTheme());
        },
        onInput(event: InputEvent & { currentTarget: HTMLSelectElement }) {
          const nextTheme = event.currentTarget.value;
          theme.setTheme(nextTheme);
          local.onThemeChange?.(nextTheme);
        },
        get children() {
          return options();
        }
      });
    }
  });
}
