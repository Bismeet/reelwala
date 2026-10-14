import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const origin = process.env.PREVIEW_ORIGIN || "http://127.0.0.1:3001";
const out = "output/story-review";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
try {
  for (const width of [1440, 768, 390, 360]) {
    const page = await browser.newPage({
      viewport: {
        width,
        height: width === 1440 ? 1000 : width === 768 ? 1024 : 844,
      },
      deviceScaleFactor: 1,
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.waitForFunction(
      () =>
        document.querySelector('[data-scene-kind="hero"]')?.dataset
          .sceneReady === "true",
    );
    await page.waitForTimeout(700);
    assert.equal(
      await page.locator("[data-site-header]").isVisible(),
      false,
      "navigation should wait for the hero animation",
    );
    assert.equal(
      await page.locator("[data-site-header]").evaluate((n) => n.inert),
      true,
      "hidden navigation must not capture keyboard focus",
    );
    assert.equal(
      await page
        .locator("[data-hero-stage]")
        .evaluate((n) => Math.round(n.getBoundingClientRect().top)),
      0,
      "the opening scene should fill the screen from the top",
    );
    assert.equal(
      await page
        .locator("[data-hero-copy]")
        .evaluate((n) => getComputedStyle(n).visibility),
      "hidden",
    );
    await page.screenshot({ path: `${out}/human-${width}-opening.png` });
    const travel =
      width > 900
        ? 2150
        : await page
            .locator("#home")
            .evaluate(
              (n) =>
                (n.getBoundingClientRect().bottom + scrollY - innerHeight) *
                0.985,
            );
    await page.mouse.wheel(0, travel);
    await page.waitForFunction(
      () =>
        Number(
          document.querySelector('[data-scene-kind="hero"]')?.dataset
            .renderProgress,
        ) > 0.94,
    );
    await page.waitForTimeout(650);
    assert.ok(await page.locator("[data-site-header]").isVisible());
    assert.equal(
      await page.locator("[data-site-header]").evaluate((n) => n.inert),
      false,
    );
    assert.ok(await page.locator("[data-hero-copy]").isVisible());
    await page.screenshot({ path: `${out}/human-${width}-final.png` });
    const replay = page.getByRole("button", { name: "Replay the moment" });
    await replay.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(250);
    assert.ok(
      Number(
        await page
          .locator('[data-scene-kind="hero"]')
          .getAttribute("data-recording-progress"),
      ) < 0.7,
    );
    await page.waitForTimeout(1700);
    assert.ok(
      Number(
        await page
          .locator('[data-scene-kind="hero"]')
          .getAttribute("data-recording-progress"),
      ) > 0.95,
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
    console.log(
      `Human stage passed at ${width}px: scroll, delayed copy, keyboard replay, overflow.`,
    );
    await page.close();
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
