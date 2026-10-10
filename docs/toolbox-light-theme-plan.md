# Toolbox and ROI calculator: light theme plan

**Follows:** `docs/light-theme-transition-plan.md` (the site-wide token model). Nothing here adds a colour; it adds one surface alias and reuses the dark-theme text values.
**Scope:** the Engineering Toolbox app (`src/toolbox`, 44 components, 3 chrome files) and the ROI Projection Tool (`src/components/calculators/roi`, 16 components). Both were left on their own dark palette by the site sweep.

## Why

The problem is contrast, not only darkness. Measured before this work: toolbox muted text 3.81:1 on its ground and 3.57:1 on its cards; ROI muted text 3.07:1; 107 labels at 10px or smaller; a toolbox accent (#00B4D8) that is not the brand cyan; green, amber, and red used as text 161 times.

## The three layers

| Layer | Light | Dark | Holds |
|---|---|---|---|
| Page (`bg-surface-page`) | #F3F5F8 | #1A1D2B | toolbox ground, intro, index |
| Card (`bg-surface-card`) | #FFFFFF | #13151F | tool cards, input groups, tables, tabs, title strip |
| Readout (`.readout`) | #0A1628 | #0A1628 | results panels, logs, charts, HMI-style outputs |

The readout is brand navy deep in both themes, like the hero band and the HMI screens. `.readout` is a scope: inside it the semantic text names resolve to the dark-theme values (white, #ADB3BF, #8B94A3, brand cyan), so components use the same classes everywhere. Inputs sit on the card with a page-coloured field and a border.

Status colours (`success` #10B981, `warning` #F59E0B, `error` #EF4444) are text only inside a readout, where they measure 6.7, 7.9, and 4.5:1 on navy deep. On light surfaces they are edges, dots, and tints with the message in strong text, the callout pattern the contact form and the moments cards already use.

Labels never render under 11px, matching the diagram rule.

## Token shim (removed in the final commit)

`@theme inline` aliases the toolbox names onto the model: `dark-900` → page, `dark-800` → card, `dark-700` → readout, `primary` → accent text, `text-secondary` → body, `text-muted` → dim. With the shim in place the app flips in one step; the component passes then replace the old names.

## Commits

1. Tokens, `.readout`, shim, scopes out of the forced-dark list, results panel as a readout. Preview both themes.
2. Shared UI in `src/toolbox/components/ui`: field, tile, button, panel classes; three-layer hierarchy; 11px minimum.
3. Per-tool pass over charts, calculators, conveyor tools: readout, callout, or plain value for every coloured element.
4. Chrome: title strip, command palette, toasts, snapshots, pins.
5. ROI tool: inputs light, outputs and charts on the readout, print stylesheet simplified.
6. Remove the shim and the old names; the inventory grep returns nothing.

## Verification

Scripted browser pass on every tool page, both themes, 400 and 1280: text under 4.5:1 (3:1 large) against its effective background, labels under 11px, page scrollWidth equal to the viewport. The giveaway calculator embedded on `/solutions/veripak` is checked the same way.
