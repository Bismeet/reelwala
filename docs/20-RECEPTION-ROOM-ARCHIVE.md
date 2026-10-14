# Reception hero: imported assets

This revision replaces the previous MakeHuman geometry and procedural furnishings. Historical decisions are archived in `20-CELEBRATION-HERO-PREVIOUS.md`. The original business requirements and one-page navigation remain authoritative.

## Composition

A round wooden table, upholstered dining chairs, a lounge corner, potted plants, cake, ceramic vases and hanging lamps create one reception. Ivory architecture and a muted green arched recess frame the gathering. Furniture, foliage and characters use finished, locally hosted 3D assets with authored textures. No new human mesh or clothing is generated in code.

The gathering uses Kana, a CC BY character by ddd, plus Microsoft Rocketbox's MIT-licensed guests. The foreground operator is seen from behind. The downloaded characters retain their existing clothing; they do not reproduce the traditional outfits in the original reference image.

## Sequence

The first viewport presents a full-height scene and scroll cue. Navigation is hidden and inert until the recording/replay transition completes at phase 3 (94% scroll progress), when the headline and booking action also appear. Scrolling backwards hides navigation again. Reduced motion and graphics fallback keep navigation available. Scroll advances an authored conversation gesture and approaches the phone. The phone first releases sideways away from the operator, then moves forward, then grows into the final composition. Its screen renders the same reception through a second camera. Upward scroll reverses the sequence. Replay is finite; reduced motion uses the final composition.

## Room depth refinement (2026-10-12)

The arch has a 1.7-unit reveal with a recessed green backdrop and a brass edge. Timber wings use one instanced mesh for 56 ribs. A sideboard, original brass candleholders and glassware join the existing furniture and plants, with an oval rug defining the gathering. Added models retain their authored geometry and materials. There are now 16 active GLBs; three additional assets total 3,207,864 bytes. Credit and source links are in the public attribution file.

The environment lighting is stronger and the cached shadow map is 2048 pixels for fine-pointer devices and 1024 for coarse-pointer devices. The offscreen phone capture still reuses unchanged frames. Final phone scale and height account for the revealed header, avoiding the previous top-edge occlusion. Four-width browser checks verify full-screen opening, hidden/inert navigation, revealed navigation, delayed copy, replay and overflow. The complete browser suite also passed menus, direct section links, reduced motion and GPU context restoration.

## Clearance and rendering revision (2026-10-12)

Dining chairs, seated guests, lounge furniture and plants have separate clearance. The standing guest is behind the table throughout the authored gesture. The released phone stays outside the operator and table. A browser geometry audit checked 101 scroll positions at each of four widths, using actual imported model bounds.

WebGL requests the high-performance GPU preference; the browser selects the actual device. Pixel ratio is capped at 1 on coarse-pointer devices and 1.25 otherwise. The phone capture is 320 × 560 on small screens and 512 × 896 otherwise. The recorded view and PCF shadow map update when the gesture changes, on resizing and after context restoration; phone movement reuses the existing capture. Idle hero pointer movement no longer schedules frames. The unused flower asset is no longer requested (13 active GLBs). The external shadow receiver was removed to prevent stale scene shadows after the reception disappears.

Typecheck, lint and 11 tests pass, including a recording-cache regression. Browser checks passed navigation, replay, reduced motion, graphics context recovery and four viewport sizes. An idle-pointer check confirmed no additional phone captures. Physical low-end mobile GPU frame rates have not been measured.

## Implementation

`reception-assets.ts` loads GLBs with Meshopt decoding, clones skeletons, normalizes asset placement and releases resources. `celebration-model.ts` assembles the reception and controls the phone/cameras. `story-renderer.ts` keeps the fallback visible until the required models load. All assets are local: runtime rendering does not request external model hosts.

Source models and metadata remain in `art-source/`. Optimized GLBs with embedded textures live in `public/models/reception/`. Credits, sources, licenses and modifications are recorded in `public/models/ATTRIBUTION.md`. User reference images are not rendered in the scene.

## Validation contract

Check GLB geometry/textures and total transfer budget; check phone/table clearance across the complete scroll range and multiple aspect ratios. Run typecheck, lint, tests and production build. Visually review desktop, tablet, 390 px and 360 px, including opening/end state, keyboard replay, reversal, navigation, reduced motion and GPU context recovery. Desktop browser checks do not measure physical low-end mobile GPU performance.

## Completed checks (2026-10-11)

Typecheck, lint, all 10 tests and production build pass. The full development browser suite passed navigation, service selection, mobile menus, scroll reversal, reduced motion and WebGL context loss/recovery without runtime errors. The final production preview on port 3000 passed opening/end composition, delayed copy, keyboard replay and overflow checks at 1440, 768, 390 and 360 px. Fourteen local GLBs total 10,875,656 bytes. Source texture checksums were verified against the original Rocketbox repository.

The updated production build passed. Port 3000 was restarted with the new build; opening/end composition, delayed copy, keyboard replay and overflow checks passed at 1440, 768, 390 and 360 px. Transition screenshots at intermediate progress are saved under output/story-review/.

The room-depth production build passed and is running on port 3000. The final production four-width checks passed, including navigation visibility and keyboard exclusion. Tablet framing uses viewport width, keeping the creator and the final phone inside the scene at 768 × 1024. Typecheck, lint and all 11 tests passed; the camera-clearance test was repeated after the tablet adjustment.
