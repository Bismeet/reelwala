import * as T from "three";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { StoryModel } from "./story-models";
import { ElementResponse } from "./element-response";
import {
  loadReceptionAssets,
  disposeReceptionAssets,
  placeAsset,
  type ReceptionAssets,
} from "./reception-assets";

// Finished, locally hosted assets. The camera records the same assembled reception.
export function createCelebrationModel(
  viewportWidth: () => number = () =>
    typeof window !== "undefined" ? innerWidth : 1440,
  assetLoader: (() => Promise<ReceptionAssets>) | null = loadReceptionAssets,
): StoryModel {
  const group = new T.Group(),
    set = new T.Group(),
    creator = new T.Group(),
    phone = new T.Group();
  phone.name = "capture-phone";
  group.add(set, creator, phone);
  const materials: T.Material[] = [];
  const material = (color: string, metalness = 0, roughness = 0.8) => {
    const m = new T.MeshStandardMaterial({ color, metalness, roughness });
    materials.push(m);
    return m;
  };
  const ivory = material("#e9e2d2"),
    cream = material("#fff5df");
  const gold = material("#ae8950", 0.72, 0.32),
    dark = material("#17211e", 0.15, 0.4),
    pupil = dark;
  const mesh = (
    parent: T.Object3D,
    geometry: T.BufferGeometry,
    mat: T.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => {
    const m = new T.Mesh(geometry, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  const box = (
    parent: T.Object3D,
    w: number,
    h: number,
    d: number,
    mat: T.Material,
    x = 0,
    y = 0,
    z = 0,
    r = 0.05,
  ) =>
    mesh(
      parent,
      new RoundedBoxGeometry(w, h, d, 5, Math.min(r, w / 3, h / 3, d / 3)),
      mat,
      x,
      y,
      z,
    );
  const ball = (
    parent: T.Object3D,
    mat: T.Material,
    x: number,
    y: number,
    z: number,
    sx: number,
    sy: number,
    sz: number,
  ) => {
    const m = mesh(parent, new T.SphereGeometry(1, 48, 32), mat, x, y, z);
    m.scale.set(sx, sy, sz);
    return m;
  };
  const floorY = -2.4;
  const elements = new ElementResponse();
  let operatorWrapper: T.Group | undefined;
  const operatorRest = new T.Quaternion();
  const operatorDelta = new T.Quaternion();
  const identityRotation = new T.Quaternion();
  const operatorPivot = new T.Vector3();
  // Clearance envelope is also checked before imported assets are ready.
  const tableEnvelope = box(set, 2.72, 0.16, 2.72, ivory, -1, -0.66, 0.1);
  tableEnvelope.name = "celebration-tabletop";
  tableEnvelope.visible = false;
  let cancelled = false,
    loadedAssets: ReceptionAssets | undefined,
    nightSky: T.Texture | undefined,
    recordingDirty = true,
    forceCapture = true,
    lastCaptureAt = -Infinity,
    lastReplay = -1,
    sceneTime = 0;
  const partyMixers: {
    mixer: T.AnimationMixer;
    duration: number;
    offset: number;
  }[] = [];
  const ready = assetLoader
    ? Promise.all([
        assetLoader(),
        assetLoader === loadReceptionAssets
          ? new HDRLoader().loadAsync(
              "/scene-3d/models/reception/dikhololo_night_2k.hdr",
            )
          : Promise.resolve(undefined),
      ]).then(([assets, sky]) => {
        nightSky = sky;
        if (nightSky) {
          nightSky.mapping = T.EquirectangularReflectionMapping;
          // Grade the sourced night panorama toward cool moonlight, retaining its stars.
          const pixels = (nightSky.image as { data: Uint16Array }).data;
          for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = T.DataUtils.toHalfFloat(
              T.DataUtils.fromHalfFloat(pixels[i]) * 0.38,
            );
            pixels[i + 1] = T.DataUtils.toHalfFloat(
              T.DataUtils.fromHalfFloat(pixels[i + 1]) * 0.72,
            );
          }
          nightSky.needsUpdate = true;
        }
        if (cancelled) {
          disposeReceptionAssets(assets);
          nightSky?.dispose();
          return;
        }
        loadedAssets = assets;
        const put = (
          name: string,
          height: number,
          x: number,
          y: number,
          z: number,
          angle = 0,
        ) => {
          const placed = placeAsset(assets, name, set, height, x, y, z, angle);
          if (name === "tree_small_02")
            elements.add(placed.wrapper, 0.075, 0.014, 0.016);
          else if (name === "potted_plant_04")
            elements.add(placed.wrapper, 0.06, 0.035, 0.012);
          else if (name === "wooden_lantern_01")
            elements.add(placed.wrapper, 0.009, 0.012);
          else if (name === "party-fairy-lights")
            elements.add(placed.wrapper, 0.032, 0.018, 0.01);
          return placed;
        };
        const deck = put("party-deck", 0.16, 0, floorY - 0.16, -1);
        const deckBounds = new T.Box3().setFromObject(deck.wrapper);
        const deckSize = deckBounds.getSize(new T.Vector3());
        deck.wrapper.scale.x *= 18 / deckSize.x;
        deck.wrapper.scale.z *= 14 / deckSize.z;
        deck.wrapper.traverse((object) => {
          if (!(object instanceof T.Mesh)) return;
          const darken = (original: T.Material) => {
            if (!(original instanceof T.MeshStandardMaterial)) return original;
            const oak = original.clone();
            oak.color.set("#73634c");
            oak.roughness = 0.68;
            materials.push(oak);
            return oak;
          };
          object.material = Array.isArray(object.material)
            ? object.material.map(darken)
            : darken(object.material);
        });
        const table = put("round_wooden_table_02", 1.8, -1, floorY, 0.1);
        table.wrapper.scale.x *= 1.38;
        table.wrapper.scale.z *= 1.38;
        const tabletopObjects = [
          put("strawberry_chocolate_cake", 0.2, -0.75, -0.59, 0.35, -0.3),
          put("brass_candleholders", 0.32, -1.65, -0.59, -0.3),
          put("wine-glass", 0.38, -0.25, -0.59, -0.4),
          put("wine-glass", 0.38, -1.8, -0.59, 0.55),
        ];
        // Keep everything on the table together, so glasses/cake cannot slide into it.
        const tableAssembly = new T.Group();
        tableAssembly.name = "interactive-table-assembly";
        tableAssembly.position.set(-1, floorY, 0.1);
        set.add(tableAssembly);
        group.updateMatrixWorld(true);
        for (const placed of [table, ...tabletopObjects])
          tableAssembly.attach(placed.wrapper);
        elements.add(tableAssembly, 0, 0.012);
        put("tree_small_02", 7.8, -7.2, floorY, -7.4, 0.4);
        put("tree_small_02", 8.3, 6.2, floorY, -7, -0.7);
        put("tree_small_02", 5.5, -1.9, floorY, -12, 1.2);
        put("potted_plant_04", 1.1, -5.5, floorY, 1.1, 1.2);
        put("potted_plant_04", 1.15, 4.9, floorY, 0.8, 0.5);
        put("wooden_lantern_01", 0.8, -4.7, floorY, 0.3);
        put("wooden_lantern_01", 0.95, 3.9, floorY, -0.1);
        put("wooden_lantern_01", 0.65, 2.7, floorY, -4.5);
        const lights = put("party-fairy-lights", 1.65, -0.6, 2.3, -1.5);
        lights.wrapper.traverse((object) => {
          if (!(object instanceof T.Mesh)) return;
          object.castShadow = false;
          for (const original of Array.isArray(object.material)
            ? object.material
            : [object.material]) {
            if (
              original instanceof T.MeshStandardMaterial &&
              original.name === "Emissive"
            ) {
              // Retain the authored bulbs; tune their material to the warm party lights.
              const lit = original.clone();
              lit.emissive.set("#ffc371");
              lit.emissiveIntensity = 2.5;
              materials.push(lit);
              if (Array.isArray(object.material))
                object.material = object.material.map((m) =>
                  m === original ? lit : m,
                );
              else object.material = lit;
            } else if (original instanceof T.MeshStandardMaterial) {
              const cable = original.clone();
              cable.color.set("#272622");
              materials.push(cable);
              if (Array.isArray(object.material))
                object.material = object.material.map((m) =>
                  m === original ? cable : m,
                );
              else object.material = cable;
            }
          }
        });
        const guests: [string, number, number, number, number, number][] = [
          ["party-man", 3.3, -1.1, -2.6, 0, 12],
          ["party-woman", 3.15, -3.55, -0.6, 0.35, 4],
          ["party-clap", 3.15, 1.35, -1, -0.35, 1.2],
          ["party-man", 3.1, -3.75, -3.5, 0.25, 12.2],
          ["party-woman", 3.2, 1.35, -3.65, -0.3, 4.4],
        ];
        for (const [name, height, x, z, angle, offset] of guests) {
          const guest = put(name, height, x, floorY, z, angle);
          const clip = guest.animations[0];
          if (clip) {
            const mixer = new T.AnimationMixer(guest.object);
            mixer.clipAction(clip).play();
            mixer.setTime(offset);
            partyMixers.push({ mixer, duration: clip.duration, offset });
          }
        }
        for (const [x, y, z, strength] of [
          [-3, 3.1, -1, 18],
          [2.8, 3, -2, 16],
          [-0.8, 0.7, -0.5, 5],
        ]) {
          const practical = new T.PointLight("#ffd49a", strength, 13, 2);
          practical.position.set(x, y, z);
          set.add(practical);
        }
        const operator = placeAsset(
          assets,
          "creator-kana",
          creator,
          3.6,
          2.8,
          floorY,
          3.25,
          Math.PI + 0.48,
        );
        operatorWrapper = operator.wrapper;
        operatorRest.copy(operator.wrapper.quaternion);
        if (operator.animations[0]) {
          const mixer = new T.AnimationMixer(operator.object);
          mixer.clipAction(operator.animations[0]).play();
          mixer.setTime(4);
        }
        // The foreground operator is outside the recorded set. Keep one shared
        // reception shadow map for the main view and the phone's view.
        operator.wrapper.traverse((object) => {
          if (object instanceof T.Mesh) object.castShadow = false;
        });
        recordingDirty = true;
        group.userData.importedAssetCount = assets.size;
      })
    : undefined;

  const target = new T.WebGLRenderTarget(512, 896, {
    depthBuffer: true,
    type: T.HalfFloatType,
  });
  target.texture.colorSpace = T.LinearSRGBColorSpace;
  const screenMaterial = new T.MeshBasicMaterial({
    map: target.texture,
    toneMapped: true,
  });
  materials.push(screenMaterial);
  box(phone, 0.8, 1.58, 0.095, dark, 0, 0, 0, 0.055);
  mesh(
    phone,
    new T.PlaneGeometry(0.722, 1.32),
    screenMaterial,
    0,
    0.015,
    0.052,
  );
  box(phone, 0.72, 0.09, 0.006, dark, 0, 0.713, 0.056, 0.002);
  ball(phone, pupil, 0, 0.725, 0.065, 0.026, 0.026, 0.009);
  box(phone, 0.24, 0.018, 0.01, cream, 0, -0.73, 0.059, 0.004);
  const shutter = mesh(
    phone,
    new T.TorusGeometry(0.046, 0.008, 8, 24),
    cream,
    0,
    -0.68,
    0.065,
  );
  const recordDot = ball(
    phone,
    material("#c7583e"),
    -0.29,
    0.69,
    0.065,
    0.018,
    0.018,
    0.008,
  );
  const timeline = box(phone, 0.56, 0.012, 0.01, gold, 0, -0.62, 0.064, 0.003);
  phone.traverse((object) => {
    if (object instanceof T.Mesh) object.castShadow = false;
  });
  const recordingCamera = new T.PerspectiveCamera(35, 512 / 896, 0.1, 100);
  recordingCamera.name = "recording-camera";
  group.add(recordingCamera);
  recordingCamera.position.set(-1.1, 0.8, 12.5);
  recordingCamera.lookAt(-1.1, -0.1, 0);
  let current = 0;
  let replayAt: number | undefined;
  const smooth = (p: number, a: number, b: number) =>
    T.MathUtils.smoothstep(p, a, b);
  const mix = T.MathUtils.lerp;
  const finalBackdrop = new T.Color("#071b20");
  group.userData.materials = materials;
  return {
    group,
    ready,
    update(p, time) {
      current = p;
      // Environmental motion follows the scroll timeline, too.
      sceneTime = p * 10;
      const release = smooth(p, 0.34, 0.42),
        pull = smooth(p, 0.42, 0.55),
        focus = smooth(p, 0.55, 0.8),
        finish = smooth(p, 0.88, 1),
        mobile = viewportWidth() < 651;
      creator.position.x = mobile ? -0.55 : 0;

      let replay = p > 0.8 ? smooth(p, 0.81, 0.94) : smooth(p, 0.08, 0.33);
      if (replayAt !== undefined) {
        replay = smooth(time - replayAt, 0, 1.5);
        if (time - replayAt > 1.6) replayAt = undefined;
      }
      if (Math.abs(replay - lastReplay) > 0.00001) {
        for (const { mixer, duration, offset } of partyMixers) {
          mixer.setTime(offset + replay * Math.min(duration, 2.2));
        }
        lastReplay = replay;
        recordingDirty = true;
      }
      group.userData.liveGestureTime = 0;
      phone.position.set(
        mix(
          mix(mobile ? 1.8 : 2.35, mobile ? 0.8 : 1.25, release),
          mobile ? 0 : -1.16,
          focus,
        ),
        mix(-0.05, mobile ? 0.62 : -0.08, focus),
        mix(2.8, 4.8, pull),
      );
      // Reset every axis before the operator response so pointer tilt cannot accumulate.
      phone.rotation.set(0, mix(0.48, 0, pull), mix(-0.02, 0, focus));
      phone.scale.setScalar(mix(0.3, mobile ? 1 : 1.85, focus));
      set.visible = p < 0.82;
      creator.visible = p < 0.79;
      shutter.visible = p < 0.84;
      recordDot.visible = p < 0.84;
      timeline.scale.x = Math.max(0.02, replay);
      timeline.position.x = (timeline.scale.x - 1) * 0.28;
      group.userData.recordingProgress = replay;
      group.userData.phase =
        p < 0.35 ? "occasion" : p < 0.8 ? "recording" : "replay";
      group.userData.copyVisible = finish > 0.2;
    },
    updateCamera(camera, distance, aspect, p) {
      const focus = smooth(p, 0.55, 0.8),
        orbit = smooth(p, 0.1, 0.42),
        mobile = viewportWidth() < 651;
      const startX = mobile ? -2.8 : -3.5;
      const finalDistance = mobile
        ? 6.7
        : Math.max(
            6.7,
            4.3 / (2 * Math.tan(T.MathUtils.degToRad(16)) * aspect),
          );
      camera.position.set(
        mix(startX + orbit * 0.8, 0, focus),
        mix(2.1, 0.15, focus),
        mix(distance, finalDistance + 4.8, focus),
      );
      camera.lookAt(
        mix(-0.15, mobile ? 0 : 0, focus),
        mix(-0.25, 0, focus),
        mix(0.1, 4.8, focus),
      );
    },
    updatePointer(x, y, strength) {
      const response = elements.apply(
        x,
        y,
        strength,
        sceneTime,
        1 - smooth(current, 0.28, 0.55),
      );
      group.userData.reactiveElements = response.count;
      group.userData.elementMotion = response.largest;
      if (response.changed) recordingDirty = true;
      if (operatorWrapper && current < 0.42) {
        // The filming hand and held phone follow the operator together until release.
        operatorDelta
          .copy(operatorRest)
          .invert()
          .premultiply(operatorWrapper.quaternion);
        operatorDelta.slerp(identityRotation, smooth(current, 0.34, 0.42));
        operatorPivot.copy(operatorWrapper.position).add(creator.position);
        phone.position
          .sub(operatorPivot)
          .applyQuaternion(operatorDelta)
          .add(operatorPivot);
        phone.quaternion.premultiply(operatorDelta);
      }
    },
    beforeRender(renderer, scene, now = performance.now()) {
      scene.background = current < 0.82 && nightSky ? nightSky : finalBackdrop;
      scene.backgroundIntensity = 0.15;
      scene.backgroundRotation.set(-0.55, 1.4, 0);
      const resolution =
        current < 0.55 ? 256 : viewportWidth() < 651 ? 768 : 1024;
      if (target.width !== resolution) {
        target.setSize(resolution, resolution * 1.75);
        recordingDirty = true;
        forceCapture = true;
      }
      if (!recordingDirty) return;
      // A small phone preview needs fewer updates than the full-size portrait.
      // The main camera and party keep following the scroll at display cadence.
      const captureInterval = 1000 / (current < 0.55 ? 12 : 30);
      if (!forceCapture && now - lastCaptureAt < captureInterval) return;
      const setVisible = set.visible,
        creatorVisible = creator.visible,
        phoneVisible = phone.visible;
      set.visible = true;
      creator.visible = false;
      phone.visible = false;
      const previous = renderer.getRenderTarget();
      const background = scene.background;
      if (nightSky) scene.background = nightSky;
      renderer.shadowMap.needsUpdate = true;
      try {
        renderer.setRenderTarget(target);
        renderer.render(scene, recordingCamera);
      } finally {
        renderer.setRenderTarget(previous);
        scene.background = background;
        set.visible = setVisible;
        creator.visible = creatorVisible;
        phone.visible = phoneVisible;
      }
      group.userData.progress = current;
      group.userData.recordingRenders =
        (group.userData.recordingRenders ?? 0) + 1;
      recordingDirty = false;
      forceCapture = false;
      lastCaptureAt = now;
    },
    needsRender() {
      return recordingDirty;
    },
    isAnimating() {
      return false;
    },
    invalidate() {
      recordingDirty = true;
      forceCapture = true;
    },
    dispose() {
      target.dispose();
      nightSky?.dispose();
      cancelled = true;
      if (loadedAssets) disposeReceptionAssets(loadedAssets);
    },
    replay(time) {
      replayAt = time;
      forceCapture = true;
    },
  };
}
