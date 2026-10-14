# Design system and motion specification

Status: PROPOSED implementation design using the user's four supplied colours. Tokens are also provided in [design-tokens.json](data/design-tokens.json).

## Palette roles

| Token | Hex | Role |
|---|---|---|
| Amber | #F59E0B | Main brand accent and primary action surface |
| Turquoise | #0BF5E2 | Small energetic accents on dark surfaces; occasional highlight |
| Golden brown | #AF8C51 | Decorative details, nonessential rules, warm image treatment |
| Teal | #07AC9F | Secondary colour field or control background with dark text |
| Ink | #151916 | Main text and dark cinematic sections |
| Paper | #FFF9EF | Warm, quiet reading and form surfaces |
| White | #FFFFFF | Text on sufficiently dark surfaces; clean image treatment |
| Deep teal | #075E57 | Accessible links on paper and dark secondary buttons |
| Muted text | #5A625C | Supporting text on paper |

Use the provided hex values as the exact colour authority; do not regenerate them from the user's descriptive HSL arithmetic. Additional functional border/error tokens may be chosen during implementation and must pass contrast checks. Do not use the decorative brown as default body text.

Balance is per section, not an exact quota: paper and ink provide most of the surface area; amber establishes action; turquoise is a small flash of energy. Do not make every card amber, outline every element in teal, or spread an amber-to-turquoise gradient across the site.

## Measured contrast

Ratios calculated from sRGB relative luminance. Values are rounded for presentation; pass/fail uses unrounded values.

| Foreground on background | Ratio | Normal text |
|---|---:|---|
| Ink on amber | 8.27:1 | Pass |
| White on amber | 2.15:1 | Fail |
| Ink on turquoise | 12.83:1 | Pass |
| White on turquoise | 1.38:1 | Fail |
| Ink on supplied teal | 6.27:1 | Pass |
| White on supplied teal | 2.83:1 | Fail |
| Brown on paper | approximately 3.00:1, slightly below 3 unrounded | Fail; do not rely on it even for large text |
| Deep teal on paper | 7.30:1 | Pass |
| White on deep teal | 7.64:1 | Pass |
| Ink on paper | 16.95:1 | Pass |
| Muted text on paper | 6.01:1 | Pass |

For normal text target at least 4.5:1; large text 3:1. See [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Image-backed text needs verification against its actual crop; a palette check alone is insufficient. Focus rings and essential component boundaries need sufficient non-text contrast. Use a two-layer light/dark focus ring where a single colour does not work across surfaces.

## Typography

Proposed family pairing: Manrope for body, navigation, and bold headings; Cormorant Garamond for selected expressive phrases. The builder must verify font files, licence, and available weights before use. Self-host licensed subsets; keep system sans/serif fallbacks. Font choice is replaceable without changing content. Do not load embedded fonts from the source DOCX as website assets by assumption.

| Style | Mobile | Desktop | Guidance |
|---|---|---|---|
| Hero display | 44–60px | 76–112px | Fluid; actual wrapping controls upper size |
| Page title | 36–44px | 56–72px | One H1 per route |
| Section title | 30–36px | 44–56px | Expressive serif only when readable |
| Card title | 22–26px | 24–30px | Strong sans-serif |
| Body | 16–18px | 18px | Approximately 1.5–1.65 line height |
| Labels/support | 14–16px | 14–16px | Never use faint opacity as hierarchy |

Keep long text between about 45 and 75 characters per line. Do not force title line breaks that fail on narrower devices. Use sentence case. Source uppercase is content evidence, not a requirement for shouty typography.

## Layout and surfaces

- Content maximum width: 1280px; wide hero artwork may bleed beyond it.
- Side padding: 20px at 360–390px, 32px tablet, 48–64px desktop.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.
- Typical section padding: 64px mobile, 96–128px desktop. Avoid tall empty gaps on form pages.
- Grids: 12 conceptual columns desktop, 6 tablet, 1 content column mobile. Use content-fit breakpoints near 768 and 1100px, not device detection.
- Corners: 8px controls, 16px cards, 20px media. Avoid universal pills; reserve them for compact tags when useful.
- Prefer layout and whitespace to boxes. Cards belong to packages, work samples, and repeated bounded information.
- Hero/portfolio shadows may suggest depth. Forms and pricing need restrained, consistent elevation.

## Component catalogue

| Component | Required behaviour |
|---|---|
| SiteHeader | Logo/home link, service-page navigation, persistent primary CTA, accessible mobile menu |
| MobileMenu | Open/close label, focus management, Escape, return focus, no hidden focusable children |
| HeroScene | Immediate still + text + CTA; optional layered movement; static fallback |
| ServiceCategory | Heading, image, full source list, enquiry link; readable expanded content |
| ReelGallery | Approved media only; explicit play controls; empty state in preview |
| ReelPlayer | Keyboard controls, pause, captions when speech matters, no automatic sound |
| PackageCard | Source-backed inclusions, gated provisional fields, selected-package link |
| Testimonial | Verified quote and attribution only; no generated endorsements |
| WorkflowSteps | Semantic ordered list with exactly three customer steps |
| CreatorSteps | Semantic ordered list with exactly four creator steps |
| Field | Persistent label, hint, required marker when applicable, associated error |
| FileUpload | Count/size/type guidance, per-file progress, retry/remove, keyboard-selectable input |
| SubmissionFeedback | Saved success, validation error, retryable failure; announced without revealing PII |
| SiteFooter | Required page links, creator link, approved contact/legal content only |

Component states must include default, hover, active, focus, disabled, loading, error, and success where relevant. The submit button must not change width dramatically during submission. Do not clear input after a network failure.

## Motion language

Animate for scene continuity and state feedback. Prefer opacity and transforms; avoid layout-thrashing positional changes. No scroll-jacking, custom cursor requirement, forced horizontal scroll, or blocking entrance overlay.

- Control feedback: about 160ms.
- Small section reveal: about 400ms, once, travel no more than 16–24px.
- Main scene transition: about 700ms equivalent pacing within a bounded normal-scroll sequence.
- Render content visibly by default; progressive scripts may enhance it after initialization, never leave it hidden if scripts fail.
- Pause ambient loops offscreen and when the tab is hidden. Provide pause for persistent visible decorative motion.
- Prefer no more than one simultaneously playing video. User-started playback wins over decorative effects.
- Respect `prefers-reduced-motion`: remove parallax, spatial assembly, automatic scrolling, and decorative video autoplay. Show the final still states.
- Respect data-saving where detectable: avoid downloading decorative video. The poster is a complete visual fallback.

W3C describes disabling nonessential interaction-triggered motion in [Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). This pack intentionally adopts that behaviour as a design requirement; it is not a claim that the site has been audited.

## Responsive composition

At 1440×900 use a spacious art-directed hero, three service teasers, and structured pricing columns. At 768×1024 use two-column content only when text remains comfortable. At 360×800 and 390×844 use stacked sections, one dominant image, full-width form controls, and a simple menu. Creator uploads must work by touch and file picker without drag-and-drop.

Sticky headers must not cover anchor destinations or error focus. A mobile sticky booking CTA is optional only if it never covers the keyboard, file controls, footer, or form actions; omit it on the enquiry form itself.

## What would fail this direction

Generic gradient hero, rows of identical feature cards, unrelated stock photos, ten competing animations, tiny white text on amber, public placeholder reviews, fabricated “viral” stats, or missing source content. Quality comes from relevant media, deliberate composition, and excellent practical pages.
