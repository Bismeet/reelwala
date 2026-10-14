# Reel Wala: a sculptural story

The user explicitly requested real 3D elements, different artwork for each occasion, and motion inspired by award-winning websites. This document supersedes the repeated SVG event illustration described in doc 17. Business requirements and the single-page override in doc 15 remain authoritative.

## Story and visual direction

The story moves from being present at an occasion, to noticing its details, to choosing the kind of event, to gathering those moments into a portrait reel. Amber metal, teal lacquer, warm ivory and forest surfaces connect the chapters. Each chapter has its own silhouette rather than repeating one picture.

| Chapter | Original geometry | Movement and purpose |
| --- | --- | --- |
| Be present | Portrait frame, twisting solid ribbon, miniature celebration, jewel and orbit | Finite entrance, pointer depth and scroll rotation introduce a world of occasions. |
| Notice the details | Extruded aperture blades, layered lens rings, rear framing structure | Lens layers move together as scrolling brings the details into focus. Vector focus corners reinforce the action. |
| Private events | Tiered cake, balloons and strings, gift, confetti and circular stage | Scroll orbit reveals the dimensional celebration. |
| Corporate events | Extruded star award, pedestal, milestone blocks and orbit | A separate angular sculpture expresses achievement. |
| Cultural events | Double-headed drum, tension strings, sticks, arch and faceted lanterns | A distinct ensemble expresses music and gathering. |
| Make the reel | Three dimensional portrait frames containing the three sculptures | Desktop scroll brings the frames together and rearranges their miniatures into one frame. The timeline gives way to the replay caption. |

The artwork is an abstract interpretation, not customer footage, a client testimonial or evidence of delivered work. The existing client-reel placeholder remains honest about awaiting approved examples.

## Reference evidence

- [Igloo Inc: creators' case study](https://www.awwwards.com/igloo-inc-case-study.html): a unique 3D shape for each project, an intentional camera journey, and browser-based performance iteration informed the approach. No assets or source code were copied.
- [Igloo's 2026 Webby result](https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-visual-design-aesthetic/361001/igloo-inc): verifies its Best Visual Design — Aesthetic award.
- [Lusion's Porsche: Dream Machine](https://lusion.co/projects/porsche_dream_machine/): a sequential transformation reference. This is a CG film, not an interactive website demonstration.
- [Three.js RoomEnvironment](https://threejs.org/docs/pages/RoomEnvironment.html) and [RoundedBoxGeometry](https://threejs.org/docs/pages/RoundedBoxGeometry.html): official implementation references for procedural reflections and rounded geometry.

These references were researched through their published pages and case studies; their live interactions were not browser-tested. The Reel Wala implementation was tested locally in Chrome.

## Implementation and resource lifecycle

- `src/lib/story-models.ts` constructs all geometry locally. Original meshes, ribbons, extrusions, lighting and posters use no downloaded models, HDRs, generated photographs or paid asset packs.
- `src/lib/story-renderer.ts` manages the Three.js scene, procedural room reflection map, camera, lights, finite rendering and disposal. Three.js was already installed. Its bundled MIT notices remain intact.
- `src/components/story/Scene3D.tsx` imports the renderer only when a scene approaches the viewport. Each fixed-size stage renders its unique vector poster first, preventing layout shifts.
- Scroll position follows the shared visual-scroll events from GSAP ScrollSmoother. The desktop edit timeline supplies its scrubbed progress to the renderer. Native touch scrolling retains vertical flow.
- Device resolution is capped at 1.5 on desktop and 1.25 on coarse pointers. Rendering stops after entrance and interpolation settle, pauses outside the viewport, and suspends in hidden tabs. Each scene has one renderer; at most six contexts are mounted on this page.
- ResizeObserver adjusts camera framing. IntersectionObserver controls loading and render activity. Listeners, observers, animation frames, geometry, materials, environment targets and renderer resources are disposed on unmount.
- Reduced motion fixes composition progress and suppresses pointer/scroll movement and pinning. WebGL construction failure or context loss shows the corresponding vector poster. Context restoration resumes rendering.

## Content and verification

All 24 source services, packages, customer/creator forms, intake persistence and same-page links remain in place. No new commercial claims, prices or deliverables were added.

`scripts/verify-story-browser.mjs` checks actual canvas readiness, edit progress, six distinct scene variants, context-loss/restoration behavior, static reduced motion, ordinary content clicks, same-page navigation, service preselection and layouts at 1440, 768, 390 and 360 pixels. It captures screenshots for visual inspection. Typecheck, lint, existing intake tests and optimized build are separate checks; consult the final task report for the executed results.

Headless Chrome verifies functional rendering and composition; it does not substitute for performance profiling on physical low-end phones. The existing public-launch dependencies and approved client footage remain unchanged.
