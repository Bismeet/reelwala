import test from "node:test";
import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";
import { receptionAssetNames } from "../src/features/scene-3d/lib/reception-assets";

test("the reception ships complete, textured GLBs within its asset budget", async () => {
  await MeshoptDecoder.ready;
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ "meshopt.decoder": MeshoptDecoder });
  let bytes = 0;
  for (const name of receptionAssetNames) {
    const path = `public/scene-3d/models/reception/${name}.glb`;
    bytes += (await stat(path)).size;
    const doc = await io.read(path);
    assert.ok(
      doc.getRoot().listMeshes().length,
      `${name}: geometry is required`,
    );
    assert.ok(
      doc.getRoot().listMaterials().length,
      `${name}: authored materials are required`,
    );
    if (name !== "wine-glass" && name !== "party-fairy-lights")
      assert.ok(
        doc.getRoot().listTextures().length,
        `${name}: authored textures are required`,
      );
    for (const texture of doc.getRoot().listTextures())
      assert.ok(
        texture.getImage()?.byteLength,
        `${name}: missing embedded texture`,
      );
    if (["party-man", "party-woman", "party-clap"].includes(name)) {
      const triangles = doc
        .getRoot()
        .listMeshes()
        .reduce(
          (sum, mesh) =>
            sum +
            mesh
              .listPrimitives()
              .reduce(
                (n, primitive) =>
                  n + (primitive.getIndices()?.getCount() ?? 0) / 3,
                0,
              ),
          0,
        );
      assert.ok(
        triangles >= 120000,
        `${name}: retain refined character geometry`,
      );
      assert.ok(
        doc.getRoot().listSkins().length,
        `${name}: preserve animation rigs`,
      );
      const face = doc
        .getRoot()
        .listMaterials()
        .find((m) => m.getName().endsWith("_head"));
      assert.ok(face, `${name}: retain a named face material`);
      assert.ok(face.getNormalTexture(), `${name}: retain face surface detail`);
      assert.deepEqual(face.getBaseColorTexture()?.getSize(), [2048, 2048]);
    }
    if (
      (name.startsWith("party-") &&
        ["party-man", "party-woman", "party-clap"].includes(name)) ||
      name === "creator-kana"
    )
      assert.ok(
        doc.getRoot().listAnimations().length,
        "retain the artist's animation",
      );
  }
  assert.ok(
    bytes < 64 * 1024 * 1024,
    `High-detail scene assets exceed 64 MB: ${bytes}`,
  );
});
