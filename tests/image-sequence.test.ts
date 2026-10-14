import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import sequence from "../src/content/cinematic-sequence.json";
import {
  SequenceFrameCache,
  sequenceFrameIndex,
  type SequenceImage,
} from "../src/lib/sequence-frame-cache";

const flush = async () => {
  for (let i = 0; i < 12; i++)
    await new Promise<void>((resolve) => setImmediate(resolve));
};

test("all 300 supplied frames are present, ordered and complete", async () => {
  assert.equal(sequence.frames.length, 300);
  assert.deepEqual([sequence.width, sequence.height], [1920, 1080]);
  for (const [i, frame] of sequence.frames.entries()) {
    assert.equal(Number(frame.source.match(/(\d+)\.jpg$/)?.[1]), i + 1);
    for (const path of [frame.original, frame.desktop, frame.mobile])
      assert.ok(
        (await stat(`public${path}`)).size > 0,
        `Missing frame ${path}`,
      );
  }
  const original = await readFile(`public${sequence.frames.at(-1)!.original}`);
  assert.ok(original.length > 0, "retain the exact supplied final frame");
});

test("scroll maps exactly to the first, quarter, middle and final frames", () => {
  assert.deepEqual(
    [0, 0.25, 0.5, 0.75, 1].map((p) => sequenceFrameIndex(p, 300)),
    [0, 75, 150, 224, 299],
  );
  assert.equal(sequenceFrameIndex(-1, 300), 0);
  assert.equal(sequenceFrameIndex(2, 300), 299);
  assert.equal(sequenceFrameIndex(0.5, 50), 25);
});

test("frame loading prioritizes scroll, deduplicates downloads and bounds decoded memory", async () => {
  const requested: number[] = [];
  let closed = 0;
  const cache = new SequenceFrameCache(
    30,
    async (index) => {
      requested.push(index);
      return new Blob([String(index)]);
    },
    async () =>
      ({
        source: {} as CanvasImageSource,
        width: 100,
        height: 100,
        close: () => {
          closed++;
        },
      }) satisfies SequenceImage,
    () => {},
    () => {},
    3 * 100 * 100 * 4,
  );
  cache.setTarget(0);
  await flush();
  assert.deepEqual(requested.slice(0, 4), [0, 1, 2, 3]);
  assert.equal(new Set(requested).size, 30);
  assert.equal(cache.nearest(0)?.index, 0);
  assert.ok(cache.stats.decodedBytes <= 120000);
  cache.setTarget(29);
  await flush();
  assert.equal(cache.nearest(29)?.index, 29);
  assert.ok(cache.stats.decodedBytes <= 120000);
  cache.setTarget(0);
  await flush();
  assert.equal(cache.nearest(0)?.index, 0);
  assert.equal(
    requested.length,
    30,
    "reverse scrolling reuses compressed resources",
  );
  cache.dispose();
  assert.equal(cache.stats.decodedBytes, 0);
  assert.ok(closed > 0);
});

test("reduced-motion mode requests only its static frame", async () => {
  const requested: number[] = [];
  const cache = new SequenceFrameCache(
    300,
    async (index) => {
      requested.push(index);
      return new Blob(["frame"]);
    },
    async () => ({
      source: {} as CanvasImageSource,
      width: 100,
      height: 100,
      close: () => {},
    }),
    () => {},
    () => {},
    120000,
    1024,
    false,
  );
  cache.setTarget(299);
  await flush();
  assert.deepEqual(requested, [299]);
  assert.equal(cache.nearest()?.index, 299);
  cache.dispose();
});
