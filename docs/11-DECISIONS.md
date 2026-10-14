# Open decisions and release dependencies

This register preserves uncertainty in the supplied brief. It does not block creation of the documentation or a private implementation preview. A future coding agent should seek the owner’s answers before publishing the affected claims or enabling the affected production flow.

## Business decisions

| ID | Missing answer or conflict | Evidence | Safe preview treatment | Blocks |
|---|---|---|---|---|
| DEC-01 | Are ₹1,999 and ₹4,999 the intended prices? Is GST included/excluded and at what applicable treatment? | Screenshot values only | Keep reference values in annotated preview data; no public price or tax calculation | Public Standard/second package pricing |
| DEC-02 | What is the second package named, and are 1 hour/1 reel and 2 reels/60-second caps/raw footage retained? Are equipment/certification claims true? | P045–P056 plus screenshots | Written 4 photos, 4 hours/7 photos preserved; other fields reference-only | Final package cards and related claims |
| DEC-03 | What does Premium include and cost? Is it distinct from the second package? May it be an enquiry-only offering? | P066 heading only | Keep separate Premium slot with no invented facts | Premium public card |
| DEC-04 | “Same day” or “within 24 hours”? When does the clock start, and does it cover both reels and photos? | P049, P056, P081, P083 | Preview uses within-24-hours wording; no 30-minute/1–2-hour claims | Any public delivery-time claim |
| DEC-05 | Does ₹1,000 buy one extra shoot hour only? Which packages support it, and how is tax handled? | P059–P060 overriding image2 | Preserve written hour scope and amount; do not promise another reel | Extension publication/eligibility |
| DEC-06 | Does “above iPhone 15” include the iPhone 15 family? Which actual models qualify? | P098 | Configurable empty or clearly marked test catalogue; verify actual models before seeding | Public creator intake |
| DEC-07 | Are exactly 5 photos required, up to 5, or optional? Does choosing videos require exactly 2 or permit 1? | P100–P101 | Proposed optional 0–5 photos and optional 0–2 videos; zero videos always allowed | Final creator validation |
| DEC-08 | Must locality and gender be required? Which gender choices should appear? | P099 addition, image4 required gender | Retain fields; preview defaults explicitly labelled in internal config | Final creator validation/copy |
| DEC-09 | Which cities/areas are served? What phone/contact/social links should be public? | Not supplied; Viman Nagar is an example | No city-wide/nationwide claim or invented contact details | Location/contact publication |
| DEC-10 | Is the customer's submission an enquiry followed by staff confirmation? | Lead-gen wording vs instant-booking reference | Enquiry-first; honest separate-confirmation helper text | Final booking behaviour/copy |
| DEC-11 | Does “color gradiant” mean colour-graded photos? | P048, P055 | Say complimentary pictures without an unverified treatment | Final photo benefit wording |
| DEC-12 | Which original work, testimonials, logo, and subject permissions are approved? | No final assets supplied | Marked preview placeholders, no fake customers | Complete public portfolio/testimonials/identity |
| DEC-13 | Workshop format/eligibility and payout process details, if the owner wants them public | P104 sequence only | Publish only four source steps, with no fee/date/income promise | Additional creator claims, not the basic sequence |

## Operational decisions

| ID | Needed input | Proposed default / treatment | Blocks |
|---|---|---|---|
| OPS-01 | Hosting, database, storage, notification providers and domain | Next.js-compatible host, PostgreSQL, private object storage; no provider purchased | Live deployment |
| OPS-02 | Authorized staff destination and reviewer access | Authenticated provider back office; notification adapter remains test-only until configured | Live intake operations |
| OPS-03 | Actual privacy notice, retention periods, service terms and responsible business contact | Do not invent owner practices or legal promises; owner supplies/reviews accurate text | Public personal-data collection |
| OPS-04 | Upload limits and HEIC/HEIF support | Proposed 100 MiB/video, 10 MiB/photo; 2 videos/5 photos; decide iPhone image conversion | Production upload experience |
| OPS-05 | Production approval of source-required pages lacking content | Complete all required pages; explicit defer decision only if owner changes scope | Scope-complete release |

## Reversible design/engineering decisions already delegated

The coding agent can execute the following without repeatedly asking the owner: spacing, component composition, responsive breakpoints, use of accessible dark text on amber/turquoise, addition of deep teal, motion reduction, code organization, server-side validation, idempotency, durable storage, private upload handling, and tests. They are proposed implementation choices and may be adjusted when evidence supports a better approach.

Homepage and portfolio previews support the agreed story; they must not displace source pages. The exact headline and font pairing are proposed creative choices, while supplied booking copy stays intact. Colour tweaks are explicitly allowed by the user.

## Recommended owner-answer order

First resolve pricing/delivery (DEC-01–05), then creator eligibility/uploads (DEC-06–08), then supply location/contact/assets (DEC-09, DEC-12) and operational access/privacy (OPS-01–04). Confirm enquiry behaviour and photo wording (DEC-10–11) alongside those decisions. Do not hold a private visual preview hostage to all answers arriving at once.

## Change record format

For each resolution record ID, date, owner answer verbatim, interpreted implementation change, affected content keys/routes/tests, and public approval status. If a decision changes the DOCX meaning, keep the original source value and add a superseding decision; never rewrite historical evidence to conceal the difference.

At handoff creation all rows above are open. No silence, elapsed time, or assistant suggestion counts as owner confirmation.
