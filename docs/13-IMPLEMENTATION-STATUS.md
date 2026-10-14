# Implementation status — 10 October 2026

**Latest visual update:** [document 17](17-MOTION-IMPLEMENTATION.md) describes the implemented motion story and supersedes the older photographic hero/gallery descriptions and browser-verification limitations below.

The user authorized building after the documentation handoff and then requested components from Shopify Editions, React Bits, Aceternity, shadcn and Three.js. The local implementation is present and builds successfully. Public release and final visual verification of the newest effects remain outstanding.

**Latest navigation:** the user has now required one page. All feature content, both forms and notices are consolidated into homepage sections; see [the single-page update](15-SINGLE-PAGE-UPDATE.md). The older page descriptions and browser checks below document earlier implementation stages.

## Implemented experience

- Homepage with the story “Some moments deserve a replay”, layered illustrative photography, the approved amber/turquoise palette, warm paper and forest sections, and locally served Manrope/Cormorant Garamond fonts.
- All required pages: Services, Testimonials, Pricing, Workflow and Become a Creator. Services retains all 24 supplied entries. Additional privacy, terms and preview-status pages explain the actual local preview behaviour.
- Responsive navigation, package-to-enquiry links, field validation, loading/error/success states, and focus movement after invalid or successful submissions.
- Customer enquiries and creator applications persist in embedded PostgreSQL. Submission success means a saved enquiry/application, not a confirmed booking or creator acceptance.
- Private creator uploads with signed sessions, byte limits, actual format inspection, upload progress, removal, retries and ownership checks. Videos are checked for supported container structure; this is not a complete codec decode or malware scan. Image inspection includes decoding and a pixel limit.
- Atomic record/outbox transactions, idempotent retries, persisted throttling and an operator CLI. The outbox queues notifications locally; no email or WhatsApp delivery is configured.
- React Bits hero tilt, Aceternity gallery perspective, a shadcn/Radix booking FAQ and an original Three.js photographic scene. See [component provenance](14-COMPONENT-PROVENANCE.md) for sources, licences and fallbacks.

## Source adherence and provisional decisions

The DOCX and its original evidence remain unchanged. The design references inform composition and interactions; they do not supply business facts.

- The supplied booking heading, subheading and introduction are retained. Customer name, phone, event type, date and location remain required; no customer email, payment or account was added.
- Written package changes prevail: Standard includes four complimentary pictures; the second package uses four shoot hours and seven pictures. Screenshot price/deliverable details remain explicitly provisional. Premium has no invented inclusion or price.
- “Within 24 hours” is a labelled preview interpretation of the unresolved same-day/24-hour conflict. The extra-hour amount/scope follows the written source; tax and eligibility remain open.
- Creator fields and the Register → Workshop → Receive Shoots → Paid after shoots sequence are retained. The locality example remains `Type Your Area Like “Viman Nagar”`.
- The preview includes verified actual iPhone model names, including the 15 family. Inclusion of that family is a provisional interpretation, not eligibility approval. Gender choices and optional 0–2 videos/0–5 photos are also preview defaults pending the decisions in [the register](11-DECISIONS.md).
- Generated scenes are labelled illustrative. No client testimonials, work, service areas, business contact details or final logo were invented. Testimonials has an honest empty state.

## Verification completed

| Check | Result |
|---|---|
| `npm run typecheck` | Passed after component integration; the later Three.js resource-lifecycle adjustment also passed TypeScript during the final build |
| `npm run lint` | Passed |
| `npm test` | All six tests passed: service/date/phone validation; concurrent safe replay and conflict; optional creator uploads/portfolio normalization; ownership and transaction rollback; throttling; disk persistence after closing/reopening |
| `npm run build` | Passed with all application/API routes compiled |
| Optimized server HTTP checks | Nine page routes, three photographs and the icon returned 200; the missing-page route returned 404 |
| `node scripts/verify-http.mjs` | Passed nine integration checks on the final optimized server: session ownership, PNG inspection, cross-session rejection, application attachment, replay, attached-file removal protection, spoofed-file rejection, field validation and origin rejection |
| Operator listing | Passed with the website server stopped; saved browser records/outbox entries survived shutdown |
| Operator cleanup | Completed with zero expired records; this run verifies the command path, not deletion of an expired fixture |

Earlier browser inspection covered the core interface at 1440×900, 390×844, 360×800 and 768×1024. It included homepage/pricing layouts, mobile navigation, package preselection, invalid-form focus, saved customer enquiries, and creator application submission with a generated MP4 fixture. A photo was also uploaded and removed. Observed responsive issues and warnings were corrected during that pass. No horizontal overflow was observed at those checked widths.

**Verification limit:** browser-control tools became unavailable before the latest premium components were added. Their final appearance, pointer motion, WebGL fallback and accordion keyboard interaction have not been inspected in a browser. They compile and serve, but that does not replace visual/interaction QA. No final screenshot files are included. A browser tab opening was requested from Codex; its result was queued, not a confirmation of inspection.

No live managed PostgreSQL database, notification delivery, authenticated staff portal, cloud storage or hosted deployment was tested.

## Subsequent GSAP smooth-scroll addition

The user explicitly requested GSAP smooth scrolling after opening the local preview. GSAP 3.15.0 ScrollSmoother/ScrollTrigger now enhance desktop layouts above 900px with a fine pointer, hover support and no reduced-motion preference. Smoothing uses a 0.85-second catch-up with unchanged scroll speed. Touch layouts and reduced-motion settings use native scrolling.

The header, navigation dialog and badge stay outside the transformed content. Same-page hash links use the smoother with a measured header offset and retain history state; cross-route links remain handled by Next. Focused fields are brought into view, modals pause background scrolling, and route/media changes remove the previous instance and its listeners. GSAP's resize observer tracks content height; fonts and header-size changes also refresh measurements. Hero and gallery animations subscribe to displayed scroll position. Form introductions use normal flow while smoothing is active because native sticky positioning is incompatible with that transformed viewport.

Type checking, lint, the optimized build and all six existing tests passed for this addition. The final optimized server returned HTTP 200 for the homepage, Workflow and Become a Creator, with the new wrapper present. Browser chunks containing GSAP also returned 200. The user's requested preview server remains running for review. Browser-control tools remain unavailable: wheel/trackpad feel, Back/Forward, cross-route anchors, keyboard focus, menu pause, dynamic form/accordion heights, responsive overflow and reduced-motion toggling still require browser interaction QA. Code/build checks do not confirm those behaviours visually.

### Hero click jump correction

The user reported that clicking the hero title or photograph jumped to another section. The main landmark has `tabindex=-1` for skip-link accessibility; clicking a non-interactive descendant can focus that landmark. The original focus handler treated its page-sized bounds as an offscreen control and attempted to centre the entire main element. Focus-based scrolling now excludes page containers and plain content, and reveals only actual controls, keyboard stops, editable content or explicitly marked feedback. Form-success headings are explicitly marked so their intentional focus still works. Skip links and hash navigation retain their own scroll handling.

Type checking, lint, the optimized build and all eight tests passed, including two regression tests for the focus policy. The preview server was restarted and the homepage returned HTTP 200. Those tests cover the container rejection and retained control/feedback behaviour; they are not browser click tests. Browser-control tools remain unavailable for reproducing the supplied click interaction directly.

## Running and reviewing

The single-page consolidation passed type checking, lint, all eight unit tests and the optimized build. `verify-one-page.mjs` passed all eight integration groups: sections on root; one H1/two forms; unique IDs/labels; every link stays on root and resolves; 24 service choices/three presets; compatibility redirects; query preservation; and homepage enquiry save/replay. Service/package preselection is implemented in place but actual browser interaction and visual review of this consolidated layout remain unverified because browser-control tools are unavailable. The requested server remains running for user review.

Follow [the root README](../README.md). Keep `APP_ENV=preview`. The website binds to `127.0.0.1`; temporary QA servers are stopped after verification. Run `npm run dev` to reopen the preview, or `npm run start` after building.

Stop the website before running `intake:list` or `intake:cleanup`: the embedded database is opened by one process at a time. `.data` contains private submissions, uploads and a signing secret, and must not be included in a handoff or source archive. QA records are clearly named and are not business leads. Cleanup is manual, preserves attached files and is not a scheduled retention system.

The original documentation-only ZIP is preserved as a historical deliverable; it is not a package of the implemented application. The working application lives in this checkout.

## Remaining before release

Complete browser review of the latest effects and responsive/keyboard states. Resolve pricing/tax, package details, delivery timing and creator eligibility/upload decisions. Supply approved work, testimonials, branding, contacts and service areas where required. Confirm accurate privacy/terms and retention practices. Configure managed private storage, authenticated staff review and real notification delivery, then validate the selected deployment environment.

Production intake deliberately refuses requests. Setting `RELEASE_APPROVED=true` alone does not enable it. These release dependencies do not prevent local review of the implementation.
