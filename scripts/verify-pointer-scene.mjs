import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const origin = process.env.PREVIEW_ORIGIN || "http://127.0.0.1:3001";
await mkdir("output/story-review", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
try {
  for (const width of [1440, 768, 390, 360]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 1440 ? 1000 : 844 },
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(origin, { waitUntil: "networkidle" });
    const hero = page.locator('[data-scene-kind="hero"]');
    await page.waitForFunction(
      () =>
        document.querySelector('[data-scene-kind="hero"]')?.dataset
          .sceneReady === "true",
    );
    await page.waitForTimeout(1500);
    const still = await hero.screenshot();
    const liveTime = Number(await hero.getAttribute("data-live-gesture-time"));
    await page.waitForTimeout(1000);
    const moving = await hero.screenshot();
    assert.ok(
      Number(await hero.getAttribute("data-live-gesture-time")) >
        liveTime + 0.2,
      "the party must animate without mouse movement or scrolling",
    );
    const regions =
      width === 1440
        ? [
            { left: 150, top: 300, width: 700, height: 500 },
            { left: 50, top: 80, width: 1100, height: 230 },
          ]
        : [{ left: 0, top: 0, width, height: 844 }];
    for (const region of regions) {
      const before = await sharp(still)
        .extract(region)
        .removeAlpha()
        .raw()
        .toBuffer();
      const after = await sharp(moving)
        .extract(region)
        .removeAlpha()
        .raw()
        .toBuffer();
      let changedPixels = 0;
      for (let pixel = 0; pixel < before.length; pixel += 3)
        if (
          Math.abs(before[pixel] - after[pixel]) +
            Math.abs(before[pixel + 1] - after[pixel + 1]) +
            Math.abs(before[pixel + 2] - after[pixel + 2]) >
          30
        )
          changedPixels++;
      assert.ok(
        changedPixels > 300,
        "people and vegetation must visibly move, not only update metadata",
      );
    }
    const captures = await hero.getAttribute("data-recording-renders");
    await page.mouse.move(width * 0.85, 220, { steps: 10 });
    await page.waitForTimeout(1400);
    const offset = (await hero.getAttribute("data-pointer-offset"))
      .split(",")
      .map(Number);
    assert.ok(
      offset[0] > 0.5 && offset[0] < 1.1,
      `mouse should shift scene at ${width}px`,
    );
    assert.ok(
      Number(await hero.getAttribute("data-recording-renders")) >
        Number(captures),
      "phone should capture the responding elements",
    );
    assert.ok(
      Number(await hero.getAttribute("data-reactive-elements")) >= 16,
      "trees, plants, lanterns, lights, table, guests and creator should respond",
    );
    assert.ok(Number(await hero.getAttribute("data-element-motion")) > 0.015);
    assert.equal(
      await page.evaluate(() => scrollY),
      0,
      "mouse movement must not scroll the page",
    );
    await page.screenshot({ path: `output/story-review/pointer-${width}.png` });
    await page.locator("[data-hero-stage]").dispatchEvent("pointerleave");
    await page.waitForTimeout(1700);
    assert.equal(
      await hero.getAttribute("data-pointer-offset"),
      "0.0000,0.0000",
    );
    assert.ok(
      Number(await hero.getAttribute("data-element-motion")) > 0,
      "breeze continues after the mouse leaves",
    );
    await hero.evaluate((n) => {
      window.pointerFrames = 0;
      window.pointerObserver = new MutationObserver(
        () => window.pointerFrames++,
      );
      window.pointerObserver.observe(n, {
        attributes: true,
        attributeFilter: ["data-pointer-offset"],
      });
    });
    await page.waitForTimeout(350);
    assert.ok(
      await page.evaluate(() => window.pointerFrames),
      "the idle opening should remain lively",
    );
    await page.mouse.wheel(0, 2150);
    await page.waitForFunction(
      () =>
        Number(
          document.querySelector('[data-scene-kind="hero"]')?.dataset
            .renderProgress,
        ) > 0.94,
    );
    await page.waitForTimeout(700);
    await page.mouse.move(width * 0.2, 300);
    await page.waitForTimeout(400);
    assert.equal(
      await hero.getAttribute("data-pointer-offset"),
      "0.0000,0.0000",
      "final phone composition stays steady",
    );
    assert.ok(await page.locator("[data-site-header]").isVisible());
    assert.equal(await hero.getAttribute("data-element-motion"), "0.00000");
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      window.pointerFrames = 0;
    });
    await page.waitForTimeout(350);
    assert.equal(
      await page.evaluate(() => window.pointerFrames),
      0,
      "final scene stops ambient rendering",
    );
    await page.close();
  }
  for (const reducedMotion of ["reduce", "no-preference"]) {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      reducedMotion,
    });
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.waitForFunction(
      () =>
        document.querySelector('[data-scene-kind="hero"]')?.dataset
          .sceneReady === "true",
    );
    const hero = page.locator('[data-scene-kind="hero"]');
    await hero.dispatchEvent("pointermove", {
      pointerType: reducedMotion === "reduce" ? "mouse" : "touch",
      clientX: 380,
      clientY: 100,
    });
    await page.waitForTimeout(500);
    assert.equal(
      await hero.getAttribute("data-pointer-offset"),
      "0.0000,0.0000",
    );
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    "Visible idle gestures/vegetation, mouse response, paced captures, steady final reveal and reduced motion passed at four widths.",
  );
} finally {
  if (errors.length) console.error(errors);
  await browser.close();
}
