# Asset production and sourcing brief

## What exists now

The DOCX and its ten embedded screenshots are preserved in [references](references/README.md). They are private planning references with another brand's artwork and interface. No logo, original event footage, customer portfolio, testimonial, brand photograph, or final illustration has been supplied. This handoff does not claim that production assets exist.

Do not publish reference screenshots or extract their photos for public website use. Shopify is a quality/storytelling reference, not an asset source. Creator application uploads are private submissions and must not automatically become public portfolio examples.

## Asset manifest

| ID | Purpose | Needed material | Minimum practical variants | Publication requirement |
|---|---|---|---|---|
| A01 | Wordmark/logo | Owner logo or proposed clean text wordmark | SVG where available, accessible text fallback | Owner approval for final identity |
| A02 | Hero scene | A strong human event still with controlled negative space | Wide desktop and intentional mobile crop | Licensed/approved use; accurate representation |
| A03 | Hero details | 2–3 crops from A02's same event | Portrait crops with focal-point metadata | Same rights as source footage/still |
| A04 | Signature result | Finished reel corresponding to A02/A03 | 9:16 video, poster, caption track if needed | Actual approved work for public portfolio claim |
| A05 | Private chapter | Candid private celebration coverage | Wide and portrait still, optional reel | Approved material |
| A06 | Corporate chapter | Team/launch/achievement coverage | Wide and portrait still, optional reel | Approved material and identifiable-brand permission as needed |
| A07 | Cultural chapter | Performance/community atmosphere | Wide and portrait still, optional reel | Approved material; correct event labelling |
| A08 | Work gallery | 3–6 selected real samples | Poster + video + accurate caption each | Permission and source evidence |
| A09 | Creator story | Creator at work or original illustration | Wide + mobile crop | Do not imply pictured person is on staff without evidence |
| A10 | Testimonials | Exact quotes and optional portraits | Text records first | Explicit publication approval |
| A11 | Social preview | Branded 1200×630 composition | Static image, descriptive alt metadata | Approved public assets only |
| A12 | Small identity assets | Favicon/app icon | Appropriate SVG/PNG variants | Match approved identity |

## Hero shot selection

Choose one occasion with a readable focal moment: someone turning toward a friend, a group reacting, a couple laughing, a performer acknowledging the crowd. Avoid an image so crowded that text needs an opaque box over the main subject.

Capture/select a wider establishing view, close reaction details, and a finished reel from the same occasion. The visual story should be truthful: those details belong to the scene they emerge from. If that asset relationship is unavailable, simplify to a strong static hero and independent labelled work gallery rather than manufacturing continuity.

Private events should not become exclusively weddings; corporate and cultural material must be visible in the overall site. Avoid introducing camera drones or professional cinema rigs as evidence of included equipment when the service brief does not specify them.

## Proposed art brief for illustrative preview only

An original editorial scene of a contemporary Indian celebration, natural expressions, warm amber light, restrained teal details, convincing fabric and skin texture, intentional space for website text, no embedded words or logos, and a composition that crops well to mobile. Separate foreground detail crops are optional. This is a prompt direction, not an instruction to generate assets in the documentation phase.

Generated or stock imagery may support an illustrative brand scene after approval. It cannot prove client experience, create fake testimonials, or substitute for authentic finished work under “Our Work.” Maintain an internal field distinguishing `client-work`, `licensed-editorial`, and `illustration` and disclose illustrative examples where a visitor could mistake them for real results.

## Media preparation

- Still masters: keep original high-quality files privately, export responsive AVIF/WebP/JPEG as compatible with the implementation.
- Hero derivative target: roughly 200–400 KB at an appropriate wide display size, with a smaller mobile derivative; optimize against actual quality.
- Work posters: aim around 80–180 KB; reserve dimensions to avoid layout shift.
- Videos: short optional preview loop only where worthwhile; full reel loaded on user intent. Supply broadly playable web encoding, poster, duration, and captions for important speech.
- All video starts muted unless the user explicitly starts audible playback. Never autoplay several full-resolution reels.
- Store focal coordinates and alternate mobile crops. Do not stretch a landscape image into a portrait frame.
- Preserve accessible text around visually expressive images. Decorative duplicates use empty alt text; meaningful work gets concise descriptive alt text.
- Do not embed copy into hero art; live text must remain readable, responsive, and selectable.

These budgets are proposed targets, not measured current asset sizes. Verify image quality and video playback on actual devices during implementation.

## Rights and provenance record

For each asset record ID, filename, source, creator/owner, allowed use, approval status/date, type of material, relevant subject/publication permissions, caption/alt text, focal points, and variants. Store documentary evidence privately and expose only public-safe attribution where required.

Never publish a private event subject, submitted creator portfolio, or recognizable client logo just because a file was available in a folder. The coding agent should use marked preview placeholders while obtaining approved public material.

## Delivery structure for future assets

```text
asset-master/          private originals and approvals, outside public web root
public/approved-media/
  hero/
  services/private/
  services/corporate/
  services/social-cultural/
  work/
  creator/
  identity/
```

Use descriptive IDs rather than names containing customer contact information. Do not create these production asset folders merely to imply completion; create them when actual approved assets are prepared.
