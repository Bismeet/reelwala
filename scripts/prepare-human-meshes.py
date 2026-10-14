"""Build local, texture-free character geometry from MakeHuman's CC0 artist assets.

No MakeHuman application code is bundled. Source mesh/rig assets and their license
are kept in art-source/makehuman. Run this script after obtaining those assets.
"""
import json
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "art-source/makehuman"
DEST = ROOT / "src/lib/data/human-meshes.json"


def obj(path):
    vertices, faces, groups = [], [], []
    group = ""
    for line in path.read_text(encoding="utf-8").splitlines():
        p = line.split()
        if not p:
            continue
        if p[0] == "v":
            vertices.append([float(n) for n in p[1:4]])
        elif p[0] == "g":
            group = p[1]
        elif p[0] == "f":
            faces.append([int(n.split("/")[0]) - 1 for n in p[1:]])
            groups.append(group)
    return vertices, faces, groups


base, base_faces, face_groups = obj(SOURCE / "base.obj")
rig = json.loads((SOURCE / "default.mhskel").read_text())
bone_names = list(rig["bones"])
weights = [defaultdict(float) for _ in base]
for name, entries in json.loads((SOURCE / "default_weights.mhw").read_text())["weights"].items():
    for index, value in entries:
        weights[index][bone_names.index(name)] += value


def target(vertices, filename, influence):
    for line in (SOURCE / filename).read_text().splitlines():
        p = line.split()
        if p and p[0].isdigit():
            index = int(p[0])
            for axis in range(3):
                vertices[index][axis] += float(p[axis + 1]) * influence


def attachment(path, vertices):
    data = path.read_text().splitlines()
    fitted, skin, delete = [], [], set()
    in_verts = in_delete = False
    for line in data:
        p = line.split()
        if not p or line.startswith("#"):
            continue
        if p[0] == "verts":
            in_verts = True
            continue
        if p[0] == "delete_verts":
            in_verts = False
            in_delete = True
            continue
        if in_delete:
            i = 0
            while i < len(p):
                a = int(p[i])
                if i + 2 < len(p) and p[i + 1] == "-":
                    delete.update(range(a, int(p[i + 2]) + 1)); i += 3
                else:
                    delete.add(a); i += 1
        elif in_verts and p[0].isdigit():
            if len(p) == 1:
                i = int(p[0]); fitted.append(vertices[i][:]); skin.append(dict(weights[i]))
            else:
                ids = [int(n) for n in p[:3]]
                factors = [float(n) for n in p[3:6]]
                offset = [float(n) for n in p[6:9]]
                fitted.append([sum(vertices[i][a] * f for i, f in zip(ids, factors)) + offset[a] for a in range(3)])
                w = defaultdict(float)
                for i, factor in zip(ids, factors):
                    for bone, value in weights[i].items():
                        w[bone] += value * factor
                skin.append(dict(w))
    return fitted, skin, delete


def compact(vertices, faces, skin, regions=False):
    triangle_regions = []
    if regions:
        # The authored suit is a single connected mesh. Split its triangles at
        # the waist instead of colouring whole triangles across a jagged edge.
        vertices, skin = [v[:] for v in vertices], [dict(w) for w in skin]
        clipped, intersections = [], {}
        waist = 0.7
        def intersection(a, b):
            edge = tuple(sorted((a, b)))
            if edge not in intersections:
                t = (waist - vertices[a][1]) / (vertices[b][1] - vertices[a][1])
                intersections[edge] = len(vertices)
                vertices.append([vertices[a][axis] * (1-t) + vertices[b][axis] * t for axis in range(3)])
                skin.append({bone: skin[a].get(bone, 0) * (1-t) + skin[b].get(bone, 0) * t
                             for bone in skin[a].keys() | skin[b].keys()})
            return intersections[edge]
        for face in faces:
            for i in range(1, len(face)-1):
                triangle = [face[0], face[i], face[i+1]]
                for region in [0, 1]:
                    poly = []
                    for a, b in zip(triangle, triangle[1:] + triangle[:1]):
                        inside_a = vertices[a][1] >= waist if region == 0 else vertices[a][1] <= waist
                        inside_b = vertices[b][1] >= waist if region == 0 else vertices[b][1] <= waist
                        if inside_a: poly.append(a)
                        if inside_a != inside_b: poly.append(intersection(a, b))
                    for j in range(1, len(poly)-1):
                        clipped.append([poly[0], poly[j], poly[j+1]])
                        triangle_regions.append(region)
        faces = clipped
    used = sorted({i for face in faces for i in face})
    lookup = {old: new for new, old in enumerate(used)}
    position, indices, skin_index, skin_weight = [], [], [], []
    for i in used:
        position.extend(round(n, 5) for n in vertices[i])
        w = sorted(skin[i].items(), key=lambda p: p[1], reverse=True)[:4]
        w = [(bone, max(0, weight)) for bone, weight in w]
        total = sum(weight for _, weight in w) or 1
        for bone, weight in w:
            skin_index.append(bone); skin_weight.append(round(weight / total, 6))
        for _ in range(4 - len(w)):
            skin_index.append(0); skin_weight.append(0)
    for face in faces:
        for i in range(1, len(face) - 1):
            indices.extend([lookup[face[0]], lookup[face[i]], lookup[face[i + 1]]])
    mesh = {"position": position, "index": indices, "skinIndex": skin_index, "skinWeight": skin_weight}
    if regions:
        mesh["region"] = triangle_regions
    return mesh


result = {"source": "MakeHuman system assets, CC0", "characters": {}}
for sex in ["male", "female"]:
    vertices = [v[:] for v in base]
    target(vertices, sex + ".target", 0.65)
    target(vertices, "caucasian-" + sex + "-young.target", 0.35)
    joints = {name: [sum(vertices[i][a] for i in ids) / len(ids) for a in range(3)] for name, ids in rig["joints"].items()}
    bones = [{"name": name, "parent": bone_names.index(b["parent"]) if b["parent"] else -1,
              "head": [round(n, 5) for n in joints[b["head"]]], "tail": [round(n, 5) for n in joints[b["tail"]]]}
             for name, b in rig["bones"].items()]
    assets = {}
    suit = "female_elegantsuit01" if sex == "female" else "male_casualsuit01"
    hair = "ponytail01" if sex == "female" else "short04"
    masks = set()
    for label, path in [("outfit", f"clothes/{suit}/{suit}"), ("hair", f"hair/{hair}/{hair}"),
                         ("shoes", "clothes/shoes01/shoes01"), ("eyes", "eyes/high-poly/high-poly")]:
        _, faces, _ = obj(SOURCE / (path + ".obj"))
        fitted, skin, hidden = attachment(SOURCE / (path + ".mhclo"), vertices)
        masks.update(hidden)
        if sex == "female" and label == "shoes":
            # Adapt the ankle boot topology into discreet low shoes under the sari.
            for vertex in fitted:
                if vertex[1] > -7.5:
                    vertex[1] = -7.5 + (vertex[1] + 7.5) * 0.10
        if sex == "female" and label == "outfit":
            # Retain the artist-built blouse; a full-length draped sari replaces the skirt.
            faces = [f for f in faces if sum(fitted[i][1] for i in f) / len(f) > 0.7]
        assets[label] = compact(fitted, faces, skin, label == "outfit" and sex == "male")
    visible = [f for f, g in zip(base_faces, face_groups) if g == "body" and not any(i in masks for i in f)]
    if sex == "female":
        visible = [f for f in visible if sum(vertices[i][1] for i in f) / len(f) > 0.6]
    assets["skin"] = compact(vertices, visible, weights)
    result["characters"][sex] = {"bones": bones, "meshes": assets}

DEST.parent.mkdir(parents=True, exist_ok=True)
DEST.write_text(json.dumps(result, separators=(",", ":")), encoding="utf-8")
print("Prepared", DEST.name, round(DEST.stat().st_size / 1024), "KiB")
for sex, character in result["characters"].items():
    print(sex, [(name, len(mesh["position"]) // 3, len(mesh["index"]) // 3) for name, mesh in character["meshes"].items()])
