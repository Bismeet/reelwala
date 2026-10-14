# Preserved 3D scene

The original reception, phone recording, camera path, rigs and high-detail models are preserved here.

To switch the homepage back, set `heroMode` to `"3d"` in `src/content/hero-mode.ts`. Set it to `"sequence"` to use the cinematic frames again. No copying or asset rebuilding is needed.

- `components/`: original hero, replay control, reusable 3D scenes and their styles.
- `lib/`: Three.js renderer, character animation and scene models.
- Model assets: `public/scene-3d/models/`.
- Original source assets remain in `art-source/`.

The other website sections still use the reusable 3D illustrations from this folder. The opening reception models are only loaded when the 3D hero is selected.
