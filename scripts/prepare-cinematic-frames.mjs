import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = process.argv[2] ?? "C:/Users/bisme/Downloads/camera";
if (!(await fs.stat(source)).isDirectory())
  throw new Error("Expected an extracted frame folder.");
const files = (await fs.readdir(source, { recursive: true }))
  .filter((name) => /\.(?:jpe?g|png|webp)$/i.test(name))
  .sort(new Intl.Collator("en", { numeric: true }).compare);
if (!files.length) throw new Error("No JPG, PNG or WebP frames found.");
// Separate URLs prevent cached frames from the previous sequence being reused.
const base = `/frames/${path.basename(path.resolve(source))}`;
for (const variant of ["original", "desktop", "mobile"])
  await fs.mkdir(`public${base}/${variant}`, { recursive: true });
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
  const extension = path.extname(file).toLowerCase();
  const originalUrl = `${base}/original/frame-${name}${extension}`;
  const originalPath = `public${originalUrl}`;
  await fs.writeFile(originalPath, bytes);
  const desktop = await sharp(bytes)
    .webp({ quality: 92, effort: 4 })
    .toBuffer();
  await fs.writeFile(`public${base}/desktop/frame-${name}.webp`, desktop);
  const mobile = await sharp(bytes)
    .resize({ width: 960, withoutEnlargement: true })
    .webp({ quality: 88, effort: 4 })
    .toBuffer();
  await fs.writeFile(`public${base}/mobile/frame-${name}.webp`, mobile);
  const originalBytes = bytes.length;
  const webpBytes = desktop.length;
  frames.push({
    source: file,
    desktop:
      webpBytes < originalBytes
        ? `${base}/desktop/frame-${name}.webp`
        : originalUrl,
    mobile: `${base}/mobile/frame-${name}.webp`,
    original: originalUrl,
  });
}
await fs.writeFile(
  "src/content/cinematic-sequence.json",
  JSON.stringify({ width, height, frames }, null, 2) + "\n",
);
console.log(`Prepared ${frames.length} frames at ${width} × ${height}.`);
