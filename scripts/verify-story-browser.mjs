import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

// Use an installed Playwright package, or set PLAYWRIGHT_MODULE to its module URL.
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const origin = process.env.PREVIEW_ORIGIN || "http://127.0.0.1:3001";
const out = "output/story-review";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
await page.goto(origin, { waitUntil: "networkidle" });
await page.waitForFunction(
  () => document.documentElement.dataset.scrollReady === "true",
);
await page.waitForTimeout(1500);
assert.ok(
  (await page.locator(".pin-spacer").count()) === 2,
  "hero and edit should each have one desktop pin",
);
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-scene-kind="hero"]')
      ?.getAttribute("data-scene-ready") === "true",
);
await page.waitForTimeout(650);
await page.screenshot({ path: `${out}/desktop-home.png` });
assert.equal(
  await page
    .locator("[data-hero-copy]")
    .evaluate((n) => getComputedStyle(n).visibility),
  "hidden",
  "headline should wait for animation",
);
assert.equal(await page.locator("h1").count(), 1);
assert.equal(await page.locator("form").count(), 2);
assert.equal(await page.locator("[data-enquiry-service]").count(), 24);
assert.equal(await page.locator('img[src*="/media/"]').count(), 0);
const heroProgress = () =>
  page.locator('[data-scene-kind="hero"]').getAttribute("data-render-progress");
assert.ok(
  Number(await heroProgress()) < 0.1,
  "hero must begin with the celebration",
);
await page.mouse.wheel(0, 900);
await page.waitForTimeout(1800);
assert.equal(
  await page.locator("[data-hero-stage]").getAttribute("data-hero-phase"),
  "1",
);
await page.screenshot({ path: `${out}/hero-unfold.png` });
await page.mouse.wheel(0, 1250);
await page.waitForTimeout(1800);
assert.ok(
  Number(await heroProgress()) > 0.93,
  "hero did not become a portrait reel",
);
await page.screenshot({ path: `${out}/hero-replay.png` });
assert.equal(
  await page.locator("[data-hero-stage]").getAttribute("data-hero-phase"),
  "3",
);
assert.ok(
  await page.locator("[data-hero-copy]").isVisible(),
  "copy should appear after recording transition",
);
const beforeClick = await page.evaluate(() => window.scrollY);
await page.locator("#hero-title").click();
await page.waitForTimeout(1000);
assert.ok(
  Math.abs((await page.evaluate(() => window.scrollY)) - beforeClick) < 5,
  "heading click changed scroll position",
);

await page.getByRole("button", { name: "Replay the moment" }).click();
await page.waitForTimeout(250);
assert.ok(
  Number(
    await page
      .locator('[data-scene-kind="hero"]')
      .getAttribute("data-recording-progress"),
  ) < 0.7,
  "replay button must restart the gesture",
);
await page.screenshot({ path: `${out}/hero-replaying.png` });
await page.waitForTimeout(1600);
assert.ok(
  Number(
    await page
      .locator('[data-scene-kind="hero"]')
      .getAttribute("data-recording-progress"),
  ) > 0.95,
  "replay gesture must finish",
);
await page.mouse.wheel(0, -2150);
await page.waitForTimeout(1800);
assert.ok(
  Number(await heroProgress()) < 0.05,
  "hero camera must reverse smoothly",
);

async function goTo(id) {
  await page.evaluate((id) => {
    const link = document.createElement("a");
    link.href = `/#${id}`;
    document.body.append(link);
    link.click();
    link.remove();
  }, id);
  await page.waitForTimeout(1500);
  assert.equal(new URL(page.url()).pathname, "/");
}
for (const id of [
  "story",
  "services",
  "work",
  "how-it-works",
  "pricing",
  "enquiry",
  "become-a-creator",
]) {
  await goTo(id);
  await page.screenshot({ path: `${out}/desktop-${id}.png` });
}

await goTo("work");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-scene-kind="edit"]')
      ?.getAttribute("data-scene-ready") === "true",
);
const originalProgress = Number(
  await page
    .locator('[data-scene-kind="edit"]')
    .getAttribute("data-render-progress"),
);
assert.ok(originalProgress < 0.3, "edit must begin with separate 3D moments");
await page.mouse.wheel(0, 500);
await page.waitForTimeout(1300);
await page.screenshot({ path: `${out}/desktop-edit-middle.png` });
await page.mouse.wheel(0, 500);
await page.waitForTimeout(1300);
await page.mouse.wheel(0, 200);
await page.waitForTimeout(1000);
await page.screenshot({ path: `${out}/desktop-edit-finished.png` });
const assembledProgress = Number(
  await page
    .locator('[data-scene-kind="edit"]')
    .getAttribute("data-render-progress"),
);
assert.ok(assembledProgress > 0.9, "3D moments did not assemble into a reel");
for (const kind of ["private", "corporate", "cultural"]) {
  await goTo(kind === "cultural" ? "social-cultural" : kind);
  await page.waitForFunction(
    (kind) =>
      document
        .querySelector(`[data-scene-kind="${kind}"]`)
        ?.getAttribute("data-scene-ready") === "true",
    kind,
  );
  await page.screenshot({ path: `${out}/3d-${kind}.png` });
}
assert.equal(await page.locator('[data-scene-ready="true"] canvas').count(), 6);
// Exercise a real GPU context loss and restoration, including reflection resources.
await goTo("home");
await page.locator('[data-scene-kind="hero"] canvas').evaluate((canvas) => {
  canvas.qaContext = canvas
    .getContext("webgl2")
    .getExtension("WEBGL_lose_context");
  canvas.qaContext.loseContext();
});
await page.waitForFunction(
  () =>
    document.querySelector('[data-scene-kind="hero"]').dataset.sceneReady ===
    "fallback",
);
assert.equal(
  await page
    .locator('[data-scene-kind="hero"]')
    .getAttribute("data-scene-ready"),
  "fallback",
);
await page.screenshot({ path: `${out}/webgl-fallback.png` });
await page.waitForTimeout(600);
await page
  .locator('[data-scene-kind="hero"] canvas')
  .evaluate((canvas) => canvas.qaContext.restoreContext());
await page.waitForFunction(
  () =>
    document.querySelector('[data-scene-kind="hero"]').dataset.sceneReady ===
    "true",
);
assert.equal(
  await page
    .locator('[data-scene-kind="hero"]')
    .getAttribute("data-scene-ready"),
  "true",
);

const direct = await browser.newPage({
  viewport: { width: 1440, height: 900 },
});
direct.on("pageerror", (error) => errors.push(error.message));
await direct.goto(`${origin}/#enquiry`, { waitUntil: "networkidle" });
await direct.waitForTimeout(1500);
const directTop = await direct
  .locator("#enquiry")
  .evaluate((node) => node.getBoundingClientRect().top);
assert.ok(
  directTop >= 80 && directTop < 150,
  `direct enquiry link shifted after pin creation: ${directTop}`,
);
await direct.emulateMedia({ reducedMotion: "reduce" });
await direct.waitForTimeout(600);
assert.equal(await direct.locator(".pin-spacer").count(), 0);
await direct.emulateMedia({ reducedMotion: "no-preference" });
await direct.waitForTimeout(1000);
assert.equal(await direct.locator(".pin-spacer").count(), 2);
await direct.close();

await goTo("how-it-works");
let top = await page
  .locator("#how-it-works")
  .evaluate((node) => node.getBoundingClientRect().top);
assert.ok(top >= 70 && top < 170, `How It Works anchor is misplaced: ${top}`);
await page
  .locator('header nav[aria-label="Main navigation"] a[href="/#services"]')
  .click();
await page.waitForTimeout(1400);
assert.equal(new URL(page.url()).hash, "#services");
await page.locator("[data-enquiry-service]").first().click();
await page.waitForTimeout(1400);
assert.equal(new URL(page.url()).hash, "#enquiry");
const selectedService = await page
  .locator("[data-enquiry-service]")
  .first()
  .getAttribute("data-enquiry-service");
assert.equal(
  await page.locator('[name="serviceId"]').inputValue(),
  selectedService,
);

for (const width of [768, 390, 360]) {
  const mobile = await browser.newPage({
    viewport: { width, height: width === 768 ? 1024 : 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1,
  });
  mobile.on("pageerror", (error) => errors.push(error.message));
  await mobile.goto(origin, { waitUntil: "networkidle" });
  await mobile.waitForFunction(
    () =>
      document
        .querySelector('[data-scene-kind="hero"]')
        ?.getAttribute("data-scene-ready") === "true",
  );
  await mobile.waitForTimeout(1000);
  const overflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth - innerWidth,
  );
  assert.ok(overflow <= 1, `horizontal overflow at ${width}: ${overflow}`);
  await mobile.screenshot({ path: `${out}/mobile-${width}-home.png` });
  await mobile.mouse.wheel(0, 900);
  await mobile.waitForTimeout(900);
  assert.ok(
    Number(
      await mobile
        .locator('[data-scene-kind="hero"]')
        .getAttribute("data-render-progress"),
    ) > 0.25,
    "touch hero did not move towards recording",
  );
  await mobile.screenshot({ path: `${out}/mobile-${width}-unfold.png` });
  await mobile.mouse.wheel(0, -900);
  await mobile.waitForTimeout(900);
  assert.equal(
    await mobile.locator("[data-site-header]").isVisible(),
    false,
    "navigation should hide again when the story reverses",
  );
  await mobile
    .locator("#home")
    .evaluate((node) =>
      window.scrollTo(
        0,
        (node.getBoundingClientRect().bottom + scrollY - innerHeight) * 0.985,
      ),
    );
  await mobile.waitForFunction(
    () =>
      document.querySelector("[data-hero-stage]")?.dataset.heroPhase === "3",
  );
  await mobile.waitForTimeout(500);
  await mobile.getByRole("button", { name: "Open navigation menu" }).click();
  await mobile.locator('dialog a[href="/#how-it-works"]').click();
  await mobile.waitForTimeout(1800);
  assert.equal(await mobile.locator("dialog[open]").count(), 0);
  assert.equal(new URL(mobile.url()).pathname, "/");
  assert.equal(new URL(mobile.url()).hash, "#how-it-works");
  top = await mobile
    .locator("#how-it-works")
    .evaluate((node) => node.getBoundingClientRect().top);
  assert.ok(
    top >= 60 && top < 160,
    `mobile section covered at ${width}: ${top}`,
  );
  await mobile.screenshot({ path: `${out}/mobile-${width}-process.png` });
  for (const id of ["services", "work", "enquiry", "application"]) {
    await mobile.goto(`${origin}/#${id}`, { waitUntil: "networkidle" });
    await mobile.waitForTimeout(1800);
    await mobile.screenshot({ path: `${out}/mobile-${width}-${id}.png` });
  }
  await mobile.close();
}
const reduced = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
await reduced.goto(`${origin}/#work`, { waitUntil: "networkidle" });
await reduced.waitForTimeout(700);
await reduced.waitForFunction(
  () =>
    document
      .querySelector('[data-scene-kind="edit"]')
      ?.getAttribute("data-scene-ready") === "true",
);
const stillProgress = await reduced
  .locator('[data-scene-kind="edit"]')
  .getAttribute("data-render-progress");
await reduced.mouse.wheel(0, 200);
await reduced.waitForTimeout(700);
assert.equal(
  await reduced
    .locator('[data-scene-kind="edit"]')
    .getAttribute("data-render-progress"),
  stillProgress,
  "reduced motion scene moved",
);
assert.equal(await reduced.locator(".pin-spacer").count(), 0);
assert.notEqual(
  await reduced.evaluate(() => document.documentElement.dataset.smoothScroll),
  "true",
);
await reduced.screenshot({ path: `${out}/reduced-motion-work.png` });
assert.deepEqual(errors, [], "browser errors");
await browser.close();
console.log(
  "Story browser checks passed: desktop anchors, content click, service selection, mobile menus/layouts, reduced motion, no runtime errors.",
);
