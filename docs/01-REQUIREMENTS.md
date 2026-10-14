# Requirements and source traceability

## Source identity

Business source: [THE REEL WALA.docx](references/THE%20REEL%20WALA.docx), copied unchanged from `C:\Users\bisme\Downloads\THE REEL WALA.docx`.

SHA-256: `0a2631e5eb20a901937e63018e17c323b9f21f70f4e41850ec52f051f10fe79c`.

See [the full transcription](references/source-transcription.md) and [structured extraction](references/source-extraction.json). P identifiers are paragraph positions in the Word XML, including empty paragraphs. They are not rendered page numbers. Text and all ten embedded images were inspected. Word pagination was not verified because the packaged renderer could not locate bundled LibreOffice.

## Requirements register

| ID | Requirement | Evidence | Status and implementation rule |
|---|---|---|---|
| REQ-01 | Brand is The Reel Wala | P001, P089 | SOURCE. Proposed consistent display spelling: The Reel Wala; preserve supplied booking title separately. |
| REQ-02 | Orange headings identify pages | P005 | SOURCE. Services, Testimonials, Pricing, Workflow get separate routes. Homepage is an additional proposed entry point. |
| REQ-03 | Three service groups | P007–P039 | SOURCE. Private, Corporate, Social / Cultural. |
| REQ-04 | All private services | P010–P019 | SOURCE. Ten entries; retain all. |
| REQ-05 | All corporate services | P023–P030 | SOURCE. Eight entries; retain all. |
| REQ-06 | All social/cultural services | P034–P039 | SOURCE. Six entries; retain festival examples. |
| REQ-07 | Testimonials page | P042 | SOURCE. No reviews supplied. Build preview and data-driven page; publication gate requires genuine material or owner-approved omission. |
| REQ-08 | Standard package | P045–P049, image7 | SOURCE name, tagline, 4 pictures, 24-hour wording. Other inclusions reference-only. |
| REQ-09 | Longer-shoot package | P052–P056, image5 | SOURCE tagline, up to 4 hours, 7 pictures, 24-hour wording. Name/price/other inclusions reference-only. |
| REQ-10 | Extended hour ₹1,000 | P058–P060, image2 | SOURCE amount and hour scope. Do not inherit screenshot extra-reel option or ₹1,250. |
| REQ-11 | Premium package | P066 | SOURCE heading only. No invented price, duration, reel count, or benefits. |
| REQ-12 | Customer workflow step 1 | P072–P074 | SOURCE: Booking — tell us where, what and when. |
| REQ-13 | Customer workflow step 2 | P076–P079 | SOURCE: a professional reeler is assigned; details shared. |
| REQ-14 | Customer workflow step 3 | P081–P083 | SOURCE conflict: same day vs within 24 hours. Stage preview with 24-hour wording; resolve before publication. |
| REQ-15 | Lead form must be on Workflow page | P086–P087 | SOURCE. A standalone booking route cannot be the only form location. |
| REQ-16 | Booking form left-column text | P088–P092 | SOURCE. Preserve supplied wording; repair broken apostrophe. |
| REQ-17 | Customer form fields | image10, P087 | REFERENCE: name, phone, event type, date, location; all appear required. Adopt as implementation baseline. |
| REQ-18 | Become a Creator access and page | P095–P097, image6 | SOURCE request. Reference competitor branding is not final copy. |
| REQ-19 | Creator contact/device fields | image4, P097 | REFERENCE: name, mobile, email, gender, portfolio/Instagram, iPhone. Required markers except portfolio. |
| REQ-20 | iPhone model dropdown above iPhone 15 | P098 | SOURCE. Boundary ambiguous; verify eligibility and current actual models rather than inventing a list. |
| REQ-21 | Creator locality field | P099 | SOURCE. Placeholder: Type Your Area Like “Viman Nagar”. This is not proof of geographic coverage. |
| REQ-22 | Two creator videos optional | P100 | SOURCE overrides required asterisk in image4. Zero videos must be accepted. |
| REQ-23 | Best five creator photos | P101 | SOURCE section required. Required count vs maximum unspecified. |
| REQ-24 | Four creator steps | P103–P104, image9 | SOURCE: register, attend workshop, receive shoots, payments after shoots. |
| REQ-25 | Reference partner page | P106 | REFERENCE link only: https://partner.reelongo.com/. Do not treat external page changes as new requirements. |
| REQ-26 | Cinematic story direction | User discussion following Shopify review | PROPOSED execution accepted as direction; business facts remain controlled by DOCX. |
| REQ-27 | Supplied colour palette | Latest user request | SOURCE: amber #F59E0B, turquoise #0BF5E2, brown #AF8C51, teal #07AC9F. Tweaks permitted. |
| REQ-28 | Documentation only in this phase | Latest user request | SOURCE. No application scaffolding or deployment during handoff preparation. |

## Full service inventory

Machine-readable equivalent: [services.json](data/services.json). Source spelling is retained there. The following labels use light capitalization normalization without removing content.

### Private Events

1. Weddings & Receptions
2. Mehendi, Sangeet, Haldi, Make-Up Shoots
3. Birthdays & Anniversaries
4. New Car Delivery
5. Baby Showers, Naming Ceremonies & Annaprashan
6. Birthday Parties & Graduation Days
7. Proposal & Pre-Wedding Shoots
8. Pet Shoots
9. Housewarming
10. Family Gatherings & Home Tours

### Corporate Events

1. Team Outing, Team Lunch / Dinner
2. Corporate Parties
3. Annual & Quarterly Meetups
4. Office Celebrations
5. Company Anniversaries
6. Product Launches
7. Sports & Corporate Tournaments
8. Store / Product Launches

### Social / Cultural Events

1. Cultural Fests & Carnivals
2. Festivals: Diwali, Holi, Eid, Christmas, Gudi Padwa & more
3. Community / Society Events
4. Music Festivals & Concerts
5. Stand-Up Comedy Shows
6. Fashion Shows / Food Festivals

The overlaps are intentional preservation of the source, not an instruction to deduplicate. Use group headings or accessible disclosures if necessary; never replace the full inventory with three generic service cards.

## Package reconciliation

| Field | First package | Second package | Extension | Premium |
|---|---|---|---|---|
| Written name | Standard package | Not supplied | Extended hour | Premium package |
| Screenshot name | Hourly Plan | Half Day Plan | Add On’s | None |
| Written price | Not supplied | Not supplied | ₹1,000 | Not supplied |
| Screenshot price | ₹1,999 + GST | ₹4,999 + GST | ₹1,250 + GST | None |
| Shoot time | Reference: up to 1 hour | Written: up to 4 hours, overrides reference 3 | Written: extended hour | Unknown |
| Reels | Reference: 1, up to 60 seconds | Reference: 2, up to 60 seconds each | No written extra reel | Unknown |
| Pictures | Written: 4, overrides reference 5 | Written: 7 | Unknown | Unknown |
| Delivery | Written: within 24 hours | Written: within 24 hours | Not separately defined | Unknown |
| Other reference claims | Trained and certified reel maker; latest iPhones | Trained and certified reel maker; latest iPhones; raw footage | 1 extra reel OR 1 extra hour | None |

Do not convert the second screenshot into Premium by assumption; P066 appears later as a separate heading. Use internal ID `extended-session` and provisional label `Longer shoot package` in preview until the owner defines the name/relationship.

Written “color gradiant picture” likely means colour-graded photos, but this is unresolved wording. Preserve the source phrase in data and preview use “4 complimentary pictures” / “7 complimentary pictures” without claiming a particular treatment until confirmed.

## Conflicts to preserve

1. Same-day, within-24-hours, within-1–2-hours, and 30-minute delivery are different. The latter two are screenshot claims and must not migrate to final copy. Written timing still needs a start-point and label decision.
2. Instant booking confirmation appears in a screenshot, while the document requests a lead-generation form. Proposed v1 submits an enquiry; no slot is reserved.
3. Videos are required in the screenshot and optional in the notes. Notes control: videos optional.
4. Premium is unspecified; retain the requested concept without fabricated commercial details.
5. Source screenshot equipment/certification claims are not owner-verified.

## Functional additions with explicit status

The homepage, work gallery, submission persistence, server validation, upload progress, accessible controls, private storage, and release gates are PROPOSED implementation support. They enable the brief without changing its commercial offering. No extra mandatory customer questions, subscription offers, packages, locations, or accounts should be added without a documented decision.
