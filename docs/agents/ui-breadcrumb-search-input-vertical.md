# UI Breadcrumb And SearchInput Vertical

## Status

- Breadcrumb: implemented as source-owned UI display/navigation parts for docs, app routes, and topbar trails.
- SearchInput: implemented as a native search input composition for filters, topbars, docs search, and command/search entry points.

## Audit

- Breadcrumb had inventory and docs navigation mentions but no registry item or UI source.
- SearchInput existed only as an input-group composition example; reusable source and registry metadata were missing.
- Reusable local patterns: `Input` visual control classes, source-owned registry metadata, Solid part exports, and focused Vitest DOM contract tests.

## End-State Contract

- Breadcrumb owns native navigation semantics only: `nav`, ordered list, anchors, presentation separators, `aria-current=page`, and stable `data-scope`/`data-part`/`data-slot` attributes.
- Breadcrumb intentionally does not own router matching, data loading, responsive collapse policy, or menu state.
- SearchInput owns a native `type=search` control, decorative leading icon, optional clear button, loading status, invalid/disabled/loading state attributes, controlled and uncontrolled value rendering, and clear behavior that runs user handlers before internal clearing.
- SearchInput intentionally does not filter data, own command behavior, sync router state, or register with Field/TanStack Field.

## Verification

- Component tests cover Breadcrumb landmark/list/link/page/separator/ellipsis semantics.
- Component tests cover SearchInput native type, loading status, clear behavior, focus restoration, and `defaultPrevented` clear handling.
- Registry metadata records API, anatomy, accessibility, limitations, and parity notes for both items.
