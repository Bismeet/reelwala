# Component sources and visual enhancements

## Current motion story — 10 October 2026

The user approved the direction in document 16 for implementation. The active homepage now uses original SVG event artwork and GSAP choreography. The former TiltedCard, ContainerScroll and Three.js photo gallery components are retained as historical source but are no longer imported by the homepage. The old generated photographs are not rendered in any homepage section.

- `story/SplitHeading.tsx` adapts the React Bits [Split Text](https://reactbits.dev/text-animations/split-text) font-ready GSAP splitting and stagger approach. It uses React effects and `gsap.matchMedia` rather than introducing `@gsap/react`, adds reduced-motion handling, and reverts only its own split/tween. Registry source is retained in `licences/split-text-registry.json`; its saved-file SHA-256 is in the source record. The existing React Bits license notice applies.
- `story/EventArt.tsx` is original vector artwork, not a borrowed component, stock photograph, or client example. It shares a ribbon, illustrated people, and stage across three occasions.
- `story/StoryMotion.tsx` is original GSAP choreography: capture-frame movement, ribbon-to-frame MorphSVG transformation, service-scene movement, desktop portrait assembly, and the closing underline. Stack-like behavior uses the existing GSAP instance; React Bits Scroll Stack and its Lenis dependency were not installed.
- GSAP SplitText and MorphSVGPlugin are supplied by the already installed GSAP 3.15.0 package and covered by its recorded license. No paid React Bits Pro component was used.
- The existing shadcn/Radix accordion and source-backed forms remain active.

The lower table records the earlier implementation for traceability; it is not a list of components currently rendered on the redesigned homepage.

The user explicitly requested Shopify Editions, React Bits, Aceternity, shadcn, Three.js and other premium-site components on 10 October 2026. The additions retain the existing art direction, source-required pages, business copy and form contracts.

| Source | Implementation | Adaptation |
|---|---|---|
| [Shopify Winter 2026 developer chapter](https://www.shopify.com/editions/winter2026#developer) | Editorial chapters, large serif/sans headings, layered visual narrative | Visual reference only. No Shopify commercial features, artwork, assets or proprietary source copied |
| [React Bits Tilted Card](https://reactbits.dev/components/tilted-card) | `src/components/effects/TiltedCard.tsx`, hero photograph | Upstream motion-value/spring/pointer model; accepts existing image children; 4° tilt; no mobile tooltip; reduced-motion handling |
| [Aceternity Container Scroll Animation](https://ui.aceternity.com/components/container-scroll-animation) | `src/components/effects/ContainerScroll.tsx`, homepage gallery | Upstream perspective/useTransform pattern; displayed-position measurement replaces native useScroll to synchronize with GSAP; CSS modules; 8° rotation; modest scale |
| [shadcn Accordion / Radix](https://ui.shadcn.com/docs/components/radix/accordion) | `src/components/ui/Accordion.tsx`, `BookingQuestions.tsx` | New York registry component structure, Radix semantics/keyboard support; brand CSS; questions use existing documented behaviours |
| [Three.js](https://threejs.org/) | `src/lib/film-scene.ts`, `FilmGallery.tsx` | Original composition of three photographic planes; pointer parallax; capped pixel ratio; lazy import; offscreen pause; resource disposal |
| [GSAP ScrollSmoother](https://gsap.com/docs/v3/Plugins/ScrollSmoother/) | `src/components/effects/SmoothScroll.tsx`, root layout | GSAP 3.15.0 with ScrollTrigger; 0.85-second desktop smoothing; native touch/reduced-motion fallback; focus, hash links, modal pause and route cleanup; visual-scroll bridge for existing animations |

Component registry URLs, retrieval date and SHA-256 hashes are recorded in `docs/licences/source-record.json`. Licence texts/notices are in that directory. These components are adapted within the Reel Wala website, not supplied as a separate component library, template product or marketplace item. No paid templates were purchased.

GSAP is installed from npm at an exact version, with package integrity recorded in `package-lock.json`. Its original source notices remain in the dependency and the local [notice](licences/gsap.txt) points to the GSAP Standard License; it is not described as MIT-licensed.

The memory gallery uses generated illustrative photographs. It does not pretend to play completed client reels. The existing truthful portfolio callout remains below it.

## Performance and fallbacks

- Three.js is imported only when the gallery approaches the viewport on desktop above 900px.
- Reduced-motion settings, touch-sized layouts, data-saving connections and WebGL failures retain the static images.
- Resize/media changes and unmount remove rendering resources, observers, listeners and pending animation frames.
- Renderer draws on changes rather than running a permanent animation loop.
- Pointer tilt is decorative. It introduces no extra keyboard stop or required pointer interaction.
- The accordion uses Radix controls and a visible focus indicator; animations respect reduced motion.
- ScrollSmoother is dynamically imported only for eligible desktop layouts. Disabling motion or moving to a touch layout restores normal document scrolling. Header height changes update its content offset.
- The header, native navigation dialog, skip link and preview badge stay outside the transformed viewport. Modal opening pauses background scroll. CSS sticky form introductions stay in document flow while smoothing is active, allowing tall copy to remain readable.
- The existing hero and gallery use the rendered position. The gallery still uses the Aceternity perspective pattern without a second scroll-smoothing engine.

These enhancements do not resolve open business decisions. Source precedence and the release gates remain intact.
