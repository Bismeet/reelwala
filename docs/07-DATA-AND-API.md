# Data model and API contracts

Status: PROPOSED implementation contracts. This is a specification, not an implemented backend. Request fields must match [the forms](05-FORMS-AND-JOURNEYS.md). The owner controls business rules listed in [decisions](11-DECISIONS.md).

## Planning data provided

- [services.json](data/services.json): all 24 source entries, IDs, and paragraph provenance.
- [packages.json](data/packages.json): written and screenshot values explicitly separated, with publication flags.
- [copy.json](data/copy.json): source wording, suggested display wording, workflow and creator steps.
- [design-tokens.json](data/design-tokens.json): palette, spacing, motion, and measured contrast.
- [source-extraction.json](references/source-extraction.json): complete raw paragraph evidence and image/link mapping.

Planning data schema version is 1. Do not replace nulls with fabricated defaults, convert reference-only values into approved content, or expose internal notes publicly.

## Content entities

### ServiceCategory and ServiceItem

Category: stable `id`, label, source paragraph(s), sort order. Item: stable `id`, category, original source label, normalized display label, source paragraph, sort order, active flag. Do not infer an expanded geographic or service promise from the label. An inactive source entry requires an explicit owner scope change, not casual design trimming.

### Package

Stable ID, approved display name, proposed name where needed, source tagline, duration minutes, reel count, maximum reel seconds, photo count, photo treatment, price minor units, currency, tax treatment, turnaround wording, inclusions, provenance per field, publication status, approval record.

Store money as integer minor units. ₹1,000 = 100000 paise; ₹1,999 = 199900 paise. Missing price is null, never zero. Tax treatment is an explicit enum such as unknown/included/excluded after approval; do not compute an assumed tax percentage. No checkout or total calculation is required.

### WorkSample and Testimonial

WorkSample: ID, service category/item, title, approved public poster/video URLs, media dimensions, duration, alt text, caption track if needed, focal points by breakpoint, rights/permission record, publication status, optional associated testimonial.

Testimonial: ID, exact approved quote, approved display name, optional event label/company/photo only if permitted, source evidence reference, permission status, approval date, publication status. No aggregate rating model is needed without real rating data.

### DeviceModel

Stable ID, manufacturer `Apple`, exact model label, model family/generation, eligibility status, authoritative verification source/date, owner approval state, sort order. Do not generate eligibility using a simple numeric comparison until the iPhone 15 boundary is resolved. No actual catalogue is supplied in this pack.

## Persistent intake entities

| Entity | Important fields | Integrity rules |
|---|---|---|
| Enquiry | UUID, createdAt, name, normalizedPhone, serviceId, eventDate, eventLocation, optional packageId, status, sourceRoute, contentVersion, noticeVersion | Required fields validated; service/package IDs from allowed catalogue; no stored financial commitment |
| CreatorApplication | UUID, createdAt, name, normalizedPhone, email, gender response per approved rule, optional portfolio URL, deviceModelId, locality, status, contentVersion, noticeVersion | Device must be eligible; fields follow approved optionality; submission does not mean approval |
| UploadSession | UUID, createdAt, expiresAt, sessionTokenHash, status, fileCount and reservedBytes | Anonymous session bound by HttpOnly token; hard limits across all reservations |
| Upload | UUID, sessionId, optional applicationId, kind, privateObjectKey, originalFilename, declaredMime, inspectedMime, byteSize, state, expiresAt, createdAt | Owned by one session; attached to at most one application; never public |
| IdempotencyRecord | endpointScope, keyHash, requestHash, resultResourceId, responseStatus, createdAt, expiresAt | Unique scope + key; request changes under same key return conflict |
| NotificationOutbox | UUID, entityType, entityId, eventType, state, attempts, nextAttemptAt, lastErrorCategory, createdAt | Unique event/entity prevents duplicate dispatch; written with intake transaction |

Suggested enquiry statuses: `new`, `contacted`, `closed`. Suggested application statuses: `submitted`, `under_review`, `approved`, `declined`. Staff changes are administrative workflow, not public endpoints. Upload states: `authorized`, `uploaded`, `inspecting`, `ready`, `rejected`, `attached`, `expired`, `deleting`.

Use UTC timestamps for system events, a database DATE for eventDate, and a configured business timezone for date validation. Keep original names/locations as user-entered text with safe display escaping; do not restrict names to ASCII. Limit lengths and strip control characters. Do not store unnecessary browser fingerprints.

## Common API conventions

All endpoints are same-origin JSON over HTTPS in deployment. Mutating endpoints validate origin/CSRF as appropriate, apply bounded rate limits, reject unsupported content types, and limit body size. Do not accept wildcard cross-origin credential access. Intake JSON is small; media bytes go directly to private storage.

Use an `Idempotency-Key` header on intake submission, scoped by endpoint. Client creates a new random key when beginning a new logical submission. Retry unchanged data with the same key. If the user changes data after an uncertain outcome, first resolve/replay the original request rather than silently creating duplicates. Use request hashing excluding transient upload URLs; canonical upload IDs are stable.

Newly saved records return 201. A successful replay can return 200 with the same reference and `replayed: true`. 400 malformed JSON; 413 size limit; 415 unsupported content type; 422 validation failure; 409 conflicting idempotency payload/state; 429 rate limit with Retry-After; 503 temporary unavailable persistence or required dependency. Never return internal SQL/storage/provider errors.

Error envelope:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the highlighted fields.",
    "fields": {"eventDate": "Choose today or a future date."},
    "requestId": "opaque-request-reference"
  }
}
```

No endpoint allows public retrieval of another person's submitted details using a reference number. The reference is for support, not an authentication token. Responses and logs must not echo unnecessary personal data.

## POST /api/enquiries

Request keys:

```json
{
  "name": "Example Person",
  "phone": "+<country-code><number>",
  "serviceId": "private-010",
  "eventDate": "YYYY-MM-DD",
  "eventLocation": "Example venue and area",
  "packageId": null,
  "sourceRoute": "/workflow",
  "noticeVersion": "owner-approved-version"
}
```

This is a documentation example; placeholder values are not valid production fixtures. The server resolves the actual current content/notice version and rejects unsupported values; it does not trust a client to assert consent or approval.

Successful response:

```json
{
  "ok": true,
  "reference": "opaque-enquiry-reference",
  "status": "received",
  "replayed": false
}
```

Transaction: validate → claim unique idempotency record → create enquiry → create notification outbox event → complete idempotency result → commit. Two simultaneous matching requests must converge on one saved record; a failed transaction must not strand a completed idempotency key. Response means stored, not scheduled or paid.

## POST /api/upload-sessions

Create a bounded anonymous session for creator work samples. Return session metadata and set a Secure, HttpOnly, SameSite cookie in deployment. Return an anti-CSRF mechanism as appropriate for the chosen framework. Do not return a privileged storage credential.

Proposed session expiry: 24 hours. Proposed signed upload expiry: 10 minutes. Re-authorizing an expired upload must not count duplicate reservations forever; reclaim or reuse reservations transactionally. Rate limits and quotas must cover session creation, authorization, completion, and aggregate reserved bytes to prevent bypass by parallel requests.

## POST /api/uploads/authorize

Request: `kind` (video/photo), `filename`, `byteSize`, `declaredMime`. Session identity comes from the session mechanism, not an arbitrary session ID alone.

Return: opaque `uploadId`, method, signed storage destination, required headers/fields, and expiry. Signed authorization restricts the object key, size, and type wherever the storage API supports it; server completion checks remain mandatory.

## POST /api/uploads/{id}/complete

Verify ownership and object existence. Inspect stored size, actual content type, and allowed content. Queue or perform inspection according to provider capabilities. Return `inspecting`, `ready`, or `rejected`; idempotent completion cannot attach the upload or skip validation. An object that exceeds its authorized size is rejected and scheduled for private cleanup.

## GET /api/uploads/{id}

Session-scoped status only: ID, state, safe filename, progress/inspection message if available, rejection category. Return no permanent media URL. Poll with bounded backoff while inspecting and stop on terminal states; no high-frequency endless polling.

## DELETE /api/uploads/{id}

Session owner may remove an unattached upload and free quota. Reject deletion of attached files through this anonymous endpoint. Mark a deletion state before storage removal so attachment and cleanup cannot race. An expired session cannot retrieve or delete someone else's file by guessing the ID.

## POST /api/creator-applications

Request keys: `name`, `phone`, `email`, `gender`, optional `portfolioUrl`, `deviceModelId`, `locality`, `videoUploadIds`, `photoUploadIds`, `noticeVersion`. Optionality follows finalized field rules. Empty video array is always valid. No uploaded file IDs are required merely because the UI created an upload session; the approved photo rule decides the minimum.

Validate all files are ready, unexpired, owned by this session, correctly typed, within counts, and not attached elsewhere. In one transaction lock eligible upload rows, insert application, attach files, insert outbox event, and finalize idempotency. Cleanup must honor row locks/state transitions and never delete files attached by a concurrent submission.

Return the same saved-reference envelope with `status: received`. Application database failure leaves uploads unbound for retry until expiry. Ingestion success is not creator approval.

## Notifications and staff access

Outbox worker retries transient failures with backoff; after a configured maximum it enters an actionable failure state. Dedupe by outbox ID; if provider supports idempotency, use it. Do not promise exactly-once email transport; ensure the record exists once and notifications are safely retryable.

Notification recipient and provider must be owner-configured. The default message should contain record type/reference and an authenticated back-office link, without attachments or full personal details. This documentation phase sends no messages and provisions no services.

## Retention and data lifecycle

Unattached uploads: proposed 24-hour expiry and scheduled cleanup. Attached applications/enquiries: no invented retention period; owner must choose an operational policy before public collection. Implement deletion across database, files, derivatives, and notification metadata where applicable; document backup retention separately. Retention jobs are operational tasks, not new customer-facing features.

## Minimal meaningful tests

Idempotent replay and simultaneous submission; transaction rollback; failure after commit but before response; outbox notification retry; cross-session file access/attachment rejection; file MIME/size rejection; cleanup versus attach race; optional zero videos; unapproved device rejection; date validation at timezone boundary. UI tests should exercise those outcomes, not merely mirror the component markup.
