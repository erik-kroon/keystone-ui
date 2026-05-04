# UI Button Vertical

## Issue

- GitHub: #156
- Inventory item: UI Base UI / Button
- Reference: reference UI Button source in `inspo/apps/ui/registry/default/ui/button.tsx`

## Audit

Existing Keystone Button was a thin native `<button>` wrapper with `solid`, `outline`, and `ghost`
variants, `sm`/`md`/`lg` sizes, `data-scope="ui-button"`, `data-part="root"`, and `cn`
composition. It had no loading state, no default `type="button"`, no icon sizing contract, no
pressed state attributes, no docs-ready API metadata beyond basic parity notes, and no tests for the
registry source contract.

Reusable pieces were the native button baseline, Solid `splitProps` style, `cn` registry dependency,
and existing root data attributes.

## End-State Contract

- Anatomy: `root`, `loading-indicator`, and `loading-label`.
- Native semantics: root renders a native button and defaults `type` to `button`; explicit
  `submit` and `reset` types pass through.
- Accessibility: loading sets native `disabled`, `aria-disabled`, `aria-busy`, and `data-loading`;
  disabled/loading both expose `data-disabled`; `pressed` exposes `aria-pressed` and `data-pressed`.
- Styling: reference-inspired base class, variant class, and size class strings are source-owned through
  `buttonClass`.
- Variants: `default`, `secondary`, `destructive`, `destructive-outline`, `outline`, `ghost`,
  `link`, plus `solid` as a compatibility alias for the previous Keystone API.
- Sizes: `xs`, `sm`, `default`, `md`, `lg`, `xl`, `icon-xs`, `icon-sm`, `icon`, `icon-lg`, and
  `icon-xl`; `md` is a compatibility alias for the previous Keystone API.
- State contract: no controlled/uncontrolled state is owned by Button; `loading` and `pressed` are
  controlled presentation props.
- SSR/hydration: no effects, portals, IDs, or browser-only APIs; server and client markup are
  determined solely by props.

## Intentional Limits

Button remains the presentational native action surface. Link-style navigation buttons, icon-only
guardrails, and toggle state machines belong to separate end-state inventory items: `LinkButton`,
`IconButton`, `Toggle`, and `ToggleGroup`.
