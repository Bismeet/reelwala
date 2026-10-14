# Unfold the moment: current hero

The user supplied four images and explicitly asked to use them only as references, recreating the elements in 3D/React with smooth scroll animation. This update supersedes the ribbon-and-frame hero described in doc 18. No supplied image is displayed, used as a texture, downloaded, or embedded in the website.

## Visual interpretation

The three-panel event compositions inform the overall geometry and scene subjects. The dark film-strip reference informs the final perforated portrait frame, metallic edges, silk gestures and restrained palette. The implemented hero uses a warm ivory environment for continuity with the existing site, with deep jade surfaces, champagne brass, ivory ceramic, teal fabric and warm lantern light.

All shapes are original procedural geometry. The result is an interpretation of the references, not a pixel-for-pixel photographic reproduction.

## The scroll story

1. **Be present, 0–30%:** three partially folded panels introduce a floral celebration, a sculpted milestone award, and a drum-and-lantern gathering. The booking link is immediately available.
2. **Unfold the moment, 30–75%:** the hinged panels open in depth. Vector-like 3D focus corners sweep across the scenes, the camera moves closer, and supporting copy changes to noticing the feeling inside the moments.
3. **Feel it again, 75–100%:** the side panels fold inward; a perforated portrait film frame emerges, containing rings, fabric, an award and a lantern. The final caption describes keeping the memory. Scrolling upward reverses the whole sequence.

The desktop hero occupies one viewport below the header, with 1,500px of pinned scroll travel. The existing edit study remains a second, independent pin. Navigation anchors account for both pin spacers and continue to resolve to sections on the same page.

Touch layouts use native scrolling and a CSS sticky stage inside a 170svh section. The sculpture sits below the headline and booking action on phones. Reduced motion removes the prolonged section and pinning, and presents an open, static 3D composition.

## Architecture

- `src/components/story/UnfoldHero.tsx` contains semantic text, booking link, the three phase captions and progress labels.
- `src/components/story/unfold.module.css` handles the dedicated desktop, tablet and phone composition. Hero styling is independent of the historical hero classes.
- `src/lib/unfold-model.ts` constructs the panels, hinge barrels, rails, arches, sampled fabric surfaces, cake flowers, lamps and ribs, curved drum body and strings, sculpted award, and film edge with actual cut-outs.
- `src/lib/story-models.ts` delegates the hero and the three service sculptures to this refined geometry. Capture and edit retain their independent compositions.
- `src/components/story/StoryMotion.tsx` supplies scrubbed progress and phase changes. The existing ScrollSmoother remains the only desktop scrolling transform.
- `src/lib/story-renderer.ts` interpolates progress, adjusts the camera, renders reflections and soft hero shadows, and manages loading, resizing, context loss and disposal. Reflection resources are regenerated after GPU context restoration.

The supplied references are not runtime dependencies. Fonts are local. No new package, remote model, photograph or texture service is required. All 24 service choices, package details, intake forms, persistence and same-page navigation remain intact.

## Verification and practical limits

The browser verification script checks two desktop pins, initial/open/replay hero states, smooth reversal, mobile unfolding, same-page navigation, service preselection, reduced motion, and real WebGL context loss/restoration. Screenshots are saved under the ignored `output/story-review` folder for visual inspection.

Typecheck, lint, eight existing intake/focus tests, optimized build and one-page HTTP verification remain required. Refer to the final task report for completed results. Browser testing uses Chrome on this computer; performance on physical low-end phones has not been measured. Approved customer reels and other existing public-release dependencies remain unchanged.

Executed on 2026-10-10: typecheck, lint, all eight tests, optimized build, the full story browser script against the optimized server, and one-page HTTP verification passed. The browser run included actual GPU context loss and recovery. Desktop, tablet, 390px and 360px screenshots were reviewed. A final spacing adjustment reserves room for the preview badge below the phone story labels.
