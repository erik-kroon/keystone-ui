# Primitive Browser And Manual Accessibility Evidence

## Status

Evidence summary for Dialog, Select, and Field/FormControl stable-candidate work.

## Date

2026-05-05

## Related

- [Accessibility Testing Plan](testing-plan.md)
- [Dialog Accessibility Spec](../specs/dialog.md)
- [Select Accessibility Spec](../specs/select.md)
- [Field And FormControl Accessibility Spec](../specs/field-form-control.md)
- GitHub issues: #296, #297, #303

## Verification Commands

Focused Core harness verification:

```sh
bun --filter @keystone-ui/core test -- dialog.behavior.test.tsx select.behavior.test.tsx select.performance.test.tsx field-validity.test.tsx form-control.behavior.test.tsx
```

Result on 2026-05-05: 5 files passed, 44 tests passed.

Additional manual browser probe:

- Browser: Chromium through Playwright MCP.
- Harness: temporary local page in `.context/evidence-browser`, importing Core Dialog, Select, and Field directly from workspace source.
- Result artifacts: `.context/evidence-browser/snapshot-ok.md` and Playwright run output in the session transcript.

The temporary harness is workspace-local evidence only. The durable result is summarized below.

## Dialog Evidence

Browser matrix:

| Scenario                          | Environment            | Result | Evidence                                                                |
| --------------------------------- | ---------------------- | ------ | ----------------------------------------------------------------------- |
| Open from trigger                 | Core happy-dom harness | Pass   | `packages/core/test/dialog.behavior.test.tsx`                           |
| `role`, modal, title, description | Chromium manual probe  | Pass   | Content had `role="dialog"`, `aria-modal="true"`, label and description |
| Focus entry                       | Chromium manual probe  | Pass   | Focus moved to `First dialog action`                                    |
| Tab focus containment             | Chromium manual probe  | Pass   | Tab cycled from first action to close and back to first action          |
| Escape dismissal                  | Chromium manual probe  | Pass   | Escape detached content                                                 |
| Focus restore                     | Chromium manual probe  | Pass   | Focus returned to `Open project dialog`                                 |
| Outside dismissal                 | Core happy-dom harness | Pass   | Covered by outside pointer and preventable outside interaction tests    |
| Nested dialogs                    | Core happy-dom harness | Pass   | Top-layer Escape dismissal order is covered                             |
| Force mount and presence          | Core happy-dom harness | Pass   | Closed forced content uses `hidden`; transitions complete as expected   |
| Outside inert content             | Core happy-dom harness | Pass   | Existing and late-added outside body children become inert and restore  |
| Preventable autofocus events      | Core happy-dom harness | Pass   | Mount and unmount autofocus prevention covered                          |

Manual accessibility check:

- Primitive: Dialog
- Version or commit: workspace state on 2026-05-05
- Tester: Codex
- Date: 2026-05-05
- Environment: Chromium through Playwright MCP
- Assistive technology: Playwright accessibility snapshot, no desktop screen reader attached
- Scenario: Open modal dialog, inspect role/name/description, cycle focus, close with Escape.
- Expected: Dialog exposes modal dialog semantics, labelled/described content, contained focus, and focus restore.
- Actual: Browser DOM and accessibility snapshot exposed the expected dialog semantics and focus behavior.
- Result: Pass for browser semantics and keyboard probe; Blocked for NVDA/JAWS/VoiceOver announcement quality.
- Follow-up: Run the full manual screen-reader matrix from `docs/accessibility/testing-plan.md` before promoting Dialog to stable.

## Select Evidence

Browser and large-list matrix:

| Scenario                                   | Environment            | Result   | Evidence                                                    |
| ------------------------------------------ | ---------------------- | -------- | ----------------------------------------------------------- |
| Keyboard navigation and typeahead          | Core happy-dom harness | Pass     | `packages/core/test/select.behavior.test.tsx`               |
| Disabled and hidden item protection        | Core happy-dom harness | Pass     | Disabled item blocks selection; hidden item is skipped      |
| Grouped options                            | Core happy-dom harness | Pass     | Group role and label relationship covered                   |
| Single selection                           | Chromium manual probe  | Pass     | Pointer selection of `Bravo` serialized `project=bravo`     |
| Multiple selection                         | Core happy-dom harness | Pass     | Repeated hidden inputs covered                              |
| Hidden input submission and reset          | Chromium manual probe  | Pass     | Reset restored `project=alpha`                              |
| External form owner                        | Core happy-dom harness | Pass     | External form reset covered                                 |
| Readonly state                             | Core happy-dom harness | Pass     | Readonly exposes state and blocks value changes             |
| Floating geometry                          | Core happy-dom harness | Pass     | Positioner side/align and anchor-width variable covered     |
| Large mounted list                         | Core performance test  | Pass     | Mounted counts of 10, 100, 500, and 1000 items measured     |
| Virtualization and offscreen item matching | Policy                 | Deferred | Public virtualization adapter remains out of Core 0.1 scope |

Manual accessibility check:

- Primitive: Select
- Version or commit: workspace state on 2026-05-05
- Tester: Codex
- Date: 2026-05-05
- Environment: Chromium through Playwright MCP
- Assistive technology: Playwright accessibility snapshot, no desktop screen reader attached
- Scenario: Open Select popup, inspect listbox and disabled option semantics, select `Bravo`, reset form.
- Expected: Popup exposes listbox/option semantics, disabled option is announced as disabled by the browser accessibility tree, selected value serializes to the form, reset restores default.
- Actual: Listbox role was present, disabled option exposed `aria-disabled="true"`, selecting `Bravo` serialized `project=bravo`, and reset restored `project=alpha`.
- Result: Pass for browser semantics/form probe; Blocked for NVDA/JAWS/VoiceOver announcement quality.
- Follow-up: Run the full screen-reader matrix and keep virtualization deferred until a separate adapter design exists.

## Field And FormControl Evidence

Browser matrix:

| Scenario                                      | Environment            | Result | Evidence                                                                |
| --------------------------------------------- | ---------------------- | ------ | ----------------------------------------------------------------------- |
| Label, description, error relationships       | Core happy-dom harness | Pass   | `packages/core/src/form/form-control.behavior.test.tsx`                 |
| Required, invalid, disabled, readonly states  | Core happy-dom harness | Pass   | Field wiring and validity tests cover ARIA/data state                   |
| Native and custom validity                    | Core happy-dom harness | Pass   | `packages/core/src/form/field-validity.test.tsx`                        |
| Async validity latest-result behavior         | Core happy-dom harness | Pass   | Latest async validation result wins                                     |
| Hidden inputs                                 | Core happy-dom harness | Pass   | Array values serialize as repeated native inputs                        |
| Form reset                                    | Core happy-dom harness | Pass   | Field and FormControl reset listeners covered                           |
| Browser invalid email announcement/reset path | Chromium browser probe | Pass   | Reset clears stale native email validity and removes the error relation |
| Browser hidden input serialization            | Chromium browser probe | Pass   | Hidden input serialized `project=alpha` before and after reset          |

Manual accessibility check:

- Primitive: Field/FormControl
- Version or commit: workspace state on 2026-05-05
- Tester: Codex
- Date: 2026-05-05
- Environment: Headless Chromium through Playwright 1.59.1 against `.context/evidence-browser/field-form-control`
- Assistive technology: Chromium accessibility tree via CDP `Accessibility.getFullAXTree`, no desktop screen reader attached
- Scenario: Fill invalid email, submit, inspect label/description/error relationships and reset behavior.
- Expected: Control is labelled by `Email`, described by help text plus error when invalid, exposes required/invalid state, reset clears invalid UI, and the help text remains described after reset.
- Actual: Initial email control exposed `aria-labelledby` for the label, `aria-describedby` for the description, and `aria-required="true"`. Invalid submit added `aria-invalid="true"`, added the error id to `aria-describedby`, and rendered `Use a work email`. Reset removed `aria-invalid`, removed the error id and error node, kept the description id, and restored the empty value. Hidden input form data remained `project=alpha` before and after reset.
- Result: Pass for Chromium browser semantics, error relationship, description relationship, hidden input serialization, and reset behavior.
- Follow-up: Run the full desktop screen-reader announcement matrix before promoting Field/FormControl beyond stable-candidate.

## Stable-Candidate Posture

Dialog and Select have enough focused automated and browser-probe evidence to remain stable candidates, but not enough to be called stable because desktop and mobile screen-reader announcement quality has not been run.

Field/FormControl should remain beta/stable-candidate at most. The Chromium browser reset gap is resolved, but desktop and mobile screen-reader announcement quality still needs a dedicated matrix before any stable claim.
