# Current hero: watch a moment become a reel

## User authority

The user rejected the folding-panel metaphor as unclear. They requested an opening viewport focused on the scene, with headline and booking copy revealed after the scroll animation. They supplied `codex-clipboard-6a1e5421-7d2c-4d46-a3c6-d2707962a7a0.png` as an art reference and explicitly requested original 3D elements rather than displaying the image.

This direction supersedes doc 19. The previous hero component, styles, folded-panel geometry and folded-panel fallback are removed from the runtime. Historical design documents remain as provenance. The original DOCX business requirements and one-page navigation remain authoritative.

## Art and sequence

The scene is one continuous ivory celebration space: two women in teal/amber sarees, a seated guest, a standing guest raising a glass, a cake and flowers on a circular table, and a creator filming on a portrait phone. The current characters use artist-authored anatomical topology, genuine skeletal skinning, detailed hands and fitted garment meshes adapted from MakeHuman's CC0 system assets. Custom native geometry supplies the sari drapes and celebration environment. The architecture includes a curved relief, decorative niches and a gold pendant. The supplied image remains a composition reference; it is never displayed as the hero or phone recording.

The opening contains the 3D scene, existing navigation and a scroll cue. Headline, explanation and hero booking CTA are hidden visually and removed from keyboard interaction until the animation finishes. The header booking link remains available throughout.

1. **Occasion, 0–35%:** the guest raises the glass and friends turn towards them. The phone is held between the creator's hands.
2. **Recording, 35–80%:** a continuous camera movement and phone enlargement bring the recording into view. The creator and surroundings recede as the portrait recording becomes the primary object.
3. **Replay, 80–94%:** the raised-glass action repeats inside the portrait screen. The camera has settled.
4. **Explanation, 94–100%:** “Your events, captured in reels.”, supporting copy, the source service categories, booking link and a working replay button appear. This final interval gives the visitor room to read before normal page flow resumes.

Scrolling up reverses the sequence. The animation follows scroll position; it does not run an endless background loop. The replay button triggers one finite 1.5-second gesture, respecting reduced motion.

## Recording architecture

`celebration-model.ts` assembles the environment, characters, furniture, food, lights and phone. `human-character.ts` fits locally adapted CC0 meshes to a 139-bone skeleton per person. Skinning animates the actual garment and body vertices during the toast; head bones turn the faces. The earlier procedural primitive character builder has been removed.

The phone uses a 768×1344 half-float WebGL render target. Before rendering the main view, the same scene is rendered from a second portrait camera with the creator and phone temporarily hidden. That live render is mapped to the phone screen. The scene in the phone therefore shares the guests, objects and animation with the main view. It is neither the supplied reference nor a pre-rendered image. The recording excludes the phone itself to avoid recursive rendering.

`StoryModel` offers optional camera, pre-render, replay and disposal hooks. The existing renderer manages tone mapping, shadows, resize, intersection visibility, context recovery and finite rendering. The offscreen render target is explicitly disposed. The service sculptures now live in `occasion-model.ts`, without the rejected folded hero.

`CelebrationHero.tsx` provides semantic copy, accessible scene description and anchor actions. `celebration.module.css` owns the composition and delayed text state. `ReplayMoment.tsx` is a keyboard-accessible replay control. The existing ScrollSmoother remains the only desktop smoothing mechanism.

## Responsive and accessibility behavior

Desktop uses one pinned hero with 2,200px of scroll travel. The pre-existing edit study remains the second pin. Touch uses a native CSS sticky stage inside 320svh, with no added scroll transform. Phones place the finished portrait above centred copy. The existing same-page links, services, pricing and intake flows remain intact.

Reduced motion presents the final portrait and all explanatory copy immediately, removes prolonged hero scrolling and hides replay. A distinct vector celebration poster supports WebGL failure; business copy remains visible in that state. The visual canvas and poster are decorative to assistive technology, with a separate text description describing the capture sequence.

## Verification

Use the project typecheck, lint, ten tests and optimized build. The browser script checks the opening copy is hidden, final copy appears, scrolling reverses, replay is actionable, same-page navigation and service preselection work, tablet/phone layouts fit, and reduced motion and actual GPU context recovery remain functional.

Review screenshots at 1440px, 768px, 390px and 360px. Physical low-end phone performance remains unmeasured. The characters are real-time, texture-free anatomical models, rather than a pixel-identical or photorealistic reproduction of the supplied render. Earlier revisions below are retained as history, not current implementation instructions.

Executed on 2026-10-10: typecheck, lint, all eight existing tests, optimized build and one-page HTTP verification passed. The full browser script passed against the development preview. The final optimized preview at port 3000 passed focused checks at 1440px, 768px, 390px and 360px: delayed headline, actual replay gesture restarting and finishing, scroll reversal, overflow and same-page booking. Actual GPU context loss/recovery and the immediate reduced-motion presentation also passed. Opening and finished screenshots were visually reviewed, including the tablet framing correction.

## Character and camera refinement, 2026-10-11

The user requested clearer, better-looking people and reported the phone passing into the table. Heads now use one continuous sculpted cheek/jaw surface, shaped hairlines, swept hair, restrained eye/lip details and smooth skin shading. Bodies use independently shaped shoulder/waist/depth profiles. Rounded tapered limbs overlap at joints, and sculpted hands rest above the tabletop. The foreground creator is larger on desktop and repositioned to fit phones. Lighting preserves more colour and shape, and the recording target retains HDR values rather than clipping highlights.

The phone now first pulls forward into clear space, then translates sideways and enlarges. Its final depth is 4.8 world units; the main camera approaches a target at that depth while staying in front of the table. The fixed portrait recording camera also remains outside the set. `tests/celebration-clearance.test.ts` samples the actual phone/table mesh bounds and both camera positions at 101 scroll positions for four viewport shapes, including the mobile phone pose. This regression test passed. Nine tests, lint and typecheck passed; the full Chrome browser suite also passed with replay, reversal, same-page navigation, mobile layouts, reduced motion and actual GPU recovery.

The optimized build passed. The final port-3000 preview passed desktop/phone smoke checks, including keyboard-triggered replay restarting and finishing, delayed copy, no overflow and no page errors.

## Sculptural art refinement, 2026-10-11

The user rejected the cartoon appearance. This revision replaces the separate ball-shaped nose, white oval eyes, bulky hair locks and exaggerated mouth with continuous facial relief: brow ridges, recessed sockets, a nasal bridge, cheek planes, restrained lips and chin. Heads are narrower in relation to the shoulders and hairstyles have fine surface relief. The figures remain stylised procedural sculptures; they are not photorealistic scanned or professionally modelled humans.

Clothing uses physical fabric materials with muted colours and restrained sheen. Tailored torsos and tapered limbs have tension folds. A continuous swept sleeve removes the creator's segmented elbow. Seated trousers follow the knee continuously. Sari skirts bend over the lap and fall in pleats; the contrasting pallu conforms to the torso and blends into the lap instead of cutting through the body. Hands use smaller tapered fingers. A shirt collar and covered trouser waist refine the foreground creator.

The environment receives a neutral fill and warm rim light. The cake has fine fluted icing rather than large rounded decorations; flowers have thin petals, and drinks are translucent amber rather than solid metallic gold. These changes preserve the same live recording, forward-first phone clearance, scroll phases, delayed copy, replay, one-page business content and intake behavior. No reference images or external character assets are displayed.

The development browser suite passed at desktop, tablet and phone widths, including reverse scrolling, actual replay, service selection, one-page navigation, reduced motion and GPU recovery. Desktop and phone screenshots were reviewed during refinement. Physical low-end-device performance and photorealistic character quality remain outside this verification.

Final validation: typecheck, lint, nine tests and the optimized build passed. The restarted port-3000 preview passed at 1440, 768, 390 and 360px, with delayed copy, keyboard replay restarting and finishing, no horizontal overflow and no browser errors. The final production screenshots were reviewed on desktop, tablet and phone. The production preview remains running at `http://127.0.0.1:3000/`.

## Anatomical mesh replacement and Three.js references, 2026-10-11

The user approved the scene placement, story and scroll animation but rejected the primitive character artwork entirely. They requested inspiration from threejs.org. This revision removes `sculpted-character.ts` and replaces all five figures with real, artist-authored mesh topology. The inspiration is the Three.js skeletal animation and physically lit model examples:

- https://threejs.org/examples/webgl_animation_skinning_blending.html
- https://threejs.org/examples/webgl_loader_gltf.html

`scripts/prepare-human-meshes.py` fits CC0 base geometry, eyes, hairstyles, authored clothes and shoes to adult morphology targets. It transfers the source skin weights to fitted garments, removes covered body faces, retains only used vertices and exports compact, local geometry. No MakeHuman application code or bitmap textures are used. `public/models/ATTRIBUTION.md` records the sources and the distinction between the CC0 assets and MakeHuman's application license. Original assets and headers are retained under `art-source/makehuman/`.

`human-character.ts` builds a full 139-bone skeleton for each person and binds anatomical skin and fitted garments as `SkinnedMesh` objects. Rest positions come from the actual mesh, and poses use bone targets for seated legs, resting hands, the creator's phone hold and the raised glass. Wrist direction is calculated from its actual posed position, preventing a target mismatch from bending the hand backwards. Finger segments curl independently. The glass follows the index-finger base, and head turns deform the original head mesh. Hair, eyelids, nose, ears, jaw, palms and fingers now have authored anatomical topology rather than combined spheres or tapered tubes.

The male suit triangles are split at the waist before export to give the material boundary a continuous edge. Material indices are batched into at most three geometry groups per character mesh, avoiding hundreds of fabric draw calls. Female garments have explicit material groups so array materials render correctly. The sari's pleated lower fabric and narrow, smoothed torso-fitting drape remain native geometry; the shoes are adapted into a low silhouette. Warm muted fabric materials preserve the established teal, amber, ivory and brass palette.

The one-page business content, first viewport, scroll phases, camera positions, live portrait recording, delayed explanation, replay behavior and forward-first phone clearance are preserved. The models are local, texture-free real-time artwork, not photographic scans. No supplied reference image is displayed. Physical low-end-device performance remains unmeasured.

The additional `human-art.test.ts` verifies every person's clothing renders with complete material coverage, bounded material-group counts, normalized skin weights and a genuine gesture that changes body mesh vertices. The existing phone/table clearance regression remains in place. `verify-human-stage.mjs` checks opening/final composition, keyboard replay and overflow at all four target widths. The full development browser suite passed, including one-page navigation, service preselection, scroll reversal, mobile menus, reduced motion and actual GPU context loss/recovery.

Final validation for this replacement: typecheck, lint, all ten tests and the optimized build passed. The restarted production preview passed the focused opening-to-portrait flow at 1440, 768, 390 and 360px, including delayed explanation, keyboard replay restarting and finishing, no horizontal overflow and no runtime errors. Opening and finished screenshots were visually reviewed on desktop, tablet and phone. The optimized preview is running at `http://127.0.0.1:3000/`.
