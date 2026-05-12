# Shadcn Registry Reference

Use this for install, preview, and manual setup guidance.

## Commands

Preferred shape:

```bash
pnpm dlx shadcn@latest add https://keystone-ui.dev/r/button.json
pnpm dlx shadcn@latest add https://keystone-ui.dev/r/dialog.json
pnpm dlx shadcn@latest add https://keystone-ui.dev/r/select-field.json
pnpm dlx shadcn@latest add https://keystone-ui.dev/r/data-table.json
```

If the hosted endpoint is not available, use the local registry item JSON and copy the listed source files manually. Do not invent Keystone-specific installer flags.

## Discovery

- Registry root: `registry/default/registry.json`
- Registry items: `registry/default/items/*.json`
- UI source: `packages/ui/src/`
- Docs generation: `scripts/generate-docs-registry-items.ts`
- Public shadcn payload generation: `scripts/generate-shadcn-registry.ts`

## Manual Install

When manual install is requested:

1. Read the registry item JSON.
2. Copy every listed source file.
3. Copy transitive local imports.
4. Install external dependencies listed in metadata.
5. Preserve import aliases.
6. Add design-system tokens if the target app does not have them.
7. Run typecheck.

## Output Checklist

- Command matches a real shadcn registry item URL.
- Dependency list is complete.
- File paths are complete.
- Token/theme requirements are stated.
- Manual steps do not bypass accessibility behavior.
