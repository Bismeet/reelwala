import test from "node:test";
import assert from "node:assert/strict";
import * as T from "three";
import { createCelebrationModel } from "../src/features/scene-3d/lib/celebration-model";
import {
  receptionAssetNames,
  type ReceptionAssets,
} from "../src/features/scene-3d/lib/reception-assets";
import type { GLTF } from "three/addons/loaders/GLTFLoader.js";

test("guest poses stay fixed while idle and follow scroll in both directions", async () => {
  const assets: ReceptionAssets = new Map();
  for (const name of receptionAssetNames) {
    const scene = new T.Group();
    scene.add(
      new T.Mesh(new T.BoxGeometry(1, 1, 1), new T.MeshStandardMaterial()),
    );
    assets.set(name, {
      scene,
      animations: [
        new T.AnimationClip("gesture", 20, [
          new T.NumberKeyframeTrack(".position[y]", [0, 20], [0, 1]),
        ]),
      ],
    } as unknown as GLTF);
  }
  const model = createCelebrationModel(
    () => 1440,
    async () => assets,
  );
  await model.ready;
  const guest = model.group.getObjectByName("party-man")!;
  model.update(0.15, 0);
  model.updatePointer!(0, 0, 1);
  const pose = guest.children[0].position.clone();
  for (const time of [1, 10, 30]) {
    model.update(0.15, time);
    model.updatePointer!(1, -1, 1);
    assert.ok(
      guest.children[0].position.equals(pose),
      "elapsed time cannot advance the character",
    );
    assert.equal(
      guest.rotation.z,
      0,
      "pointer movement cannot tilt the character",
    );
    assert.equal(
      model.isAnimating!(),
      false,
      "idle animation cannot keep scheduling frames",
    );
  }
  model.update(0.25, 31);
  assert.notEqual(
    guest.children[0].position.y,
    pose.y,
    "scroll must advance the gesture",
  );
  model.update(0.15, 32);
  assert.ok(
    guest.children[0].position.equals(pose),
    "reverse scroll must restore the pose",
  );
  model.dispose?.();
});

test("the phone clears held tilt each frame and reveals an upright portrait", () => {
  const model = createCelebrationModel(() => 1440, null);
  const phone = model.group.getObjectByName("capture-phone")!;
  for (const progress of [0.2, 0.4, 0.6, 0.8, 1]) {
    // Simulate the orientation left by the preceding operator response.
    phone.rotateX(0.7);
    model.update(progress, 0);
    assert.equal(phone.rotation.x, 0, "held tilt must not survive a new frame");
    if (progress >= 0.8) {
      assert.equal(phone.rotation.y, 0);
      assert.equal(phone.rotation.z, 0);
    }
  }
  model.dispose?.();
});

test("the phone and both camera views stay outside the table for the entire scroll sequence", () => {
  let width = 1440;
  const model = createCelebrationModel(() => width, null);
  const phone = model.group.getObjectByName("capture-phone")!;
  const table = model.group.getObjectByName("celebration-tabletop")!;
  const recording = model.group.getObjectByName(
    "recording-camera",
  ) as T.PerspectiveCamera;
  const main = new T.PerspectiveCamera(32, 1, 0.1, 100);
  for (const viewport of [
    { width: 390, aspect: 0.5 },
    { width: 768, aspect: 0.82 },
    { width: 1440, aspect: 1.58 },
    { width: 2200, aspect: 2.2 },
  ]) {
    width = viewport.width;
    const aspect = viewport.aspect;
    for (let step = 0; step <= 100; step++) {
      const progress = step / 100;
      model.update(progress, 0);
      model.updateCamera!(main, 16, aspect, progress);
      model.group.updateMatrixWorld(true);
      const tableBounds = new T.Box3().setFromObject(table, true);
      const phoneBounds = new T.Box3().setFromObject(phone, true);
      assert.equal(
        phoneBounds.intersectsBox(tableBounds),
        false,
        `phone intersects tabletop at progress ${progress}`,
      );
      assert.ok(
        main.position.z - main.near > tableBounds.max.z + 0.5,
        `main camera enters tabletop at progress ${progress}`,
      );
      assert.ok(
        recording.position.z - recording.near > tableBounds.max.z + 0.5,
        "recording camera must remain outside the set",
      );
      if (progress >= 0.55)
        assert.ok(
          phoneBounds.min.z > tableBounds.max.z + 0.5,
          "phone must clear the table before moving sideways",
        );
    }
  }
  model.dispose?.();
  const materials = new Set<T.Material>();
  model.group.traverse((object) => {
    if (object instanceof T.Mesh) {
      object.geometry.dispose();
      (Array.isArray(object.material)
        ? object.material
        : [object.material]
      ).forEach((m) => materials.add(m));
    }
  });
  materials.forEach((m) => m.dispose());
});
