# Quality and acceptance criteria

These are build acceptance checks for the future coding agent. They are not claims that the site has been implemented or tested.

## Content fidelity

| Check | Expected result | Requirement |
|---|---|---|
| Service coverage | All 24 entries across 3 groups, including overlapping birthdays and launches | REQ-03–06 |
| Routes | Services, Testimonials, Pricing, Workflow, Become a Creator exist in preview | REQ-02, 07, 18 |
| Form placement | Actual enquiry form on Workflow, not only a CTA elsewhere | REQ-15 |
| Booking copy | All four supplied left-column text elements present with encoding repair only | REQ-16 |
| First package | Written 4-photo count wins over reference 5 | REQ-08 |
| Second package | 4 hours and 7 pictures win over reference 3-hour duration | REQ-09 |
| Extension | Written ₹1,000 and hour scope; no unapproved extra reel | REQ-10 |
| Premium | Defined preview slot; no fabricated specifics | REQ-11 |
| Delivery | No 30-minute/1–2-hour screenshot claims; written timing conflict resolved before public claim | REQ-14 |
| Creator form | iPhone dropdown, locality, optional videos, best-five-photos section present | REQ-19–23 |
| Creator steps | Register, workshop, shoots, payments after shoots | REQ-24 |
| Palette | User's four colours retained in defined roles with accessible pairings | REQ-27 |

## Commercial accuracy and release gates

Search rendered HTML, metadata, JSON responses, and production bundles for reference-only prices, placeholder names, ReelOnGo branding, “certified”, “latest iPhones”, “same day”, “30 minutes”, “1–2 hours”, and mock testimonial text. Some phrases may be approved later; every published instance needs evidence. Do not indiscriminately remove supplied source copy such as “scroll-stopping.”

Null price must not display as ₹0. Preview diagnostics must not appear on the public site. Reference-only fields cannot be protected by CSS hiding. Required unresolved pages are release blockers unless the owner explicitly changes scope.

## Customer flow acceptance

1. A service CTA sets the correct valid event option. Invalid query values are ignored safely.
2. Package selection carries an ID without displaying or committing an unapproved price.
3. Every required field has inline validation and a visible label.
4. Date validation behaves correctly near midnight in the configured business timezone.
5. A successful submit creates exactly one persistent record and an outbox event.
6. Refresh/server restart does not erase the record.
7. Rapid double-click, retry, and simultaneous requests with the same key do not create duplicates.
8. Database failure cannot show success. Email failure after saving cannot lose the record.
9. Unknown outcomes keep inputs and support safe retry.
10. No account, payment, availability reservation, or live creator match is implied.

## Creator flow acceptance

1. All reference fields and written additions are present under the approved optionality rules.
2. Zero videos is accepted. Photo-count rules match the owner's decision, not an arbitrary inferred requirement.
3. Device options are verified and meet the finalized iPhone boundary.
4. Selecting valid files shows progress and completion; rejection explains how to fix it.
5. Too many files, oversize files, forged MIME, incomplete uploads, and expired authorizations are handled honestly.
6. Files from another session cannot be viewed, removed, or attached.
7. Application commit attaches only ready files and survives a simultaneous cleanup job.
8. Failed application submission allows retry without forcing successful uploads to restart unnecessarily.
9. Anonymous users cannot read saved applications or obtain permanent media URLs.
10. Success says received, never approved or guaranteed work/payment.

## Responsive visual review

Inspect every route at 360×800, 390×844, 768×1024, and 1440×900. Capture full-route screenshots in addition to the first viewport. Test in a desktop Chromium browser and a real or representative mobile Safari/WebKit environment when available; report unavailable device coverage honestly.

Verify no horizontal overflow, header overlap, clipped headlines, accidental blank gaps, distorted media, unreadable image-backed text, or covered form controls. Check portrait-to-landscape changes, mobile keyboard, long names/locations, error messages, and selected filenames. Menus must not shrink to microscopic targets to fit.

## Accessibility

- One meaningful H1 per page and ordered headings/landmarks; skip link works.
- Main controls have comfortable approximately 44px targets, visible focus, and accessible names.
- Navigation, disclosures, dropdowns, upload controls, and media players work with keyboard alone.
- Dialog/menu Escape and focus restoration work; hidden content is not accidentally tabbable.
- Labels, hints, requiredness, errors, and success are available to assistive technology.
- Text contrast follows measured tokens and actual media crops; essential control boundaries are visible.
- Reduced-motion removes parallax/assembly/autoscroll and preserves all information and actions.
- Reels have pause controls and captions/transcripts when needed to understand speech.
- At 200% zoom and narrow reflow, content and forms remain usable.

Do not claim WCAG compliance solely from an automated scan. Use automated checks plus keyboard and visual inspection.

## Performance targets

PROPOSED budgets: aim for LCP at most 2.5 seconds, CLS at most 0.1, and INP at most 200ms at the 75th percentile when field data becomes available. Before launch use lab tools and a representative mobile connection; no field results can be claimed without actual traffic measurements.

Initial compressed first-party JavaScript target: approximately 200KB or less before optional motion/player loads; document justified framework overhead. No full reel downloads on initial load, no unnecessary third-party video embeds, no simultaneous autoplay wall. Prioritize hero poster, set image dimensions, subset fonts, lazy-load below-fold assets, and profile expensive scenes.

The visual story is allowed to simplify to meet usability/performance. It is not allowed to make the form inaccessible on a weaker phone.

## Tests and completion evidence

Use unit tests for publication rules, date/field validation, and meaningful content constraints. Integration tests cover persistence/idempotency/uploads/outbox. Browser tests cover primary journeys, menu, errors, and reduced-motion. Avoid shallow tests that only assert the implementation's own markup.

Run the chosen project's typecheck, lint, test suite, and production build. Record versions, commands, outcomes, routes, viewport coverage, and remaining blocked scenarios. Resolve console errors, broken links, missing assets, and unresolved request failures.

## Final release checklist

- Final commercial and eligibility decisions incorporated.
- Approved portfolio/testimonial/identity assets in place.
- Real domain, staff destination, private storage, database, and workers configured.
- Collection notices, retention, and access responsibilities confirmed.
- No local mock-success adapter enabled.
- Backups/recovery and failed-notification handling checked.
- Required pages complete or explicit owner-approved scope changes recorded.
- All checks above either passed or have an explicitly accepted, described limitation.

Distinguish implementation completion from release readiness in the report. Do not silently deploy unresolved content.
