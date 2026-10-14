# Forms and user journeys

## Customer journey

Discover service or work → compare options → open `/workflow#enquiry` → enter event details → submit → server persists enquiry → show saved confirmation → staff follows up outside the website.

Package/service query parameters are intent hints. They do not lock a price, reserve a time, confirm availability, or create a payment obligation. Customers can change a selected service. Preserve the selection after validation errors and server failures.

### Customer fields

| Field / API key | Label | Required | Validation / source |
|---|---|---|---|
| `name` | Name | Yes | Reference form; trimmed Unicode text, proposed 2–100 characters; allow varied personal names |
| `phone` | Phone Number | Yes | Reference form; country-aware validation, proposed India default without implying India-wide service |
| `serviceId` | Event Type | Yes | Reference form; options grouped by all 24 source entries using stable IDs |
| `eventDate` | Event Date | Yes | Reference form; ISO calendar date; no past date relative to service timezone |
| `eventLocation` | Event Location | Yes | Reference form; plain text, proposed 3–300 characters; do not infer precise GPS or force map access |
| `packageId` | Selected package | No | PROPOSED context if a package CTA was followed; visible and removable; no hidden price commitment |

Do not add required email, budget, start time, company, attendee count, account creation, or marketing opt-in. Such fields are not in the source brief. The owner may authorize optional additions later; v1 keeps the reference form small.

Use the proposed business timezone `Asia/Kolkata` for date validation, pending location confirmation. Store the date as a date, not midnight converted between timezones. Same-day enquiries remain possible; submission does not imply same-day availability. Phone normalization should preserve valid international numbers and should not impose a simplistic fixed digit count on every country.

If every event option fits poorly, an optional `Other occasion` plus detail can be an owner-approved enhancement; it is not seeded by default because the task asks for strict source adherence.

### States and messages

- Empty: visible labels, useful examples, no preselected event type.
- Invalid: inline errors, error summary, focus first invalid field after attempted submit. Do not rely only on colour.
- Sending: disable duplicate submission while keeping labels and field values stable.
- Saved: show confirmation only after a durable server write. Announce it with a polite live region and move focus to the confirmation heading.
- Failed: `We couldn’t save your enquiry. Please try again.` Keep inputs; offer retry using the same idempotency key for unchanged data.
- Unknown outcome/network timeout: use `We couldn’t confirm whether your enquiry was received. Please retry.` Same-key replay must safely return the previously saved result.
- Notification failure: the enquiry remains saved and confirmation remains valid. Retry staff notification in the backend; never ask the customer to duplicate an already stored enquiry.

## Creator journey

Explore role → understand four steps → enter details → optionally add edited videos and add photos per approved rule → upload → submit application with verified upload IDs → server commits application → show received message → authorized staff reviews outside the website.

### Creator fields

| Field / API key | Label | Baseline status | Rule |
|---|---|---|---|
| `name` | Your Name | Required, REFERENCE | Same text handling as customer |
| `phone` | Mobile Number | Required, REFERENCE | Country-aware phone validation |
| `email` | Email | Required, REFERENCE | Normalize domain, validate ordinary email syntax; no confirmation email promise |
| `gender` | Gender | Required in REFERENCE | Keep field in preview; source does not supply options. Proposed options Woman, Man, Non-binary, Self-describe, Prefer not to say require owner approval; DEC-08 governs production |
| `portfolioUrl` | Portfolio / Instagram | Optional, REFERENCE | Accept a valid http(s) URL; a clearly entered Instagram handle may be normalized to a profile URL. Never server-fetch arbitrary links during submission |
| `deviceModelId` | iPhone You Shoot With | Required, REFERENCE + SOURCE dropdown request | Select from owner-approved real device catalogue; iPhone 15 boundary unresolved |
| `locality` | Locality | SOURCE addition; requiredness proposed | Placeholder exactly `Type Your Area Like “Viman Nagar”`; proposed required in preview, confirm DEC-08 |
| `videoUploadIds` | Upload any two videos edited by you | Optional, SOURCE override | Zero accepted. Proposed 0–2, with one permitted; confirm exact-count interpretation if needed |
| `photoUploadIds` | Upload Best 5 pics clicked by you | SOURCE addition | Proposed preview 0–5, optional; requiredness/exact-five rule unresolved and gated by DEC-07 |

Do not render a fake live device list. During development seed only a clearly marked test option in non-production or use a verified, approved catalogue. Production creator intake requires DEC-06 to define eligibility and an up-to-date model list. Dropdown values are canonical IDs, never trusting an arbitrary browser label.

### Proposed upload defaults

These are engineering limits, not requirements extracted from the DOCX. Owner/provider can change them before release; keep one shared configuration for UI and server.

- Videos: up to 2, maximum 100 MiB each, MP4 or MOV containers; do not promise browser playback of every codec.
- Photos: up to 5, maximum 10 MiB each, JPEG, PNG, or WebP initially.
- HEIC/HEIF requires an explicit conversion/inspection decision because iPhone applicants may use it. If unsupported, clearly request JPEG/PNG/WebP before selection and explain conversion; do not silently fail.
- Maximum accepted payload after all files: 250 MiB. Upload directly to private storage rather than proxying files through a small form request.
- Validate actual bytes/container as well as extension and declared MIME type. Detect malformed files and reject dangerous content. Store originals privately; strip location metadata from any public derivative if publication is later authorized.
- Per-file upload progress, retry, remove, count, size, and status must be visible. File picker is primary; drag-and-drop is optional enhancement.
- On refresh, preserve no personal data in long-lived local storage by default. Explain that selected files may need to be reselected; no false resumable-upload promise.

### Upload lifecycle

Create anonymous, bounded upload session → authorize each allowed file → upload to a server-generated private key → complete upload → inspect file → mark ready or rejected → submit application referencing ready files → atomically attach them to the application.

An opaque session cookie binds files to the applicant's current session. Client-supplied storage paths are never accepted. An unattached upload expires automatically (proposed 24 hours). Retry/cleanup must not delete attached application files. Application retention is a separate owner decision.

Uploads still pending inspection block application submission with a clear explanation; optional uploads can be removed to proceed. If a file is rejected, announce why and allow replacement. Submitted files are not automatically portfolio material for the public site.

### Creator states

Use customer form states plus per-file queued/uploading/inspecting/ready/rejected states. Completing uploads is not equivalent to submitting the application. Saved success does not imply workshop admission, creator approval, assignments, or payment eligibility.

## Privacy and operational handling

Show an owner-approved collection notice adjacent to each submit action and link to the actual privacy page. Do not precheck marketing consent or bundle unrelated marketing into the enquiry. Do not require an unnecessary consent checkbox merely because a template contains one; the owner must confirm the appropriate notice/consent wording before public collection.

Applications and uploads are visible only to authorized reviewers in the selected back-office service. Prefer a notification that a new record exists and a link to the authenticated record; do not email portfolios as public attachments. Do not send anything to invented addresses or messaging channels.

The source's secure customer download link is a later fulfilment process, not the creator-upload storage flow. Keep those concepts distinct in code and copy.
