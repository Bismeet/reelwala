"use client";

import { useEffect, useRef } from "react";
import {
  SequenceFrameCache,
  sequenceFrameIndex,
  sequenceScrollProgress,
  type SequenceImage,
} from "@/lib/sequence-frame-cache";
import s from "./sequence.module.css";

type Frame = { desktop: string; mobile: string };

async function decodeFrame(blob: Blob): Promise<SequenceImage> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(blob);
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      close: () => bitmap.close(),
    };
  }
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      close: () => {
        image.src = "";
      },
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function ScrollImageSequence({
  frames,
  width,
  height,
}: {
  frames: Frame[];
  width: number;
  height: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = root.current,
      stage = viewport.current,
      surface = canvas.current;
    if (!section || !stage || !surface || !frames.length) return;
    const ctx = surface.getContext("2d", { alpha: false });
    if (!ctx) {
      stage.dataset.sceneReady = "fallback";
      return;
    }
    const small = matchMedia("(max-width: 900px)").matches;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false,
      raf = 0,
      requested = reduced.matches ? frames.length - 1 : 0;
    let lastDrawn = -1,
      width = 0,
      height = 0;
    let hasPainted = false;
    const requestDraw = () => {
      if (!disposed && !raf) raf = requestAnimationFrame(draw);
    };
    const cache = new SequenceFrameCache(
      frames.length,
      async (index, signal) => {
        const response = await fetch(
          small ? frames[index].mobile : frames[index].desktop,
          { signal, cache: "force-cache" },
        );
        if (!response.ok) throw new Error(`Frame ${index + 1} failed to load`);
        return response.blob();
      },
      decodeFrame,
      requestDraw,
      (index) => {
        if (index === requested && !hasPainted) {
          stage.dataset.sceneReady = "fallback";
          const status = stage.querySelector('[role="status"]');
          if (status)
            status.textContent =
              "The moment couldn’t load. Scroll to continue.";
        }
      },
      (small ? 24 : 64) * 1024 * 1024,
      32 * 1024 * 1024,
      !reduced.matches,
    );

    function draw() {
      raf = 0;
      if (disposed || !ctx || !stage || !surface) return;
      // Keep moving through ready frames while a full-resolution frame decodes.
      const available = cache.get(requested) ?? cache.nearest(requested);
      if (!available || !width || !height) return;
      const { image, index } = available;
      if (index === lastDrawn) return;
      const { source, width: iw, height: ih } = image;
      const cover = Math.max(width / iw, height / ih);
      // Portrait screens retain the whole scene over a defocused, full-bleed fill.
      // A cover crop alone would cut off the landscape phone in the final frames.
      if (width / height < 1) {
        ctx.fillStyle = "#fff3e9";
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 0.16;
        ctx.filter = "blur(22px)";
        ctx.drawImage(
          source,
          (width - iw * cover) / 2 - 30,
          (height - ih * cover) / 2 - 30,
          iw * cover + 60,
          ih * cover + 60,
        );
        ctx.filter = "none";
        ctx.globalAlpha = 1;
        const contain = Math.min(width / iw, height / ih);
        ctx.drawImage(
          source,
          (width - iw * contain) / 2,
          (height - ih * contain) / 2,
          iw * contain,
          ih * contain,
        );
      } else {
        ctx.filter = "none";
        ctx.drawImage(
          source,
          (width - iw * cover) / 2,
          (height - ih * cover) / 2,
          iw * cover,
          ih * cover,
        );
      }
      lastDrawn = index;
      hasPainted = true;
      stage.dataset.frameIndex = String(index);
      if (stage.dataset.sceneReady !== "true")
        stage.dataset.sceneReady = "true";
      stage.dataset.decodedFrames = String(cache.stats.decodedFrames);
    }

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      surface.width = Math.round(width * dpr);
      surface.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawn = -1;
      requestDraw();
    };
    const observe = new ResizeObserver(resize);
    observe.observe(stage);
    resize();
    cache.setTarget(requested);

    const progress = (value: number) => {
      requested = sequenceFrameIndex(value, frames.length);
      stage.dataset.requestedFrame = String(requested);
      stage.dataset.sceneProgress = String(value);
      const phase = value >= 0.999 ? "3" : "0";
      if (stage.dataset.heroPhase !== phase) stage.dataset.heroPhase = phase;
      cache.setTarget(requested);
      requestDraw();
    };
    const updateProgress = () => {
      progress(
        reduced.matches
          ? 1
          : sequenceScrollProgress(
              section.getBoundingClientRect().top,
              section.offsetHeight,
              stage.offsetHeight,
            ),
      );
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
    const changeMotion = () => {
      cache.setProgressive(!reduced.matches);
      updateProgress();
    };
    reduced.addEventListener("change", changeMotion);
    return () => {
      disposed = true;
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      reduced.removeEventListener("change", changeMotion);
      observe.disconnect();
      cancelAnimationFrame(raf);
      cache.dispose();
    };
  }, [frames]);

  if (!frames.length) return null;
  const first = frames[0],
    last = frames[frames.length - 1];
  return (
    <div ref={root} className={s.sequence} data-sequence-section>
      <div
        ref={viewport}
        className={s.viewport}
        data-hero-stage
        data-image-sequence
        data-hero-phase="0"
        data-frame-count={frames.length}
      >
        <picture className={s.poster}>
          <source
            media="(prefers-reduced-motion: reduce) and (max-width: 900px)"
            srcSet={last.mobile}
          />
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet={last.desktop}
          />
          <source media="(max-width: 900px)" srcSet={first.mobile} />
          {/* The initial frame is a native priority image; it must not wait for hydration. */}
          <img
            src={first.desktop}
            alt="An orange camera floating above a sculpted pedestal."
            width={width}
            height={height}
            fetchPriority="high"
          />
        </picture>
        <canvas ref={canvas} className={s.canvas} aria-hidden="true" />
        <p className={s.loading} role="status">
          Loading the moment…
        </p>
        <p className={s.hint}>
          SCROLL TO CAPTURE THE MOMENT <span aria-hidden="true">↓</span>
        </p>
      </div>
    </div>
  );
}
