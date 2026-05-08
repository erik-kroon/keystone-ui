# Maturity Model

## Purpose

Every Core primitive and first-party UI item should carry a maturity status before public preview. Maturity is a product contract: it tells users how much API stability, accessibility evidence, and test depth they can expect.

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
- UI wrapper works when the primitive is Core-backed.
- Known gaps are explicit.

### Stable

Public contract. Changes require migration notes.

Requirements:

- Strong behavior tests.
- Accessibility evidence, including manual notes for complex primitives.
- SSR/hydration smoke coverage.
- Stable styling contract: anatomy, `data-scope`, `data-part`, state attributes, and CSS variables.
- API reviewed against Solid-native conventions.
- UI wrapper and docs examples verified where relevant.

### Deprecated

Public surface with a documented replacement path.

Requirements:

- Replacement documented.
- Removal timeline documented.
- Migration notes provided.

## Current Core Labels

These labels are intentionally conservative.

Preview docs use these buckets:

- Stable-candidate: `Stable` metadata surfaces that are small enough to carry a stable contract during preview (`direction`, `visually-hidden` today).
- Beta: useful public surfaces for early adopters with explicit known gaps.
- Experimental: feedback surfaces whose API or evidence may change materially.
- Internal: private kernel or helper surfaces, even when metadata-visible for testing.
- Backlog: planned surfaces with no public API contract.

The authoritative source is `packages/core/src/metadata/index.ts`. This table is the current public-docs snapshot of that metadata plus the `@keystone-ui/core` package exports. Public subpaths should not ship without a label here or an explicit explanation.

| Public surface / metadata scope | Export subpath      | Maturity     | Explanation                                                                                                                                                               |
| ------------------------------- | ------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Package root aggregate          | `.`                 | Mixed        | Re-exports public primitives, metadata helpers, and types. Each primitive keeps its own maturity label; root availability is not a stable claim for every member.         |
| `accessible-icon`               | `./accessible-icon` | Beta         | Small, proven utility; still preview package.                                                                                                                             |
| `accordion`                     | `./accordion`       | Beta         | Useful disclosure primitive; API review remains open before stable.                                                                                                       |
| `alert-dialog`                  | `./alert-dialog`    | Beta         | Safety-critical Dialog derivative with explicit cancel/action parts, least-destructive focus, prevented outside dismissal, and shared overlay behavior.                   |
| `autocomplete`                  | `./autocomplete`    | Experimental | Combobox-derived UI convenience surface; filtering, async loading, and large-list guidance are still forming.                                                             |
| `checkbox`                      | `./checkbox`        | Beta         | Selection-control kernel is promising; validate form/reset and readonly semantics broadly.                                                                                |
| `collapsible`                   | `./collapsible`     | Beta         | Useful disclosure primitive; measured transition helpers remain follow-up work.                                                                                           |
| `combobox`                      | `./combobox`        | Experimental | Important collection/form primitive, but async/filtering/virtualization guidance and AT evidence are not stable-grade yet.                                                |
| `command`                       | `./command`         | Experimental | Combobox-kernel specialization for command list semantics; UI owns filtering, ranking, shortcuts, stores, previews, and action execution.                                 |
| `calendar`                      | `./date-picker`     | Experimental | Exported through the date-picker package; calendar-system and date-field depth remain follow-up work.                                                                     |
| `date-picker`                   | `./date-picker`     | Experimental | Date field family should move cautiously until segment editing, validation, and locale coverage mature.                                                                   |
| `description`                   | `./description`     | Beta         | Small form-associated text primitive; stable status waits on broader form docs and examples.                                                                              |
| `direction`                     | `./direction`       | Stable       | Proven utility with isolated behavior.                                                                                                                                    |
| `dialog`                        | `./dialog`          | Beta         | Primary overlay proving primitive; needs broader browser/manual accessibility evidence before stable.                                                                     |
| `error-message`                 | `./error-message`   | Beta         | Small form-associated text primitive; stable status waits on broader form docs and examples.                                                                              |
| `field`                         | `./form`            | Beta         | Exported through the form package; API should settle before stable.                                                                                                       |
| `fieldset`                      | `./fieldset`        | Beta         | Form group primitive with useful metadata; validation/browser evidence needs to broaden before stable.                                                                    |
| `form-control`                  | `./form`            | Beta         | Exported through the form package; strong direction and tests, but API should settle before stable.                                                                       |
| `hover-card`                    | `./hover-card`      | Experimental | PreviewCard/HoverCard overlay derivative with documented end-state contract; should trail Dialog and Popper maturity until detached trigger and broader AT evidence land. |
| `label`                         | `./label`           | Beta         | Small native-label wrapper; stable status waits on broader field composition docs.                                                                                        |
| `live-announcer`                | `./live-announcer`  | Beta         | Useful utility; manual AT notes should precede stable claims.                                                                                                             |
| `locale`                        | `./locale`          | Beta         | Useful provider; needs broader docs before stable.                                                                                                                        |
| `context-menu`                  | `./context-menu`    | Experimental | Menu-family surface; pointer intent, checked items, and nested menu depth are still maturing.                                                                             |
| `dropdown-menu`                 | `./dropdown-menu`   | Experimental | Menu-family surface; submenu, checked item, modality, and layer edge evidence are still maturing.                                                                         |
| `menu`                          | `./menu`            | Experimental | Menu-family base; submenu, pointer intent, and nested menu depth are needed before beta/stable.                                                                           |
| `menubar`                       | `./menubar`         | Experimental | Menu-family derivative; nested popup coordination and RTL/pointer coverage need more evidence.                                                                            |
| `navigation-menu`               | `./navigation-menu` | Experimental | Menu-family derivative; viewport/layout APIs, touch intent, and routed focus evidence remain open.                                                                        |
| `number-field`                  | `./number-field`    | Experimental | Numeric form primitive backed by the SpinButton controller; needs UI wrapper examples and broader browser/AT evidence before beta.                                        |
| `popover`                       | `./popover`         | Experimental | Overlay derivative with a documented interaction matrix; should trail Dialog until browser, nested overlay, and manual AT evidence improve.                               |
| `popper`                        | `./popper`          | Beta         | Public positioning composition surface; depends on Floating UI adapter maturity.                                                                                          |
| `portal`                        | `./portal`          | Beta         | Proven utility; SSR/hydration docs should remain visible.                                                                                                                 |
| `radio-group`                   | `./radio-group`     | Beta         | Selection-control kernel is promising; validate form/reset and readonly semantics broadly.                                                                                |
| `select`                        | `./select`          | Beta         | Primary collection/form proving primitive; needs virtualized/large collection strategy and manual AT evidence before stable.                                              |
| `sheet`                         | `./sheet`           | Experimental | Overlay derivative; side-specific and nested modal evidence should trail Dialog maturity.                                                                                 |
| `slider`                        | `./slider`          | Experimental | Needs broader pointer/keyboard/orientation coverage before beta.                                                                                                          |
| `spin-button`                   | `./spin-button`     | Experimental | Shared numeric controller and primitive; needs press-repeat behavior and broader manual AT evidence before beta.                                                          |
| `switch`                        | `./switch`          | Beta         | Selection-control kernel is promising; validate form/reset and readonly semantics broadly.                                                                                |
| `tabs`                          | `./tabs`            | Beta         | Needs full keyboard/mounting/focus docs and broader browser evidence before stable.                                                                                       |
| `toast`                         | `./toast`           | Experimental | Needs manager/provider/a11y evidence and pause/update policy before beta.                                                                                                 |
| `toolbar`                       | `./toolbar`         | Experimental | Needs composite coordination depth before beta.                                                                                                                           |
| `tooltip`                       | `./tooltip`         | Experimental | Overlay derivative with documented timing/hover limitations; should trail Dialog/Popover kernel maturity and manual AT evidence.                                          |
| `visually-hidden`               | `./visually-hidden` | Stable       | Small utility with stable behavior.                                                                                                                                       |

## Internal And Backlog Surfaces

| Surface                 | Maturity | Explanation                                                                                                                     |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `listbox`               | Internal | Kernel-facing until Select and Combobox prove the collection API. It is metadata-visible but not a public package subpath.      |
| `overlay`               | Internal | Private overlay kernel. Document behavior through public overlay primitives instead of promoting this API.                      |
| Broad primitive backlog | Backlog  | Future inventory belongs in roadmap or issue-tracker work. Backlog items are not public API and should not carry stable claims. |

## Known Gaps

Stable status requires closing or explicitly deferring the relevant API, browser, and manual accessibility gaps in the primitive docs, metadata, or active issue tracker.

## UI Labels

First-party registry items should use the same labels, but the evidence is different:

- Shadcn-compatible registry payload validation and dependency resolution.
- Generated app typecheck/build.
- Source readability.
- Keystone delegation where behavior is primitive-owned.
- TanStack integration correctness where app engines are used.
- Metadata completeness, including parity notes.

Data-dense UI items remain experimental until the underlying Core kernels and registry payload lifecycle are mature enough to support them.

## Backlog Milestones

Backlog maturity is separate from issue milestone sequencing. Current open backlog should be triaged into:

- `0.3 Later Core`: Core primitive/runtime backlog.
- `0.4 Later UI`: UI component, registry, block, and app-source backlog.
- `0.5 Data-Dense Workspace`: data-dense workspace patterns.

Use these milestone labels instead of the generic `phase:later` label for new open Core/UI backlog items.
