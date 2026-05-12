import { createDynamic } from "solid-js/web";
import { createThemeScript, normalizeThemeConfig } from "../core";
import type { ThemeScriptProps } from "./types";

export function ThemeScript(props: ThemeScriptProps) {
  const script = () => createThemeScript(normalizeThemeConfig(props));

  return createDynamic(() => "script", {
    ...props.scriptProps,
    get nonce() {
      return props.nonce;
    },
    get innerHTML() {
      return script();
    },
    get children() {
      return undefined;
    }
  });
}
