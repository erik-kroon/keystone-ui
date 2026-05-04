# UI Card Vertical

## Issue

- GitHub: #165
- Inventory item: UI Base UI / Card
- Reference: reference UI Card source in `inspo/apps/ui/registry/default/ui/card.tsx`

## Audit

Existing Keystone Card was a small styled composition with `Card`, `CardHeader`, `CardTitle`,
`CardDescription`, `CardContent`, and `CardFooter`. It already used Solid props, the registry `cn`
helper, and stable `data-scope="ui-card"` / `data-part` hooks. It did not include the reference Card
layout classes, `data-slot` hooks, `CardAction`, `CardPanel`, `CardFrame`, frame subparts, CSS
variable notes, or source-contract tests.

Reusable pieces were the presentational div model, part helper, existing part names, and `cn`
dependency.

## End-State Contract

- Anatomy: `root`, `header`, `title`, `description`, `action`, `panel`, `content`, `footer`,
  `frame`, `frame-header`, `frame-title`, `frame-description`, `frame-action`, and `frame-footer`.
- API: exports `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardPanel`,
  `CardContent`, `CardFooter`, `CardFrame`, `CardFrameHeader`, `CardFrameTitle`,
  `CardFrameDescription`, `CardFrameAction`, and `CardFrameFooter`.
- Styling: reference-inspired classes are embedded in source, including root surface styling, frame
  clipping variables, action grid placement, panel spacing, and `data-slot` hooks.
- Accessibility: Card does not create roles, headings, focus behavior, keyboard behavior, or
  interactive-card semantics. Consumers pass native HTML/ARIA props and place semantic controls
  inside cards.
- State contract: Card owns no controlled or uncontrolled state.
- SSR/hydration: no effects, IDs, portals, or browser-only APIs; markup is determined by props.

## Intentional Limits

Card remains a presentational source-owned layout primitive. Polymorphic rendering is deferred until
Keystone has a public Solid-native UI convention for it, and interactive card behavior belongs to
nested native links/buttons or future dedicated UI surfaces.
