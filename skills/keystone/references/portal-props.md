# Portal Props

Use this when a Keystone overlay, popup, or toast needs a custom portal target or mounted-state behavior.

## Rule

Do not assume a `portalProps` prop exists. Inspect the local UI wrapper first.

Current Keystone UI wrappers commonly expose portal configuration through a `portal` prop that forwards to the Core portal part, for example:

```tsx
<DialogContent portal={{ disabled: false }}>...</DialogContent>
```

The exact prop name and supported fields are component-specific. Verify the local file before using it.

## When To Customize

- Rendering inside a specific container.
- Keeping content mounted for measurement or animation.
- SSR/hydration-sensitive overlays.
- Nested app shells where z-index or stacking context is intentional.

## Safety

- Keep the app root isolated when portaled backdrops overlap the page.
- Confirm focus restore still works.
- Confirm outside dismissal still works.
- Confirm body scroll locking still works for modal overlays.
