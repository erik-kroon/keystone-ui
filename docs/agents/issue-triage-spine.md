# Issue Triage Spine

## Rule

Do not pick from the full open issue list directly. Work only from milestone parent issues or maintainer-selected active issues.

The active parent for 0.1 is [#46](https://github.com/erik-kroon/core-ui/issues/46). The data-dense workspace parent for post-0.1 work is [#271](https://github.com/erik-kroon/core-ui/issues/271). The long-term north star remains [#28](https://github.com/erik-kroon/core-ui/issues/28).

## Milestones

- `0.1 Preview`: kernel/API hardening, existing primitives only, Mason registry stability, docs/contracts, accessibility harness.
- `0.2 UI App Layer`: DataTable, CommandMenu, TanStack Form adapters, registry lifecycle polish, generated app verification.
- `0.3 Data-Dense Workspace`: RealtimeTable, Watchlist, metrics, workspace layouts, EventFeed, ConditionBuilder, chart inspection wrappers.
- `Later / End-State`: broad catalog, advanced date/time/color work, rich controls, charts, carousel, and other non-0.1 surfaces.

## Active Board

Keep the active board near 12-15 issues:

- [#46](https://github.com/erik-kroon/core-ui/issues/46): 0.1 preview hardening.
- [#63](https://github.com/erik-kroon/core-ui/issues/63): Core kernel API boundary.
- [#58](https://github.com/erik-kroon/core-ui/issues/58): Dialog and overlay interactions.
- [#59](https://github.com/erik-kroon/core-ui/issues/59): overlay presence and lifecycle.
- [#61](https://github.com/erik-kroon/core-ui/issues/61): modal environment management.
- [#60](https://github.com/erik-kroon/core-ui/issues/60): Select collection and selection.
- [#62](https://github.com/erik-kroon/core-ui/issues/62): composite navigation and typeahead.
- [#99](https://github.com/erik-kroon/core-ui/issues/99): FormControl.
- [#44](https://github.com/erik-kroon/core-ui/issues/44): docs metadata and primitive contract pages.
- [#45](https://github.com/erik-kroon/core-ui/issues/45): primitive accessibility verification harness.
- [#43](https://github.com/erik-kroon/core-ui/issues/43): Mason registry lifecycle commands.
- [#52](https://github.com/erik-kroon/core-ui/issues/52): registry parity metadata contract.
- [#233](https://github.com/erik-kroon/core-ui/issues/233): UI DataTable.
- [#246](https://github.com/erik-kroon/core-ui/issues/246): UI CommandMenu.
- [#197](https://github.com/erik-kroon/core-ui/issues/197), [#198](https://github.com/erik-kroon/core-ui/issues/198), and [#201](https://github.com/erik-kroon/core-ui/issues/201): TanStack Form proof.

## 0.1 Hardening Checklist

### Core Kernel

- [ ] Overlay kernel public/private boundary documented.
- [ ] Collection/listbox kernel public/private boundary documented.
- [ ] FormControl public/private boundary documented.
- [ ] Controlled/uncontrolled state convention documented.
- [ ] `data-scope`/`data-part` contract documented.

### Stable Candidate Primitives

- [ ] Dialog.
- [ ] Popover.
- [ ] Tooltip.
- [ ] Menu/DropdownMenu.
- [ ] Select.
- [ ] Combobox.
- [x] Tabs.
- [ ] Checkbox/Switch/RadioGroup.
- [ ] Field/FormControl.
- [x] Toast.

### UI

- [ ] Registry lifecycle verified.
- [ ] Parity metadata docs updated.
- [ ] Generated app verification passes.
- [ ] DataTable story documented.
- [ ] CommandMenu story documented.
- [ ] TanStack Form field story documented.

### Docs

- [ ] Keystone vs UI page.
- [ ] Do-not-reinvent engines page.
- [ ] Primitive maturity labels.
- [ ] Accessibility verification strategy.

## Phase Guidance

- `phase:0.1`: active hardening spine and existing primitive/app-layer proof only.
- `phase:0.2`: UI app layer after 0.1: DataTable, CommandMenu, TanStack Form/Store/Hotkeys.
- `phase:0.3`: data-dense workspace patterns such as realtime tables, watchlists, resizable shells, metrics, and chart inspection.
- `phase:later`: broad end-state catalog and advanced surfaces.
