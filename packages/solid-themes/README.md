# solid-themes

Theme runtime and Solid bindings for Vite, SolidStart, TanStack Router, and TanStack Start.

```tsx
import { ThemeGate, ThemeProvider, ThemeScript, ThemeSelect, useTheme } from "solid-themes";
```

`solid-themes` stores the selected canonical theme name, resolves `"system"` against
`prefers-color-scheme`, and applies the resolved value to `document.documentElement` through a
class or `data-*` attribute. The core implementation is framework-neutral; the Solid adapter is a
thin context/lifecycle layer.

## Vite SPA

Wrap the app once near the root:

```tsx
import { render } from "solid-js/web";
import { ThemeProvider } from "solid-themes";
import { App } from "./App";

render(
  () => (
    <ThemeProvider defaultTheme="system">
      <App />
    </ThemeProvider>
  ),
  document.getElementById("root")!
);
```

For SPA no-flash behavior, place the script output in `index.html` before your app script, or render
`<ThemeScript />` in root markup when your shell controls the document. `ThemeProvider` manages
runtime state; `ThemeScript` is intentionally placed explicitly so SSR integrations can put it before
first paint.

## Reading And Setting Theme

`useTheme()` returns a stable object. Values are Solid accessors:

```tsx
import { ThemeGate, useTheme } from "solid-themes";

export function ThemeSelect() {
  const theme = useTheme();

  return (
    <ThemeGate>
      <select value={theme.theme()} onInput={(event) => theme.setTheme(event.currentTarget.value)}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </ThemeGate>
  );
}
```

Theme-dependent text and selected controls can be hydration-sensitive because the server cannot read
`localStorage` or the user's system preference. Render those controls after mount when their displayed
value depends on browser state. `ThemeGate` handles that mount gate for custom UI, and the active
theme object also exposes `mounted()` for lower-level control:

```tsx
const theme = useTheme();

theme.mounted();
```

For the default select use case, import the built-in control:

```tsx
import { ThemeSelect } from "solid-themes";

export function Settings() {
  return <ThemeSelect aria-label="Theme" />;
}
```

`ThemeSelect` renders after mount, uses `theme.themes()` by default, stores canonical theme names, and
disables itself while `forcedTheme` is active. You can pass custom labels or a custom theme list:

```tsx
<ThemeSelect labels={{ system: "Use system" }} themes={["light", "dark", "system"]} />
```

## SolidStart

Render `ThemeScript` in the document/root head before hydrated UI:

```tsx
import { Html, Head, Body, Scripts } from "@solidjs/start";
import { ThemeProvider } from "solid-themes";
import { ThemeScript } from "solid-themes/solid-start";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <ThemeScript defaultTheme="system" />
      </Head>
      <Body>
        <ThemeProvider>
          <App />
        </ThemeProvider>
        <Scripts />
      </Body>
    </Html>
  );
}
```

Pass a CSP nonce to both the startup script and transition-disabling style:

```tsx
<ThemeScript nonce={nonce} />
<ThemeProvider nonce={nonce} disableTransitionOnChange />
```

## TanStack Router And TanStack Start

Plain TanStack Router SPAs use the base entrypoint:

```tsx
import { ThemeProvider } from "solid-themes";

root.render(() => (
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
));
```

TanStack Start document/root layouts can import the thin adapter:

```tsx
import { ThemeScript } from "solid-themes/tanstack-start";

export function Document(props: { children: unknown }) {
  return (
    <html lang="en">
      <head>
        <ThemeScript attribute="class" />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
```

The framework adapters only re-export `ThemeScript`; theme logic stays in the base package and core.

## Tailwind Class Mode

Use `attribute="class"` so Tailwind's class strategy receives `dark` on the root element:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" />
```

For custom DOM values, store canonical names while applying mapped values:

```tsx
<ThemeProvider
  themes={["light", "dark", "brand"]}
  attribute="data-theme"
  value={{ light: "day", dark: "night", brand: "brand-a" }}
/>
```

## Forced Themes

Use `forcedTheme` for route or page overrides. It applies to the DOM but does not overwrite the user's
stored preference:

```tsx
<ThemeProvider forcedTheme="dark">
  <CheckoutRoute />
</ThemeProvider>
```

Nested providers are ignored; the first provider owns the document theme. Put forced route themes on
the owning provider or pass them through root route state.

## Core API

The core entrypoint has no Solid dependency:

```ts
import { applyTheme, createThemeScript, getSystemTheme, resolveTheme } from "solid-themes/core";
```

Use it for tests, custom integrations, or document shells that need serialized startup code.

## Options

- `themes`: defaults to `["light", "dark"]`
- `defaultTheme`: defaults to `"system"` when system themes are enabled, otherwise `"light"`
- `enableSystem`: defaults to `true`
- `enableColorScheme`: defaults to `true`
- `storageKey`: defaults to `"theme"`
- `attribute`: defaults to `"data-theme"` and accepts `"class"`, `data-*`, or an array
- `disableTransitionOnChange`: injects a temporary nonce-aware style only for runtime theme changes
- `nonce`: applied to `ThemeScript` and the temporary transition-disabling style
- `scriptProps`: forwarded to the `ThemeScript` script element

## Validation

```sh
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```
