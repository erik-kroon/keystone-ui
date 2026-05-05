# UI CodeBlock And CopyButton Vertical

## Status

- CodeBlock: implemented as source-owned UI display source for docs and product code surfaces.
- CopyButton: implemented as an accessible native button backed by a UI-owned clipboard helper.
- useCopyToClipboard: implemented as generated UI hook source because #175 and #174 need shared clipboard behavior and #329 tracks the reusable helper.

## Audit

- CodeBlock and CopyButton existed only in `apps/web/src/components/docs-shell.tsx` as app-local docs helpers.
- Inventory listed both under UI base components, but no reusable UI package source, registry metadata, or package tests existed.
- Reusable local patterns: source-owned UI anatomy, inline icons, `cn`, generated hook registry shape from `use-media-query`, and focused DOM contract tests.

## End-State Contract

- CodeBlock owns native `figure`, optional `figcaption`, `pre`, and `code` semantics, language metadata, optional copy action, action slot, wrapping mode, and stable `data-scope`/`data-part`/`data-slot` hooks.
- CodeBlock intentionally does not tokenize syntax, parse markdown, virtualize long files, or own docs routing.
- CopyButton owns native button semantics, labelled/icon-only rendering, copied/error state attributes, user-first click handling, and disabled state when clipboard support is unavailable.
- createCopyToClipboard owns browser clipboard API access, temporary copied state, failure state, callbacks, timer cleanup, and SSR-safe capability checks.

## Verification

- Hook tests cover successful copy state and unavailable clipboard fallback.
- CopyButton tests cover copy behavior, accessible copied label, copied state attribute, and `event.preventDefault` cancellation.
- CodeBlock tests cover figure/header/code/copy anatomy and copy-free plain rendering.
- Registry metadata records API, anatomy, accessibility, limitations, and parity notes for all three generated-source items.
