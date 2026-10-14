import test from "node:test";
import assert from "node:assert/strict";
import * as T from "three";
import { ElementResponse } from "../src/features/scene-3d/lib/element-response";

test("imported elements respond individually around fixed bases and return exactly to rest", () => {
  const response = new ElementResponse();
  const objects = Array.from({ length: 6 }, (_, i) => {
    const object = new T.Group();
    object.position.set(i * 2, -2.4, -i);
    object.rotation.y = i * 0.3;
    response.add(object, 0.032, 0.045);
    return object;
  });
  const rest = objects.map((o) => ({
    position: o.position.clone(),
    rotation: o.rotation.clone(),
  }));
  const moved = response.apply(1, -1, 1);
  assert.equal(moved.count, 6);
  assert.ok(moved.changed && moved.largest > 0.025 && moved.largest < 0.05);
  assert.notEqual(objects[0].rotation.z, objects[1].rotation.z);
  for (const [i, object] of objects.entries()) {
    assert.ok(
      object.position.equals(rest[i].position),
      "ground anchors cannot move",
    );
  }
  assert.equal(
    response.apply(1, -1, 1).changed,
    false,
    "stationary cursor cannot trigger more captures",
  );
  response.apply(1, -1, 0);
  for (const [i, object] of objects.entries())
    assert.ok(object.rotation.equals(rest[i].rotation));
  assert.equal(response.apply(0, 0, 0).changed, false);
});

test("tabletop props stay attached to the table through its response", () => {
  const response = new ElementResponse();
  const assembly = new T.Group();
  const glass = new T.Group();
  glass.position.set(0.7, 1.8, 0.2);
  assembly.add(glass);
  response.add(assembly, 0, 0.012);
  const rest = glass.position.clone();
  for (const x of [-1, 1, 0]) {
    response.apply(x, 1, 1);
    assert.ok(glass.position.equals(rest));
    assembly.updateMatrixWorld(true);
    assert.equal(glass.getWorldPosition(new T.Vector3()).y, 1.8);
  }
});

test("vegetation moves without pointer input and disables wind before the final reveal", () => {
  const response = new ElementResponse();
  const tree = new T.Group();
  tree.position.set(3, -2.4, -7);
  response.add(tree, 0.075, 0.014, 0.016);
  response.apply(0, 0, 1, 0, 1);
  const opening = tree.quaternion.clone();
  response.apply(0, 0, 1, 1, 1);
  assert.ok(opening.angleTo(tree.quaternion) > 0.004);
  assert.deepEqual(tree.position.toArray(), [3, -2.4, -7]);
  response.apply(0, 0, 0, 2, 1);
  assert.ok(tree.quaternion.equals(new T.Quaternion()));
});
