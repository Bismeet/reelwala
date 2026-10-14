import test from "node:test";
import assert from "node:assert/strict";
import * as T from "three";
import { createCelebrationModel } from "../src/features/scene-3d/lib/celebration-model";

test("recorded view is reused during phone movement and refreshed for replay, resize and context restoration", () => {
  let width = 1440;
  const model = createCelebrationModel(() => width, null);
  const scene = new T.Scene();
  scene.add(model.group);
  let renders = 0;
  let target: T.WebGLRenderTarget | null = null;
  const renderer = {
    shadowMap: { needsUpdate: false },
    getRenderTarget: () => target,
    setRenderTarget: (value: T.WebGLRenderTarget | null) => {
      target = value;
    },
    render: () => {
      renders++;
    },
  } as unknown as T.WebGLRenderer;
  const frame = (progress: number, time = 0) => {
    model.update(progress, time);
    model.beforeRender!(renderer, scene, (progress + time) * 1000);
    assert.equal(target, null, "offscreen pass must restore the main target");
  };
  frame(0.34);
  assert.equal(renders, 1);
  for (let step = 35; step < 55; step++) frame(step / 100);
  assert.equal(renders, 1, "moving the phone must not redraw unchanged video");
  frame(0.55);
  assert.equal(
    renders,
    2,
    "enlarging the portrait must allocate its sharp capture once",
  );
  for (let step = 56; step <= 80; step++) frame(step / 100);
  assert.equal(
    renders,
    2,
    "unchanged video should be reused at the larger size",
  );
  frame(0.9);
  assert.equal(renders, 3);
  frame(0.9);
  assert.equal(renders, 3);
  width = 390;
  frame(0.9);
  assert.equal(renders, 4);
  model.invalidate!();
  frame(0.9);
  assert.equal(renders, 5);
  model.replay!(1);
  frame(1, 1.2);
  assert.equal(renders, 6);
  assert.equal(
    model.group.children[0].visible,
    false,
    "recording must not expose the hidden set",
  );
  model.dispose?.();
});

test("phone captures are paced while scrolling and a pending final pose is retained", () => {
  const model = createCelebrationModel(() => 1440, null);
  const scene = new T.Scene();
  scene.add(model.group);
  let renders = 0;
  const sizes: number[] = [];
  const renderer = {
    shadowMap: { needsUpdate: false },
    getRenderTarget: () => null,
    setRenderTarget: (target: T.WebGLRenderTarget | null) => {
      if (target) sizes.push(target.width);
    },
    render: () => {
      renders++;
    },
  } as unknown as T.WebGLRenderer;
  const frame = (progress: number, now: number) => {
    model.update(progress, 0);
    model.beforeRender!(renderer, scene, now);
  };
  frame(0.1, 0);
  for (let i = 1; i <= 5; i++) frame(0.1 + i * 0.005, i * 8);
  assert.equal(
    renders,
    1,
    "small-preview work must not run at every display frame",
  );
  assert.equal(model.needsRender!(), true, "the last pose must remain pending");
  frame(0.125, 90);
  assert.equal(renders, 2);
  assert.equal(model.needsRender!(), false);
  frame(0.85, 100);
  assert.equal(renders, 3, "portrait resize must bypass pacing");
  assert.equal(sizes.at(-1), 1024);
  frame(0.86, 110);
  assert.equal(renders, 3);
  frame(0.86, 140);
  assert.equal(
    renders,
    4,
    "full portrait updates must resume at video cadence",
  );
  model.invalidate!();
  frame(0.86, 141);
  assert.equal(renders, 5, "graphics restoration must refresh immediately");
  model.dispose?.();
});
