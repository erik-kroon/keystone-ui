# Direction Provider Vertical

## Audit

- Existing repo state: Tabs and Toolbar each accepted a local `dir` prop and implemented RTL-aware horizontal keyboard movement independently.
- Missing behavior: shared Keystone direction context, exported provider/controller API, public metadata, docs contract entry, and regression tests proving inheritance and local override.
- Reusable code: existing `createControllableSignal`, `partDataAttributes`, Tabs direction logic, Toolbar roving-focus direction logic, and docs contract metadata pipeline.

## End-State Contract

- API: `Direction.Root`, `DirectionProvider.Root`, `createDirection`, and `useDirection`.
- Direction values: `"ltr"` and `"rtl"`.
- Controlled usage: pass `dir` and react to `onDirectionChange`.
- Uncontrolled usage: pass `defaultDir` or rely on inherited provider direction, falling back to `"ltr"`.
- Anatomy: root only, rendered as an unstyled `div`.
- Attributes: `dir`, `data-scope="direction"`, `data-part="root"`, and `data-dir="ltr|rtl"`.
- Accessibility: no widget role is added; native `dir` drives text and layout direction while descendants consume context for direction-aware keyboard behavior.
- SSR/hydration: no browser globals are read; explicit and default values produce deterministic server output.

## Implementation Status

- Added Keystone direction module and package subpath export.
- Wired Tabs and Toolbar roots to inherit nearest provider direction while preserving their explicit `dir` prop override.
- Added public primitive metadata and docs contract coverage.
- Added tests for root attributes, controlled controller updates, primitive inheritance/override, and RTL toolbar arrow order.

## Known Limits

- This is a primitive context provider only. Locale/i18n, bidirectional text isolation, and document-level `<html dir>` management remain separate future kernel helpers.
