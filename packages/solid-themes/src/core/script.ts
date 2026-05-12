import { normalizeThemeConfig } from "./config";
import type { CreateThemeScriptOptions } from "./types";

function safeJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function createThemeScript(options: CreateThemeScriptOptions = {}): string {
  const config = normalizeThemeConfig(options);
  const payload = safeJson({
    attribute: config.attribute,
    storageKey: config.storageKey,
    defaultTheme: config.defaultTheme,
    forcedTheme: config.forcedTheme,
    themes: config.themes,
    value: config.value,
    enableSystem: config.enableSystem,
    enableColorScheme: config.enableColorScheme
  });

  return `(function(c){try{var d=document.documentElement;var a=Array.isArray(c.attribute)?c.attribute:[c.attribute];var s=["light","dark"];var t=c.forcedTheme;try{if(!t)t=localStorage.getItem(c.storageKey)||c.defaultTheme}catch(e){t=c.defaultTheme}if(t==="system"&&c.enableSystem){try{t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){t="light"}}var v=c.value&&c.value[t]?c.value[t]:t;for(var i=0;i<a.length;i++){var x=a[i];if(x==="class"){var r=[];for(var j=0;j<c.themes.length;j++){var n=c.themes[j];r.push(c.value&&c.value[n]?c.value[n]:n)}if(c.defaultTheme&&c.defaultTheme!=="system")r.push(c.value&&c.value[c.defaultTheme]?c.value[c.defaultTheme]:c.defaultTheme);if(c.forcedTheme)r.push(c.value&&c.value[c.forcedTheme]?c.value[c.forcedTheme]:c.forcedTheme);if(c.enableSystem){r.push(c.value&&c.value.light?c.value.light:"light");r.push(c.value&&c.value.dark?c.value.dark:"dark")}d.classList.remove.apply(d.classList,r);if(v)d.classList.add(v)}else if(v){d.setAttribute(x,v)}else{d.removeAttribute(x)}}if(c.enableColorScheme&&s.indexOf(t)>-1)d.style.colorScheme=t}catch(e){}})(${payload});`;
}
