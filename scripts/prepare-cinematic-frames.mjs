import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source =
  process.argv[2] ?? "C:/Users/bisme/Downloads/ezgif-83cd1bf33305a7c9-jpg";
if (!(await fs.stat(source)).isDirectory())
  throw new Error("Expected an extracted frame folder.");
const files = (await fs.readdir(source, { recursive: true }))
  .filter((name) => /\.jpe?g$/i.test(name))
  .sort(new Intl.Collator("en", { numeric: true }).compare);
if (!files.length) throw new Error("No JPG frames found.");
await fs.mkdir("public/frames/original", { recursive: true });
await fs.mkdir("public/frames/desktop", { recursive: true });
await fs.mkdir("public/frames/mobile", { recursive: true });
const frames = [];
let width, height;
for (const [index, file] of files.entries()) {
  const input = path.join(source, file);
  const bytes = await fs.readFile(input);
  const metadata = await sharp(bytes).metadata();
  width ??= metadata.width;
  height ??= metadata.height;
  if (metadata.width !== width || metadata.height !== height)
    throw new Error(`Frame dimensions differ: ${file}`);
  const name = String(index + 1).padStart(4, "0");
  const originalPath = `public/frames/original/frame-${name}.jpg`;
  // Originals already present are left intact while the preview serves them.
  if ((await fs.stat(originalPath).catch(() => null))?.size !== bytes.length)
    await fs.writeFile(originalPath, bytes);
  const desktop = await sharp(bytes).webp({ quality: 85, effort: 4 }).toBuffer();
  await fs.writeFile(`public/frames/desktop/frame-${name}.webp`, desktop);
  const mobile = await sharp(bytes)
    .resize({ width: 960, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  await fs.writeFile(`public/frames/mobile/frame-${name}.webp`, mobile);
  const originalBytes = bytes.length;
  const webpBytes = desktop.length;
  frames.push({
    source: file,
    desktop:
      webpBytes < originalBytes
        ? `/frames/desktop/frame-${name}.webp`
        : `/frames/original/frame-${name}.jpg`,
    mobile: `/frames/mobile/frame-${name}.webp`,
    original: `/frames/original/frame-${name}.jpg`,
  });
}
await fs.writeFile(
  "src/content/cinematic-sequence.json",
  JSON.stringify({ width, height, frames }, null, 2) + "\n",
);
console.log(`Prepared ${frames.length} frames at ${width} × ${height}.`);
