import assert from "node:assert/strict";
import test from "node:test";
import { advancePointerSpring } from "../src/lib/pointer-spring";

test("pointer spring remains bounded through rapid reversals and settles at rest", () => {
  const state = { position: 0, velocity: 0 };
  for (let frame = 0; frame < 120; frame++) {
    advancePointerSpring(state, frame < 30 ? 1 : frame < 60 ? -1 : 1, 1 / 30);
    assert.ok(Math.abs(state.position) < 1.15);
    assert.ok(Number.isFinite(state.velocity));
  }
  for (let frame = 0; frame < 100; frame++)
    advancePointerSpring(state, 0, 1 / 30);
  assert.deepEqual(state, { position: 0, velocity: 0 });
});

test("spring response is independent of GPU frame cadence", () => {
  const fine = { position: 0, velocity: 0 };
  const uneven = { position: 0, velocity: 0 };
  for (let i = 0; i < 60; i++) advancePointerSpring(fine, 1, 1 / 120);
  for (let i = 0; i < 5; i++) {
    advancePointerSpring(uneven, 1, 0.03);
    advancePointerSpring(uneven, 1, 0.07);
  }
  assert.ok(Math.abs(fine.position - uneven.position) < 1e-10);
  assert.ok(Math.abs(fine.velocity - uneven.velocity) < 1e-10);
});
