# VisuallyHidden And AccessibleIcon Vertical

## Scope

This note closes the Core kernel-helper inventory items for:

- GitHub #74, `Visually hidden`
- GitHub #75, `Accessible icon`

These are public utility primitives, not private kernel internals. They should stay small,
unstyled, Solid-native, SSR-safe, and independent from UI or TanStack app libraries.

## Current Repo Audit

Reusable implementation already exists in:

- `packages/core/src/visually-hidden/index.tsx`
- `packages/core/src/accessible-icon/index.tsx`
- `packages/core/src/metadata/index.ts`
- `apps/docs/src/lib/primitive-contracts.ts`

Reusable tests already exist in:

- `packages/core/src/visually-hidden/visually-hidden.test.tsx`
- `packages/core/src/accessible-icon/accessible-icon.test.tsx`

No controlled/uncontrolled state, keyboard behavior, pointer behavior, focus management, form
behavior, CSS variables, portals, or lifecycle effects are part of either helper. Those are
intentional non-goals, not missing parity.

## End-State Contract

### VisuallyHidden

API:

- `VisuallyHidden.Root`
- `VisuallyHiddenProps`
- Package export: `@keystone-ui/core/visually-hidden`

Anatomy:

- `root`

Behavior:

- Renders as `span` by default.
- Supports Solid polymorphic `as` rendering.
- Preserves children in the accessibility tree while clipping them visually.
- Applies a deterministic inline hidden style contract:
  `position:absolute`, one-pixel box, negative margin, hidden overflow, `clip`, `clip-path`,
  nowrap, and no border.
- Caller styles may extend the hidden style through object or string style props.

Accessibility:

- Adds no role, ARIA, focus behavior, keyboard behavior, or pointer behavior.
- Callers should not set `aria-hidden` on the root unless they intentionally want to remove the
  content from assistive technology.

SSR and hydration:

- Deterministic render output.
- No browser globals or lifecycle effects.

### AccessibleIcon

API:

- `AccessibleIcon.Root`
- `createAccessibleIcon`
- `AccessibleIconRootProps`
- `AccessibleIconLabelProps`
- `AccessibleIconPartProps`
- `CreateAccessibleIconOptions`
- Package export: `@keystone-ui/core/accessible-icon`

Anatomy:

- `root`
- `label`

Behavior:

- Renders as `span` by default.
- Supports Solid polymorphic `as` rendering.
- Requires `label`.
- Exposes a controller helper for wrappers that need deterministic root and label props.
- The label part uses the same hidden style contract shape as `VisuallyHidden`, including
  string-style merging.

Accessibility:

- Root gets `role="img"` and `aria-label` from the required label.
- Label text is rendered in a visually hidden label part for user-agent and wrapper resilience.
- Owns no keyboard behavior and adds no focusability.

SSR and hydration:

- Deterministic render output.
- No browser globals or lifecycle effects.

## Metadata And Docs

Primitive metadata publishes:

- `visually-hidden`: stable, `root`
- `accessible-icon`: beta, `root`, `label`

Docs contracts live in `apps/docs/src/lib/primitive-contracts.ts` and record import path,
role notes, keyboard non-goals, ARIA contract, SSR contract, and examples.

## Verification

Focused tests cover:

- Rendered anatomy and stable `data-scope`/`data-part` attributes.
- `VisuallyHidden` style contract, polymorphism, object style merging, string style merging, and
  docs metadata.
- `AccessibleIcon` named image contract, polymorphism, controller props, label hidden styles,
  string style merging, SSR-safe controller creation, and docs metadata.

Run:

```sh
bun --filter @keystone-ui/core test -- src/visually-hidden/visually-hidden.test.tsx src/accessible-icon/accessible-icon.test.tsx
bun --filter @keystone-ui/core check-types
```

## Known Limitations

- Manual assistive-technology transcripts are still a broader accessibility-harness task.
- Icon-library conventions remain documentation/examples work; Core should not couple this
  helper to a specific icon package.
