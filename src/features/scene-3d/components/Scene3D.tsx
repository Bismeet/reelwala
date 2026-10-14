"use client";

import { useEffect, useRef } from "react";
import type { StoryScene } from "@/features/scene-3d/lib/story-models";
import s from "./scene.module.css";

export default function Scene3D({
  kind,
  className = "",
}: {
  kind: StoryScene;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false,
      loading = false,
      cleanup: (() => void) | undefined;
    const host = root.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loading) return;
        loading = true;
        observer.disconnect();
        void import("@/features/scene-3d/lib/story-renderer")
          .then(({ mountStoryScene }) => {
            if (!disposed) cleanup = mountStoryScene(host, kind);
          })
          .catch(() => {
            if (!disposed) host.dataset.sceneReady = "fallback";
          });
      },
      { rootMargin: "350px" },
    );
    observer.observe(host);
    return () => {
      disposed = true;
      observer.disconnect();
      cleanup?.();
    };
  }, [kind]);
  return (
    <div
      ref={root}
      className={`${s.scene} ${className}`}
      data-scene-kind={kind}
      aria-hidden="true"
    >
      <svg className={s.poster} viewBox="0 0 600 500" fill="none">
        <ellipse
          cx="300"
          cy="427"
          rx="145"
          ry="16"
          fill="#102b27"
          opacity=".12"
        />
        {kind === "hero" ? (
          <g />
        ) : kind === "private" ? (
          <g stroke="#AF8C51" strokeWidth="2">
            <path
              d="M210 370v-80h180v80M235 290v-65h130v65M260 225v-55h80v55"
              fill="#fff5df"
            />
            <path d="M300 170v-38" stroke="#F59E0B" strokeWidth="8" />
            <ellipse cx="170" cy="170" rx="35" ry="46" fill="#07AC9F" />
            <path d="M170 216v150" />
            <ellipse cx="430" cy="140" rx="35" ry="46" fill="#F59E0B" />
            <path d="M430 186v180" />
          </g>
        ) : kind === "corporate" ? (
          <g>
            <path
              d="m300 95 33 100 104 0-84 61 32 100-85-62-85 62 32-100-84-61h104z"
              fill="#F59E0B"
            />
            <path d="M300 293v87" stroke="#AF8C51" strokeWidth="15" />
            <ellipse cx="300" cy="387" rx="70" ry="18" fill="#102b27" />
            <ellipse
              cx="300"
              cy="234"
              rx="190"
              ry="55"
              stroke="#07AC9F"
              strokeWidth="10"
              transform="rotate(-30 300 234)"
            />
          </g>
        ) : kind === "cultural" ? (
          <g>
            <path
              d="M155 390V230a145 145 0 0 1 290 0v160"
              stroke="#F59E0B"
              strokeWidth="10"
            />
            <path d="m210 295 145-58 40 105-145 58z" fill="#db6042" />
            <ellipse
              cx="228"
              cy="349"
              rx="25"
              ry="57"
              fill="#fff5df"
              transform="rotate(-21 228 349)"
            />
            <ellipse cx="392" cy="220" rx="32" ry="45" fill="#07AC9F" />
            <ellipse cx="220" cy="188" rx="32" ry="45" fill="#07AC9F" />
          </g>
        ) : kind === "capture" ? (
          <g stroke="#F59E0B" strokeWidth="12">
            <circle cx="300" cy="255" r="133" />
            <circle cx="300" cy="255" r="101" />
            <circle cx="300" cy="255" r="66" fill="#07AC9F" />
            <path
              d="M130 155v-70h70m200 0h70v70M130 350v70h70m200 0h70v-70"
              strokeWidth="3"
            />
          </g>
        ) : kind === "edit" ? (
          <g stroke="#F59E0B" strokeWidth="8">
            <rect
              x="60"
              y="100"
              width="140"
              height="270"
              rx="10"
              fill="#fff5df"
              transform="rotate(-9 130 235)"
            />
            <rect
              x="230"
              y="90"
              width="140"
              height="270"
              rx="10"
              fill="#07AC9F"
            />
            <rect
              x="400"
              y="100"
              width="140"
              height="270"
              rx="10"
              fill="#db6042"
              transform="rotate(9 470 235)"
            />
          </g>
        ) : (
          <g>
            <rect
              x="215"
              y="68"
              width="170"
              height="340"
              rx="15"
              stroke="#F59E0B"
              strokeWidth="10"
              transform="rotate(-12 300 238)"
            />
            <ellipse
              cx="300"
              cy="245"
              rx="200"
              ry="77"
              stroke="#F59E0B"
              strokeWidth="22"
              transform="rotate(-35 300 245)"
            />
            <circle cx="468" cy="145" r="35" fill="#07AC9F" />
            <path d="m137 316 34-35 35 35-35 35z" fill="#07AC9F" />
          </g>
        )}
      </svg>
      <svg className={s.orbit} viewBox="0 0 600 500" fill="none">
        <ellipse
          cx="300"
          cy="265"
          rx="255"
          ry="183"
          stroke="currentColor"
          strokeWidth=".6"
          strokeDasharray="2 9"
        />
        <path
          d="M30 265h26m488 0h26M300 36v22m0 414v-22"
          stroke="currentColor"
        />
        <circle cx="300" cy="36" r="3" fill="currentColor" />
      </svg>
    </div>
  );
}
