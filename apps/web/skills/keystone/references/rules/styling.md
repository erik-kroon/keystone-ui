# Keystone Styling Rules

Use this when writing or updating Keystone UI source, docs examples, blocks, and templates.

## Core Rules

- Use semantic tokens from `docs/design-system.md`: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `border`, `input`, `ring`, `sidebar`, and semantic status colors.
- Prefer component variants and size props before custom class overrides.
- Use `flex flex-col gap-*` layouts instead of `space-x-*` or `space-y-*`.
- Use `size-*` for square icon buttons and square affordances.
- Use `cn()` for conditional class composition.
- Avoid raw palette classes for shipped UI unless the design system explicitly calls for them.
- Avoid redundant classes already provided by the component default.
- Use Tailwind v4 syntax, including valid `--alpha()` theme functions.
- Preserve the Keystone framed-shell grammar: 1416px container, thin rails, square pins, sticky header, and `CardFrame` surfaces.

## Solid Styling Expectations

- Use `class`, not React `className`, in Solid JSX.
- Use `classList` only when it is clearer than `cn()`.
- Keep `data-slot` hooks on UI parts when they help styling or downstream customization.
- Core primitives must expose stable `data-scope` and `data-part`; UI wrappers can add `data-slot`.
- Prefer `lucide-solid` icons and size them through classes.
- Decorative icons should use `aria-hidden="true"`.
- Icon-only buttons need `aria-label` or equivalent accessible text.

## Component Visual Contract

- Buttons: rounded-lg, compact heights, focus-visible ring, pointer-coarse hit expansion, SVG opacity around 80%.
- Inputs and select triggers: border-input, bg-background, shadow-xs/5, focus-visible 3px ring, invalid destructive states.
- Cards and frames: rounded-2xl, thin border, tiny shadow, pseudo-element inset highlight.
- Badges: rounded-sm and compact; reserve pills for deliberate badge variants.
- Tabs: measured indicator, 200ms width/translate motion, compact triggers.
- Skeletons: muted shimmer, reduced dark highlight.
- Overlays: portal above app shell, visible focus, scroll-safe content, semantic title/description where applicable.

## Do / Don't

```tsx
// Do
<Button variant="outline" size="sm" />
<div class="flex flex-col gap-3" />
<Badge class="text-muted-foreground" />
<Button>
  <Plus aria-hidden="true" />
  Add item
</Button>

// Don't
<Button class="bg-blue-500 text-white" />
<div class="space-y-3" />
<Icon size={16} />
<button class="rounded-full px-4 py-2">Save</button>
```

## Check Before Finalizing

1. Are colors semantic?
2. Are dimensions and radius aligned with `docs/design-system.md`?
3. Are icon labels and decorative states correct?
4. Does dark mode work?
5. Does mobile text fit?
6. Did you avoid adding design behavior to Core?

