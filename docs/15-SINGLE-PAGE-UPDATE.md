# Single-page experience — superseding navigation instruction

The user explicitly instructed: “everything should be on one page” and “everything needs to be one page.” This supersedes the earlier separate-page presentation requirement. It changes navigation and composition, not the DOCX's business content or the open release decisions.

## Current page structure

| Anchor | Content |
|---|---|
| `/#home` | Hero and primary actions |
| `/#story` | Brand story |
| `/#services` | All three categories and all 24 services |
| `/#work` | Illustrative memory gallery |
| `/#how-it-works` | Full three-step customer workflow |
| `/#pricing` | All three package slots, written overrides, provisional reference prices and extra hour |
| `/#testimonials` | Honest placeholder for approved testimonials |
| `/#enquiry` | Customer enquiry, supplied booking copy, followed by booking questions |
| `/#become-a-creator` | Creator story and four steps |
| `/#application` | Creator application and private uploads |
| `/#privacy`, `/#terms`, `/#preview-status` | Expandable notices/status on the same page |

Header, footer, hero actions and section calls to action now use these anchors. The header highlights the currently visible section. There is one H1 and no duplicated standalone page-hero banners. The three service categories present the full lists below their photographs. Section components live in `src/components/sections`.

## Enquiry selection and forms

Service and package choices use `EnquiryLink` to publish an in-page selection event. `EnquiryForm` updates its controlled service/package selects without replacing the page or clearing other entered fields. Existing safe-retry handling still compares the submitted payload; selecting an option does not discard a pending retry key. Legacy query presets are validated against the existing service/package lists on hydration.

Both forms now share the document, so customer field IDs use `enquiry-` and creator field IDs use `creator-`. Labels, error descriptions and summary links use the same scoped IDs. Submitted field names and API contracts retain their business meaning. The enquiry source route accepts `/`; the historical `/workflow` value remains accepted for compatibility.

The success, loading, errors, upload verification, local persistence, privacy notices and production-intake restrictions remain in place.

## Compatibility and scrolling

Old Services/Pricing/Testimonials/Creator/Privacy/Terms/Status URLs redirect to the corresponding homepage anchor. `/workflow` redirects to the homepage enquiry and preserves supplied service/package query values. New navigation links do not use those routes.

GSAP smooth scrolling continues on eligible desktop devices; touch/reduced-motion users retain native scrolling. Clicking a navigation link inside an open menu closes the menu and resumes the smoother before scrolling. Notice links expand their disclosure, and GSAP refreshes the changed height before aligning it. Native anchor offsets use the document's scroll padding once. The hero-click focus correction remains in place.

## Verification

Run the normal type/lint/test/build checks, then `node scripts/verify-one-page.mjs` against the running server. That integration check verifies homepage sections, one H1, two forms, unique IDs, label associations, every link target, all 24 service selections, all three package presets, compatibility redirects, and saved/replayed enquiries from `/`.

The script creates one clearly named local QA enquiry and does not send notifications. Browser control is unavailable in the current session. The rendered composition, actual click-to-scroll/preselection, both forms' keyboard flows, menu behaviour and mobile overflow still need browser review. HTTP/markup checks do not substitute for that review.
