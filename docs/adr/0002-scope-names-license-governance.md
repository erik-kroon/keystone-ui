# ADR 0002: Scope, Names, License, And Governance

## Status

Accepted, amended by [ADR 0005](0005-shadcn-registry-distribution.md)

## Date

2026-05-03

## Context

Phase 0 needs a concrete baseline for repository scope, product names, package scope, license, and governance before package and API work starts.

The repository already uses `keystone-ui` as the workspace name and `@keystone-ui/*` for internal package names. The product PRD still treats `Keystone` and `UI` as working names until package, trademark, domain, and public positioning work is complete.

## Decision

Use this repository as the single monorepo for both product layers:

- Core primitives and internals.
- Styled source, blocks, templates, registry metadata, docs, and examples.

Keep `Keystone` as the provisional umbrella product name for now. Treat Core and UI components as repo layer names until explicit clearance happens in a later ADR.

Use `@keystone-ui` as the provisional npm scope for internal workspace packages and pre-clearance planning examples. Public package names remain provisional until naming clearance is complete.

Use MIT as the intended open-source license for repository source unless a later ADR supersedes it. Add a root `LICENSE` file before public release or package publication.

Use lightweight maintainer governance during the foundation milestone:

- Durable product and architecture decisions live in ADRs.
- API and registry proposals live in RFCs before implementation-heavy work.
- Significant public API changes require an ADR or accepted RFC.
- Keystone Core/UI boundary changes require an ADR.
- Maintainers may merge routine implementation work when it follows accepted ADRs, RFCs, tests, and package boundaries.

## Consequences

- Documentation and code may use `Keystone`, `UI`, and `@keystone-ui` as provisional names, but must not imply legal or launch clearance.
- Package scaffolding should prefer `@keystone-ui/*` until a final scope decision replaces it.
- Public release work must include naming clearance and a root license file.
- Contributors have a clear path for durable decisions without introducing a heavyweight governance process too early.

## Follow-Ups

- Perform package, trademark, domain, and handle clearance for final public names.
- Add a root `LICENSE` file before publication.
- Write `docs/rfcs/core-api.md`.
- Use ADR 0005 for public distribution.
- Write `docs/accessibility/testing-plan.md`.
