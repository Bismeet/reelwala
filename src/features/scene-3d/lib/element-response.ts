import * as T from "three";

/** Grounded reactions on imported asset wrappers, leaving their authored rigs intact. */
export class ElementResponse {
  private entries: {
    object: T.Object3D;
    rest: T.Euler;
    tilt: number;
    turn: number;
    weight: number;
    breeze: number;
  }[] = [];

  add(object: T.Object3D, tilt: number, turn = 0, breeze = 0) {
    const index = this.entries.length;
    this.entries.push({
      object,
      rest: object.rotation.clone(),
      tilt,
      turn,
      weight: 0.72 + (index % 4) * 0.09,
      breeze,
    });
  }

  apply(x: number, y: number, strength: number, time = 0, windStrength = 0) {
    let changed = false;
    let largest = 0;
    const horizontal = T.MathUtils.clamp(x, -1.1, 1.1) * strength;
    const vertical = T.MathUtils.clamp(y, -1.1, 1.1) * strength;
    for (const { object, rest, tilt, turn, weight, breeze } of this.entries) {
      const wind = breeze * windStrength * strength;
      const rx =
        rest.x +
        vertical * tilt * weight * 0.6 +
        Math.sin(time * 0.9 + weight * 9) * wind * 0.35;
      const ry = rest.y + horizontal * turn * weight;
      const rz =
        rest.z -
        horizontal * tilt * weight +
        Math.sin(time * 1.25 + weight * 13) * wind;
      if (
        Math.abs(object.rotation.x - rx) +
          Math.abs(object.rotation.y - ry) +
          Math.abs(object.rotation.z - rz) >
        0.00001
      )
        changed = true;
      object.rotation.set(rx, ry, rz, rest.order);
      largest = Math.max(
        largest,
        Math.abs(rx - rest.x),
        Math.abs(ry - rest.y),
        Math.abs(rz - rest.z),
      );
    }
    return { changed, largest, count: this.entries.length };
  }
}
