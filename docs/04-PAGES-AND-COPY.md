# Page specifications and copy inventory

Status labels follow [the handoff](00-START-HERE.md). All proposed marketing language may be refined without altering source facts. Text marked SOURCE must retain its meaning; the supplied booking left-column text should remain intact apart from encoding repair.

## Sitemap

| Route | Purpose | Origin |
|---|---|---|
| `/` | Cinematic introduction and service discovery | PROPOSED supporting homepage |
| `/services` | Full inventory across three categories | SOURCE page |
| `/testimonials` | Genuine customer experiences | SOURCE page; content missing |
| `/pricing` | Package comparison | SOURCE page; commercial decisions pending |
| `/workflow` | Customer steps and enquiry form at `#enquiry` | SOURCE page and form placement |
| `/become-a-creator` | Creator story, steps, application at `#apply` | SOURCE request |
| `/privacy` | Owner-approved data-use explanation | PROPOSED release support |
| `/terms` | Owner-approved service terms if applicable | PROPOSED release support |

No separate booking route is needed. If later added as an alias, redirect to `/workflow#enquiry`. Do not scatter independent forms with divergent validation across routes. A separate work route is not necessary in v1; use a homepage work section and service-linked samples.

## Shared navigation

Desktop: wordmark, Services, Testimonials, Pricing, How It Works, Become a Creator, Book a Shoot. The exact spacing may move Become a Creator into a secondary row at intermediate widths rather than shrinking the type. Mobile: wordmark, Book a Shoot, Menu; the menu includes every released route.

Book a Shoot points to `/workflow#enquiry`. Become a Creator points to `/become-a-creator`. The logo goes home. Active route state is visible and accessible. Unknown contact details and social URLs stay absent, not fabricated. A text wordmark is an acceptable preview until a logo is provided; it is not a completed identity design.

Unready source pages remain available in the private preview with a clear preview-only note. For production, required page content is a launch gate; hiding a required page is an explicit owner-approved scope adjustment, not the default solution.

## Homepage

### Section H01 — Hero

Purpose: make the service and its emotional value clear immediately.

Proposed eyebrow: `THE REEL WALA`.

Proposed H1: `Some moments deserve a replay.`

Proposed explanatory sentence: `Reel shoots for your private celebrations, corporate events, and cultural gatherings.`

Primary CTA: `Book a Shoot`. Secondary CTA: `Explore Services`, linking to `/services`. Add `Watch Our Work` only when approved playable media exists.

Use the signature event scene from the story brief. The image is not evidence of a real client unless it is approved client work. Do not display delivery timing or “starting at” prices here until their decisions are resolved.

### Section H02 — Presence and replay

Proposed heading: `Be in the moment.`

Proposed body: `From the big reactions to the little details, give your occasion a story you can return to.`

The hero's crops become a playable reel when matching assets exist. The result player needs an event label and accurate attribution where approved. No generated demo should be labelled customer work. If real work is unavailable in preview, use a visibly marked illustrative still and keep play disabled with an honest explanation.

### Section H03 — Services overview

Three editorial sections or asymmetric panels: Private Events, Corporate Events, Social / Cultural Events. Each links to a stable anchor on `/services`. Homepage teaser examples are allowed, but the full inventory must exist on the Services route.

Proposed heading: `For everything worth remembering.`

### Section H04 — Work selection

Use 3–6 approved samples, each tagged to one service category. Portrait video ratios may vary only with intentional composition. Include accessible play controls and captions where needed. Do not require a carousel to discover every item. No view counts or social metrics without evidence.

### Section H05 — Process preview

Show the same three customer steps as `/workflow` in condensed form. CTA: `See How It Works`. If delivery timing is unresolved, condensed copy says `Receive your reels and pictures` without creating an alternative time promise.

### Section H06 — Pricing and trust previews

Pricing teaser links to `/pricing`; no unapproved amounts. Testimonial excerpt only when approved source material exists. In public release this content cannot be replaced by generated quotes. Avoid placing two large secondary sections between a convinced visitor and the booking CTA.

### Section H07 — Closing invitation

Proposed heading: `What are we capturing next?`

CTA: `Book a Shoot` to the Workflow form. Secondary creator invitation: `Have an eye for the moment?` with `Become a Creator`.

## Services page

H1: `Services` (SOURCE). Proposed introduction: `Explore reel shoots for private celebrations, corporate events, and social or cultural occasions.`

Keep three stable anchors: `#private`, `#corporate`, `#social-cultural`. Use category navigation that also works without animation. Each category contains its full inventory from [services.json](data/services.json), a relevant image, optional approved work sample, and an enquiry CTA.

An item CTA may link to `/workflow?service=private-010#enquiry`. Use stable IDs, not display text as identifiers. Validate query values against the catalogue before selecting a form option. Category links can preselect only the group when an item has not been selected; never select a random event.

Do not deduplicate birthdays or product launches. Do not interpret “& more” as unrestricted service availability. Do not create city landing pages until operating areas are confirmed.

Mobile: complete lists remain readable. An accessible disclosure per category is acceptable, with headings and category summaries visible, but a user must be able to access every service by keyboard. For search indexing and basic resilience, server-render all list text.

## Testimonials page

H1: `Testimonials` (SOURCE). Proposed introduction once content exists: `Hear from the people whose moments we captured.`

No testimonial content was supplied. Implement the data model and layout in preview with an empty state reading `Approved testimonials will appear here.` This is a preview diagnostic, not production marketing copy.

For each approved item store exact quote, display name, event label if approved, permission status, and optional linked sample. Do not create ratings, five-star graphics, surnames, headshots, city names, or company logos. Production requires real approved items or an explicit owner decision to defer this page.

## Pricing page

H1: `Pricing` (SOURCE). Proposed introduction: `Compare the shoot options for your occasion.`

Place package inclusions in aligned, readable cards. Do not make the longest option look “recommended” or “most popular” without an owner decision. On mobile, stack in source order. Selecting a package carries its internal ID to the Workflow form; it does not initiate checkout.

### Standard package

SOURCE tagline: `Quick, focused content for when you need a high-quality reel without the wait.`

SOURCE inclusions: 4 complimentary pictures; reels delivered within 24 hours (timing conflict/start-point still gated).

REFERENCE only: ₹1,999 + GST, up to 1 hour, 1 edited reel up to 60 seconds, trained/certified maker, latest iPhones. Show in an annotated preview if useful; do not publish the reference fields without approval.

### Longer shoot package

This is a provisional preview label, not a new product name.

SOURCE tagline: `Ideal for longer shoots, events, and creating multiple high-quality reels in one session.`

SOURCE inclusions: up to 4 hours shoot time; 7 complimentary pictures; reels delivered within 24 hours (timing gated).

REFERENCE only: Half Day Plan, ₹4,999 + GST, 2 reels up to 60 seconds each, raw footage access, trained/certified maker, latest iPhones. The reference's three-hour duration must never override four hours.

### Extension

SOURCE label: `Extended hour`. SOURCE amount: ₹1,000. The screenshot's “extra reel OR extra hour” and ₹1,250 are superseded. Tax treatment, applicability to packages, and whether another reel is produced are unresolved. Preview can show the written amount with an internal note; do not create a public tax disclaimer that has not been approved.

### Premium package

SOURCE heading only. In private preview show the heading and a visible unresolved-content note. Do not invent wedding bundles, all-day coverage, priority creators, drone footage, unlimited edits, or a price. A public “Enquire about Premium” card is an acceptable proposed alternative only after owner approval (DEC-03).

All CTAs use `Enquire About This Package` or `Book a Shoot` and end at the lead form. No payment action, urgency timer, crossed-out price, discount, or unavailable slot indicator.

## Workflow page

H1: `How It Works` (PROPOSED label for the SOURCE Workflow page).

Customer steps, in order:

1. **Booking** — `Tell us where, what & when.` SOURCE.
2. **Reeler Assigned** — `A professional reel creator will be assigned to your event, and their details will be shared with you.` SOURCE, encoding/spacing normalized.
3. **Delivery** — preview uses `Reels and pictures will be shared within 24 hours via a secure download link.` SOURCE meaning; the source heading “Same day Delivery” is conflicting and not silently discarded. Final heading and timing depend on DEC-04.

Do not show tracker, arrival estimate, PIN, instant-confirmation screen, or “Step 5” from the references. These illustrations imply systems outside v1.

### Enquiry section at `#enquiry`

Desktop: left copy / right form, roughly 45/55. Mobile: copy above the form. Preserve the following SOURCE copy:

- Title: `Book Your Shoot with TheReelWala`
- Supporting headline: `Your Events, Captured in Reels!`
- Paragraph: `From corporate gatherings to weddings and creative events, we turn your special moments into engaging, scroll-stopping reels.`
- Paragraph: `Fill out the form to book your session. Let’s create content that captures the vibe of your event and makes every moment worth sharing.`

Add a short PROPOSED clarification near the button: `Submitting this form sends an enquiry. Your shoot is confirmed separately by our team.` This reconciles the source booking language with lead-generation behaviour; confirm the business process before production.

Form specification is in [forms and journeys](05-FORMS-AND-JOURNEYS.md). Button: `Send Shoot Enquiry`. Saved-success message: `Your enquiry has been received. Our team will contact you about your shoot.` No invented response time.

## Become a Creator page

H1: `Become a Creator` (SOURCE intent). Proposed intro: `Have an eye for the moment? Tell us about yourself and share your work.`

Source onboarding sequence:

1. `Register` — submit an application with your details.
2. `Attend the Workshop` — workshop details and eligibility are supplied by the team; no dates, fee, certificate, or admission guarantee are given.
3. `Receive Shoots` — approved creators receive assignments through the business process; no guaranteed volume.
4. `Get Paid After Shoots` — no invented amount, payout date, method, or instant-payment claim.

Application at `#apply`. Include all source form fields and requested additions. Show upload optionality explicitly. Do not turn the page into an employment offer or earnings calculator. Saved success: `Your application has been received. Our team will review your details and contact you about the next steps.` Submission is not approval.

## Metadata and release behaviour

Proposed title pattern: `Services | The Reel Wala`, etc. Homepage: `The Reel Wala | Event Reel Shoots`. Write accurate descriptions without unconfirmed cities or prices. Set one canonical URL per route using the owner's actual domain. Preview environments must be noindex and access-controlled when they contain private assets or business drafts; robots metadata alone is not access control.

Do not emit review, rating, Offer price, business address, or contact structured data with invented values. Optional schema should be generated only from verified published data. Missing legal/contact content is a launch dependency, not permission to publish boilerplate factual claims.
