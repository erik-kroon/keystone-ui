# Maturity Model

## Purpose

Every Keystone primitive and first-party Mason component should carry a maturity status before public preview. Maturity is a product contract: it tells users how much API stability, accessibility evidence, and test depth they can expect.

## Statuses

### Internal

Private implementation detail. No public API promise.

Requirements:

- Not documented as a user-facing API.
- May change without migration notes.
- Tested through the public primitive or package that consumes it.

Examples: private kernels, DOM helpers, registry implementation details.

### Experimental

Preview surface. Useful for feedback, but API and behavior may change.

Requirements:

- Basic behavior tests.
- Known gaps documented.
- Data attributes present when a DOM part is public.
- No stable accessibility claim beyond tested behavior.

### Beta

Mostly stable surface. Suitable for early adopters that can tolerate some churn.

Requirements:

- Behavior tests for core flows.
- Keyboard behavior documented.
- ARIA relationships documented.
- Controlled and uncontrolled behavior tested where relevant.
- SSR/hydration smoke coverage where relevant.
- Mason wrapper works when the primitive is Keystone-backed.
- Known gaps are explicit.

### Stable

Public contract. Changes require migration notes.

Requirements:

- Strong behavior tests.
- Accessibility evidence, including manual notes for complex primitives.
- SSR/hydration smoke coverage.
- Stable styling contract: anatomy, `data-scope`, `data-part`, state attributes, and CSS variables.
- API reviewed against Solid-native conventions.
- Mason wrapper and docs examples verified where relevant.

### Deprecated

Public surface with a documented replacement path.

Requirements:

- Replacement documented.
- Removal timeline documented.
- Migration notes provided.

## Current Keystone Labels

These labels are intentionally conservative.

| Primitive                             | Maturity     | Notes                                                                                                 |
| ------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| AccessibleIcon                        | Beta         | Small, proven utility; still preview package.                                                         |
| Direction                             | Stable       | Proven utility with isolated behavior.                                                                |
| Locale                                | Beta         | Useful provider; needs broader docs before stable.                                                    |
| LiveAnnouncer                         | Beta         | Useful utility; manual AT notes should precede stable claims.                                         |
| VisuallyHidden                        | Stable       | Small utility with stable behavior.                                                                   |
| Portal                                | Beta         | Proven utility; SSR/hydration docs should remain visible.                                             |
| Popper                                | Beta         | Public positioning composition surface; depends on Floating UI adapter maturity.                      |
| FormControl / Field                   | Beta         | Strong direction and tests, but API should settle before stable.                                      |
| Dialog                                | Beta         | Primary overlay proving primitive; needs broader browser/manual accessibility evidence.               |
| Select                                | Beta         | Primary collection/form proving primitive; needs virtualized/large collection strategy before stable. |
| Combobox                              | Experimental | Important, but async/filtering/virtualization guidance is still forming.                              |
| Listbox                               | Internal     | Kernel-facing until Select/Combobox prove the collection API.                                         |
| Overlay internals                     | Internal     | Private kernel.                                                                                       |
| Accordion / Collapsible               | Beta         | Useful disclosure primitives; keep API review open.                                                   |
| Tabs                                  | Beta         | Needs full keyboard/mounting/focus docs before stable.                                                |
| Menu family                           | Experimental | Needs submenu, pointer intent, and nested menu depth before beta/stable.                              |
| Popover / Tooltip / HoverCard / Sheet | Experimental | Overlay derivatives should trail Dialog kernel maturity.                                              |
| Checkbox / Switch / RadioGroup        | Beta         | Selection-control kernel is promising; validate form/reset and readonly semantics broadly.            |
| Slider                                | Experimental | Needs broader pointer/keyboard/orientation coverage before beta.                                      |
| DatePicker / Calendar                 | Experimental | Date field family should move cautiously.                                                             |
| Toast                                 | Experimental | Needs manager/provider/a11y evidence and pause/update policy before beta.                             |
| Toolbar                               | Experimental | Needs composite coordination depth before beta.                                                       |

## Mason Labels

Mason registry items should use the same labels, but the evidence is different:

- Registry validation and dependency resolution.
- Generated app typecheck/build.
- Source readability.
- Keystone delegation where behavior is primitive-owned.
- TanStack integration correctness where app engines are used.
- Metadata completeness, including parity notes.

Data-dense Mason components remain experimental until the underlying Keystone kernels and Mason registry lifecycle are mature enough to support them.
