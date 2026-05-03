# ADR 0001: Keystone And Mason Product Boundary

## Status

Accepted

## Date

2026-05-03

## Context

The product direction describes two connected but distinct layers:

- Keystone: headless, accessible, unstyled primitives for Solid.
- Mason: copy-paste styled components, blocks, templates, registry, and CLI for Solid.

The main architecture risk is mixing primitive behavior with styled registry output too early. If Keystone knows about Mason, the primitive layer becomes harder to reuse for design systems and harder to keep unstyled. If Mason reimplements behavior, accessibility and interaction fixes cannot be centralized.

## Decision

Keep Keystone and Mason as separate product layers in one monorepo.

Keystone must not depend on Mason.

Allowed dependency direction:

```txt
Keystone internals
  -> Keystone primitives
  -> Mason components
  -> Mason blocks
  -> Mason templates
```

Keystone should be designed as one public primitive package with subpath exports, such as `@scope/keystone/dialog`, unless a later ADR supersedes this decision.

Mason should have Solid-specific CLI and registry packages, while remaining compatible with shadcn-style registry concepts where practical.

## Consequences

- Keystone work should start with kernel systems and hard primitives rather than styled components.
- Mason components should import Keystone primitives for behavior instead of copying primitive internals.
- Package boundaries, tests, docs, and examples should preserve the direction `Keystone -> Mason` as forbidden.
- Future docs should describe Keystone for design-system authors and Mason for app builders and registry authors.

## Follow-Ups

- Confirm final public names after package, trademark, domain, and handle clearance.
- Write a Keystone API RFC.
- Write a Mason registry RFC.
- Write an accessibility testing plan.
