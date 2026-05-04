# Keystone Solid Polymorphic `as` Rendering

## Status

- Issue: #68
- Layer: Keystone
- Inventory item: Solid polymorphic `as` rendering
- Current status: complete for the private Keystone kernel surface

## Audit

Existing reusable surfaces:

- `packages/keystone/src/utils/index.ts` owns `KeystoneAs`, `PolymorphicProps`, and `renderPolymorphic`.
- Public primitive parts use that helper for trigger-like surfaces, including Dialog, Select, Accordion, Collapsible, Combobox, HoverCard, Menu, Popover, Sheet, Tabs, Toast, and Toolbar.
- `packages/keystone/src/utils/kernel.test.tsx` already proves callback-style composition and router-link-like trigger rendering.
- `packages/keystone/src/utils/polymorphic.types.tsx` is included in package typechecking and keeps callback renderer, primitive prop, and direct Solid component examples compiling.
- `docs/rfcs/keystone-api.md` defines the Solid-native API direction and explicitly calls out Solid-specific constraints.
- `docs/prd/keystone-internals-inspiration-parity.md` tracks this module in the parity ledger.

Intentional non-goals:

- Keystone does not port Base UI or Radix React `cloneElement`, element slot, or render-prop cloning behavior.
- Keystone does not forward Solid `use:*` directives through user-defined components; consumers that need directive ownership should use callback-style composition and place directives on the final element.
- Keystone does not make the private utility a public package subpath during the 0.1.0 kernel proving phase.

## End-State Contract

API shape:

- Primitive parts expose `as?: KeystoneAs<Props>` through `PolymorphicProps`.
- `as` accepts intrinsic element names such as `"button"` or `"a"`.
- `as` accepts direct Solid components when the caller can satisfy that component's props.
- `as` accepts callback-style renderers for advanced composition:

```tsx
<Dialog.Trigger
  as={(triggerProps) => (
    <A href="/settings" {...triggerProps}>
      Settings
    </A>
  )}
/>
```

Runtime behavior:

- If `as` is omitted, the primitive part renders its semantic fallback element.
- If `as` is an intrinsic name, Keystone renders it through Solid `Dynamic`.
- If `as` is a function, Keystone renders it through Solid `createComponent` so function-valued `as` uses Solid's component execution path.
- Keystone passes the complete primitive prop contract to the target renderer, including user props, composed event handlers, ARIA, `data-scope`, `data-part`, state data attributes, `ref`, and `children`.
- User code controls final prop merge order in callback-style composition. This keeps link/router wrappers explicit instead of relying on React-style cloning.

Accessibility and styling contract:

- Polymorphism must not remove required primitive ARIA unless the user intentionally overrides it in the callback merge.
- Every rendered primitive part must preserve `data-scope` and `data-part`.
- State attributes such as `data-state`, `data-disabled`, `data-highlighted`, and `data-selected` remain owned by the primitive that creates the props.
- No CSS variables are introduced by polymorphic rendering itself. Geometry variables remain the responsibility of floating/measured primitives.

SSR and hydration:

- `renderPolymorphic` does not touch `window` or `document`.
- Fallback, intrinsic, direct component, and callback rendering are deterministic from props and are safe for SSR as long as the provided renderer is SSR-safe.

State contract:

- Polymorphic rendering is stateless. Controlled and uncontrolled behavior remains owned by the primitive controller that supplies the rendered props.

## Verification

Current proof surfaces:

- `packages/keystone/src/utils/kernel.test.tsx`
  - callback-style composition
  - intrinsic element names
  - direct Solid components
  - router-link-like Dialog trigger rendering with primitive ARIA/data attributes
- `packages/keystone/src/utils/polymorphic.types.tsx`
  - callback renderer type coverage
  - Dialog and Select trigger prop type coverage
  - direct Solid component render type coverage
- `packages/keystone/test/dialog.behavior.test.tsx` and `packages/keystone/test/select.behavior.test.tsx`
  - user-visible primitive behavior on public trigger parts that consume polymorphic rendering

Known limitations:

- Element-specific props on public primitive part types intentionally remain anchored to the primitive fallback element. Consumers that need router/link-specific props should use callback-style composition so the final element and prop merge are explicit.
- Direct Solid components are suitable when their required props can be supplied at the `renderPolymorphic` call site. Primitive JSX parts with fixed fallback props should prefer callback-style composition for custom component requirements.
