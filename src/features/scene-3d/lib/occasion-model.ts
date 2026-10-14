import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { StoryModel } from "./story-models";

// Original geometry inspired by the supplied references. No bitmap textures or models.
export function createOccasionModel(
  variant: "private" | "corporate" | "cultural",
): StoryModel {
  const group = new T.Group();
  const brass = new T.MeshStandardMaterial({
    color: "#c18a3c",
    metalness: 1,
    roughness: 0.27,
    side: T.DoubleSide,
  });
  const ivory = new T.MeshStandardMaterial({
    color: "#f2e7d4",
    roughness: 0.57,
  });
  const jade = new T.MeshStandardMaterial({
    color: "#082e27",
    roughness: 0.4,
    metalness: 0.2,
  });
  const silk = new T.MeshStandardMaterial({
    color: "#dfc6a0",
    roughness: 0.46,
    metalness: 0.12,
    side: T.DoubleSide,
  });
  const teal = new T.MeshStandardMaterial({
    color: "#07665b",
    roughness: 0.35,
    metalness: 0.35,
    side: T.DoubleSide,
  });
  const timber = new T.MeshStandardMaterial({
    color: "#754022",
    roughness: 0.45,
    metalness: 0.05,
  });
  const petal = new T.MeshStandardMaterial({
    color: "#fff2da",
    roughness: 0.75,
  });
  const leaves = new T.MeshStandardMaterial({
    color: "#345944",
    roughness: 0.75,
    side: T.DoubleSide,
  });
  const glow = new T.MeshStandardMaterial({
    color: "#ffd787",
    emissive: "#ffb547",
    emissiveIntensity: 1.4,
    roughness: 0.4,
  });
  const glass = new T.MeshStandardMaterial({
    color: "#e7b85c",
    emissive: "#ed9825",
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 0.32,
    roughness: 0.28,
    depthWrite: false,
  });
  const materials = [
    brass,
    ivory,
    jade,
    silk,
    teal,
    timber,
    petal,
    leaves,
    glow,
    glass,
  ];
  group.userData.materials = materials;
  const ballGeo = new T.SphereGeometry(1, 16, 12);
  const mesh = (
    parent: T.Object3D,
    geometry: T.BufferGeometry,
    material: T.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => {
    const object = new T.Mesh(geometry, material);
    object.position.set(x, y, z);
    parent.add(object);
    object.castShadow = true;
    object.receiveShadow = true;
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
    r = 0.025,
  ) => mesh(parent, new RoundedBoxGeometry(w, h, d, 2, r), material, x, y, z);
  const cylinder = (
    parent: T.Object3D,
    r: number,
    h: number,
    material: T.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => mesh(parent, new T.CylinderGeometry(r, r, h, 40), material, x, y, z);
  const ball = (
    parent: T.Object3D,
    r: number,
    material: T.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => {
    const o = mesh(parent, ballGeo, material, x, y, z);
    o.scale.setScalar(r);
    return o;
  };
  const tube = (
    parent: T.Object3D,
    points: T.Vector3[],
    radius: number,
    material: T.Material,
  ) =>
    mesh(
      parent,
      new T.TubeGeometry(new T.CatmullRomCurve3(points), 40, radius, 6, false),
      material,
    );
  const ring = (
    parent: T.Object3D,
    r: number,
    thickness: number,
    material: T.Material,
    x = 0,
    y = 0,
    z = 0,
  ) =>
    mesh(parent, new T.TorusGeometry(r, thickness, 8, 56), material, x, y, z);
  const v = (x: number, y: number, z = 0) => new T.Vector3(x, y, z);
  const fabric = (
    parent: T.Object3D,
    points: T.Vector3[],
    width: number,
    material: T.Material,
    twist = 0,
  ) => {
    const curve = new T.CatmullRomCurve3(points);
    const vertices: number[] = [],
      indices: number[] = [];
    for (let i = 0; i <= 72; i++) {
      const t = i / 72,
        position = curve.getPoint(t),
        tangent = curve.getTangent(t);
      const side = new T.Vector3()
        .crossVectors(tangent, v(0, 0, 1))
        .normalize()
        .applyAxisAngle(tangent, twist * t);
      const normal = new T.Vector3().crossVectors(tangent, side).normalize();
      for (let j = 0; j <= 8; j++) {
        const across = j / 8 - 0.5;
        const point = position
          .clone()
          .addScaledVector(
            side,
            across * width * (0.72 + Math.sin(t * Math.PI) * 0.28),
          )
          .addScaledVector(
            normal,
            Math.sin((j / 8) * Math.PI * 4 + t * 5) * 0.025,
          );
        vertices.push(point.x, point.y, point.z);
        if (i < 72 && j < 8) {
          const a = i * 9 + j;
          indices.push(a, a + 1, a + 9, a + 1, a + 10, a + 9);
        }
      }
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return mesh(parent, geo, material);
  };
  const arch = (
    parent: T.Object3D,
    w: number,
    h: number,
    z: number,
    material: T.Material,
    weight = 0.035,
  ) => {
    tube(
      parent,
      [
        v(-w / 2, -h / 2, z),
        v(-w / 2, h * 0.1, z),
        v(-w * 0.35, h * 0.35, z),
        v(0, h / 2, z),
        v(w * 0.35, h * 0.35, z),
        v(w / 2, h * 0.1, z),
        v(w / 2, -h / 2, z),
      ],
      weight,
      material,
    );
  };
  const lantern = (
    parent: T.Object3D,
    x: number,
    y: number,
    z: number,
    size = 1,
  ) => {
    const lamp = new T.Group();
    parent.add(lamp);
    lamp.position.set(x, y, z);
    lamp.scale.setScalar(size);
    const points = [
      new T.Vector2(0.14, -0.58),
      new T.Vector2(0.28, -0.43),
      new T.Vector2(0.38, -0.17),
      new T.Vector2(0.4, 0.08),
      new T.Vector2(0.32, 0.39),
      new T.Vector2(0.12, 0.53),
    ];
    mesh(lamp, new T.LatheGeometry(points, 24), glass);
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5;
      tube(
        lamp,
        points.map((p) => v(p.x * Math.cos(a), p.y, p.x * Math.sin(a))),
        0.018,
        brass,
      );
    }
    cylinder(lamp, 0.15, 0.08, brass, 0, 0.56);
    cylinder(lamp, 0.15, 0.08, brass, 0, -0.6);
    ball(lamp, 0.14, glow, 0, -0.05);
    ring(lamp, 0.32, 0.018, brass, 0, 0.39).rotation.x = Math.PI / 2;
    ring(lamp, 0.28, 0.018, brass, 0, -0.43).rotation.x = Math.PI / 2;
    cylinder(lamp, 0.017, 1.1, brass, 0, 1.15);
    ball(lamp, 0.045, brass, 0, -0.75);
    return lamp;
  };
  const flower = (
    parent: T.Object3D,
    x: number,
    y: number,
    z: number,
    r = 0.11,
  ) => {
    const root = new T.Group();
    parent.add(root);
    root.position.set(x, y, z);
    root.rotation.set(0.5, x * 2, z);
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3,
        o = ball(
          root,
          r,
          petal,
          Math.cos(a) * r * 0.62,
          Math.sin(a) * r * 0.62,
        );
      o.scale.set(r * 0.8, r * 0.58, r * 0.38);
      o.rotation.z = a;
    }
    ball(root, r * 0.35, brass, 0, 0, 0.015);
    for (let i = 0; i < 2; i++) {
      const leaf = ball(
        root,
        r,
        leaves,
        (i ? 1 : -1) * r * 1.1,
        -r * 0.5,
        -0.03,
      );
      leaf.scale.set(r * 0.9, r * 0.3, r * 0.1);
      leaf.rotation.z = i ? -0.5 : 0.5;
    }
  };
  const cake = (parent: T.Object3D) => {
    cylinder(parent, 0.67, 0.1, brass, 0, -1.68, 0.34);
    cylinder(parent, 0.15, 0.45, brass, 0, -1.94, 0.34);
    cylinder(parent, 0.48, 0.07, brass, 0, -2.18, 0.34);
    for (const [radius, height, y] of [
      [0.62, 0.6, -1.33],
      [0.48, 0.53, -0.765],
      [0.33, 0.43, -0.285],
    ]) {
      cylinder(parent, radius, height, ivory, 0, y, 0.35);
      const trim = ring(
        parent,
        radius + 0.004,
        0.012,
        brass,
        0,
        y - height / 2 + 0.035,
        0.35,
      );
      trim.rotation.x = Math.PI / 2;
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        ball(
          parent,
          0.022,
          petal,
          Math.cos(a) * radius,
          y - height / 2 + 0.075,
          0.35 + Math.sin(a) * radius,
        );
      }
    }
    for (let i = 0; i < 7; i++) {
      const t = i / 6;
      flower(
        parent,
        -0.38 + Math.sin(t * 5) * 0.15,
        -1.48 + t * 1.4,
        0.95 - t * 0.25,
        0.1,
      );
    }
    flower(parent, 0.06, -0.04, 0.36, 0.12);
    flower(parent, -0.1, 0.04, 0.4, 0.09);
    fabric(
      parent,
      [
        v(-1.13, 2.1, 0.22),
        v(-0.9, 1.72, 0.6),
        v(-0.25, 1.1, 0.17),
        v(0.94, 0.75, 0.4),
        v(1.1, -0.05, 0.7),
      ],
      0.45,
      silk,
      2.4,
    );
    fabric(
      parent,
      [
        v(-1.2, -2.15, 0.3),
        v(-0.72, -1.75, 0.65),
        v(-1, -0.7, 0.5),
        v(-0.8, 0.4, 0.4),
        v(-1.1, 1.5, 0.2),
      ],
      0.12,
      teal,
      4,
    );
    tube(
      parent,
      [v(-1, 1.55, 0.45), v(0, 1.1, 0.45), v(1, 1.5, 0.45)],
      0.012,
      brass,
    );
    for (let i = 0; i < 7; i++) {
      const x = -0.9 + i * 0.3,
        y = 1.13 + x * x * 0.4;
      cylinder(parent, 0.007, 0.18, brass, x, y - 0.06, 0.45);
      ball(parent, 0.041, glow, x, y - 0.18, 0.45);
    }
    lantern(parent, 0.7, 0.82, 0.43, 0.33);
  };
  const award = (parent: T.Object3D) => {
    const steps = new T.Group();
    parent.add(steps);
    cylinder(steps, 0.98, 0.18, jade, 0, -2.18, 0.25);
    cylinder(steps, 0.84, 0.18, jade, 0, -2, 0.25);
    cylinder(steps, 0.68, 0.18, jade, 0, -1.82, 0.25);
    for (const [r, y] of [
      [0.98, -2.09],
      [0.84, -1.91],
      [0.68, -1.73],
    ])
      ring(steps, r, 0.014, brass, 0, y, 0.25).rotation.x = Math.PI / 2;
    box(parent, 0.72, 0.66, 0.7, jade, 0, -1.39, 0.3);
    cylinder(parent, 0.25, 0.13, brass, 0, -1.02, 0.3);
    const flame = fabric(
      parent,
      [
        v(0.04, -0.95, 0.3),
        v(-0.24, -0.45, 0.3),
        v(0.22, 0.1, 0.34),
        v(0.06, 0.7, 0.38),
        v(-0.28, 1.38, 0.3),
      ],
      0.49,
      brass,
      3.7,
    );
    const orbit = ring(parent, 0.91, 0.018, brass, 0, -0.04, 0.25);
    orbit.rotation.set(0.6, -0.1, -0.4);
    const orbit2 = ring(parent, 0.94, 0.013, brass, 0, -0.04, 0.25);
    orbit2.rotation.set(-0.6, 0.6, 0.45);
    for (const [x, h] of [
      [-0.94, 2.2],
      [0.94, 2.8],
    ]) {
      box(parent, 0.017, h, 0.017, brass, x, 0.15, -0.01);
      ball(parent, 0.09, brass, x, 0.45, 0.05);
    }
    return flame;
  };
  const culture = (parent: T.Object3D) => {
    const drum = new T.Group();
    parent.add(drum);
    drum.position.set(0.02, -0.5, 0.62);
    drum.rotation.set(0.15, -0.18, -0.43);
    const profile = [
      v(0.54, -0.87),
      v(0.65, -0.7),
      v(0.72, -0.2),
      v(0.72, 0.2),
      v(0.65, 0.7),
      v(0.54, 0.87),
    ].map((p) => new T.Vector2(p.x, p.y));
    mesh(drum, new T.LatheGeometry(profile, 40), timber).rotation.z =
      Math.PI / 2;
    for (const x of [-0.88, 0.88]) {
      cylinder(drum, 0.55, 0.08, ivory, x).rotation.z = Math.PI / 2;
      ring(drum, 0.55, 0.035, brass, x).rotation.y = Math.PI / 2;
      ring(drum, 0.53, 0.018, teal, x + Math.sign(x) * 0.04).rotation.y =
        Math.PI / 2;
    }
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      tube(
        drum,
        [
          v(-0.85, Math.cos(a) * 0.56, Math.sin(a) * 0.56),
          v(0, Math.cos(a + 0.24) * 0.74, Math.sin(a + 0.24) * 0.74),
          v(0.85, Math.cos(a + 0.48) * 0.56, Math.sin(a + 0.48) * 0.56),
        ],
        0.014,
        brass,
      );
    }
    for (const x of [-0.71, 0.71])
      ring(drum, 0.65, 0.025, teal, x).rotation.y = Math.PI / 2;
    lantern(parent, -0.55, 1.2, 0.32, 0.5);
    lantern(parent, 0.57, 1.48, 0.25, 0.42);
    arch(parent, 1.95, 4.2, -0.02, ivory, 0.075);
    arch(parent, 1.65, 3.95, 0.035, brass, 0.015);
    fabric(
      parent,
      [
        v(1.2, 1.7, 0.3),
        v(0.84, 0.55, 0.1),
        v(1.15, -0.3, 0.6),
        v(0.7, -1.4, 1),
        v(1, -2, 0.45),
      ],
      0.32,
      teal,
      4.1,
    );
    fabric(
      parent,
      [
        v(-1.1, -2, 0.4),
        v(-0.9, -1.5, 0.9),
        v(-1.3, -0.9, 0.5),
        v(-1.2, -0.2, 0.2),
      ],
      0.17,
      brass,
      3,
    );
    cylinder(parent, 0.54, 0.16, ivory, 0.22, -2.17, 0.33);
    cylinder(parent, 0.37, 0.15, ivory, 0.22, -2.01, 0.33);
  };
  const sculpture = new T.Group();
  group.add(sculpture);
  if (variant === "private") cake(sculpture);
  else if (variant === "corporate") award(sculpture);
  else culture(sculpture);
  arch(sculpture, 2.5, 4.65, -0.2, brass, 0.02);
  cylinder(sculpture, 1.55, 0.09, ivory, 0, -2.3, 0.1);
  return {
    group,
    update(p) {
      sculpture.rotation.y = -0.32 + p * 0.65;
      sculpture.rotation.x = 0.03;
    },
  };
}
