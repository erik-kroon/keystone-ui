# ADR 0001: Keystone Core And UI Product Boundary

## Status

Accepted

## Date

2026-05-03

## Context

The product direction describes two connected but distinct layers:

- Core: headless, accessible, unstyled primitives for Solid.
- UI source: copy-paste styled components, blocks, templates, and app-layer source for Solid.
- Mason: registry and CLI machinery for UI source.

The main architecture risk is mixing primitive behavior with styled registry output too early. If Keystone knows about UI, the primitive layer becomes harder to reuse for design systems and harder to keep unstyled. If UI reimplements behavior, accessibility and interaction fixes cannot be centralized.

## Decision

Keep Core primitives and UI source as separate layers in one Keystone monorepo.

Core must not depend on UI.

Allowed dependency direction:

```txt
Core internals
  -> Core primitives
  -> UI items
  -> UI blocks
  -> UI templates
```

Core should be designed as one public primitive package with subpath exports, such as `@scope/core/dialog`, unless a later ADR supersedes this decision.

Mason should have Solid-specific CLI and registry packages, while remaining compatible with shadcn-style registry concepts where practical.

## Consequences

- Core work should start with kernel systems and hard primitives rather than styled components.
- UI items should import Core primitives for behavior instead of copying primitive internals.
- Package boundaries, tests, docs, and examples should preserve the direction `Core -> UI` as forbidden.
- Future docs should describe Core for design-system authors and UI for app builders and registry authors.

## Follow-Ups

- Confirm final public names after package, trademark, domain, and handle clearance.
- Write a Core API RFC.
- Write a Mason registry RFC.
- Write an accessibility testing plan.
