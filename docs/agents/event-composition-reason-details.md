# Event Composition And Reason Details

## Status

End-state baseline reached for the Core kernel helper layer.

## Audit

- `composeEventHandlers` already ran user handlers before internal handlers and skipped internal behavior when `event.defaultPrevented`.
- `callEventHandler` already supported Solid bound event tuples at runtime, but this behavior was not documented by a focused regression test.
- State-change reason details existed across primitives, but several controllers carried details through mutable `last*Detail` or `pendingDetail` variables because `createControllableSignal` only emitted the next value.
- The reusable code was `packages/core/src/utils/index.ts`, plus existing Dialog, Select, Listbox, Disclosure, Accordion, Combobox, and Overlay tests that assert observable reasons.

## Contract

- Keystone event composition is Solid-native and accepts normal event callbacks plus Solid bound event tuples.
- User handlers always run first.
- Internal handlers run only when `event.defaultPrevented` is false, unless `checkForDefaultPrevented: false` is passed.
- Reason details use `{ event?: Event; reason: string }` through `CoreChangeDetail`.
- Controllable setters accept an optional detail object and pass that exact detail to `onChange`.
- Controlled state still derives from props and only requests changes through callbacks.
- Uncontrolled state mutates local state and skips unchanged notifications via `Object.is`.
- Programmatic changes should provide a `defaultDetail` so omitted details have a stable `"programmatic"` reason.

## Implementation Notes

- `createControllableSignal<T, Detail>` and `createControllableBooleanSignal<Detail>` now carry detail objects directly.
- Overlay, Select, Combobox, Listbox selection, Disclosure, and Accordion no longer need mutable side-channel detail state.
- `CoreEventHandler` intentionally remains permissive at the type boundary because Solid event handlers encode element-specific `currentTarget` and `target` types that are narrower than the generic kernel can safely name.
- There are no CSS variables, ARIA attributes, data attributes, SSR branches, or hydration behavior specific to this kernel item. Those contracts remain owned by the primitives that consume the helpers.

## Verification

- Kernel tests cover controlled and uncontrolled state, explicit controlled `undefined`, typed change details, default programmatic details, user-first composition, preventDefault cancellation, and Solid bound event tuples.
- Dialog, Select, Listbox, Accordion, Combobox, Disclosure, and Overlay consumers reuse the shared detail-carrying setter contract instead of re-solving reason propagation.

## Known Limits

- The helper remains private to Core internals per `docs/agents/core-internal-kernel-guidance.md`; no public `./utils` subpath is introduced.
