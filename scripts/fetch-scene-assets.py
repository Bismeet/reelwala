"""Download complete CC0 Poly Haven models with their original PBR textures."""
import concurrent.futures
import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "art-source/polyhaven"
DEST = ROOT / "art-source/polyhaven-assets"
SOURCE.mkdir(parents=True, exist_ok=True)
DEST.mkdir(parents=True, exist_ok=True)
HEADERS = {"User-Agent": "TheReelWala-local-scene-development"}
ASSETS = ["dining_chair_02", "round_wooden_table_02", "potted_plant_02",
          "potted_plant_04", "modern_ceiling_lamp_01", "strawberry_chocolate_cake",
          "ceramic_vase_03", "flower_heliophila", "modern_arm_chair_01",
          "modern_coffee_table_01", "modern_wooden_cabinet", "brass_candleholders"]

def fetch(url, path):
    if path.exists() and path.stat().st_size:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=90) as response:
        data = response.read()
    path.write_bytes(data)

def model(asset):
    metadata = SOURCE / (asset + ".json")
    fetch("https://api.polyhaven.com/files/" + asset, metadata)
    data = json.loads(metadata.read_text())
    gltf = data["gltf"]["1k"]["gltf"]
    folder = DEST / asset
    fetch(gltf["url"], folder / (asset + ".gltf"))
    for relative, item in gltf["include"].items():
        fetch(item["url"], folder / relative)
    print("Ready:", asset, sum(p.stat().st_size for p in folder.rglob("*") if p.is_file()), "bytes", flush=True)

if __name__ == "__main__":
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for result in pool.map(model, ASSETS):
            pass

