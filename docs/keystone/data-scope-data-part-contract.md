# Data Scope And Data Part Contract

## Status

Preview docs page for Keystone styling metadata.

## Summary

Every public Keystone DOM part must expose stable `data-scope` and `data-part` attributes. These attributes are the primary selector contract for unstyled primitives and for Mason components that style Keystone-backed behavior.

```html
<button data-scope="select" data-part="trigger" data-state="open">Project</button>
```

The selector for a part is:

```css
[data-scope="<primitive>"][data-part="<part>"]
```

The docs metadata returned by `getDocsMetadata(scope)` includes the same selector for every registered part.

## Required Attributes

Each public part must include:

- `data-scope`: the primitive scope, such as `dialog`, `select`, or `form-control`.
- `data-part`: the part name, such as `trigger`, `content`, `item`, or `label`.

These attributes must be present whether a component is styled, unstyled, force-mounted, controlled, uncontrolled, open, closed, enabled, disabled, valid, invalid, selected, or unselected.

## State Attributes

State attributes describe public behavior and styling states. Examples include:

- `data-state="open|closed"` for overlays and disclosures.
- `data-disabled` for disabled parts.
- `data-invalid`, `data-required`, `data-readonly`, and `data-placeholder` for form-aware parts.
- `data-selected` and `data-highlighted` for collection items.
- `data-orientation="horizontal|vertical"` for directional composites.
- `data-side` and `data-align` for floating placement.

State attributes are public styling contracts. Renaming or removing them requires migration notes once the primitive is stable.

## CSS Variables

Keystone CSS variables expose calculated geometry that styling layers need but should not recompute:

- `--keystone-anchor-width`
- `--keystone-anchor-height`
- `--keystone-available-width`
- `--keystone-available-height`
- `--keystone-arrow-x`
- `--keystone-arrow-y`
- `--keystone-transform-origin`

Floating primitives should prefer the shared Popper/floating adapter instead of defining local geometry variables.

## Mason Usage

Mason components should style Keystone-backed parts through `data-scope`, `data-part`, state attributes, and Keystone CSS variables. Mason should not depend on Keystone private DOM structure, generated IDs, signal names, or implementation file paths.

When Mason wraps a Keystone primitive, it may add class names for project ergonomics, but those class names are Mason source conventions. The durable primitive contract remains the data attribute metadata.

## Tests

Metadata and runtime tests should assert:

- Every docs metadata part has `data-scope` and `data-part`.
- Runtime helpers return the same scope and part attributes.
- Public state attributes are listed in primitive metadata.
- Floating parts list their CSS variable contracts.
- SSR output does not depend on browser globals to render stable part attributes.
