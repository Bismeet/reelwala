# Motion story implementation

Implemented 10 October 2026 after the user approved the direction in [document 16](16-MOTION-STORYBOARD.md). This is the current visual implementation; older descriptions of the photographic hero and gallery are historical.

## Experience

- A warm-paper opening with “You live it.”, a split-text entrance, an original illustrated event stage and “We reel it.”
- A dark capture chapter: the viewfinder explores the scene, detail cards emerge, and the amber ribbon morphs into a portrait frame using GSAP MorphSVG.
- Three illustrated service chapters with the complete 24-entry source inventory. The same figures, ribbon and stage establish continuity; corporate and cultural scenes have their own backdrop/props and color treatment.
- A desktop edit sequence gathers three illustrated portrait compositions into one central reel-shaped stack. There is a single 700px scroll pin, followed by the normal document flow.
- A calm process/package section, a large enquiry invitation with a drawn amber underline, the original booking content and both working forms.
- A focus-frame motif for the creator invitation. No generated photographs are rendered on the active homepage.

The scene artwork is original SVG, so this version does not need WebGL, additional image downloads, or a continuously running rendering loop. These are illustrative scenes, not purported client reels. Approved client footage and testimonials remain outstanding content dependencies.

## Implementation boundaries

`src/components/story/EventArt.tsx` contains reusable art; `Narrative.tsx` composes the storytelling sections; `SplitHeading.tsx` adapts React Bits Split Text; `StoryMotion.tsx` owns the scroll-driven choreography. Section content is server-rendered, with client enhancement around it.

GSAP remains the only smooth-scroll owner. React Bits Scroll Stack/Lenis was not added. Story animation waits for `SmoothScroll` to announce readiness, then refreshes geometry. Initial deep links are reconciled after fonts and pin spacing settle; user interaction cancels the startup alignment. Media changes and unmount revert the owned effects. The established focus guard prevents ordinary content clicks from centering the page's main landmark.

Touch layouts use native vertical scrolling without the desktop edit pin. Reduced motion removes scroll animation and leaves all content visible. The full story is also readable if the animation modules fail to load. No soundtrack or forced playback was introduced.

The single-page anchors, 24 service choices, three package selections, unique form IDs, enquiry state, API contracts, local persistence and compatibility redirects are retained. The business decision register remains authoritative; animation does not approve provisional prices, delivery timings or eligibility rules.

## Verification

- TypeScript, ESLint, eight existing tests, and the optimized Next.js build passed during implementation.
- `scripts/verify-one-page.mjs` passed: root sections, one H1/two forms, unique IDs/labels, same-page links, complete service/package selections, redirects, query preservation, and saved/replayed enquiry.
- Browser checks use real headless Chrome through Playwright, with screenshots under the ignored `output/story-review` directory. Desktop, 768px tablet, 390px phone and 360px phone layouts were inspected. The normal desktop viewport is 1440 × 1000; direct-link checks also use 1440 × 900.
- The browser script covers ordinary-heading click stability, section navigation, service-to-enquiry selection, mobile menus and anchor offsets, horizontal overflow, and reduced motion. It additionally checks the desktop edit's separate/assembled positions, direct enquiry links after pin creation, and changing reduced-motion preferences while the page is open.
- Review found and fixed a tablet illustration overlapping the booking action. Mobile long-distance native scrolling was allowed to settle before asserting anchor positions. Optimized-build review also exposed an initial deep-link timing issue, addressed in `SmoothScroll`.
- The final browser run against the optimized port-3000 build passed every assertion with no page errors. The separate-to-assembled reel transition, direct enquiry link, and live reduced-motion changes passed. Three additional fresh direct-enquiry loads aligned consistently below the header; the direct privacy link opened its disclosure and aligned correctly.

The optimized preview uses `http://127.0.0.1:3000/`. No public deployment or external notification service is configured.
