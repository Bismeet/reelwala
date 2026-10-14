import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import {
  dedup,
  prune,
  weld,
  textureCompress,
  meshopt,
} from "@gltf-transform/functions";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";
import { TGALoader } from "three/addons/loaders/TGALoader.js";
import sharp from "sharp";
import fs from "node:fs/promises";

await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "meshopt.decoder": MeshoptDecoder,
    "meshopt.encoder": MeshoptEncoder,
  });
const report = [];
const triangles = (doc) =>
  doc
    .getRoot()
    .listMeshes()
    .reduce(
      (sum, mesh) =>
        sum +
        mesh
          .listPrimitives()
          .reduce(
            (n, p) =>
              n +
              (p.getIndices()?.getCount() ??
                p.getAttribute("POSITION").getCount()) /
                3,
            0,
          ),
      0,
    );

// Curved edge subdivision follows the authored normals, UVs and skin weights.
// It refines silhouettes without smoothing across separate materials or UV seams.
function subdivide(doc) {
  for (const mesh of doc.getRoot().listMeshes())
    for (const p of mesh.listPrimitives()) {
      if (p.getMode() !== 4 || p.listTargets().length) continue;
      const semantics = p.listSemantics();
      const attributes = Object.fromEntries(
        semantics.map((s) => [s, p.getAttribute(s)]),
      );
      const values = Object.fromEntries(
        semantics.map((s) => [s, Array.from(attributes[s].getArray())]),
      );
      const count = attributes.POSITION.getCount();
      const indices =
        p.getIndices()?.getArray() ??
        Uint32Array.from({ length: count }, (_, i) => i);
      const edges = new Map();
      const midpoint = (a, b) => {
        const key = a < b ? `${a}:${b}` : `${b}:${a}`;
        if (edges.has(key)) return edges.get(key);
        const index = values.POSITION.length / 3;
        let influences;
        if (attributes.JOINTS_0 && attributes.WEIGHTS_0) {
          const weights = new Map();
          for (const v of [a, b])
            for (let k = 0; k < 4; k++) {
              const joint = values.JOINTS_0[v * 4 + k];
              weights.set(
                joint,
                (weights.get(joint) ?? 0) + values.WEIGHTS_0[v * 4 + k] * 0.5,
              );
            }
          influences = [...weights].sort((x, y) => y[1] - x[1]).slice(0, 4);
          while (influences.length < 4) influences.push([0, 0]);
          const total = influences.reduce((s, v) => s + v[1], 0);
          influences = influences.map(([joint, weight]) => [
            joint,
            weight / total,
          ]);
        }
        for (const s of semantics) {
          const size = attributes[s].getElementSize();
          let v = Array.from(
            { length: size },
            (_, k) => (values[s][a * size + k] + values[s][b * size + k]) * 0.5,
          );
          if (s === "JOINTS_0" && influences) v = influences.map((i) => i[0]);
          if (s === "WEIGHTS_0" && influences) v = influences.map((i) => i[1]);
          if (s === "POSITION" && attributes.NORMAL) {
            const pos = values.POSITION,
              normals = values.NORMAL;
            // Project the midpoint onto each endpoint's tangent plane, then blend.
            const dot = (endpoint) =>
              v.reduce(
                (sum, x, k) =>
                  sum + (x - pos[endpoint * 3 + k]) * normals[endpoint * 3 + k],
                0,
              );
            const da = dot(a),
              db = dot(b);
            v = v.map(
              (x, k) =>
                x - 0.5 * (da * normals[a * 3 + k] + db * normals[b * 3 + k]),
            );
          }
          if (s === "NORMAL" || s === "TANGENT") {
            const length = Math.hypot(...v.slice(0, 3));
            if (length) for (let k = 0; k < 3; k++) v[k] /= length;
            if (s === "TANGENT") v[3] = values[s][a * size + 3];
          }
          values[s].push(...v);
        }
        edges.set(key, index);
        return index;
      };
      const refined = [];
      for (let i = 0; i < indices.length; i += 3) {
        const a = indices[i],
          b = indices[i + 1],
          c = indices[i + 2];
        const ab = midpoint(a, b),
          bc = midpoint(b, c),
          ca = midpoint(c, a);
        refined.push(a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca);
      }
      for (const s of semantics)
        p.setAttribute(
          s,
          attributes[s]
            .clone()
            .setArray(new (attributes[s].getArray().constructor)(values[s])),
        );
      p.setIndices(
        doc
          .createAccessor()
          .setType("SCALAR")
          .setArray(new Uint32Array(refined))
          .setBuffer(attributes.POSITION.getBuffer()),
      );
    }
}

async function tgaImage(path) {
  const bytes = await fs.readFile(path);
  const image = new TGALoader().parse(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  );
  return sharp(image.data, {
    raw: { width: image.width, height: image.height, channels: 4 },
  });
}
async function restoreNormals(doc, character, prefix) {
  const dir = `art-source/rocketbox/Assets/Avatars/Professions/${character}/Textures`;
  const colors = [];
  for (const part of ["body", "head", "opacity"]) {
    const pipeline = await tgaImage(`${dir}/${prefix}_${part}_color.tga`);
    colors.push({
      part,
      sample: await pipeline.resize(16, 16).removeAlpha().raw().toBuffer(),
    });
  }
  for (const material of doc.getRoot().listMaterials()) {
    const texture = material.getBaseColorTexture();
    if (!texture) continue;
    const sample = await sharp(texture.getImage())
      .resize(16, 16)
      .removeAlpha()
      .raw()
      .toBuffer();
    const match = colors
      .map((c) => ({
        ...c,
        error: sample.reduce((sum, x, i) => sum + (x - c.sample[i]) ** 2, 0),
      }))
      .sort((a, b) => a.error - b.error)[0];
    material.setName(`${prefix}_${match.part}`);
    if (match.part === "opacity") continue;
    const normal = await tgaImage(`${dir}/${prefix}_${match.part}_normal.tga`);
    // Rocketbox normal maps use DirectX's downward green axis; glTF uses upward.
    const raw = await normal.raw().toBuffer({ resolveWithObject: true });
    for (let i = 1; i < raw.data.length; i += 4)
      raw.data[i] = 255 - raw.data[i];
    const png = await sharp(raw.data, { raw: raw.info }).png().toBuffer();
    const normalTexture = doc
      .createTexture(`${prefix}_${match.part}_normal`)
      .setImage(png)
      .setMimeType("image/png");
    material
      .setNormalTexture(normalTexture)
      .setNormalScale(0.65)
      .setRoughnessFactor(match.part === "head" ? 0.6 : 0.8);
    const sourceUV = material.getBaseColorTextureInfo();
    material.getNormalTextureInfo().setTexCoord(sourceUV.getTexCoord());
  }
}

async function publish(name, source, refine = 0, character, prefix) {
  const doc = await io.read(source);
  const before = triangles(doc);
  if (character) await restoreNormals(doc, character, prefix);
  await doc.transform(dedup(), weld());
  for (let pass = 0; pass < refine; pass++) subdivide(doc);
  await doc.transform(
    prune(),
    textureCompress({
      encoder: sharp,
      targetFormat: "webp",
      resize: [2048, 2048],
      quality: 95,
      slots: /^(?!normalTexture).*$/,
    }),
    meshopt({ encoder: MeshoptEncoder, level: "high" }),
  );
  const dest = `public/scene-3d/models/reception/${name}.glb`;
  await io.write(dest, doc);
  const item = {
    name,
    sourceTriangles: before,
    triangles: triangles(doc),
    bytes: (await fs.stat(dest)).size,
  };
  report.push(item);
  console.log(JSON.stringify(item));
}

for (const [name, refine] of [
  ["round_wooden_table_02", 2],
  ["tree_small_02", 0],
  ["potted_plant_04", 2],
  ["strawberry_chocolate_cake", 1],
  ["brass_candleholders", 1],
  ["wooden_lantern_01", 2],
])
  await publish(
    name,
    `art-source/polyhaven-assets/${name}/${name}.gltf`,
    refine,
  );
for (const [name, character, prefix] of [
  ["party-man", "Business_Male_03", "m020"],
  ["party-woman", "Business_Female_01", "f014"],
  ["party-clap", "Business_Female_01", "f014"],
])
  await publish(name, `art-source/rocketbox/${name}.glb`, 2, character, prefix);
for (const [name, id, refine] of [
  ["creator-kana", "9da9099962e946a185cbc71d7754f034", 1],
  ["party-deck", "4eeb5a6ffcba4113a5225c53eb297247", 0],
  ["party-fairy-lights", "82a67d28bc554f29b70c3300dc06bc3d", 1],
])
  await publish(name, `art-source/sketchfab/${id}.glb`, refine);
await publish("wine-glass", "art-source/innerscene/wine-glass.glb", 2);
await fs.writeFile(
  "output/scene-quality-report.json",
  JSON.stringify(report, null, 2),
);
