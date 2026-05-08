# ADR 0005: Shadcn Registry Distribution

## Status

Accepted

## Date

2026-05-08

## Context

Keystone has two distribution needs:

- Core primitives should be installed as a normal npm package.
- Styled UI source should be copied into user projects so teams can own and edit it.

The earlier direction put Mason in the public product path as the registry and CLI layer for UI source. Since then, the shadcn registry has become a framework-agnostic code distribution format and CLI surface. It supports custom registries, namespaced registries, direct item URLs, local item paths, `add`, `view`, `search`, `build`, `--dry-run`, and `--diff`.

Building a public Keystone-specific installer would duplicate a working ecosystem surface before Keystone has proven a Solid-specific need that shadcn cannot cover.

## Decision

Distribute Keystone Core as an npm package:

```bash
npm i @keystone-ui/core
```

Core remains headless, accessible, unstyled Solid primitive runtime with public subpath exports such as `@keystone-ui/core/dialog`.

Distribute Keystone styled UI through a shadcn-compatible Keystone registry. First-party components, blocks, hooks, utilities, themes, rules, pages, and templates should be represented as shadcn registry items with explicit targets where framework-agnostic installation requires them.

Mason is no longer a public product surface or public install command. The existing `packages/mason` code may remain as internal registry tooling for validation, dependency graph checks, path safety experiments, docs generation support, and future migration research.

Public docs should prefer shadcn CLI commands, initially using direct registry item URLs until a stable namespace or registry index entry exists:

```bash
pnpm dlx shadcn@latest add https://keystone-ui.dev/r/button.json
```

## Consequences

- Public installation language changes from `mason add <item>` to `shadcn add <item-url>` or a future namespaced shadcn registry reference.
- Registry metadata should use the shadcn registry schemas.
- UI source remains source-owned copy-paste code and may still depend on `@keystone-ui/core` for behavior.
- Keystone should not maintain a competing public installer unless a documented Solid-specific gap requires it.
- The Mason registry RFC is superseded as a public distribution plan, but useful safety and validation ideas may be retained as internal tooling.

## Follow-Ups

- Generate shadcn-compatible registry payloads for docs deployment.
- Validate a real `shadcn add` install into a clean Solid project before public preview.
- Decide whether to pursue a registry namespace such as `@keystone` after naming and package clearance.
- Update stale Mason language in repo docs, agent guidance, and generated docs.
