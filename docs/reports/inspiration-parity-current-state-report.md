# Keystone/Mason Inspiration Parity And First-Class Gap Report

## 1. Executive Summary

Keystone/Mason is a serious private-preview repo, not a scaffold, but it is not first-class yet. Core now has real shared kernels for controllable state, event composition, metadata, overlays, focus, dismissal, outside hiding, scroll locking, presence, floating, collections, typeahead, selection, form control, direction, locale, and live announcement. Mason is stronger than the primitive catalog: registry validation, dependency resolution, path safety, install planning, lifecycle commands, installed metadata, and generated-app verification are all implemented and tested.

The strongest areas are Dialog/overlay internals, Select/listbox/form participation, Mason registry validation, Mason CLI transaction planning, and TanStack Table composition in UI source. The weakest areas are breadth that outpaces maturity: DatePicker is not a full date-field system, Menu lacks deep pointer/submenu/menu-bar behavior, Combobox lacks async/filtering/virtualization policy, Toast is not Sonner-grade, and most primitives lack public accessibility specs and manual assistive-technology evidence.

The biggest strategic risk is overclaiming parity because many docs and registry notes are more confident than the evidence supports. Current tests are useful, but most run in happy-dom/jsdom-style harnesses, not a browser and screen-reader matrix. The repo should continue its current architecture. Do not pivot to wrapping Kobalte, Ark, or Radix. The highest-leverage next phase is kernel hardening plus conservative maturity labels, not more component breadth.

Recommended next phase: freeze Core breadth, harden Dialog/Select/Menu/Combobox/FormControl with browser and accessibility evidence, tighten stale docs, and make Mason lifecycle/default-registry behavior public-preview credible.

## 2. Methodology

I cloned or updated these inspiration repos under `inspo/` and recorded current shallow-clone commits:

| Repo                        | Commit inspected | Role                                                              |
| --------------------------- | ---------------- | ----------------------------------------------------------------- |
| Kobalte                     | `abd5613`        | Solid-native primitive API and composition reference              |
| corvu                       | `ff79bca`        | Solid overlay/disclosure/drawer/resizable reference               |
| solid-primitives            | `16ded87`        | Solid utility and SSR test discipline reference                   |
| Zag                         | `310747f`        | state-machine, anatomy, connector, data-attr reference            |
| Ark UI                      | `1b446df`        | Zag-backed multi-framework component surface reference            |
| Base UI                     | `8c5bdda`        | React primitive runtime depth, tests, docs/data-attr reference    |
| Radix Primitives            | `22473d1`        | React primitive precedent and accessibility test reference        |
| shadcn registry-template    | `906f859`        | registry shape reference                                          |
| React Spectrum / React Aria | `0a84129`        | accessibility, i18n, collection/date/form rigor reference         |
| Ariakit                     | `479afd4`        | store/composite/menu/dialog behavior and browser matrix reference |
| Floating UI                 | `d8020ee`        | positioning engine reference                                      |
| shadcn/ui                   | `3977fb9`        | copy-paste registry and generated source reference                |
| TanStack Table              | `e4d15a6`        | table engine reference                                            |
| TanStack Virtual            | `5ae5db1`        | virtualization engine reference                                   |
| Lightweight Charts          | `868cae2`        | chart engine reference                                            |

Local context read: `README.md`, `CONTEXT.md`, `CONTEXT-MAP.md`, package manifests, Core source and tests, Mason CLI/registry source and tests, registry metadata, ADR/RFC/PRD/report/roadmap excerpts, and current registry item JSON. Parity was judged by implemented behavior, accessibility semantics, keyboard/focus behavior, SSR/hydration posture, public API shape, data attributes, test depth, docs, and whether the repo uses proven engines instead of rebuilding them.

Limitations: I did not run upstream inspiration test suites. Inspiration analysis is source/doc inspection from current clones, not a full upstream audit. I ran local `bun run test:core`, `bun run test:mason-registry`, and `bun run test:mason-cli`, but not the full `bun run verify:release`.

## 3. Local Source Of Truth Review

Core package exports are the root export plus 35 subpaths: `accessible-icon`, `accordion`, `autocomplete`, `checkbox`, `combobox`, `context-menu`, `collapsible`, `date-picker`, `direction`, `dialog`, `description`, `dropdown-menu`, `error-message`, `fieldset`, `form`, `hover-card`, `label`, `locale`, `live-announcer`, `menu`, `menubar`, `navigation-menu`, `popper`, `portal`, `popover`, `radio-group`, `sheet`, `switch`, `tabs`, `tooltip`, `toolbar`, `select`, `slider`, `toast`, and `visually-hidden`.

Main private kernels: `utils` for state/event/polymorphism/data helpers, `metadata`, `overlay`, `collection`, `form`, `selection-control`, and i18n/live-announcer support. `@keystone-ui/core` currently depends only on `solid-js` and `@floating-ui/dom`, which matches the Core/TanStack boundary.

Current public primitive coverage is broad: overlay family, collection/input family, form/control family, disclosure/structure, utility/display, i18n, and toast. This breadth is useful for proving Mason UI wrappers, but it is ahead of stable evidence.

Mason registry current state:

- `registry/default/items` has 47 item JSON files.
- Item categories include base UI, Core-backed UI, TanStack app components, blocks, and a template.
- Multi-file items are present, especially `data-table`, `data-table-tanstack-router`, invoice/dashboard blocks, and TanStack Start template.
- First-party metadata includes `meta.parity` notes and rich `meta` docs, but notes are sometimes more confident than test evidence.

Mason CLI current capabilities: `init`, `add`, `diff`, `update`, `remove`, `doctor`, `--dry-run`, `--force`, explicit `--registry`, project detection, dependency planning, file hash recording, conflict detection, path safety, installed metadata, and generated app verification in tests. It does not yet have a hosted default registry, richer remote registry resolution, prompts, transforms, or broad framework matrices.

Tests currently pass:

- Core: 44 files, 251 tests. The direct `createAutocomplete` test is now wrapped in a Solid root so the suite no longer emits the prior disposal warning.
- Mason Registry: 52 tests.
- Mason CLI: 27 tests.

Docs overstate: README and older readiness/status reports have stale registry item counts. The kernel PRD marks many internals `proven`; that is fair for focused test coverage, but not enough for public-stable claims. Docs understate: Mason CLI/registry are now materially stronger than older tracer language suggests.

## 4. Inspiration Repo Findings

### Kobalte

Kobalte does Solid-native compound primitives well: separate parts, context-driven composition, hidden inputs, form-control pieces, internationalized behavior, and broad primitive coverage. Keystone should learn from its Solid idioms, form/control composition, and mature primitive inventory. Keystone should not blindly copy Kobalte's breadth or exact APIs; Keystone's data-scope/data-part contract and Mason layer are distinct product choices.

### corvu

corvu is valuable for focused Solid overlay/disclosure primitives and small reusable support packages such as dismissible, focus trap, prevent scroll, presence, list, persistent, and floating helpers. Keystone should learn from its narrow packages and drawer/resizable ergonomics. Keystone should not chase corvu's package split; Keystone's private-kernel monorepo shape is better for current API discipline.

### solid-primitives

solid-primitives is a reference for small, well-scoped Solid utilities, package-level docs, client/SSR tests, and community package discipline. Keystone should learn its utility granularity and SSR test posture. Keystone should not turn Core into a generic utilities library; primitive behavior belongs in Keystone, broad generic utilities do not.

### Zag

Zag's strength is explicit state machines, anatomy, connector functions, generated docs for props/data attributes/CSS vars, and multi-framework adapters. Keystone should learn from its machine discipline, anatomy metadata, and generated documentation. Keystone should not adopt a full machine runtime by default; Solid-native primitives can stay smaller and more direct as long as behavior stays explicit and tested.

### Ark UI

Ark shows how Zag can produce ergonomic multi-framework component APIs with anatomy and presence/floating/collection consistency. Keystone should learn from Ark's documentation, anatomy consistency, and multi-framework quality gates. Keystone should not chase multi-framework scope; Keystone's strategic differentiator is Solid-native Core plus Mason source installation.

### Base UI

Base UI is the best current runtime-depth reference in this review. It has extensive per-part files, tests, data-attribute docs, CSS variable docs, browser test scripts, and mature behavior for overlays, fields, composites, menus, and floating surfaces. Keystone should use Base UI as the bar for behavior, not React API shape. Keystone should not import React store/render-prop patterns into Solid.

### Radix Primitives

Radix remains useful for primitive anatomy, accessible interaction precedent, and source-level overlay/focus/dismissal patterns. Its test and story coverage are mature. Keystone should treat it as secondary precedent when Base UI/Kobalte disagree. Keystone should not mimic React Slot/asChild as the primary polymorphic model.

### React Aria / React Spectrum

React Aria/Spectrum is the rigor reference for accessibility, i18n, date/time, collections, selection, form semantics, and large cross-browser evidence. Keystone should lean on React Aria for date/calendar/combobox/select expectations and manual accessibility matrices. Keystone should not try to recreate React Aria's full i18n/date/collection engine immediately; for date/i18n, use focused scope and document gaps.

### Ariakit

Ariakit is strong on composite stores, menu/dialog/popover behavior, and browser/mobile test matrices. It now also has Solid loader/test paths, which makes it relevant beyond React. Keystone should learn from its browser coverage and store clarity. Keystone should not copy its store shape wholesale unless a primitive demands that depth.

### shadcn registry-template / shadcn/ui

shadcn's strength is source ownership, registry build tooling, public docs, component install ergonomics, and a culture of readable generated code. Mason is aligned on source ownership and multi-file components, but below parity on hosted registry, CLI polish, public docs, and lifecycle UX. Keystone should not copy React component implementations; it should copy the distribution discipline.

### Floating UI

Floating UI should remain the positioning engine. Keystone's `@floating-ui/dom` adapter is the correct boundary: Core owns primitive-facing props, CSS variables, and update lifecycle; Floating UI owns geometry. Do not build a custom positioning engine.

### TanStack Table / Virtual

TanStack Table and Virtual are the correct data-dense engines. Mason should compose them in installed source and expose app-level patterns, not reimplement row models or virtualizers. Current DataTable correctly uses `@tanstack/solid-table`; virtualization is a future companion item, not a Core concern.

### Lightweight Charts

Lightweight Charts is a credible financial/chart engine with canvas rendering, typed APIs, verification scripts, size limits, interaction tests, memory checks, and docs validation. Mason should wrap chart interaction patterns around a chart engine like this instead of building charts.

## 5. Keystone Kernel Parity

| Kernel                          | Current Keystone state                                            | Closest references           | Score | Gaps                                                  | First-class target / next work                                               |
| ------------------------------- | ----------------------------------------------------------------- | ---------------------------- | ----- | ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| Controllable state              | `createControllableSignal` supports value/default/onChange/detail | Kobalte, Base UI             | near  | no public policy doc for undefined/control edge cases | Keep private or primitive-specific; add docs/tests for controlled edge cases |
| Event composition               | user handler first, defaultPrevented blocks internal behavior     | Radix, Kobalte               | at    | handler typing is loose (`unknown`)                   | Tighten types without breaking Solid handler tuple support                   |
| Polymorphic rendering           | Solid `as` with intrinsic/component/callback                      | Kobalte, Ariakit Solid       | near  | no broad type tests for router components             | Add type tests and examples                                                  |
| Metadata/data attributes        | `data-scope`, `data-part`, state helpers                          | Zag, Base UI                 | near  | public docs incomplete for all primitives             | Generate docs from metadata and registry                                     |
| Overlay controller              | shared open/presence/floating/layer controller                    | Base UI, Kobalte, corvu      | near  | not every overlay derivative proves all paths         | Use Dialog, Popover, Menu, Tooltip matrices                                  |
| Dismissable layer               | outside pointer/focus/Escape, branches, top layer                 | Base UI, Kobalte, Radix      | near  | browser/mobile/pointer intent gaps                    | Add Playwright browser tests and nested overlay matrix                       |
| Focus scope                     | trap, guards, focus entry/restore, preventable autofocus          | Base UI, Radix               | near  | edge browser/Shadow DOM not proven                    | Browser tests, initialFocus/finalFocus API review                            |
| Outside hiding/inert            | hides dynamic outside DOM, restores state, live region exceptions | Base UI, React Aria          | near  | browser AT evidence missing                           | Manual screen-reader proof and exception docs                                |
| Prevent scroll                  | body lock, scrollbar compensation, iOS touch handling code        | corvu, Base UI               | near  | iOS behavior not browser-proven                       | Playwright/WebKit/manual mobile verification                                 |
| Portal/presence                 | portal present/forceMount and transition retention                | Radix, Kobalte, Base UI      | near  | animation docs incomplete                             | Public transition-status contract docs                                       |
| Floating adapter                | `@floating-ui/dom`, CSS vars, arrow, autoUpdate                   | Floating UI                  | at    | virtualized/dynamic content examples sparse           | Keep engine boundary; document vars and collision behavior                   |
| Collection registration         | DOM order, groups, hidden/disabled metadata                       | Kobalte, React Aria, Zag     | near  | virtualization/offscreen collection not solved        | Define virtual collection adapter before public Listbox                      |
| Roving focus/active descendant  | listbox active descendant, toolbar roving focus                   | Ariakit, Base UI, React Aria | near  | RTL/grid/menu-bar depth incomplete                    | Add direction/grid/composite matrices                                        |
| Typeahead                       | printable keys, collator, repeated search behavior                | Kobalte, Base UI             | near  | offscreen items and locale docs                       | Add tests with accents/locale and virtual items                              |
| Selection manager               | single/multiple/toggle/replace, hidden input integration          | React Aria, Kobalte          | near  | object values/custom equality absent                  | Document string-value constraint for 0.1                                     |
| Form-control/hidden input       | ARIA relationships, reset, external form owner                    | Kobalte, Base UI             | near  | manual AT evidence and browser validation             | Add public Field spec and AT matrix                                          |
| Direction/locale/live announcer | providers and tests exist                                         | React Aria, Kobalte          | near  | limited primitive adoption                            | Wire into Toast/date/menu strings; document message keys                     |

No kernel is beyond parity. Floating positioning is at parity because it delegates to Floating UI. Most other kernels are near parity for private-preview but below first-class public evidence.

## 6. Keystone Primitive Family Parity

| Family / primitive                      | Current code state                                                | Accessibility / keyboard parity | API parity                 | Test/docs parity          | 0.1 status         | First-class requirement                                         |
| --------------------------------------- | ----------------------------------------------------------------- | ------------------------------- | -------------------------- | ------------------------- | ------------------ | --------------------------------------------------------------- |
| Dialog                                  | Strongest overlay; modal, focus, dismiss, inert, portal, presence | near                            | near Base UI/Kobalte shape | good tests, needs AT docs | beta               | manual AT, browser matrix, alert-dialog                         |
| AlertDialog                             | not exported                                                      | missing                         | missing                    | missing                   | backlog            | dedicated role/least-destructive action semantics               |
| Sheet/Drawer                            | Sheet exists as overlay derivative                                | partial                         | near dialog derivative     | limited                   | experimental       | drawer-specific focus/scroll/mobile behavior                    |
| Popover                                 | exists with floating/overlay tests                                | partial-near                    | reasonable                 | limited                   | experimental       | non-modal focus/dismiss matrix                                  |
| Tooltip                                 | exists with hover/focus delay-ish behavior                        | partial                         | basic                      | focused tests             | experimental       | WCAG timing, hoverable content, disabled trigger docs           |
| HoverCard                               | exists                                                            | partial                         | basic                      | limited                   | experimental       | hover/focus grace, pointer intent                               |
| Menu/Dropdown/Context                   | shared menu namespace, items, checkbox/radio, submenu parts       | partial                         | useful                     | behavior tests            | experimental       | submenu pointer intent, menubar roving, typeahead, nested focus |
| Menubar/NavigationMenu                  | aliases over menu module                                          | below                           | shallow                    | limited                   | experimental       | true menubar/nav menu behavior                                  |
| Toast                                   | manager/provider/viewport/root/actions                            | partial                         | useful                     | behavior tests            | experimental       | pause/resume UX, swipe, live-region AT, Sonner-grade lifecycle  |
| Select                                  | strong collection/form baseline                                   | near                            | near Kobalte/Base UI       | good tests                | beta               | browser/AT matrix, large/virtual list policy                    |
| Combobox/Autocomplete                   | active descendant input/listbox, form value                       | partial                         | useful                     | behavior tests            | experimental       | async/filtering, autocomplete modes, virtualized options        |
| Listbox                                 | private facade                                                    | near internal                   | not public                 | kernel tests              | internal           | public API only after Select/Combobox settle                    |
| Command primitive                       | Mason `command-menu` item, no Core primitive                      | belongs mostly UI               | n/a                        | registry metadata         | Mason experimental | use hotkeys/store/fuzzy dependency, not Core engine             |
| FormControl/Field                       | solid Core form semantics                                         | near                            | useful                     | good tests                | beta               | public spec, manual error announcement evidence                 |
| Label/Description/ErrorMessage/Fieldset | exported support utilities                                        | near for simple cases           | simple                     | unit tests                | beta               | docs and integration examples                                   |
| Checkbox/Switch/RadioGroup              | selection-control kernel                                          | near                            | useful                     | tests                     | beta               | browser form/reset/readonly matrix                              |
| Slider                                  | multi-thumb controller                                            | partial-near                    | useful                     | tests                     | experimental       | pointer/browser/RTL/orientation evidence                        |
| NumberField/SpinButton                  | not present                                                       | missing                         | missing                    | missing                   | backlog            | use React Aria/Zag expectations before implementing             |
| Calendar/DatePicker                     | calendar grid and trigger dialog                                  | below                           | shallow date picker        | tests exist               | experimental       | date field, segments, i18n/date library strategy, AT            |
| DateField/DateRangePicker               | not present                                                       | missing                         | missing                    | missing                   | backlog            | deliberate date/i18n dependency decision                        |
| Collapsible/Accordion                   | working disclosure primitives                                     | near                            | reasonable                 | tests                     | beta               | docs and mount/presence policy                                  |
| Tabs                                    | working tabs                                                      | near                            | reasonable                 | behavior tests            | beta               | keyboard matrix, activation modes, SSR docs                     |
| Toolbar                                 | roving focus toolbar                                              | partial                         | basic                      | tests                     | experimental       | composite item registration/focus matrix                        |
| VisuallyHidden/AccessibleIcon           | small utilities                                                   | at/near                         | simple                     | tests                     | stable/beta        | docs and examples                                               |
| Portal/Popper                           | public utilities                                                  | near/at                         | useful                     | tests                     | beta               | docs for SSR and CSS vars                                       |
| Separator/Progress/Meter                | Separator exists in UI registry, not Core                         | UI only/backlog                 | n/a                        | registry only             | UI beta/backlog    | Core Progress/Meter only if primitive behavior needed           |

## 7. Mason Registry / CLI Parity

| Area                       | Current state                                                    | shadcn/reference comparison  | Gap                             | First-class target / next work                      |
| -------------------------- | ---------------------------------------------------------------- | ---------------------------- | ------------------------------- | --------------------------------------------------- |
| Registry schema            | Zod schema with item types, files, deps, meta                    | compatible in spirit         | no public schema package/site   | publish schema docs and examples                    |
| Item metadata              | rich `meta`, `meta.parity`, docs URLs                            | stronger than many templates | some claims overconfident       | validate maturity and parity evidence               |
| Multi-file components      | `filesRoot`/`targetRoot`, DataTable                              | good                         | limited docs                    | keep multi-file as default for app kits             |
| Dependency resolution      | deterministic graph, cycle/missing tests                         | good                         | no remote registry graph        | add hosted/URL registry support                     |
| Path safety                | rejects escapes/symlink unsafe paths                             | strong                       | keep broad OS matrix            | maintain as release gate                            |
| CLI init/add               | implemented with local registry                                  | preview-grade                | no hosted default, no prompts   | default registry resolution and noninteractive docs |
| Dry run                    | implemented                                                      | good                         | output is terse                 | add JSON output later                               |
| Update/diff/remove/doctor  | implemented and tested                                           | near for local preview       | UX/docs shallow                 | public docs, examples, failure modes                |
| Installed metadata         | package.json `mason.installed` with hashes and registry identity | useful                       | no lockfile                     | keep provenance checks in doctor                    |
| Generated app verification | CLI tests typecheck/build slices                                 | strong                       | limited app/style/router matrix | add SolidStart/TanStack Router/Tailwind variants    |
| Docs registry preview      | docs app has some coverage                                       | below shadcn                 | not hosted/full catalog         | registry pages with install preview                 |
| Hosted registry            | absent                                                           | below                        | public blocker                  | build/publish static registry                       |
| Source ownership           | installed readable source                                        | at                           | needs customization docs        | document ownership/update tradeoffs                 |

## 8. Mason App-Layer / TanStack Parity

| Surface                  | Belongs in     | Dependency to use                                   | Current state              | Minimum useful first version                     | What not to build             |
| ------------------------ | -------------- | --------------------------------------------------- | -------------------------- | ------------------------------------------------ | ----------------------------- |
| DataTable                | Mason UI       | `@tanstack/solid-table`                             | implemented multi-file kit | local state, sorting, filters, pagination, slots | custom table engine           |
| DataTable router adapter | Mason UI       | TanStack Router + Table                             | implemented source adapter | URL-backed table state                           | custom router                 |
| CommandMenu              | Mason UI       | hotkeys/store/fuzzy lib, Core dialog/menu as needed | registry item exists       | open/close, search, keyboard nav                 | Core command engine too early |
| TanStack Form fields     | Mason UI       | `@tanstack/solid-form` + Core Field                 | implemented items          | text/select/submit wrappers                      | app form engine               |
| RealtimeTable            | Mason UI       | Table + Query/Store + Virtual                       | future                     | live row states and update clarity               | Core realtime system          |
| Watchlist                | Mason UI       | Table/Virtual/Store                                 | future                     | dense rows, keyboard selection, freshness states | financial domain in Core      |
| Metric components        | Mason UI       | formatting libs                                     | future                     | stable numeric display                           | custom i18n/number engine     |
| TerminalLayout           | Mason UI/block | resizable/layout libs if needed                     | future                     | keyboard-first panels                            | Core layout framework         |
| EventFeed                | Mason UI       | Virtual + Query/Store                               | future                     | append/prepend states, focus retention           | custom virtualizer            |
| ConditionBuilder         | Mason UI       | form + validation libs                              | future                     | composable rule rows                             | schema validation engine      |
| Chart wrappers           | Mason UI       | Lightweight Charts or chosen chart engine           | future                     | interaction adapters, annotations                | canvas chart engine           |

## 9. Do-Not-Reinvent Assessment

| Area                 | Do not reinvent                               | Use                                                 | Keystone/Mason value above it                     |
| -------------------- | --------------------------------------------- | --------------------------------------------------- | ------------------------------------------------- |
| table engine         | row models, sorting/filtering/pagination core | TanStack Table                                      | source-owned UI, presets, accessibility wrappers  |
| virtualization       | virtual measurement/windowing                 | TanStack Virtual                                    | app-specific keyboard/focus integration           |
| form state           | app validation/submission orchestration       | TanStack Form                                       | Core field semantics + generated field source     |
| query/cache          | server cache/invalidation                     | TanStack Query                                      | templates and loading/error UI                    |
| routing              | route/search state engine                     | TanStack Router                                     | adapters for registry components                  |
| floating positioning | collision/placement math                      | Floating UI                                         | primitive API, data attrs, CSS vars               |
| chart engine         | canvas/SVG chart renderer                     | Lightweight Charts or similar                       | interaction wrappers and dense workspace patterns |
| schema validation    | schema parser/validator                       | Zod/Valibot/etc.                                    | examples and form adapters                        |
| date/i18n            | full calendar/date math and locale database   | `@internationalized/date` or similar if scope grows | Solid primitive composition                       |
| hotkeys              | app shortcut engine                           | TanStack Hotkeys or proven alternative              | command palette and workflow bindings             |
| fuzzy search         | scoring/matching engine                       | match-sorter/fuse/fzf-style lib                     | CommandMenu UI and result rendering               |

Current implementation is mostly appropriate. Keystone is not reimplementing table/floating/form app engines in Core. Date/calendar is the danger area: if Keystone grows DatePicker without a date/i18n engine decision, it will drift into reimplementing React Aria-level date complexity.

## 10. Documentation And Public API Gap

Accurate docs: product boundary, private kernel direction, TanStack app-layer boundary, do-not-reinvent guidance, Mason registry RFC, data-scope/data-part contract, and maturity model.

Stale docs fixed in the current cleanup: README, release notes, readiness tracker, status report, and research report now use the 47-item registry count and current Core/Mason test counts. Remaining caution: several docs use "proven" kernel language that is true only for current test scope, not for public-stable claims.

Missing docs:

- Per-primitive API reference and anatomy for all exported subpaths.
- Keyboard interaction tables for Dialog, Select, Combobox, Menu, Tabs, Toolbar, Slider, DatePicker, Toast.
- ARIA specs and known gaps for every beta/experimental primitive.
- CSS variable docs for every floating/measured part.
- Public maturity labels tied to evidence.
- Manual AT evidence files.
- Mason install/update/diff/remove/doctor user guide with failure states.
- Hosted registry and source ownership docs.

Public-facing soon: README, Core/UI boundary, primitive specs for Dialog/Select/Field/Tabs, Mason lifecycle docs, data attributes contract, maturity model, DataTable docs. Keep internal: agent verticals, issue triage spine, private kernel implementation notes, stale parity ledgers after superseded.

## 11. Test Gap Analysis

Strongest tested areas: Core overlay/Dialog behavior, collection/listbox/typeahead/selection, Select form participation, Mason registry validation, Mason CLI transaction/lifecycle/path safety/provenance checks, DataTable install plan, and generated app typecheck/build for key Mason slices.

Weakest tested areas:

- Manual assistive technology evidence is absent.
- Browser matrix is missing for most primitives.
- Nested overlay coverage exists for Dialog but not full Popover/Menu/Tooltip combinations.
- SSR/hydration coverage exists, but not per primitive.
- Combobox async/filtering/autocomplete modes are shallow.
- DatePicker lacks date-field/segment/i18n depth.
- Toast live-region behavior and pause/update/dismiss policies need more evidence.
- Data-dense UI lacks performance/keyboard tests beyond install/build.
- The prior `autocomplete.test.tsx` disposal warning has been fixed by wrapping direct controller creation in a Solid root.

Before 0.1: add browser tests for Dialog/Select/Menu/Combobox; manual AT notes for Dialog, Select, Field; add keyboard matrices for beta primitives; extend Mason generated-app coverage into SolidStart/router/style variants. Defer broad mobile gestures, DateRangePicker, chart wrappers, and full data-dense work.

## 12. Maturity Classification

### Core Exports

| Surface         | Current maturity | Evidence                    | Gaps                         | 0.1 status   | Next action       |
| --------------- | ---------------- | --------------------------- | ---------------------------- | ------------ | ----------------- |
| root            | preview          | package barrel exists       | stable API not committed     | beta         | keep conservative |
| accessible-icon | beta             | focused tests               | docs examples                | beta         | docs              |
| accordion       | beta             | disclosure tests            | docs/keyboard matrix         | beta         | spec              |
| autocomplete    | experimental     | wrapper over combobox       | shallow docs                 | experimental | document gaps     |
| checkbox        | beta             | selection-control tests     | browser form matrix          | beta         | docs              |
| collapsible     | beta             | disclosure tests            | docs                         | beta         | spec              |
| combobox        | experimental     | behavior tests              | async/filter/virtual policy  | experimental | harden            |
| context-menu    | experimental     | menu tests                  | pointer/submenu depth        | experimental | harden menu       |
| date-picker     | experimental     | behavior tests              | date/i18n depth              | experimental | pause breadth     |
| description     | beta             | unit tests                  | docs                         | beta         | document          |
| dialog          | beta             | 20 behavior tests           | manual AT/browser matrix     | beta         | stabilize first   |
| direction       | stable-candidate | unit tests                  | docs integration             | stable       | document          |
| dropdown-menu   | experimental     | menu tests                  | submenu/pointer depth        | experimental | harden            |
| error-message   | beta             | unit tests                  | docs                         | beta         | document          |
| fieldset        | beta             | unit tests                  | docs                         | beta         | document          |
| form            | beta             | form-control/validity tests | manual AT/browser validation | beta         | spec              |
| hover-card      | experimental     | source exists               | limited tests                | experimental | add tests         |
| label           | beta             | unit tests                  | docs                         | beta         | document          |
| locale          | beta             | tests/date consumer         | message inventory            | beta         | docs              |
| live-announcer  | beta             | tests                       | manual AT                    | beta         | evidence          |
| menu            | experimental     | behavior tests              | submenu/menu-bar depth       | experimental | harden            |
| menubar         | experimental     | alias-like menu shape       | true menubar behavior        | experimental | redesign/test     |
| navigation-menu | experimental     | behavior tests              | true nav menu behavior       | experimental | redesign/test     |
| popover         | experimental     | focused tests               | browser/focus docs           | experimental | harden            |
| popper          | beta             | floating tests              | docs                         | beta         | document CSS vars |
| portal          | beta             | tests                       | SSR docs                     | beta         | document          |
| radio-group     | beta             | selection-control tests     | docs/browser matrix          | beta         | document          |
| select          | beta             | 11 behavior tests           | manual AT/large-list policy  | beta         | stabilize         |
| sheet           | experimental     | overlay derivative          | drawer-specific behavior     | experimental | harden            |
| slider          | experimental     | controller tests            | browser pointer matrix       | experimental | harden            |
| switch          | beta             | selection-control tests     | docs                         | beta         | document          |
| tabs            | beta             | behavior tests              | activation/docs matrix       | beta         | spec              |
| toast           | experimental     | behavior tests              | live-region/UX depth         | experimental | harden            |
| toolbar         | experimental     | behavior tests              | composite matrix             | experimental | harden            |
| tooltip         | experimental     | focused tests               | WCAG timing/AT docs          | experimental | harden            |
| visually-hidden | stable-candidate | tests                       | docs                         | stable       | document          |

### Major Mason Items

| Surface                                                                           | Current maturity  | Evidence                                            | Gaps                                     | 0.1 status        | Next action            |
| --------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------- | ---------------------------------------- | ----------------- | ---------------------- |
| base UI items (`button`, `input`, `textarea`, `badge`, `card`, `separator`, `cn`) | beta              | registry + generated app build                      | public docs                              | beta              | publish docs           |
| Core-backed UI items                                                              | beta/experimental | metadata + install plans                            | wrapper behavior not browser-tested      | match Core status | align labels           |
| `field`, `text-field`, `select-field`, TanStack fields                            | beta              | registry + form tests                               | app-form examples                        | beta              | docs                   |
| `data-table`                                                                      | experimental      | multi-file source + install plan                    | no virtualization/server/persisted views | experimental      | add examples/tests     |
| `data-table-tanstack-router`                                                      | experimental      | install plan + generated route adapter verification | limited SolidStart coverage              | experimental      | route example          |
| `command-menu`                                                                    | experimental      | registry metadata                                   | behavior/deps unclear                    | experimental      | define engine boundary |
| blocks/templates                                                                  | experimental      | account-settings build, template metadata           | broad matrix absent                      | experimental      | generated app matrix   |

## 13. First-Class Target State

Keystone first-class means accessible behavior, complete keyboard interaction, documented ARIA, SSR safety, stable API, stable `data-scope`/`data-part` contract, known gaps, manual accessibility evidence, and strong tests. A primitive without browser/AT evidence should not be called stable.

Mason first-class means source-owned generated code, safe CLI transactions, complete registry metadata, generated app verification, integration docs, clear app-engine boundaries, update/diff/remove/doctor UX, and no hidden runtime abstraction.

Data-dense first-class means large-data behavior, keyboard-first workflows, virtualization where needed, performance awareness, source/freshness states, stable formatting, density controls, and TanStack-powered engines rather than custom engines.

## 14. Priority Roadmap

### Phase 0: Immediate cleanup

Tasks: keep registry counts current in README/reports, mark parity notes as evidence-based, align maturity labels, and document hosted-registry absence. Inspect `README.md`, `docs/reports/*`, `docs/roadmap/maturity-model.md`, `registry/default/items/*.json`. Outcome: no overclaiming. Avoid: broad new primitives.

### Phase 1: Kernel hardening

Tasks: browser-test overlay stack, focus scope, dismissal, prevent scroll, collection/typeahead, form-control, data attrs, and creator APIs. Inspect `packages/core/src/overlay`, `collection`, `form`, `utils`. Outcome: Dialog/Select kernels ready for public beta. Avoid: exporting private kernels.

### Phase 2: Primitive stabilization

Tasks: stabilize Dialog, Select, Combobox, Menu, Field/FormControl, Tabs, Tooltip/Popover, Toast. Outcome: a small credible beta set. Avoid: AlertDialog/NumberField/DateRangePicker breadth until docs/tests catch up.

### Phase 3: Mason registry maturity

Tasks: default registry story, lifecycle docs, update/diff/remove examples, multi-file docs, registry preview pages, installed metadata registry identity. Outcome: Mason local preview becomes public-preview credible. Avoid: marketplace features.

### Phase 4: Mason app-engine proof

Tasks: DataTable examples, CommandMenu dependency decision, TanStack Form field examples, route-aware demos. Outcome: UI app-layer direction proven with real app code. Avoid: Core app engines.

### Phase 5: Data-dense flagship

Tasks: RealtimeTable, Watchlist, Metric components, TerminalLayout, EventFeed, ConditionBuilder, chart adapters. Outcome: Keystone/Mason product differentiation. Avoid: starting before Phase 1-4 evidence exists.

## 15. Top 25 Action Items

| Rank | Title                                        | Why it matters                                  | Area       | Likely files              | Risk   | Expected outcome          |
| ---- | -------------------------------------------- | ----------------------------------------------- | ---------- | ------------------------- | ------ | ------------------------- |
| 1    | Fix stale registry counts                    | docs currently contradict code                  | docs       | `README.md`, reports      | low    | honest current state      |
| 2    | Keep autocomplete tests warning-free         | lifecycle warnings weaken preview evidence      | Core tests | `src/autocomplete`, tests | low    | clean test output         |
| 3    | Add Dialog browser/AT matrix                 | strongest stable candidate lacks final evidence | Core       | dialog/overlay docs/tests | medium | beta confidence           |
| 4    | Add Select AT and large-list docs            | Select is central to collections                | Core       | select/collection docs    | medium | credible beta             |
| 5    | Publish primitive maturity table from code   | avoid overclaiming                              | docs/app   | metadata/docs app         | medium | user-facing status        |
| 6    | Document all `data-scope`/`data-part` parts  | styling contract is product value               | Core docs  | metadata/docs             | medium | stable wrapper contract   |
| 7    | Harden Menu submenu/pointer behavior         | menu family below parity                        | Core       | `src/menu`                | high   | experimental to beta path |
| 8    | Define Combobox async/filter policy          | current combobox is shallow                     | Core       | `src/combobox`            | high   | avoid wrong API           |
| 9    | Decide DatePicker dependency strategy        | avoid rebuilding date/i18n engine               | Core       | date-picker docs/ADR      | high   | scoped date roadmap       |
| 10   | Add Mason hosted registry plan               | public CLI needs default registry               | Mason      | registry/CLI/docs         | medium | real install story        |
| 11   | Keep registry identity in installed metadata | update/diff need provenance                     | Mason CLI  | `install/plan.ts`         | medium | safer lifecycle           |
| 12   | Add JSON output for Mason dry runs           | automation/debugging                            | Mason CLI  | commands                  | low    | CI-friendly UX            |
| 13   | Extend generated app matrix                  | app-shape fixtures are still narrow             | Mason CLI  | tests/fixtures            | medium | fewer install regressions |
| 14   | Align registry parity with evidence          | metadata can overpromise                        | registry   | item JSON                 | low    | reliable docs             |
| 15   | Add Tooltip timing/hover tests               | tooltip a11y is sensitive                       | Core       | tooltip tests             | medium | parity clarity            |
| 16   | Add Toast live-region tests                  | notifications need AT behavior                  | Core       | toast/live-announcer      | medium | toast beta path           |
| 17   | Add Slider browser pointer tests             | happy-dom is not enough                         | Core       | slider tests              | medium | pointer confidence        |
| 18   | Add Tabs keyboard spec                       | beta primitive needs docs                       | Core/docs  | tabs/specs                | low    | stable path               |
| 19   | Add FormControl AT evidence                  | forms are central                               | Core/docs  | form specs                | medium | beta confidence           |
| 20   | Add Popover focus/dismiss matrix             | overlay derivative maturity                     | Core       | popover/overlay tests     | medium | reuse overlay proof       |
| 21   | Keep Listbox internal                        | public list API not ready                       | Core API   | package exports/docs      | low    | avoid API churn           |
| 22   | Add DataTable virtualization companion plan  | large-data story missing                        | UI         | data-table docs           | medium | honest app-layer roadmap  |
| 23   | Define CommandMenu engines                   | avoid custom fuzzy/hotkey engines               | UI         | command-menu item         | medium | clean dependency boundary |
| 24   | Add release readiness gate doc               | align commands and evidence                     | docs       | releases/reports          | low    | repeatable preview        |
| 25   | Close stale tracer language                  | docs still imply early tracer                   | docs/CLI   | README/docs/mason         | low    | public clarity            |

## 16. Final Verdict

The current architecture is worth continuing. Core as Solid-native primitives plus Mason as source-owned registry is the correct direction. The biggest gap to first-class is not missing components; it is evidence: browser behavior, manual accessibility, public docs, and conservative maturity labeling.

The highest-leverage next move is to make Dialog, Select, Field/FormControl, Menu, Combobox, and Mason lifecycle boringly credible. The work that should not happen next is broad new primitive/catalog expansion, data-dense flagship work, or custom implementations of table, virtualizer, form state, query/cache, charting, validation, date/i18n, hotkeys, or fuzzy search engines.

Before public 0.1 preview, the repo should have accurate counts and maturity labels, clean test output, documented known gaps, a clear default-registry story, browser evidence for the primary overlay and collection primitives, manual AT evidence for any stable-candidate primitive, and generated-app verification for the registry items presented as first-party examples.
