import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const origin =
  "C:/Users/bisme/.codex/generated_images/01a121ba-f2af-73d3-b3b3-9db0185c658a/";
await mkdir("public/media", { recursive: true });
for (const [name, file] of [
  ["celebration", "exec-cf0343cd-6bc7-4d3b-b1a0-6064bbaa82f3.png"],
  ["corporate", "exec-a699dbe3-1c83-4772-b2ec-3c2d8e0b700b.png"],
  ["festival", "exec-1ddca1bf-0add-443e-93a1-0516de1dc8ea.png"],
])
  await sharp(origin + file)
    .resize({ width: 1440, withoutEnlargement: true })
    .webp({ quality: 83 })
    .toFile(`public/media/${name}.webp`);
const pkg = JSON.parse(await readFile("package.json", "utf8"));
const lock = JSON.parse(await readFile("package-lock.json", "utf8"));
for (const section of ["dependencies", "devDependencies"])
  for (const name of Object.keys(pkg[section]))
    pkg[section][name] = lock.packages[`node_modules/${name}`].version;
await writeFile("package.json", JSON.stringify(pkg, null, 2) + "\n");
