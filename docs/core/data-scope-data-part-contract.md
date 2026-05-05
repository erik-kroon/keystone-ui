# Data Scope And Data Part Contract

## Status

Preview docs page for Core styling metadata.

## Summary

Every public Core DOM part must expose stable `data-scope` and `data-part` attributes. These attributes are the primary selector contract for unstyled primitives and for UI items that style Core-backed behavior.

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

Core CSS variables expose calculated geometry that styling layers need but should not recompute:

- `--keystone-anchor-width`
- `--keystone-anchor-height`
- `--keystone-available-width`
- `--keystone-available-height`
- `--keystone-arrow-x`
- `--keystone-arrow-y`
- `--keystone-transform-origin`

Floating primitives should prefer the shared Popper/floating adapter instead of defining local geometry variables.

Floating or measured parts currently document these variables through metadata:

| Scope                                                                                  | Parts                   | CSS variables                                                                                                                                                                                 |
| -------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `combobox`, `select`                                                                   | `positioner`, `content` | `--keystone-anchor-width`, `--keystone-anchor-height`, `--keystone-available-width`, `--keystone-available-height`, `--keystone-arrow-x`, `--keystone-arrow-y`, `--keystone-transform-origin` |
| `context-menu`, `dropdown-menu`, `hover-card`, `menu`, `menubar`, `popover`, `tooltip` | `positioner`, `content` | `--keystone-anchor-width`, `--keystone-anchor-height`, `--keystone-available-width`, `--keystone-available-height`, `--keystone-arrow-x`, `--keystone-arrow-y`, `--keystone-transform-origin` |
| `popper`                                                                               | `positioner`            | `--keystone-anchor-width`, `--keystone-anchor-height`, `--keystone-available-width`, `--keystone-available-height`, `--keystone-arrow-x`, `--keystone-arrow-y`, `--keystone-transform-origin` |
| `slider`                                                                               | `range`, `thumb`        | `--keystone-slider-range-start`, `--keystone-slider-range-end`, `--keystone-slider-thumb-percent`                                                                                             |

## Current Public Anatomy

This snapshot mirrors `primitiveMetadata` in `packages/core/src/metadata/index.ts`. Every listed part has `data-scope="<scope>"` and `data-part="<part>"`; state attributes and CSS variables are attached to part metadata and should be used as the source of truth by docs generators.

| Scope             | Maturity     | Public parts                                                                                                                                    |
| ----------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessible-icon` | Beta         | `root`, `label`                                                                                                                                 |
| `accordion`       | Beta         | `root`, `item`, `header`, `trigger`, `content`                                                                                                  |
| `autocomplete`    | Experimental | `input`, `trigger`, `clear`, `positioner`, `arrow`, `content`, `listbox`, `group`, `group-label`, `item`, `item-text`, `item-indicator`         |
| `checkbox`        | Beta         | `root`, `control`, `indicator`, `hidden-input`                                                                                                  |
| `collapsible`     | Beta         | `root`, `trigger`, `content`                                                                                                                    |
| `combobox`        | Experimental | `input`, `trigger`, `clear`, `positioner`, `arrow`, `content`, `listbox`, `group`, `group-label`, `item`, `item-text`, `item-indicator`         |
| `calendar`        | Experimental | `root`, `header`, `prev-trigger`, `next-trigger`, `heading`, `grid`, `grid-header`, `grid-body`, `row`, `column-header`, `cell`, `cell-trigger` |
| `date-picker`     | Experimental | `root`, `trigger`, `content`                                                                                                                    |
| `description`     | Beta         | `root`                                                                                                                                          |
| `direction`       | Stable       | `root`                                                                                                                                          |
| `dialog`          | Beta         | `trigger`, `close`, `backdrop`, `positioner`, `content`, `title`, `description`                                                                 |
| `error-message`   | Beta         | `root`                                                                                                                                          |
| `field`           | Beta         | `root`, `control`, `label`, `description`, `error-message`, `hidden-input`                                                                      |
| `fieldset`        | Beta         | `root`, `legend`, `description`, `error-message`                                                                                                |
| `form-control`    | Beta         | `root`, `control`, `label`, `description`, `error-message`, `hidden-input`                                                                      |
| `hover-card`      | Experimental | `trigger`, `positioner`, `arrow`, `content`                                                                                                     |
| `live-announcer`  | Beta         | `root`, `polite`, `assertive`                                                                                                                   |
| `label`           | Beta         | `root`                                                                                                                                          |
| `locale`          | Beta         | No DOM parts                                                                                                                                    |
| `context-menu`    | Experimental | `trigger`, `positioner`, `arrow`, `content`, `group`, `group-label`, `separator`, `item`, `item-indicator`                                      |
| `dropdown-menu`   | Experimental | `trigger`, `positioner`, `arrow`, `content`, `group`, `group-label`, `separator`, `item`, `item-indicator`                                      |
| `menu`            | Experimental | `trigger`, `positioner`, `arrow`, `content`, `group`, `group-label`, `separator`, `item`, `item-indicator`                                      |
| `menubar`         | Experimental | `trigger`, `positioner`, `arrow`, `content`, `group`, `group-label`, `separator`, `item`, `item-indicator`                                      |
| `navigation-menu` | Experimental | `trigger`, `positioner`, `arrow`, `content`, `group`, `group-label`, `separator`, `item`, `item-indicator`                                      |
| `popover`         | Experimental | `trigger`, `positioner`, `arrow`, `content`                                                                                                     |
| `popper`          | Beta         | `anchor`, `positioner`, `arrow`                                                                                                                 |
| `portal`          | Beta         | `root`                                                                                                                                          |
| `radio-group`     | Beta         | `root`, `item`, `item-indicator`, `hidden-input`                                                                                                |
| `select`          | Beta         | `trigger`, `value`, `positioner`, `arrow`, `content`, `listbox`, `group`, `group-label`, `item`, `item-text`, `item-indicator`                  |
| `sheet`           | Experimental | `trigger`, `close`, `backdrop`, `positioner`, `content`, `title`, `description`                                                                 |
| `slider`          | Experimental | `root`, `track`, `range`, `thumb`, `hidden-input`                                                                                               |
| `tabs`            | Beta         | `root`, `list`, `trigger`, `indicator`, `content`                                                                                               |
| `toast`           | Experimental | `viewport`, `root`, `title`, `description`, `action`, `close`                                                                                   |
| `toolbar`         | Experimental | `root`, `button`, `link`, `separator`                                                                                                           |
| `switch`          | Beta         | `root`, `control`, `thumb`, `hidden-input`                                                                                                      |
| `tooltip`         | Experimental | `trigger`, `positioner`, `arrow`, `content`                                                                                                     |
| `visually-hidden` | Stable       | `root`                                                                                                                                          |

Internal metadata scopes are not public styling contracts. `listbox` and `overlay` exist so public primitives can be tested and documented consistently, but they should not be imported or styled as standalone user APIs.

## UI Usage

UI items should style Core-backed parts through `data-scope`, `data-part`, state attributes, and Core CSS variables. UI should not depend on Core private DOM structure, generated IDs, signal names, or implementation file paths.

When UI wraps a Core primitive, it may add class names for project ergonomics, but those class names are UI source conventions. The durable primitive contract remains the data attribute metadata.

## Tests

Metadata and runtime tests should assert:

- Every docs metadata part has `data-scope` and `data-part`.
- Runtime helpers return the same scope and part attributes.
- Public state attributes are listed in primitive metadata.
- Floating parts list their CSS variable contracts.
- SSR output does not depend on browser globals to render stable part attributes.
