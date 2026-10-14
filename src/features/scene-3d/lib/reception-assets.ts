import * as T from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { clone } from "three/addons/utils/SkeletonUtils.js";

export const receptionAssetNames = [
  "round_wooden_table_02",
  "tree_small_02",
  "potted_plant_04",
  "strawberry_chocolate_cake",
  "brass_candleholders",
  "wine-glass",
  "party-man",
  "party-woman",
  "party-clap",
  "party-deck",
  "party-fairy-lights",
  "wooden_lantern_01",
  "creator-kana",
] as const;
export type ReceptionAssets = Map<string, GLTF>;

export async function loadReceptionAssets(): Promise<ReceptionAssets> {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const assets: ReceptionAssets = new Map();
  const results = await Promise.allSettled(
    receptionAssetNames.map(async (name) => {
      const asset = await loader.loadAsync(`/scene-3d/models/reception/${name}.glb`);
      assets.set(name, asset);
    }),
  );
  if (results.some((result) => result.status === "rejected")) {
    disposeReceptionAssets(assets);
    throw new Error("The reception models could not be loaded.");
  }
  return assets;
}

export function disposeReceptionAssets(assets: ReceptionAssets) {
  const textures = new Set<T.Texture>();
  const materials = new Set<T.Material>();
  const geometries = new Set<T.BufferGeometry>();
  assets.forEach((asset) =>
    asset.scene.traverse((object) => {
      if (!(object instanceof T.Mesh)) return;
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material)
        ? object.material
        : [object.material]) {
        materials.add(material);
        Object.values(material).forEach((value) => {
          if (value instanceof T.Texture) textures.add(value);
        });
      }
    }),
  );
  geometries.forEach((value) => value.dispose());
  materials.forEach((value) => value.dispose());
  textures.forEach((value) => {
    value.dispose();
    if (
      typeof ImageBitmap !== "undefined" &&
      value.image instanceof ImageBitmap
    )
      value.image.close();
  });
}

/** Preserve the artist's mesh, textures and rig; normalize only placement and scale. */
export function placeAsset(
  assets: ReceptionAssets,
  name: string,
  parent: T.Object3D,
  height: number,
  x: number,
  floor: number,
  z: number,
  angle = 0,
) {
  const asset = assets.get(name);
  if (!asset) throw new Error(`Missing reception asset: ${name}`);
  const object = clone(asset.scene);
  object.updateMatrixWorld(true);
  const bounds = new T.Box3().setFromObject(object, true);
  const size = bounds.getSize(new T.Vector3());
  const scale = height / size.y;
  const center = bounds.getCenter(new T.Vector3());
  object.position.add(new T.Vector3(-center.x, -bounds.min.y, -center.z));
  const wrapper = new T.Group();
  wrapper.name = name;
  wrapper.add(object);
  wrapper.scale.setScalar(scale);
  wrapper.position.set(x, floor, z);
  wrapper.rotation.y = angle;
  object.traverse((child) => {
    if (child instanceof T.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.frustumCulled = !(child instanceof T.SkinnedMesh);
    }
  });
  parent.add(wrapper);
  return { wrapper, object, animations: asset.animations };
}
