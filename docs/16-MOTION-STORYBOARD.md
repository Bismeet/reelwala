# Reel Wala — proposed motion story

Date: 10 October 2026. Status: research and creative proposal; not implemented or approved final artwork.

**Subsequent update:** the user approved building this direction. The original proposal is retained below; [document 17](17-MOTION-IMPLEMENTATION.md) describes the implementation and its actual behavior.

The latest request is to brainstorm the story and transitions before rebuilding. The user rejects the current photographs as the visual foundation and wants a more ambitious animated experience. This document proposes a replacement for the photo-led direction in document 02. It does not change the business requirements, approve unresolved claims, or replace the single-page requirement in document 15.

## Recommendation

**You live it. We reel it.**

Make the page tell the story of an occasion becoming a memory someone can replay. Follow one amber ribbon as it becomes a capture frame, an editing timeline, a portrait reel border, and finally the underline of the enquiry invitation. Each transformation should visibly inherit something from the preceding scene.

The customer supplies the emotional story; Reel Wala supplies the attentive eye and the edit. A visitor should understand that this is a service for filming events within the first screen. Keep an immediate explanatory sentence and a working Book a Shoot action beside the opening composition.

The visual world is an original, dimensional event stage: sculptural ribbons, layered illustrated people, stage lights, confetti, deliberate shadows, and bold typography. Use limited 3D geometry and custom vector animation. Existing generated wedding, corporate, and festival photographs are excluded from this proposed art direction. Artwork is illustrative; it cannot stand in for evidence of client work.

## Diagnosis

The existing implementation has separate photo compositions with tilt, parallax, and entrance effects. Its transitions do not establish a cause-and-effect relationship between sections. The proposed redesign needs a recognizable event, an action performed by the creator, and a visible result. Increasing the number of effects alone will not supply those elements.

## Research and transferable ideas

Research used official pages, the React Bits catalog and registry source, and first-person creator case studies. Live motion playback was not available in this session. The choreography below is an original proposal rather than a claim about the exact animation sequence on any reference site.

| Reference | Verified basis | Proposed application |
|---|---|---|
| [Shopify Winter 2026](https://www.shopify.com/editions/winter2026) | The Renaissance edition organizes product updates into named chapters with an overarching theme. | Give every chapter the same visual world, material language, and recurring object. Retain clear section navigation. |
| [Lusion: My Little Storybook](https://lusion.co/projects/my_little_story_book/) | Lusion describes original 3D assets combined with hand-drawn artwork in a WebGL environment. | Develop a compact illustrated event world with depth and intentional compositions. Original asset design is part of the work. |
| [Crosswire, by Unseen Studio](https://tympanus.net/codrops/2023/04/04/case-study-crosswire/) | Its creators used repeated brand-derived forms and a 3D environment to explain the service. | Let one capture frame and ribbon perform meaningful actions throughout the journey. |
| [Jitter's redesign](https://tympanus.net/codrops/2025/09/02/a-behind-the-scenes-look-at-the-new-jitter-website/) | The team describes prototyping motion and building responsive transitions with React and GSAP. | Prototype scene continuity before polishing assets. Keep useful content and controls easy to reach. |

These are references for different design principles; there is no evidence that these sites use React Bits. Do not copy their assets, layouts, characters, or distinctive identity.

## Directions considered

1. **The living edit — recommended.** An occasion becomes a reel in front of the visitor. Closely connected to what the business does; supports strong transitions and the full service range.
2. **A miniature celebration world.** A camera travels through event dioramas. Visually rich, but requires more bespoke assets and can overemphasize the setting at the expense of the service. Use a compact version inside the recommended opening.
3. **A kinetic type performance.** Words, rhythm, masks, and graphic cuts carry the entire site. Lightweight and distinctive, but needs recognizable event elements to communicate the human service. Use it for transitions and headlines within the recommended direction.

## Storyboard: one continuous page

### 1. Enter the occasion — home

**Proposed headline:** “You live it.”

First frame: warm ivory, oversized dark type, an illustrated gathering arranged around a broad curved amber ribbon. A pair of adult figures dance, another raises a hand in celebration, and a small stage establishes the event setting. Keep faces and gestures intentionally stylized. The composition feels like a crafted title sequence. It must not resemble a row of feature icons.

On initial entry, the heading settles once and the ribbon makes one short sweep. On scroll, the scene gains depth: foreground ribbon moves past the viewer, people remain legible in the middle, and the stage recedes. The text moves aside while the ribbon straightens into four viewfinder corners.

Destination: those same corners surround a detail of the gathering. The visitor has moved from participating in the event to seeing what the creator notices.

Mechanism: custom layered SVG/CSS or Three.js stage, GSAP choreography, React Bits Split Text for the short heading. No loading gate or compulsory intro playback.

### 2. The creator notices — story

**Proposed headline:** “We catch the moments inside it.”

The wide event scene remains visible. The capture frame isolates a dancing gesture, a raised hand, and a shared reaction in sequence. Each selected detail becomes a clean portrait tile; the rest of the scene falls slightly out of focus. Captions such as “the dance,” “the cheer,” and “the little reactions” explain the selection.

Do not require hovering to reveal meaning. Pointer focus can add a small optional response. Clicking ordinary art or headings does nothing; the scroll controls the sequence.

Destination: three selected tiles align around the capture frame and establish the next three service worlds.

Mechanism: custom masks, modest focus shifts, GSAP layout transitions. Shape Blur is a candidate for a decorative frame treatment after a visual test; its stock pointer effect does not implement this whole scene.

### 3. Recognize your occasion — services

**Proposed headline:** “Your people. Your kind of occasion.”

Three large vertical chapters share the same stage and camera frame:

- Private events: rounded stage edge, flowing ribbon, intimate celebration gestures; amber dominates.
- Corporate events: the same edge straightens into a podium, a hand raises an award, and a pair of lights converge; teal and ivory dominate.
- Social and cultural events: podium panels unfold into a performance stage, the ribbon becomes a rhythm line, and the illustrated ensemble widens; amber and turquoise meet.

This is an original geometric transition between scenes, not a stock image morph. Each group has its actual label and the full source-backed service list in ordinary readable HTML. Preserve all 24 entries, including overlaps. Desktop can hold the stage briefly beside the lists; mobile uses three consecutive compact scenes. No carousel hides the service inventory.

Destination: the stage's lower edge straightens into an editing timeline. The previously selected portrait tiles settle above it.

### 4. See the edit take shape — work

**Proposed headline:** “A little rhythm. A story worth replaying.”

This is the signature transformation. Selected illustrated moments arrange into a strip. An amber playhead crosses it; the tiles shorten, align, and stack into one upright 9:16 composition. Typography and a simple rhythm graphic synchronize visually. The final frame briefly replays the same gestures the visitor saw in the opening.

The illustrative edit explains the service; it is not displayed as a finished client reel. Label the demonstration naturally. Do not show a fake video player with an inert play button. When genuine, approved footage becomes available, a separate playable work example can follow within this section.

Mechanism: bespoke GSAP sequence for the strip-to-portrait transformation. A stack effect can help with the middle stage, but the transition needs custom choreography. Keep the complete feature short enough to understand without several screens of scrubbing. Set a provisional desktop pin budget of 1–1.5 viewport heights and evaluate it in the prototype.

Destination: the completed portrait frame moves to the side of the process explanation. The playhead continues as its progress line.

### 5. Understand the practical steps — how it works and pricing

**Proposed transition line:** “Your occasion, taken care of.”

The visual tempo settles. Show the full existing three-step customer workflow with the ribbon connecting the numbered steps. Preserve the source-backed copy and delivery qualifications. A heading reveal and short line draw are sufficient.

Packages follow in a stable comparison layout on ivory. Their descriptions stay still while being read. Retain existing source precedence and provisional markings; new animation must not imply approval of package names, prices, tax treatment, or delivery timing.

Package selection should fill the enquiry on this page and preserve all other entered fields. Testimonials retain their truthful state until approved material is supplied.

### 6. Invite the next occasion — enquiry

**Proposed headline above the required booking block:** “What are we capturing next?”

The amber border opens and becomes a single underline beneath the question. An empty frame suggests the visitor's future occasion. This is a visual callback to the opening and a clear ending to the story.

The form sits on a calm surface with stable controls. Preserve the supplied booking heading and paragraph exactly where required, field contracts, validation, loading, errors, retry behavior, and success state. Animation does not move the form or delay input.

### 7. A creator's perspective — creator application and footer

**Proposed headline:** “Have an eye for the moment?”

A short focus-frame motif introduces the source-backed four steps: Register, Attend Workshop, Receive Shoots, Get Paid After Shoots. Application, uploads, notices, and footer remain on the same page. Do not restart the main cinematic sequence here.

## React Bits selection

Component behavior was checked against the [official catalog](https://reactbits.dev/llms.txt). Registry metadata was also read for the four candidates below. Versions are observations on the research date, not instructions to replace the project's installed dependency versions.

| Candidate | Specific use | Integration decision |
|---|---|---|
| [Split Text](https://reactbits.dev/text-animations/split-text) | Short headline entrances | Registry uses GSAP and ScrollTrigger. Adapt to existing motion preferences and cleanup. |
| [Scroll Stack](https://reactbits.dev/components/scroll-stack) | Selected moments gather into the edit | Registry includes Lenis. Recreate/adapt its stacking behavior under the existing GSAP scroll owner; do not initialize a second smoother. |
| [Scroll Velocity](https://reactbits.dev/text-animations/scroll-velocity) | One brief rhythm-led typographic transition | Registry uses Motion scroll hooks. Synchronize with displayed scroll position or implement this small behavior in GSAP. |
| [Shape Blur](https://reactbits.dev/animations/shape-blur) | Optional lens-like response around decorative frame | Restrict to one motif; essential content remains readable without pointer interaction. |

The signature scene transitions are custom work. React Bits provides useful individual effects, not an assembled narrative or a replacement for art direction.

Effects from the supplied screenshot to leave out of this concept: Dither Veil still depends on compelling imagery; Shredder and Paper Crumple imply destruction; Electric Logo suggests a different visual tone; a repeated gallery would return us to the rejected photo treatment. These are choices for this story, not judgments about component quality.

Inspect and retain applicable source notices when adapting code. Existing provenance records remain authoritative for components already present. This research adds no paid component dependency.

## Palette and material direction

| Role | Color | Use |
|---|---|---|
| Emotional thread | `#F59E0B` | Ribbon, light, primary actions, key word emphasis |
| Sharp accent | `#0BF5E2` | Capture lock, editing marker, restrained cultural-scene detail |
| Warm material | `#AF8C51` | Shading and quiet decorative detail; not small body text |
| Supporting color | `#07AC9F` | Stage geometry and larger colored surfaces |
| Light foundation | `#FFF9EF` | Opening space, service information, packages and forms |
| Dark foundation | `#102B27` | Capture/edit stage and high-contrast transitions |

Proposed overall pacing: light opening → deeper capture world → alternating service moods → dark edit stage → light practical content. Keep turquoise sparse enough to signal attention. Avoid adding gradients or glow without a lighting or focus purpose. Check actual text/background contrast during implementation.

Use large, confident sans-serif headlines and reserve the existing serif for a few emotional words. Change typography through scale, spacing, and composition before adding another font family. Keep body copy comfortably readable.

## Motion and navigation architecture for a later build

- Keep the existing semantic sections and stable anchors from document 15. Everything belongs to `/`.
- Header navigation, Explore, How It Works, pricing, enquiry, and creator links scroll to those anchors. They must work when the user skips any preceding scene.
- Give GSAP sole ownership of smooth scrolling and the major scene progress. Decorative effects must not install competing wheel handlers or smoothers.
- Define stable end states for every chapter. Direct hash loads, refresh, resize, backward scrolling, and browser history must land on a readable state without replaying earlier chapters.
- Keep text, lists, controls, and forms in HTML. Put decorative art in a separate pointer-transparent layer, with only explicit controls accepting clicks.
- Restrict persistent canvas rendering to the active story area. Use one shared canvas if 3D proves useful; layered SVG is sufficient for much of the composition. Do not place each section in its own constantly rendering canvas.
- Header, menu, skip link, and status UI remain outside the smoother's transformed content, consistent with the current layout.
- Respect reduced motion with composed static scenes and native scrolling. Touch devices retain vertical document flow, shorter transitions, and no pinned camera journey. A motion pause control is required if any optional long-running loop survives prototyping.
- Default to silent. Any later sound treatment requires an explicit user control and must not carry essential information.
- Preserve the existing focus-jump correction, form IDs, in-page selection, storage/API behavior, and legacy anchor redirects.

## Assets to design before a full rebuild

1. A recognizable capture frame and amber ribbon, with a consistent shape and material across all states.
2. One small family of original illustrated event figures with a few clear adult gestures. Do not use identifiable real people or fake client branding.
3. Three stage compositions sharing reusable geometry, lighting, and illustration style.
4. Three animated detail tiles and their final portrait arrangement, derived from those same scenes.
5. Three composed static states for mobile/reduced motion/WebGL fallback.
6. A separate slot for actual approved footage; no invented client examples or testimonials.

Start with art-directed style frames for the opening, capture, and final edit. A generic collection of glowing shapes would fail this brief even if technically smooth. Approve the visual quality through reviewable artifacts before investing in all downstream scenes.

## Suggested implementation sequence after the brainstorming stage

1. Produce the three key style frames and a rough animation of the capture-frame-to-reel transformation.
2. Validate the vertical navigation and mobile alternative using simple geometry.
3. Build the shared stage and its reusable assets, then connect the story states.
4. Integrate all business sections and preserve their data and form behavior.
5. Inspect desktop and mobile playback, rapid scrolling, direct anchor loads, keyboard flow, reduced motion, and failed-WebGL behavior in a real browser.
6. Run the existing checks and the single-page regression script. Evaluate frame pacing on a midrange mobile device before calling the animation complete.

Success means the visitor can explain the service after the opening, recognize their occasion, understand the creator's contribution through the edit sequence, and reach the enquiry at any time. The same visual story should remain understandable when motion is disabled.
