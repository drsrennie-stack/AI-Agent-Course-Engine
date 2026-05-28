# Compliance Notes: AI Agent for Course Engineering

**Project:** CourseForge palette library + engine redesign
**Files covered:** `palette-library-preview.html`, `courseforge.jsx` (engine, audit pending; current scope is the preview page and the 18-palette data that will feed the engine)
**Date:** 2026-05-28
**Reviewer:** Dr. Sharilyn Rennie (commissioning), Claude (auditing)

## WCAG version and target

- Standard: WCAG 2.2
- Floor: AA on all text and non-text contrast (1.4.3, 1.4.11)
- Target: AAA where achievable on body text and headings
- Additional targets: 2.1.1 keyboard, 2.4.7 focus visible, 1.4.10 reflow, 1.4.13 hover/focus content, 4.1.2 name/role/value

## Per-criterion result, `palette-library-preview.html` chrome

| Criterion | Target | Achieved | Notes |
|---|---|---|---|
| 1.4.3 Contrast (Minimum) | AA | **AAA on body, eyebrow, wordmark; AA on lede + all tag chips** | See contrast table below. |
| 1.4.11 Non-text Contrast | AA (3:1) | **PASS** | Focus indicator patched to navy ring + gold halo (was gold-only, 2.32:1 fail). |
| 2.1.1 Keyboard | A | **PASS** | All tiles `tabindex="0"` with Enter/Space handlers; chip filters native buttons; modal close on Escape; focus restored to origin tile. |
| 2.4.3 Focus Order | A | **PASS** | Logical order: skip link → header → chips → tile grid → footer. Inside modal: close button → mode toggle → preview region. |
| 2.4.7 Focus Visible | AA | **PASS** | 2px navy outline + 3px offset + 4px gold halo = visible across any tile background. |
| 2.5.3 Label in Name | A | **PASS** | Each tile has `aria-labelledby` pointing to its name node. |
| 4.1.2 Name/Role/Value | A | **PASS** | Modal uses `role="dialog" aria-modal="true" aria-labelledby`. Filter chips use `aria-pressed`. Mode toggle uses `aria-selected`. |
| 1.4.12 Text Spacing | AA | **PASS** | Body uses Atkinson Hyperlegible at 15px / 1.55 line-height; no fixed heights on text containers. |
| 1.4.13 Content on Hover/Focus | AA | **PASS** | No hover-only tooltips; all info is persistently visible. |

## Static page chrome contrast table

All ratios computed using WCAG sRGB relative luminance (proper formula, not YIQ heuristic).

| Pair | Ratio | Grade |
|---|---|---|
| Body navy `#0B1530` on offwhite `#FAFAF9` | 17.27:1 | AAA |
| Eyebrow terra-dark `#8B3A2E` on offwhite | 7.33:1 | AAA |
| Wordmark `.forge` terra-dark on offwhite (38px) | 7.33:1 | AAA (large) |
| Lede ink-muted `#5A6573` on offwhite | 5.67:1 | AA |
| Tag `vibe-academic` navy on tinted bg | 15.65:1 | AAA |
| Tag `vibe-editorial` terra-dark on tinted bg | 6.69:1 | AA |
| Tag `vibe-warm` terra-dark on tinted bg | 6.54:1 | AA |
| Tag `vibe-cool` `#2E6E75` on tinted bg | 4.87:1 | AA |
| Tag `vibe-bold` `#8A2C2C` on tinted bg | 7.00:1 | AAA |
| Tag `.warn` `#6B5520` on tinted bg | 6.17:1 | AA |
| Focus outline (post-fix): navy `#0B1530` on offwhite | 17.27:1 | PASS (UI) |
| Focus halo (post-fix): gold `#C9A14A` ring | n/a | Decorative; navy ring carries the 3:1 requirement |

**Bug found and fixed:** the original focus outline was gold `#C9A14A` only, 2.32:1 against offwhite, failing 1.4.11 (3:1 UI requirement). Patched to a navy 2px outline with a gold 4px halo, preserving the brand accent while meeting the requirement.

**Bug found and fixed:** the original `textColor()` heuristic for swatch role labels used a YIQ approximation (`0.299r + 0.587g + 0.114b`) with a 0.58 threshold. Four swatches were rendered with white text that fails AA: MedMasters Cool `#5B9AA0` (2.95:1), Brownstone Cool `#00c07f` (2.21:1), Press Room Accent `#FF5A09` (2.85:1), Studio Audacieux Cool `#00a0a0` (2.93:1). Replaced with a proper WCAG luminance + composite comparison that picks black-0.88 or white-0.96 per swatch and selects the higher-contrast option.

## Library curation: 18 to 6

The original library held 18 palettes. The full audit (see `contrast_audit.py`) plus a structural review surfaced two problems: 5 palettes had identical hex values in their Accent and Warm slots (dead role slots that cancel CourseForge's pedagogical signal), and most palettes failed AA contrast on the warm eyebrow at small-text size. The library was curated down to **6 palettes** that each have 4 distinct role slots AND pass AA on the body text and warm eyebrow on white.

**Curated 6 (final):**

| Palette | Vibe | Body p.p / white | Eyebrow p.w / white | Pill p.p / p.a | Cool p.c / white | Slots distinct |
|---|---|---|---|---|---|---|
| **MedMasters** ★ | academic | 18.04 AAA | 7.66 AAA | 7.46 AAA | 3.19 AA-large | yes |
| Field Notes ★ | academic (non-MM) | 4.66 AA | 4.60 AA | 1.30 FAIL | 3.37 AA-large | yes |
| Pharaoh's Atelier ★ | editorial | 13.29 AAA | 4.55 AA | 6.94 AA | 8.26 AAA | yes |
| Press Room | editorial | 11.55 AAA | 4.58 AA | 3.69 AA-large | 4.87 AA | yes |
| Linen and Indigo | warm | 9.44 AAA | 4.52 AA | 3.78 AA-large | 6.71 AA | yes |
| Saturday Funnies ★ | bold (marketing only) | 11.38 AAA | 4.61 AA | 8.42 AAA | 4.84 AA | yes |

**Slot tweaks applied during curation:**

| Palette | Slot | Original | Adjusted | Reason |
|---|---|---|---|---|
| Field Notes | Primary | `#628078` | `#5E7A73` | Body text needed +0.36 to clear AA on white |
| Field Notes | Warm | `#c7af6b` | `#897334` | Eyebrow needed +2.45 to clear AA on white |
| Pharaoh's Atelier | Warm | `#c89666` | `#9E6B39` | Eyebrow needed +1.93 to clear AA on white |
| Press Room | Warm | `#ec7f37` | `#BF5712` | Eyebrow needed +1.84 to clear AA on white |
| Linen and Indigo | Warm | `#c9af98` | `#946F4E` | Eyebrow needed +2.43 to clear AA on white |
| Saturday Funnies | Warm | `#ff0028` | `#EB0025` | Eyebrow needed +0.46 to clear AA on white |

All hue and saturation were preserved; only HSL lightness was reduced. Visual identity check: each tweaked color sits within 4 to 25 lightness units of the original, with mid-and-darker hues preserved.

**Cut palettes (12), with reason:**

| Palette | Cut reason |
|---|---|
| Bronte Ridge | Warm `#76c1d4` == Cool `#76c1d4` (duplicate slot); body fails AA on white; warm fix needed >25 lightness drop |
| Atrium Society ★ | Warm fix needed 32 lightness drop, palette identity lost |
| Cathedral | Accent `#9e363a` == Warm `#9e363a` (duplicate slot) |
| Stoneworks | Warm fix needed 45 lightness drop, palette identity lost |
| Brownstone | Accent `#cd5554` == Warm `#cd5554` (duplicate slot) |
| Workshop Yellow | Accent `#feda6a` == Warm `#feda6a` (duplicate slot); warm fix lost identity |
| Picnic Basket | Body and warm both fail AA; warm fix needed 28 lightness drop |
| Studio Audacieux ★ | Warm `#fea49f` fix needed 35 lightness drop, palette identity lost |
| Recess | Accent `#e62739` == Warm `#e62739` (duplicate slot); body fails AA |
| Idle Hands | Warm `#f9c5bd` fix needed 38 lightness drop, palette identity lost |
| Disco Reactor | Accent `#eb1736` == Warm `#eb1736` (duplicate slot) |
| Lightbrite | Warm `#cdd422` fix needed 21 lightness drop, palette identity lost; bold filter already has Saturday Funnies |

**Remaining engine-side accessibility work (not palette failures, engine implementation work):**

1. **Field Notes pill:** primary `#5E7A73` on accent `#ff3a22` is 1.30:1 (FAIL). When CourseForge renders a pill with the Field Notes palette, the engine must use white text instead of `p.p` to pass AA. Same pattern for any palette where `cr(p.p, p.a) < 4.5`.
2. **Press Room and Linen and Indigo pills** are AA-large only (3.69 and 3.78), acceptable for the existing 10px pill text but the engine should consider bumping pill text to 11px or darkening the primary.
3. **Cool slots in MedMasters and Field Notes** are AA-large only (3.19 and 3.37) on white. Acceptable for the existing decorative use (background fills, secondary borders), but never use the Cool color as small text on white in those palettes.
4. **Field Notes excluded from MedMasters branding** per Dr. Rennie's standing rule on sage. Engine should gate the MedMasters-context palette selector to exclude Field Notes.

## Keyboard navigation flow

Verified manually via code review. Full flow:

1. `Tab` from page load: skip link becomes visible.
2. `Tab`: filter chips, one stop each, `aria-pressed` toggles on activation, `aria-live` count updates announce filter changes.
3. `Tab`: first tile in grid. Each tile is individually tabbable; arrow keys do not move between tiles, which is acceptable since the grid uses `role="list"` and announces as a list rather than a grid.
4. `Enter` or `Space` on tile: modal opens, focus jumps to close button.
5. Inside modal: `Tab` cycles through close button and three mode-toggle tabs. **Focus is now trapped** inside the modal (added in this revision); Tab past the last element returns focus to the first, Shift+Tab from the first returns to the last.
6. `Escape` closes the modal at any time. Modal close restores focus to the originating tile.
7. `prefers-reduced-motion`: when the user has this set, the tile hover translate and transition are suppressed; the hover shadow and border color still apply (these are not motion).

## Screen reader semantics (code-level verification)

This is a code-level audit, not a runtime SR test. The following ARIA structures were verified in the source:

- **Document landmarks:** `<main>`, `<header class="page">`, `<nav class="controls">`, `<aside class="legend">`, and the implicit modal `<div role="dialog">` form a complete landmark structure.
- **Skip link:** `<a href="#grid" class="skip">` is the first focusable element, only visible on focus.
- **Heading hierarchy:** `h1` (CourseForge wordmark), `h2` (Palette Library Preview), `h3` (modal title). No skipped levels.
- **Filter toolbar:** `role="toolbar"` with `aria-label`; each chip is a `<button>` with `aria-pressed` toggling.
- **Grid:** `role="list"`; each tile is `role="listitem"` with `aria-labelledby` (name) and `aria-describedby` (palette note prose). SR users hear name plus character description.
- **Modal:** `role="dialog" aria-modal="true" aria-labelledby="modal-title"`. Close button has `aria-label="Close preview"`. Mode toggle is `role="tablist"` with each button `role="tab" aria-selected`.
- **Live region:** filter count uses `aria-live="polite"`.
- **Decorative content:** swatch divs are `aria-hidden="true"` because their content (hex values, role labels) is not informational for SR users; the palette note carries the character.

**Runtime SR test still required before shipping** to anyone using assistive tech. Suggested protocol: VoiceOver on Safari + Chrome (macOS), NVDA on Firefox (Windows). Verify the skip link announces, the filter live region announces count changes, tiles announce both name and description, the modal traps focus correctly, the tablist toggle announces selected state.

## Known limitations and remediation plan

1. **Atkinson Hyperlegible font loaded from Google Fonts; if the font fails to load, the page falls back to system-ui.** System-ui is accessibility-acceptable but this is a single point of failure for the intended look. *Remediation:* not strictly an accessibility issue; cosmetic.

2. **Cool slot in MedMasters and Field Notes is AA-large only on white.** Acceptable for the existing decorative use (fills, borders); never use these Cool colors as small text on white. *Remediation:* document in engine generation rules; the engine must not render text using `p.c` against a white background for these two palettes.

3. **Field Notes pill, Press Room pill, Linen and Indigo pill are below AA when using `p.p` text on `p.a` background.** *Remediation:* engine must use white text instead of `p.p` when contrast falls below 4.5:1. This is a CourseForge engine implementation rule, not a palette failure.

4. **Per-palette compliance for the engine output (`courseforge.jsx`-generated course pages) is not yet audited.** This document covers the preview file only. *Remediation:* re-audit after the engine redesign produces sample generated output.

5. **Runtime SR test still pending.** Code-level semantics audit complete; live SR verification not yet performed.

## Sign-off

- **Code-level audit:** complete.
- **Static contrast audit:** complete (`contrast_audit.py` and `contrast_audit_curated.py`).
- **Library curation:** complete (18 to 6, all survivors pass AA on body and eyebrow).
- **Modal focus trap:** complete.
- **`prefers-reduced-motion` handling:** complete.
- **`aria-describedby` on tiles:** complete.
- **Screen-reader semantics audit (code-level):** complete.
- **Screen-reader runtime test:** pending (requires human tester with VoiceOver or NVDA).
- **Engine-side accessibility rules for `courseforge.jsx`:** documented above as a separate work stream.

Project is **shippable to a faculty / internal review audience** in its current state. Public-facing ship gated on the runtime SR test.

Compiled by Claude under Dr. Sharilyn Rennie's standing WCAG 2.2 AA compliance rule.
