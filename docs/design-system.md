# Keystone Design System

This is the first-party Keystone visual system for the docs site, component registry, and UI previews. It is the implementation spec for Keystone-owned Solid source, Tailwind v4 tokens, component styling, registry metadata, and application shells.

## Design Position

Keystone should feel like a precise product tool for developers building serious Solid applications:

- Neutral, quiet, technical, and dense.
- High trust through exact alignment, thin rules, small shadows, strong focus states, and restrained color.
- Component-first rather than marketing-first. The first viewport should show the product shell, docs, registry, previews, or component inventory.
- Broad whitespace at the page level, compact controls at the component level.
- Light mode is the default theme. Dark mode is equally supported but remains neutral, not blue-slate or purple.

Avoid:

- Gradient hero backgrounds, decorative orbs, floating marketing cards, or oversized landing-page composition.
- Monochrome beige, dark-blue, or purple-dominant palettes.
- Rounded pill-heavy UI except for intentionally tiny badges or mobile scroll pills.
- Cards inside cards unless the inner card is a real preview/content surface inside a frame.

## Visual Register

Keystone's component library should feel compact, exact, and quietly distinct. The default posture is not decorative minimalism; it is dense product UI with a few recognizable moves: small tactile shadows, tight radii, crisp type rhythm, thin rules, and status color used as a signal rather than a surface flood.

Apply this register before tuning individual components:

- Prefer compact vertical rhythm: common two-line component rows should sit on `1.25rem` line-height with `0.25rem` to `0.5rem` internal row gaps.
- Use smaller radii for controls and feedback surfaces than for layout containers. Rounded corners should imply precision, not softness.
- Keep status surfaces quiet. Use low-alpha semantic backgrounds and borders, then let icons, focus rings, selected states, and destructive actions carry stronger color.
- Use shadows as tactile edges. Default component shadows should be barely perceptible; avoid stacked elevation or glow effects.
- Keep padding intentional and dense. Controls, alerts, list items, tabs, and menu rows should feel efficient; larger padding belongs to page sections, cards, dialogs, and preview frames.
- Preserve strong focus and invalid states even when the resting surface is quiet.

## Core Layout

### Root Shell

- Body background: `bg-sidebar`.
- Body text: `text-foreground`.
- Body font: `font-sans`.
- Antialiasing enabled.
- Root app wrapper:
  - `relative isolate flex min-h-svh flex-col overflow-clip`.
  - CSS var `--header-height: 4rem`.
- Use a centered container utility:
  - `max-width: 1416px`.
  - Horizontal padding: `1rem` mobile, `1.5rem` from `lg`.
  - `mx-auto`.

### Framed Container Rails

The page has two persistent vertical rails aligned to the container edges:

- Rail line color: `border / 64%`.
- Left rail: `left: -0.75rem`, width `1px`.
- Right rail: `right: -0.75rem`, width `1px`.
- Rails are pointer-events-none and sit above the page background but below interactive header content.

At important horizontal rule intersections, render small square pins:

- Size: `0.5rem`.
- Radius: `2px`.
- Border: `1px solid border`.
- Background: `popover` on the left pin, `background` on the right pin.
- Shadow: very small `shadow-xs` or equivalent black alpha.
- Header pins align to `top: calc(var(--header-height) - 4.5px)`.
- Section pins align to the top rule at `top: -3.5px`.

This rail-and-pin treatment is the design's strongest page-level signature. Recreate it before tuning smaller components.

### Header

- Sticky at the top: `top: 0`, `z-index: 40`.
- Height: `var(--header-height)`, currently `4rem`.
- Background: `sidebar / 80%`.
- Backdrop blur: small, around `backdrop-blur-sm`.
- Bottom hairline: `1px` using `border / 64%`.
- Inner layout:
  - Container.
  - Flex row, centered.
  - `justify-between`.
  - `gap: 0.5rem`.
  - Horizontal padding: `1rem`, `1.5rem` from `sm`.
- Brand lockup:
  - `font-heading`.
  - Size `1.5rem` mobile, about `1.625em` at `sm`.
  - Slight negative top adjustment, about `-0.125rem`.
  - Gap `0.375rem`.
- Current product label:
  - Same line as brand.
  - Color `muted-foreground / 64%`.
- Desktop navigation:
  - Hidden below `lg`.
  - Buttons are ghost variant.
  - Active nav uses `data-pressed` and `text-primary`.
- Header tools:
  - Search command button.
  - Product dropdown.
  - GitHub link.
  - Theme switcher.
  - Vertical separator, height `1.25rem`, hidden below `md`.

### Home Page

- First section uses the standard page header, not a marketing hero card.
- Container full width.
- Page header:
  - `py-8` mobile, `py-12` at `md`, `py-16` at `lg`.
  - `gap: 0.5rem`, `1rem` at `xl`.
  - Centered by default.
  - For the homepage, align content left and constrain to `max-w-2xl`.
- H1:
  - `font-heading`.
  - `text-4xl`, `lg:text-5xl`.
  - No negative letter spacing.
- Description:
  - `text-muted-foreground`.
  - `lg:text-lg`.
- CTA row:
  - `mt-2 flex gap-2`.
  - Primary button large.
  - Secondary outline button large.

### Category Grid

- Top border rule separates header from cards.
- Grid:
  - `gap-6`.
  - `pt-8`.
  - `sm:grid-cols-2`.
  - `lg:grid-cols-3`.
  - `xl:grid-cols-4`.
  - `lg:gap-8`.
- Each category card is a `CardFrame` with an outer ghost border offset:
  - Outer after element: `inset: -5px`.
  - Radius: `calc(var(--radius-xl) + 4px)`.
  - Border: `border / 64%`.
- Category title:
  - `font-heading`.
  - `text-base`.
- Description:
  - `text-muted-foreground`.
  - `text-sm`.
  - Clamp to 2 lines.
- Preview surface:
  - Minimum height `13.75rem`.
  - Card background mixes `card` and `sidebar` in light mode.
  - Dark mode uses `background`.
  - Inner padding `2rem`.
  - Preview content moves up/down by `0.125rem` on hover through the parent frame.

### Docs Layout

Use a three-column dense docs frame:

- Main docs layout is a `main` with `flex flex-1 flex-col`.
- Inside: a sidebar provider/grid with:
  - Container.
  - `min-h-min flex-1 items-start`.
  - No horizontal padding on the provider.
  - CSS vars:
    - `--sidebar-width: 220px` default.
    - `--sidebar-width: 240px` at `lg`.
    - `--top-spacing: 0`.
    - `--top-spacing: calc(var(--spacing) * 4)` at `lg`.
  - `lg:grid`.
  - `lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]`.

Left docs sidebar:

- Hidden below `lg`.
- Sticky below header.
- Height: `calc(100svh - var(--header-height))`.
- Background transparent.
- Content padding `1rem 0.5rem`.
- Groups:
  - Gap `0.25rem`.
  - Group label height `1.75rem`.
  - Label color `sidebar-accent-foreground`.
  - Menu gap `0.125rem`.
  - Item button padding start `0.875rem`.
  - Hover background remains transparent for docs links.
  - Active state is text/background from sidebar menu button contract.

Document content:

- Outer row: `flex items-stretch xl:w-full`.
- Main content column:
  - `relative flex w-full min-w-0 flex-1 flex-col`.
  - `lg:mt-8 lg:mr-4 lg:mb-8`.
- Main document is framed:
  - `CardFrame`.
  - Border uses `sidebar-border`.
  - Shadow `shadow-lg/5`.
  - On mobile remove border and radius.
- Inner document card:
  - `dark:bg-background`.
  - Mobile has no rounded clipping.
- Content padding:
  - `px-4 py-6`.
  - `sm:px-6`.
  - `lg:p-8`.
- Inner content max width: `max-w-3xl`.
- Article gap: `gap-8`.
- Doc H1:
  - `font-heading font-semibold`.
  - `text-3xl`.
  - `xl:text-4xl`.
  - `scroll-m-20`.
- Doc description:
  - `text-muted-foreground`.
  - `sm:text-lg`.
- Action row:
  - `pt-4`.
  - Buttons `size="xs"` and `variant="outline"`.

Right table of contents:

- Hidden below `xl`.
- Width `18rem`.
- Sticky below header.
- Height `calc(100svh - var(--header-height))`.
- Scroll area hides the visible scrollbar.
- TOC label:
  - Height `1.75rem`.
  - `font-medium text-xs`.
- TOC links:
  - `text-[0.8125rem]`.
  - Line-height `1.125rem`.
  - Color `sidebar-foreground`.
  - Vertical rule at left.
  - Active state color `foreground`.
  - Active marker width `0.125rem`, color `primary`.
  - Depth 3 indent `0.875rem`.
  - Depth 4 indent `1.375rem`.

### Particles Gallery

The gallery is the registry preview browser.

- Page header centered, with extra bottom padding.
- Search area:
  - `max-w-2xl`.
  - Bottom margin `2rem`, `3rem` at `md`, `4rem` at `lg`.
  - Uses a multi-select combobox with chips.
  - Search icon start addon.
  - Rounded `xl`.
  - Padding `calc(var(--spacing) * 2 - 1px)`.
  - Keeps popup open when no filters are selected.
- Result grid:
  - `grid flex-1 items-stretch`.
  - `gap-9`.
  - `pb-12`.
  - `lg:grid-cols-2`.
  - `lg:gap-6`.
  - `xl:gap-9`.
- Particle card:
  - Outer wrapper `relative flex min-w-0`.
  - Optional `lg:col-span-2`.
  - CardFrame full width with same outer offset border.
  - Preview card minimum height `12.5rem`.
  - Preview panel centered with `lg:px-8 lg:py-12`.
  - Footer padding `0.5rem`.
  - Footer gap `0.75rem`.
  - Description row is `text-xs text-muted-foreground`, truncated.
  - Actions are small outline buttons: copy registry and view code.
- Code drawer:
  - Right drawer.
  - Max width `56rem`.
  - Straight variant.
  - Content padding `1.5rem`.
  - Installation and Code headings use `font-heading font-semibold text-xl`.

## Tokens

### Breakpoints

Add two Tailwind theme breakpoints:

| Token | Value    |
| ----- | -------- |
| `3xl` | `1600px` |
| `4xl` | `2000px` |

### Radius

| Token         | Value                       |
| ------------- | --------------------------- |
| `--radius`    | `0.625rem`                  |
| `--radius-sm` | `calc(var(--radius) - 4px)` |
| `--radius-md` | `calc(var(--radius) - 2px)` |
| `--radius-lg` | `var(--radius)`             |
| `--radius-xl` | `calc(var(--radius) + 4px)` |

Use `rounded-lg` for buttons, inputs, and alerts; use `rounded-xl` for preview surfaces; and use `rounded-2xl` for cards and frames. Badges use `rounded-sm`; tiny square pins use `2px`.

Radius hierarchy:

- `rounded-sm`: badges, dense metadata chips, menu item internals, and tiny framed marks.
- `rounded-md`: active tab indicators and compact nested affordances inside larger controls.
- `rounded-lg`: primary control and feedback surface radius for buttons, inputs, selects, alerts, popover/menu surfaces, tabs, sidebar items, and grouped controls.
- `rounded-xl`: preview surfaces, embedded examples, and medium framed regions that should read as surfaces but not full cards.
- `rounded-2xl`: cards, dialogs, sheets, high-level frames, and larger page-level containers.

Do not increase radius to make a component feel more polished. If an element feels generic, first tune alignment, typography, border contrast, state treatment, and spacing.

### Fonts

Font roles:

| Role    | Typeface             | Weight    |
| ------- | -------------------- | --------- |
| Sans    | Cal Sans UI variable | `300 700` |
| Heading | Cal Sans Regular     | `400 600` |
| Mono    | Paper Mono Regular   | regular   |

Implementation rules:

- Define `--font-sans`, `--font-heading`, and `--font-mono`.
- Body uses sans.
- Brand, H1, H2, product labels, and some menu labels use heading.
- Code, keyboard shortcuts, command install snippets, and file titles use mono.
- If these exact font files are not license-cleared for Keystone, use Keystone-owned or open alternatives with the same metrics and keep the variable names.

### Light Colors

| Token                    | Value                                |
| ------------------------ | ------------------------------------ |
| `background`             | `white`                              |
| `foreground`             | `neutral-800`                        |
| `card`                   | `white`                              |
| `card-foreground`        | `neutral-800`                        |
| `popover`                | `white`                              |
| `popover-foreground`     | `neutral-800`                        |
| `primary`                | `neutral-800`                        |
| `primary-foreground`     | `neutral-50`                         |
| `secondary`              | black alpha `4%`                     |
| `secondary-foreground`   | `neutral-800`                        |
| `muted`                  | black alpha `4%`                     |
| `muted-foreground`       | `neutral-500` mixed 90% with black   |
| `accent`                 | black alpha `4%`                     |
| `accent-foreground`      | `neutral-800`                        |
| `destructive`            | `red-500`                            |
| `destructive-foreground` | `red-700`                            |
| `info`                   | `blue-500`                           |
| `info-foreground`        | `blue-700`                           |
| `success`                | `emerald-500`                        |
| `success-foreground`     | `emerald-700`                        |
| `warning`                | `amber-500`                          |
| `warning-foreground`     | `amber-700`                          |
| `border`                 | black alpha `8%`                     |
| `input`                  | black alpha `10%`                    |
| `ring`                   | `neutral-400`                        |
| `sidebar`                | `neutral-50`                         |
| `sidebar-foreground`     | `neutral-800` mixed 64% with sidebar |
| `sidebar-border`         | black alpha `6%`                     |
| `code`                   | `white`                              |
| `code-highlight`         | black alpha `4%`                     |

Chart colors:

- `chart-1`: orange-600.
- `chart-2`: teal-600.
- `chart-3`: cyan-900.
- `chart-4`: amber-400.
- `chart-5`: amber-500.

### Dark Colors

| Token                | Value                              |
| -------------------- | ---------------------------------- |
| `background`         | neutral-950 mixed 96% with white   |
| `foreground`         | neutral-100                        |
| `card`               | background mixed 98% with white    |
| `popover`            | background mixed 96% with white    |
| `primary`            | neutral-100                        |
| `primary-foreground` | neutral-800                        |
| `secondary`          | white alpha `4%`                   |
| `muted`              | white alpha `4%`                   |
| `accent`             | white alpha `4%`                   |
| `border`             | white alpha `6%`                   |
| `input`              | white alpha `8%`                   |
| `ring`               | neutral-500                        |
| `sidebar`            | neutral-950 mixed 97% with white   |
| `sidebar-foreground` | neutral-100 mixed 64% with sidebar |
| `sidebar-border`     | white alpha `5%`                   |
| `code`               | background mixed 98% with white    |
| `code-highlight`     | white alpha `4%`                   |

Semantic dark foregrounds:

- `destructive-foreground`: red-400.
- `info-foreground`: blue-400.
- `success-foreground`: emerald-400.
- `warning-foreground`: amber-400.

### Shadows And Borders

Use shadows as tactile edges, not elevation drama:

- Default controls: `shadow-xs/5`.
- Primary/destructive button: colored shadow alpha around `24%`.
- Card/frame: `shadow-xs/5`.
- Docs frame: `shadow-lg/5`.
- Light inset top highlight: black or white alpha in `before` pseudo elements.
- Dark inset top/bottom highlight: white alpha around `6%`.
- Borders are usually `border`, `input`, `sidebar-border`, or `border / 64%`.
- Avoid decorative glow shadows, stacked shadow recipes, or large soft shadows on ordinary product controls.
- Popover, menu, dialog, and docs frame shadows may be stronger, but should still read as crisp separation rather than depth drama.

### Status Surfaces

Status variants should be recognizable without making the component visually loud:

- Resting status surfaces use semantic background alpha around `3%` to `8%` in light mode and `6%` to `16%` in dark mode.
- Status borders usually use semantic alpha around `24%` to `36%`, adjusted by component density and surrounding contrast.
- Icons, leading marks, focus states, selected states, and destructive primary actions may use full semantic color.
- Body text remains foreground or muted foreground; avoid tinting whole paragraphs with status foreground colors.
- Reserve saturated fills for active controls, destructive buttons, selected indicators, and compact badges where the color is the main identifier.

### Type And Density

Component typography should preserve scan speed under repeated use:

- Compact component text uses `text-sm` with `1.25rem` line-height.
- Dense labels, metadata, shortcuts, and table-adjacent controls may use `text-xs` with explicit line-height.
- Title/body pairs inside compact surfaces use a one-step hierarchy: foreground `font-medium` title, muted body, matching line-height, and a `0.25rem` to `0.5rem` row gap.
- Buttons, inputs, tabs, menu items, alerts, and selection controls should avoid hero-scale type and avoid viewport-scaled font sizes.
- Favor stable heights and explicit padding over letting dynamic content resize controls.

Compact padding defaults:

- Small controls and dense rows: about `0.375rem` to `0.5rem` block padding.
- Default controls and alerts: about `0.625rem` block padding.
- Menu, listbox, and command items: compact rows with enough height for pointer and keyboard use.
- Cards, dialogs, sheets, and docs content may use larger padding because they frame work areas rather than individual controls.

## Component Contracts

These contracts are the source of truth for both hand-written UI source and generated docs previews. Registry components should preserve the same Tailwind token choices, dimensions, radius, hover/focus/disabled states, popup surfaces, dark-mode treatment, and `data-slot` styling hooks unless Keystone Core behavior requires a documented Solid-specific difference.

- Actions and display: Button, Badge, Alert, Card/CardFrame, Empty, Kbd, Separator, Breadcrumb.
- Fields and forms: Input, Textarea, Label, Field, Select trigger/listbox, Autocomplete, Combobox.
- Selection controls: Checkbox, Radio Group, Switch, Slider.
- Disclosure and navigation: Accordion, Collapsible, Tabs, Toolbar.
- Overlays and menus: Dialog, Sheet, Popover, Tooltip, Menu and submenu surfaces.
- Layout helpers: Group and grouped separators/text.

Use semantic tokens instead of raw palette utilities. The only raw palette utilities expected in shipped UI are explicitly documented status bases such as `red`, `blue`, `emerald`, and `amber` in token definitions, or black/white alpha shadow and overlay formulas.

### Button

Base:

- `relative inline-flex shrink-0 cursor-pointer items-center justify-center`.
- Gap `0.5rem`.
- `whitespace-nowrap`.
- Radius `lg`.
- Border.
- `font-medium`.
- Text size `base`, `sm:text-sm`.
- Focus ring:
  - `focus-visible:ring-2`.
  - Ring color `ring`.
  - Offset `1px`.
  - Offset color `background`.
- Disabled:
  - Pointer-events none.
  - Opacity `64%`.
- Loading:
  - Select disabled.
  - Text transparent.
  - Spinner absolute.
- SVG normalization:
  - Opacity `80%` unless explicitly set.
  - Size `1.125rem`, `1rem` at `sm`.
  - Negative horizontal margin `-0.125rem`.
- Pointer coarse target expansion:
  - Add invisible min `44px` hit target.

Sizes:

| Size      | Mobile                                    | Desktop             |
| --------- | ----------------------------------------- | ------------------- |
| `xs`      | `h-7`, `text-sm`, px about `0.5rem - 1px` | `h-6`, `text-xs`    |
| `sm`      | `h-8`, gap `0.375rem`                     | `h-7`               |
| `default` | `h-9`                                     | `h-8`               |
| `lg`      | `h-10`                                    | `h-9`               |
| `xl`      | `h-11`, `text-lg`                         | `h-10`, `text-base` |
| `icon-xs` | `size-7`                                  | `size-6`            |
| `icon-sm` | `size-8`                                  | `size-7`            |
| `icon`    | `size-9`                                  | `size-8`            |
| `icon-lg` | `size-10`                                 | `size-9`            |
| `icon-xl` | `size-11`                                 | `size-10`           |

Variants:

- `default`: primary background, primary border, primary foreground, small colored shadow, hover/pressed at primary `90%`.
- `destructive`: destructive background, white text, destructive shadow.
- `outline`: popover background, input border, text foreground, small shadow, hover/pressed accent `50%`, dark input overlay.
- `destructive-outline`: outline shell with destructive text and destructive hover border/background.
- `secondary`: transparent border, secondary background, secondary foreground.
- `ghost`: transparent border, foreground, accent hover/pressed.
- `link`: transparent border, underline on hover/pressed.

### Badge

- Presentational `span` by default; callers own semantic roles, live regions, and accessible names.
- Inline-flex centered with stable `data-scope="ui-badge"`, `data-part="root"`, `data-slot="badge"`, `data-variant`, and `data-size`.
- Gap `0.25rem`.
- Radius `sm`.
- Border transparent.
- `font-medium`.
- Focus-visible ring and offset match Button.
- Button/link badges get cursor and pointer-coarse `44px` hit expansion.
- SVGs default to `80%` opacity and `0.875rem` mobile, `0.75rem` desktop.
- Text is compact:
  - Default `h-6`, `text-sm`; desktop `h-5`, `text-xs`.
  - Small `h-5`, `text-xs`; desktop `h-4.5`, `text-[0.625rem]`.
  - Large `h-7`, `text-base`; desktop `h-6`, `text-sm`.
- Variants:
  - Filled `default`/`primary` and `destructive`; `solid` remains a compatibility alias for primary.
  - Soft `info`, `success`, `warning`, `error` using background alpha `8%` light, `16%` dark.
  - `muted` for neutral counts and compact metadata.
  - Outline with input border and background.

### Card And CardFrame

Use `CardFrame` for grouped framed structures and previews. Use `Card` for a single content container.

Card:

- `relative flex flex-col`.
- Radius `2xl`.
- Border.
- Background `card`.
- Text `card-foreground`.
- Shadow `xs/5`.
- `before` pseudo element:
  - Absolute inset.
  - Radius one pixel inside `2xl`.
  - Light top inset shadow with black alpha `4%`.
  - Dark top/bottom inset shadow with white alpha `6%`.

CardFrame:

- Same shell as card.
- Adds muted internal frame background `muted / 72%`.
- Children cards use negative `1px` margin so their borders collapse into the frame.
- First and last child cards adjust clip paths and radii so stacked sections look continuous.
- Table containers inside frames overflow hidden.

Frame header/footer:

- Header: `px-6 py-4`, grid rows auto/auto, action column when present.
- Title: `font-semibold text-sm`; category cards override to `font-heading text-base`.
- Description: `text-muted-foreground text-sm`.
- Footer: `px-6 py-4`; particle footer uses `p-2`.

### Input

Input shell:

- Span wrapper, not the input itself.
- `relative inline-flex w-full`.
- Radius `lg`.
- Border `input`.
- Background `background`; dark uses `input / 32%`.
- Text `foreground`.
- `shadow-xs/5`.
- Ring color `ring / 24%`.
- Focus visible:
  - Border `ring`.
  - Ring `3px`.
- Invalid:
  - Border destructive alpha.
  - Ring destructive alpha on focus.
- Disabled:
  - Opacity `64%`.
- Placeholder: `muted-foreground / 72%`.

Input inner:

- Height `2.125rem` mobile, `1.875rem` desktop.
- Large: `2.375rem` mobile, `2.125rem` desktop.
- Small: `1.875rem` mobile, `1.625rem` desktop.
- Horizontal padding `calc(var(--spacing) * 3 - 1px)`.
- Rounded inherit.
- Outline none.
- Autofill transition hack retained to avoid browser yellow flash.

### Textarea

Textarea uses the same wrapper shell as Input:

- Span wrapper with radius `lg`, border `input`, background `background`, dark `input / 32%`, `shadow-xs/5`, focus-visible `3px` ring, invalid destructive states, and disabled opacity `64%`.
- Inner textarea is `field-sizing-content`, rounded inherit, outline none, full width.
- Default minimum height `4.375rem`, mobile small-screen minimum `5.125rem`.
- Small and large sizes adjust padding and minimum height in the same proportion as Input sizes.

### Alert

- Presentational live-region surface with stable `data-scope="ui-alert"`, `data-part`, `data-slot`, and `data-variant` hooks.
- Grid layout with compact two-line rhythm.
- Radius `lg`.
- Border plus `shadow-xs/5`.
- Padding `0.625rem 0.75rem`.
- Text `sm`, with title and description line-height `1.25rem`.
- Icon column width `1rem`; icons align to the title line and use semantic tone color.
- Variants:
  - Default uses a faint card surface in light mode and input overlay in dark mode.
  - Info/success/warning/error use semantic border alpha around `28%`, background alpha around `3%` light and `6%` dark, and icon semantic color.
- Title: foreground, `font-medium`, line-height `1.25rem`.
- Description: flex column, gap `0.5rem`, muted foreground, line-height `1.25rem`.
- Action: responsive grid placement, inline flex gap `0.25rem`, tucked closer to body copy on mobile.

### Selection Controls

Checkbox and Radio Group:

- Control size `1.125rem` mobile and `1rem` desktop.
- Border `input`, background `background`, dark unchecked background `input / 32%`.
- Rounded `0.25rem` for checkbox, full for radio.
- `shadow-xs/5` with one-pixel inset highlight while unchecked and valid.
- Focus-visible ring `2px` plus `1px` offset.
- Invalid uses destructive border/ring alpha.
- Checked state uses `primary` background and `primary-foreground` indicator.

Switch:

- Thumb size variable `--thumb-size`, `1.25rem` mobile and `1rem` desktop.
- Track width `calc(var(--thumb-size) * 2 - 2px)`.
- Checked track `primary`, unchecked track `input`.
- Thumb is background-colored, rounded, shadowed, and stretches subtly on active press.

Slider:

- Root is full width for horizontal orientation.
- Track uses input-colored rounded pseudo-track.
- Range/indicator uses `primary`.
- Thumb is white, bordered, `shadow-xs/5`, ringed on focus, and scales while active/dragging.

### Tabs

- Root: flex column gap `0.5rem`; vertical orientation switches to row.
- List:
  - Relative.
  - Width fit.
  - Gap `0.125rem`.
  - Text `muted-foreground`.
  - Default variant: rounded `lg`, muted background, padding `0.125rem`, muted foreground `72%`.
  - Underline variant: no filled background, indicator is a `2px` primary line.
- Indicator:
  - Uses active-tab CSS variables; Keystone should expose Solid-native measurements.
  - Transition width and translate over `200ms ease-in-out`.
  - Default indicator: rounded `md`, background `background`, small shadow; dark uses `input`.
- Tab:
  - Height `2.25rem`, desktop `2rem`.
  - Rounded `md`.
  - Border transparent.
  - Padding x `calc(var(--spacing) * 2.5 - 1px)`.
  - `font-medium`.
  - Hover changes text toward muted foreground.
  - Active text is foreground.

### Menu

Menu, dropdown, context menu, menubar popup surfaces, and submenu content share the same visual contract:

- Positioner `z-50`.
- Content surface is `relative flex min-w-32 rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 outline-none`.
- Surface uses a `before` inset highlight with `radius-lg - 1px`.
- Inner viewport/list uses `max-h-(--available-height) w-full overflow-y-auto p-1`.
- Items are compact: `min-h-8`, desktop `min-h-7`, `rounded-sm`, `px-2 py-1`, text `base`, desktop `sm`, highlighted background `accent`, highlighted text `accent-foreground`, disabled opacity `64%`.
- Checkbox and radio items use grid columns with a `0.75rem` or `1rem` indicator column and the same item highlighted/disabled states.
- Submenu trigger uses the same item style plus trailing chevron and highlighted/open accent states.
- Shortcuts render as passive `kbd` with `ms-auto font-sans font-medium text-xs tracking-widest text-muted-foreground/72`.

### Dialog And Sheet

Dialog and Sheet use matching overlay surfaces:

- Backdrop: fixed inset, `z-50`, `bg-black/32`, `backdrop-blur-sm`, `200ms` opacity transition.
- Dialog content: centered grid positioner, `max-w-lg`, rounded `2xl`, border, `bg-popover`, `shadow-lg/5`, inset highlight, mobile bottom-sticky option.
- Sheet content: side-aware positioner, `bg-popover`, border on the entering side, `shadow-lg/5`, side-aware translate transitions, optional inset variant with rounded `2xl` and border on larger screens.
- Header: `flex flex-col gap-2 p-6`, reduced bottom padding when a panel exists.
- Footer: responsive reversed column on mobile, row-end on desktop, default `border-t bg-muted/72 py-4`.
- Title: `font-heading font-semibold text-xl leading-none`.
- Description: `text-muted-foreground text-sm`.
- Close button uses the Button icon/ghost visual contract: absolute top/end, compact square, accent hover, focus-visible ring.

### Popover And Tooltip

- Positioner `z-50`, bounded by available width/height variables, transition position changes.
- Popover surface: rounded `lg`, border, `bg-popover`, `shadow-lg/5`, inset highlight, scale/opacity transition.
- Tooltip surface: rounded `md`, border, `bg-popover`, `text-xs`, `shadow-md/5`, text-balance, scale/opacity transition.
- Viewports own padding and overflow clipping; tooltip viewport uses inline padding `spacing(2)`, popover uses `spacing(4)`.

### Autocomplete And Combobox

- Input group is relative, full width unless explicitly fit-content, and dims when disabled.
- Start addon is absolute at `start-px`, opacity `80%`, with normalized SVG size.
- Trigger and clear buttons are absolute compact icon controls at the input end, opacity `80%`, hover `100%`, pointer-coarse target expansion, hidden when clear follows trigger.
- Popup positioner is `z-50 select-none`.
- Popup surface is rounded `lg`, bordered, `bg-popover`, `shadow-lg/5`, inset highlight, min width anchored to trigger.
- Listbox scrolls with `not-empty:px-1 not-empty:py-1`.
- Items use the same compact highlighted/disabled item contract as Select/Menu. Combobox selected items use a leading indicator column.
- Empty state is centered muted text with padding only when non-empty.

### Sidebar

Sidebar is a full UI component, not just docs navigation.

- CSS vars:
  - `--sidebar-width: 16rem`.
  - `--sidebar-width-mobile: 18rem`.
  - `--sidebar-width-icon: 3rem`.
- Wrapper:
  - `group/sidebar-wrapper flex min-h-svh w-full`.
  - `has-data-[variant=inset]:bg-sidebar`.
- Menu button:
  - Full width flex row.
  - Gap `0.5rem`.
  - Radius `lg`.
  - Padding `0.5rem`.
  - Text `sm`.
  - Height `2rem` default, `1.75rem` small, `3rem` large.
  - Hover/active background `sidebar-accent`.
  - Active font medium.
  - Collapsed icon state becomes `size-8`.
- Desktop collapse:
  - Width transitions over `200ms linear`.
  - Offcanvas width goes to `0`.
  - Icon width uses `3rem`.
- Mobile:
  - Uses sheet.
  - Width `18rem`.
  - Background sidebar.
  - Header is screen-reader-only.
- Keyboard shortcut:
  - Default sidebar toggle should be `Cmd/Ctrl+B` unless a product surface documents a different shortcut.

### Command Menu

- Trigger:
  - Outline button in header.
  - Search icon at start.
  - Shows keyboard shortcut as `KbdGroup`, usually `Cmd/Ctrl + K`.
- Open shortcuts:
  - `Cmd/Ctrl+K`.
  - `/`, except while typing in editable controls.
- Dialog:
  - Search documentation placeholder.
  - Groups docs pages and components.
  - Highlighting a component prepares an install command.
- Footer:
  - Left side shows Enter/go affordance.
  - Right side can show install command and copy shortcut.
- Keystone implementation should use Keystone registry names and shadcn commands, for example `shadcn add https://keystone-ui.dev/r/button.json`.

### Kbd

Kbd is passive display markup for keyboard input labels and shortcut hints.

- Root renders a native `kbd` element.
- Default size is compact for dense menus, command rows, and topbar controls.
- Variants:
  - `default`: bordered background keycap.
  - `muted`: low-emphasis keycap for secondary shortcut hints.
  - `outline`: transparent keycap for dense surfaces.
- `KbdGroup` composes multiple keys and separators without adding interaction behavior.
- `KbdSeparator` is aria-hidden and defaults to `+`.
- Kbd must not register shortcuts, own focus, or add command behavior.

### Skeleton

- Rounded `sm`.
- Animated shimmer.
- Animation duration `2s`, infinite linear.
- Background:
  - Base muted.
  - Linear gradient highlight from transparent to white alpha `64%` and back.
  - Dark highlight white alpha `4%`.

## Motion

Motion is subtle and functional:

- Tab indicator: `200ms`, ease-in-out, width and translate only.
- Category thumbnails: preview content translates `0.125rem` over `200ms`.
- Skeleton: continuous shimmer.
- Toast success:
  - `320ms`.
  - Scale up to `1.025`, down to `0.99`, back to `1`.
- Toast error:
  - `280ms`.
  - Horizontal shake `-3px`, `3px`, `-3px`, `0`.
- Respect `prefers-reduced-motion: reduce`; toast success/error animations should be disabled.

## Numeric Text

Use tabular numerals by default for numbers that can update in place, including timers, counters, prices, percentages, scores, pagination summaries, and live data metrics. Apply Tailwind's `tabular-nums` utility, or the equivalent CSS:

```css
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
```

## Icons

Keystone should prefer `lucide-solid` where an equivalent exists, matching the repo guidance.

Rules:

- Stroke width around `2`.
- Default control icon size `1rem` desktop and `1.125rem` mobile unless the button size overrides it.
- Icon opacity defaults to `80%`.
- Icon-only buttons need a screen-reader label.
- Use icons in buttons for tool actions: search, menu, theme, copy, GitHub, external link, return key, label/filter.

## Registry And Documentation Patterns

### Component Inventory

Docs component pages should be generated from registry metadata. The visual inventory target includes:

Accordion, Alert, Alert Dialog, Autocomplete, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Checkbox, Checkbox Group, Collapsible, Combobox, Command, Date Picker, Dialog, Drawer, Empty, Field, Fieldset, Form, Frame, Group, Input, Input Group, Kbd, Label, Menu, Meter, Number Field, OTP Field, Pagination, Popover, Preview Card, Progress, Radio Group, Scroll Area, Select, Separator, Sheet, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Toggle, Toggle Group, Toolbar, Tooltip.

### Registry Browser

Use "particles" as the interaction model, but Keystone can rename the user-facing concept if needed. The important model:

- Registry items have categories/tags.
- A multi-select search field filters by category intersection.
- Cards render live previews.
- Card footer has description, copy registry URL, and view code.
- Code view includes installation command and full source.
- Relevance sorting:
  - Direct particle name prefix match: strongest.
  - Registry dependency match: second.
  - Primary category match: third.

### Code Blocks

- Figure background: `code`.
- Text: `code-foreground`.
- Radius `xl`.
- Border `border`.
- Margin top `1.5rem`.
- Overflow hidden.
- File title:
  - Minimum height `2.75rem`.
  - Border bottom `border / 64%`.
  - Padding block `0.625rem`.
  - Padding inline `1rem`.
  - Mono font.
- Line numbers:
  - Sticky left gutter.
  - Width `4rem`.
  - Right padding `1.5rem`.
  - Muted foreground.
- Highlighted line:
  - Background `code-highlight`.
  - Left marker width `2px`.

## Implementation Checklist

1. Replace the current app-level CSS tokens with the token set above.
2. Add a root framed shell with header-height, container rails, and intersection pins.
3. Rebuild the header with brand/product label, ghost nav, command trigger, product menu, GitHub link, and theme switcher.
4. Rework docs into the sticky left sidebar, framed content card, and sticky right TOC layout.
5. Normalize primitives and UI components around `Button`, `Badge`, `CardFrame`, `Input`, `Tabs`, `Sidebar`, `Alert`, `Skeleton`, and `Command`.
6. Build the registry browser with filter chips, two-column particle cards, preview/code tabs, copy action, and code drawer.
7. Add dark tokens and verify every surface in both themes.
8. Verify desktop widths at 1440, 1600, and 2000 px, plus mobile around 390 px.
9. Run visual checks for text overflow in buttons, badges, sidebars, cards, and code tabs.
10. Keep Core styling-agnostic. All design styling belongs in UI registry source or the docs app.
