import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { createOccasionModel } from "./occasion-model";
import { createCelebrationModel } from "./celebration-model";

export type StoryScene =
  "hero" | "capture" | "private" | "corporate" | "cultural" | "edit";
export type StoryModel = {
  group: T.Group;
  ready?: Promise<void>;
  invalidate?: () => void;
  needsRender?: () => boolean;
  isAnimating?: () => boolean;
  update: (progress: number, time: number) => void;
  updatePointer?: (x: number, y: number, strength: number) => void;
  updateCamera?: (
    camera: T.PerspectiveCamera,
    distance: number,
    aspect: number,
    progress: number,
  ) => void;
  beforeRender?: (
    renderer: T.WebGLRenderer,
    scene: T.Scene,
    now?: number,
  ) => void;
  dispose?: () => void;
  replay?: (time: number) => void;
};

export function createStoryModel(kind: StoryScene): StoryModel {
  if (kind === "hero") return createCelebrationModel();
  const group = new T.Group();
  const gold = new T.MeshStandardMaterial({
    color: "#f59e0b",
    metalness: 0.72,
    roughness: 0.24,
  });
  const teal = new T.MeshStandardMaterial({
    color: "#07ac9f",
    metalness: 0.45,
    roughness: 0.23,
  });
  const cream = new T.MeshStandardMaterial({
    color: "#fff5df",
    roughness: 0.3,
    metalness: 0.08,
  });
  const forest = new T.MeshStandardMaterial({
    color: "#143e36",
    metalness: 0.42,
    roughness: 0.27,
  });
  const coral = new T.MeshStandardMaterial({
    color: "#db6042",
    roughness: 0.35,
  });
  const bright = new T.MeshStandardMaterial({
    color: "#0bf5e2",
    emissive: "#07ac9f",
    emissiveIntensity: 0.25,
    roughness: 0.3,
  });
  const materials = [gold, teal, cream, forest, coral, bright];
  const mesh = (
    geometry: T.BufferGeometry,
    material: T.Material,
    parent: T.Object3D,
    x = 0,
    y = 0,
    z = 0,
  ) => {
    const object = new T.Mesh(geometry, material);
    object.position.set(x, y, z);
    parent.add(object);
    return object;
  };
  const box = (
    parent: T.Object3D,
    w: number,
    h: number,
    d: number,
    material: T.Material,
    x = 0,
    y = 0,
    z = 0,
    r = 0.1,
  ) => mesh(new RoundedBoxGeometry(w, h, d, 3, r), material, parent, x, y, z);
  const cylinder = (
    parent: T.Object3D,
    radius: number,
    height: number,
    material: T.Material,
    x = 0,
    y = 0,
    z = 0,
  ) =>
    mesh(
      new T.CylinderGeometry(radius, radius, height, 48),
      material,
      parent,
      x,
      y,
      z,
    );
  const ring = (
    parent: T.Object3D,
    radius: number,
    tube: number,
    material: T.Material,
    x = 0,
    y = 0,
    z = 0,
  ) =>
    mesh(new T.TorusGeometry(radius, tube, 12, 80), material, parent, x, y, z);
  const sphere = (
    parent: T.Object3D,
    radius: number,
    material: T.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => mesh(new T.SphereGeometry(radius, 24, 16), material, parent, x, y, z);
  const curveTube = (
    parent: T.Object3D,
    points: T.Vector3[],
    radius: number,
    material: T.Material,
  ) =>
    mesh(
      new T.TubeGeometry(new T.CatmullRomCurve3(points), 64, radius, 6, false),
      material,
      parent,
    );
  const arch = (parent: T.Object3D, material: T.Material, x = 0, z = -0.8) => {
    const arc = mesh(
      new T.TorusGeometry(1.65, 0.085, 10, 60, Math.PI),
      material,
      parent,
      x,
      0.3,
      z,
    );
    box(parent, 0.17, 2.3, 0.17, material, x - 1.65, -0.85, z);
    box(parent, 0.17, 2.3, 0.17, material, x + 1.65, -0.85, z);
    return arc;
  };
  const plinth = (parent: T.Object3D) => {
    cylinder(parent, 2.1, 0.22, cream, 0, -1.9);
    cylinder(parent, 1.95, 0.1, gold, 0, -1.76);
  };
  const cake = () => {
    const root = new T.Group();
    plinth(root);
    cylinder(root, 1.15, 0.9, cream, 0, -1.25);
    cylinder(root, 0.83, 0.72, cream, 0, -0.45);
    cylinder(root, 0.55, 0.58, cream, 0, 0.2);
    for (const [r, y] of [
      [1.15, -0.85],
      [0.83, -0.12],
      [0.55, 0.47],
    ]) {
      const t = ring(root, r, 0.045, gold, 0, y);
      t.rotation.x = Math.PI / 2;
    }
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      sphere(root, 0.075, coral, Math.cos(a) * 0.7, -0.05, Math.sin(a) * 0.7);
    }
    box(root, 0.065, 0.5, 0.065, gold, 0, 0.72);
    sphere(root, 0.085, bright, 0, 1.03).scale.set(0.7, 1.5, 0.7);
    for (let i = 0; i < 3; i++) {
      const balloon = sphere(
        root,
        0.4,
        i === 1 ? teal : gold,
        (i - 1) * 1.8,
        1.6 + (i % 2) * 0.5,
        -0.35,
      );
      balloon.scale.y = 1.28;
      curveTube(
        root,
        [
          balloon.position.clone().add(new T.Vector3(0, -0.5, 0)),
          new T.Vector3((i - 1) * 1.6, 0.3, -0.4),
          new T.Vector3((i - 1) * 1.45, -1.4, -0.4),
        ],
        0.009,
        forest,
      );
    }
    box(root, 0.65, 0.55, 0.65, teal, 1.55, -1.42, 0.8);
    box(root, 0.07, 0.58, 0.68, gold, 1.55, -1.42, 0.8);
    ring(root, 0.16, 0.035, gold, 1.4, -1.08, 0.8).rotation.y = 0.5;
    return root;
  };
  const trophy = () => {
    const root = new T.Group();
    plinth(root);
    cylinder(root, 0.75, 0.27, forest, 0, -1.5);
    box(root, 0.2, 1.1, 0.2, gold, 0, -0.85);
    const star = new T.Shape();
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 + Math.PI / 2,
        r = i % 2 ? 0.56 : 1.25;
      if (i === 0) star.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else star.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    star.closePath();
    const award = mesh(
      new T.ExtrudeGeometry(star, {
        depth: 0.3,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.065,
        bevelThickness: 0.065,
      }),
      gold,
      root,
      0,
      0.55,
    );
    award.rotation.y = -0.2;
    const orbit = ring(root, 1.75, 0.055, teal, 0, 0.25);
    orbit.rotation.set(0.45, 0.7, 0.1);
    box(root, 0.75, 1.3, 0.75, teal, -1.55, -1.1, 0.3);
    box(root, 0.7, 0.7, 0.7, cream, 1.5, -1.4, 0.45);
    const diamond = mesh(
      new T.OctahedronGeometry(0.32),
      gold,
      root,
      -1.55,
      -0.15,
      0.3,
    );
    diamond.rotation.z = 0.4;
    return root;
  };
  const culture = () => {
    const root = new T.Group();
    plinth(root);
    arch(root, gold);
    const drum = new T.Group();
    root.add(drum);
    drum.position.set(0, -0.65, 0.4);
    drum.rotation.set(0.35, 0, -0.45);
    const body = cylinder(drum, 0.68, 1.7, coral);
    body.rotation.z = Math.PI / 2;
    for (const x of [-0.88, 0.88]) {
      const face = cylinder(drum, 0.68, 0.08, cream, x);
      face.rotation.z = Math.PI / 2;
      ring(drum, 0.69, 0.06, gold, x).rotation.y = Math.PI / 2;
    }
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      curveTube(
        drum,
        [
          new T.Vector3(-0.85, Math.cos(a) * 0.72, Math.sin(a) * 0.72),
          new T.Vector3(
            0.85,
            Math.cos(a + 0.45) * 0.72,
            Math.sin(a + 0.45) * 0.72,
          ),
        ],
        0.018,
        gold,
      );
    }
    for (const [x, y] of [
      [-1.25, 1.15],
      [1.3, 1.5],
    ]) {
      const lantern = new T.Group();
      root.add(lantern);
      lantern.position.set(x, y, 0.15);
      mesh(new T.CylinderGeometry(0.29, 0.29, 0.8, 8), teal, lantern);
      for (let rib = 0; rib < 8; rib++) {
        const a = (rib * Math.PI) / 4;
        box(
          lantern,
          0.015,
          0.8,
          0.015,
          gold,
          Math.cos(a) * 0.295,
          0,
          Math.sin(a) * 0.295,
          0.005,
        );
      }
      cylinder(lantern, 0.29, 0.06, gold, 0, 0.42);
      cylinder(lantern, 0.29, 0.08, gold, 0, -0.42);
      curveTube(
        lantern,
        [new T.Vector3(0, -0.46, 0), new T.Vector3(0.05, -0.95, 0)],
        0.035,
        gold,
      );
    }
    box(root, 0.07, 1.5, 0.07, forest, 1.1, -0.85, 1).rotation.z = -0.5;
    box(root, 0.07, 1.3, 0.07, forest, -0.9, -0.85, 1).rotation.z = 0.5;
    return root;
  };
  const frame = (parent: T.Object3D, w = 2.65, h = 4.5) => {
    const root = new T.Group();
    parent.add(root);
    box(root, 0.17, h, 0.28, gold, -w / 2);
    box(root, 0.17, h, 0.28, gold, w / 2);
    box(root, w, 0.17, 0.28, gold, 0, h / 2);
    box(root, w, 0.17, 0.28, gold, 0, -h / 2);
    return root;
  };
  let update: StoryModel["update"] = () => {};
  if (kind === "private" || kind === "corporate" || kind === "cultural") {
    return createOccasionModel(kind);
  } else if (kind === "capture") {
    const lens = new T.Group();
    group.add(lens);
    lens.rotation.set(-0.2, 0.4, 0.13);
    const layers: T.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const layer = ring(
        lens,
        1.38 - i * 0.14,
        0.12,
        i % 2 ? gold : forest,
        0,
        0,
        0.25 - i * 0.27,
      );
      layers.push(layer);
    }
    const glass = cylinder(lens, 0.84, 0.06, teal, 0, 0, -1.1);
    glass.rotation.x = Math.PI / 2;
    for (let i = 0; i < 8; i++) {
      const shape = new T.Shape();
      shape.moveTo(0.34, 0.12);
      shape.lineTo(0.67, 0.45);
      shape.lineTo(1.01, 0.32);
      shape.lineTo(0.86, -0.34);
      shape.lineTo(0.4, -0.16);
      shape.closePath();
      const blade = mesh(
        new T.ExtrudeGeometry(shape, {
          depth: 0.035,
          bevelEnabled: true,
          bevelSize: 0.012,
          bevelThickness: 0.012,
          bevelSegments: 2,
          steps: 1,
        }),
        gold,
        lens,
        0,
        0,
        -0.55,
      );
      blade.rotation.z = (i * Math.PI) / 4;
    }
    const reticle = frame(group, 3.9, 3.9);
    reticle.rotation.z = -0.12;
    reticle.position.z = -1.7;
    update = (p) => {
      lens.rotation.y = 0.6 - p * 0.65;
      lens.rotation.z = 0.18 - p * 0.25;
      layers.forEach((o, i) => {
        o.position.z = 0.25 - i * 0.27 - (1 - p) * i * 0.4;
      });
      reticle.rotation.z = -0.12 + p * 0.12;
    };
  } else {
    const cards: T.Group[] = [];
    const miniatures: T.Group[] = [];
    [cake, trophy, culture].forEach((build, i) => {
      const card = new T.Group();
      group.add(card);
      cards.push(card);
      box(
        card,
        2.45,
        4.1,
        0.18,
        i === 1 ? teal : i === 0 ? cream : coral,
        0,
        0,
        -0.25,
      );
      const rim = frame(card, 2.45, 4.1);
      rim.scale.set(0.98, 0.98, 0.7);
      const miniature = build();
      miniature.scale.setScalar(0.42);
      miniature.position.y = -0.2;
      card.add(miniature);
      miniatures.push(miniature);
      for (let j = 0; j < 3; j++)
        box(
          card,
          0.18 + j * 0.1,
          0.055,
          0.04,
          gold,
          -0.8 + j * 0.32,
          -1.65,
          0.02,
          0.01,
        );
    });
    update = (p) => {
      const collapse = T.MathUtils.smoothstep(p, 0.15, 0.85);
      cards.forEach((card, i) => {
        card.position.set(
          (i - 1) * 2.85 * (1 - collapse),
          (i === 1 ? 0.2 : 0) * collapse,
          -Math.abs(i - 1) * collapse * 0.45,
        );
        card.rotation.set(
          -0.08 * (1 - collapse),
          (i - 1) * -0.3 * (1 - collapse),
          (i - 1) * -0.12 * (1 - collapse),
        );
        card.scale.setScalar(
          i === 1 ? 1 + collapse * 0.08 : 1 - collapse * 0.03,
        );
        miniatures[i].scale.setScalar(0.42 - collapse * 0.17);
        miniatures[i].position.set(
          (i === 0 ? -0.55 : 0.45) * collapse,
          -0.2 + (i === 1 ? 1.05 : -0.4) * collapse,
          0.9 * collapse,
        );
      });
    };
  }
  update(0, 0);
  group.userData.materials = materials;
  return { group, update };
}
