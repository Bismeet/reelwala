# Night party hero

The hero is an outdoor celebration captured by a Reel Wala creator. The original business requirements and one-page navigation remain authoritative.

## Story and direction

The opening fills the viewport with five cheering or clapping guests, a cake and glassware, suspended fairy lights, timber decking and layered trees under a sourced starry night panorama. The foreground creator films the gathering. Scroll advances excerpts of the original authored animations and brings the recording into the portrait phone. The final message is “You lived it. We captured it.” Navigation, headline and booking action appear after the transition. Scrolling upwards reverses it. Replay is finite; reduced motion and graphics fallback keep navigation and booking accessible.

The direction draws from the warm practical lights, dark blue surroundings and spatial framing observed on [Dwayne Koh / The Lantern House](https://www.dwaynekoh.com/), and the focused framing on [Nick Ho](https://nickho-motorsports.nl/). These are composition references; their assets and branding are not copied.

## Finished assets

Scenery and people are imported assets. The room arch, wall panels, rug and lounge furniture were removed. No new visible scenery or human geometry is generated in code. The existing phone and its camera interface are retained.

- Sketchfab: Fairy Lights by cartti; Wooden Tile Floor by MartyBrosevelt. CC BY copies from Objaverse, with original meshes and material structure retained.
- Microsoft Rocketbox: finished Business_Male_03 and Business_Female_01 rigs, with authored m_cheer_01, f_cheer_01 and f_claphands_01 animations. Existing creator model is Kana Tablet by ddd, sourced from Sketchfab.
- Poly Haven: Tree Small 02, Wooden Lantern 01, cake, table, small plants and candleholders. The Dikhololo Night HDR panorama supplies the stars; orientation and color grading suit the composition.
- Innerscene: original wine-glass GLB.

Sources, licenses and modifications are in public/models/ATTRIBUTION.md. Original downloads and metadata remain in art-source/. All runtime assets are served locally. Trees are simplified for the browser and use 512-pixel material textures; the authored silhouette was visually checked.

## Rendering and behavior

WebGL requests the high-performance device preference. The hero renders at up to one device pixel per CSS pixel; other scenes retain their 1.25 cap on fine-pointer devices. The cached hero shadow map is 1024 pixels on fine-pointer devices and 512 on coarse-pointer devices. Warm practical lights illuminate the gathering, with a cool rim and sky. Shadows and the offscreen phone recording are cached when the captured pose is unchanged. Phone movement reuses the recording; replay, resize and graphics restoration invalidate it. The main view leaves the sky after the party disappears, while the phone continues to show the same night party.

The phone releases sideways away from its operator, moves forward, then grows into its final position. Mobile and tablet framing use viewport width. Hidden navigation is inert and does not capture keyboard focus. The imported ground, furniture, people and camera path are checked for clearance; floor contact is intentional.

## Verification

Typecheck, lint and 12 tests pass, including authored asset/material/animation checks, the initial GLB transfer budget, phone/table camera clearance, and recording-cache invalidation. The complete development browser suite passed desktop section anchors, service selection, mobile menus, reduced motion, replay, scroll reversal and GPU context loss/restoration. Four-size opening/end screenshots were reviewed at 1440, 768, 390 and 360 pixels. The old reception geometry and room-depth notes are archived in 20-RECEPTION-ROOM-ARCHIVE.md.

Physical low-end mobile frame rates have not been measured. This is a real-time assembled scene using finished character assets; it is not a prerendered photographic film.

The final scene has 13 active GLBs totaling 12,244,088 bytes plus a 7,050,455-byte sourced HDR panorama. The final geometry audit passed 404 scroll positions at four widths, checking guest/table clearance, prop spacing and the released phone/operator path. Tree optimization reduced its GLB from approximately 15 MB to 2.6 MB while retaining the authored model and textures. Night-sky orientation was visually verified so stars are visible instead of the ground portion of the panorama.

The updated production build passed and is running on port 3000. Final production checks passed at 1440, 768, 390 and 360 pixels, covering the full-screen opening, delayed/inert navigation, final phone composition, keyboard replay and horizontal overflow. Desktop and mobile screenshots were visually inspected after the final placement changes.

## Scroll timing refinement (2026-10-12)

Mouse and trackpad smoothing now applies at every viewport width, including narrow app preview panels. Touch scrolling and reduced-motion preferences retain their native behavior. GSAP ScrollSmoother uses a 1.2-second exponential ease and normalized input with nested scrolling allowed. Hero pinning follows the same fine-pointer condition, with CSS sticky pinning reserved for native touch scrolling.

The hero camera follows the already eased GSAP timeline directly, avoiding a separate scrub and renderer-damping delay. The small phone preview uses a 160 by 280 capture capped at 12 updates per second. The enlarged portrait keeps its original 512 by 896 desktop or 320 by 560 mobile capture and updates at up to 30 per second. Resizing, replay and graphics restoration force immediate captures. Pending final poses keep the render loop alive until captured, then idle rendering stops.

A controlled mouse-wheel browser check on the available AMD GPU showed a median interval between rendered hero frames of about 35 ms, compared with about 70 ms before this change, and fewer long frame gaps. This is a local timing sample, not an all-device frame-rate guarantee. Tests verify capture pacing, pending-pose completion and immediate restoration. Full browser checks passed navigation, menus, replay, reversal, touch layouts, reduced motion and graphics recovery.

The final production build and four-width checks passed on port 3000. A separate 800-pixel mouse-window check confirmed smooth scrolling, menu section links and return-to-hero navigation. All 12 tests pass, including the new capture-pacing and pending-final-pose regression.

## Mouse interaction refinement (2026-10-12)

The opening camera responds to mouse position with a restrained sideways/upward shift and tiny roll. An analytically damped spring adds a brief settling motion and remains stable with uneven GPU frame timing. Only the viewing camera moves; imported scenery, shadows and the phone recording retain their positions. The response fades between 50% and 82% story progress, leaving the enlarged phone and final headline steady. Pointer leave returns to the authored camera. Touch and reduced motion disable this response, and the renderer stops once the spring settles.

All 14 tests, type checking, lint and the production build pass. The pointer browser check covers 1440, 768, 390 and 360 pixel widths, recording reuse, no unintended scrolling, return to rest, stopped idle rendering, steady final reveal, touch and reduced motion. Desktop and mobile screenshots were inspected.

## Individual element response (2026-10-12)

Mouse interaction now also drives 16 imported asset wrappers/assemblies: three trees, two potted plants, three lanterns, suspended fairy lights, five guests, the creator and the table assembly. Different bounded rotation strengths create a larger tree sway, smaller plant/light movement and restrained human weight shifts. Each wrapper retains its base position and original rig. Table, cake, candleholders and glasses move as one assembly. The held phone follows the creator's rotation until the release transition, which smoothly removes that attachment. All element reactions fade before the final reveal and return exactly to rest on pointer leave.

The recorded view now updates for actual element movement, using the existing 12/30 Hz capture caps. Unchanged element transforms do not invalidate the recording. Pending captures complete before idle rendering stops. All 16 tests, type checking, lint and the production build pass. The four-width browser check verifies imported-element responses, corresponding phone captures, return to rest, idle stop, final reveal stability, touch and reduced motion. Desktop and mobile screenshots were visually inspected.

## Visible life at rest (2026-10-12)

The initial mouse response was too restrained, and guest animation advanced only with scroll. The opening now continuously plays smooth, staggered excerpts of the sourced cheer/clap clips even with no input. Trees, potted plants and suspended lights have a gentle phased breeze; the creator has a small grounded sway, with the held phone following. Pointer rotation is stronger and listens on the full hero stage, including its overlay children.

Ambient gestures and breeze blend out between 28% and 55% story progress. The final reveal remains steady, and its rendering stops after pending captures finish. Ambient rendering uses a capped timer; mouse/scroll events immediately bypass the wait. Background tabs, offscreen heroes, reduced motion and lost graphics contexts stop ambient work. Phone captures retain the existing rate caps.

The four-width browser check now compares actual rendered images a second apart, including separate desktop crops for guests and vegetation, to catch visually static scenes. It also verifies mouse response, continued life after pointer leave, final idle stop and reduced motion. All 17 tests, type checking, lint and the production build pass.
