# The Reel Wala

The latest [document alignment update](docs/21-DOCUMENT-ALIGNMENT.md) provides real Services, Pricing, Testimonials, Workflow and Creator pages alongside the cinematic homepage. The Workflow page groups the customer steps and enquiry form. Creator applications require five photos; edited videos remain optional. Earlier single-page redirect notes describe the previous implementation.

A working private website preview built from the supplied DOCX and the cinematic design handoff. The amber/turquoise palette is supported by warm paper and deep forest tones. Built with Next.js, React and TypeScript, locally served fonts, original Three.js sculptures and vector artwork.

## Run locally

The opening scene now uses 300 supplied cinematic frames. It is pinned for 3.5 viewport heights of scrolling and never plays automatically. Desktop uses the smaller of each original JPG and its WebP version; mobile uses 960-pixel WebP frames. Decoded frame memory is limited to 64 MiB on desktop and 24 MiB on mobile, with four concurrent downloads and two concurrent decodes. Portrait layouts show the complete footage over a blurred background so the phone remains visible. Reduced-motion mode shows the final frame without pinning.

To restore the preserved 3D hero, change `heroMode` from `"sequence"` to `"3d"` in `src/content/hero-mode.ts`. Its code is in `src/features/scene-3d/`, and its assets are in `public/scene-3d/models/`. Other 3D illustrations remain in their original website sections. See [3D scene notes](src/features/scene-3d/README.md).

To prepare a new extracted frame folder, run `node scripts/prepare-cinematic-frames.mjs "C:/path/to/frames"`. The script detects the frame count, sorts filenames numerically and preserves all source JPGs in `public/frames/original/`.

Requires Node.js 22.13+; verified with Node 24.14.0.

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:3000. The server binds to this computer. No cloud account, environment file or API key is required for the private preview.

For the optimized preview, stop the development server and run:

```powershell
npm run build
npm run start
```

Keep `APP_ENV=preview`. Next’s production build mode is separate from public business release. `.env.example` documents optional settings.

## Included

- One continuous page with Services (all 24 entries), Pricing, Testimonials, How It Works, customer enquiry and Become a Creator/application sections.
- Header and footer links scroll within that page; service/package choices fill the enquiry in place.
- Expandable privacy/terms/status notices on the same page, compatibility redirects for old URLs and a custom missing-page experience.
- An original 3D celebration hero: guests share a toast while a creator films them; the camera follows the phone into a live portrait recording, and the headline appears after the animation. Refined service sculptures, an assembling lens and a separate edit study extend the story.
- A React Bits Split Text adaptation, GSAP scene choreography and shadcn/Radix booking accordion.
- GSAP ScrollSmoother for desktop scrolling, with native touch and reduced-motion fallbacks.
- Customer enquiries and creator applications saved in durable embedded PostgreSQL under `.data/postgres`.
- Private uploads under `.data/uploads`, with signed sessions, format/byte validation, progress, removal and retries.
- Atomic intake/outbox writes, safe replay, responsive navigation and accessible form states.

The active page lazily loads Three.js geometry with procedural lighting and no remote models, textures or photographs. Every chapter has a distinct SVG poster if WebGL fails. Desktop has a pinned hero and a separate pinned edit study; touch uses a native sticky hero with normal vertical flow elsewhere. Reduced motion presents static 3D compositions. Rendering pauses offscreen and in hidden tabs; movement is finite, pointer-responsive or scroll-driven. The hero phone contains a live second-camera render of the same geometry, with a working finite replay control.

GSAP smoothing activates above 900px with a fine pointer and hover support. It keeps the native scrollbar and uses a 0.85-second catch-up. The story initializes after the scrolling system and preserves direct anchor alignment when its pin spacing is created. Header/menu/badge remain outside the transformed content. Native touch scrolling and reduced-motion preferences are preserved.

## Review local submissions

Stop the website server first: embedded PostgreSQL uses one process at a time.

```powershell
npm run intake:list
npm run intake:list -- --details
npm run intake:cleanup
```

The default listing prints references/statuses. `--details` intentionally prints stored form data and attached-file IDs for the local operator. Files have no public download endpoint. Cleanup removes expired unattached files and preserves attached application files. Run it regularly during testing; cleanup is not scheduled automatically.

`.data` contains private/test data and the signing secret. Environment files and runtime/build directories are ignored. Do not commit or share `.data`. QA entries are named Preview/Browser/HTTP Tester and use `.test` emails.

## Verification

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

With the server running, `node scripts/verify-http.mjs` checks private photo uploads, session ownership, inspection, attachment, safe retries, spoofed-file rejection and origin/field validation. It creates clearly named local test records. A generated MP4 fixture was also exercised through the browser.

`node scripts/verify-one-page.mjs` checks the consolidated page, anchor targets, field/label IDs, full service inventory, package presets, old-URL redirects and homepage enquiry persistence. It also creates one named QA enquiry.

Read [implementation status](docs/13-IMPLEMENTATION-STATUS.md), the [single-page update](docs/15-SINGLE-PAGE-UPDATE.md) and [component provenance](docs/14-COMPONENT-PROVENANCE.md) for verification, navigation and source/licence records.

The new direction is specified in [the motion storyboard](docs/16-MOTION-STORYBOARD.md), with the current hero specified in [the celebration hero update](docs/20-CELEBRATION-HERO.md). Docs 17–19 retain the earlier vector, sculpture and folding-panel iterations. `scripts/verify-story-browser.mjs` runs the motion/navigation and responsive browser checks with Playwright and Chrome. Set `PREVIEW_ORIGIN` to the server URL (default port 3001) and optionally `PLAYWRIGHT_MODULE` to an installed Playwright module URL. Review screenshots are saved in the ignored `output/story-review` directory.

## Source and live launch

The original [handoff](docs/00-START-HERE.md), [requirements](docs/01-REQUIREMENTS.md), [decision register](docs/11-DECISIONS.md) and [reference evidence](docs/references/README.md) remain the business authority. Written DOCX changes take precedence over screenshots. The original documentation-only ZIP is preserved as a historical handoff.

This build is not publicly deployed. Screenshot-derived prices and disputed timing/eligibility rules remain labelled preview details. No real client reels, testimonials, final logo or business contacts were supplied. Generated scenes are labelled illustrative.

Public intake is disabled. Release requires approved business content, accurate policies, managed private storage, authenticated staff review and a notification provider/destination. The local outbox queues records; it does not send email or WhatsApp. The optional managed PostgreSQL adapter has not been tested against a live database. `RELEASE_APPROVED` alone does not enable production intake.
