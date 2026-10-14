"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function StoryMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    let setup: (() => void) | undefined;
    let initialized = false;
    const ready = () => setup?.();
    window.addEventListener("reelwala:scroll-ready", ready);
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed || !root.current) return;
        gsap.registerPlugin(ScrollTrigger);
        setup = () => {
          cleanup?.();
          const media = gsap.matchMedia();
          media.add(
            {
              motion: "(prefers-reduced-motion: no-preference)",
              desktop: "(hover:hover) and (pointer:fine)",
            },
            (context) => {
              if (!context.conditions?.motion || !root.current) return;
              const scope = root.current;
              const select = gsap.utils.selector(scope);
              if (select("[data-hero-art]").length)
                gsap.from(select("[data-hero-art]"), {
                  y: 25,
                  duration: 1.2,
                  ease: "power3.out",
                  clearProps: "transform",
                });
              const hero = select(
                "[data-hero-stage]:not([data-image-sequence])",
              )[0] as HTMLElement;
              if (hero) {
                const state = { progress: 0 };
                gsap.to(state, {
                  progress: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: context.conditions.desktop
                      ? hero
                      : select("#home")[0],
                    start: "top top",
                    end: context.conditions.desktop
                      ? "+=2200"
                      : "bottom bottom",
                    pin: context.conditions.desktop ? hero : false,
                    scrub: context.conditions.desktop ? true : 0.45,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                  },
                  onUpdate: () => {
                    hero.dataset.sceneProgress = String(state.progress);
                    const phase =
                      state.progress < 0.35
                        ? "0"
                        : state.progress < 0.8
                          ? "1"
                          : state.progress < 0.94
                            ? "2"
                            : "3";
                    if (hero.dataset.heroPhase !== phase)
                      hero.dataset.heroPhase = phase;
                    const bar = hero.querySelector<HTMLElement>(
                      "[data-hero-progress]",
                    );
                    if (bar) bar.style.transform = `scaleX(${state.progress})`;
                    window.dispatchEvent(new Event("reelwala:scene-progress"));
                  },
                });
              }
              scope
                .querySelectorAll<HTMLElement>("[data-reveal]")
                .forEach((element) => {
                  gsap.from(element, {
                    y: 30,
                    duration: 0.85,
                    ease: "power3.out",
                    scrollTrigger: {
                      trigger: element,
                      start: "top 94%",
                      once: true,
                    },
                  });
                });
              if (
                select("[data-focus-frame]").length &&
                select("[data-capture-stage]").length
              )
                gsap.fromTo(
                  select("[data-focus-frame]"),
                  { scale: 1.18, rotation: -5 },
                  {
                    scale: 0.9,
                    rotation: 0,
                    ease: "none",
                    scrollTrigger: {
                      trigger: select("[data-capture-stage]")[0],
                      start: "top 75%",
                      end: "bottom 25%",
                      scrub: 0.4,
                    },
                  },
                );
              const edit = select("[data-edit-stage]")[0] as HTMLElement;
              if (edit && context.conditions.desktop) {
                const timeline = gsap.timeline({
                  scrollTrigger: {
                    trigger: edit,
                    start: "top 115px",
                    end: "+=800",
                    pin: true,
                    scrub: 0.5,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                  },
                });
                const state = { progress: 0 };
                timeline.to(
                  state,
                  {
                    progress: 1,
                    duration: 2,
                    ease: "none",
                    onUpdate: () => {
                      edit.dataset.sceneProgress = String(state.progress);
                      window.dispatchEvent(
                        new Event("reelwala:scene-progress"),
                      );
                    },
                  },
                  0,
                );
                timeline.to(
                  select("[data-edit-playhead]"),
                  {
                    x: () => edit.clientWidth * 0.7,
                    duration: 2,
                    ease: "none",
                  },
                  0,
                );
                timeline.to(
                  select("[data-edit-timeline]"),
                  { autoAlpha: 0, duration: 0.3 },
                  1.6,
                );
                timeline.fromTo(
                  select("[data-edit-finished]"),
                  { autoAlpha: 0, y: 12 },
                  { autoAlpha: 1, y: 0, duration: 0.4 },
                  1.6,
                );
                return () => {
                  if (hero) {
                    delete hero.dataset.sceneProgress;
                    hero.dataset.heroPhase = "0";
                    const bar = hero.querySelector<HTMLElement>(
                      "[data-hero-progress]",
                    );
                    if (bar) bar.style.removeProperty("transform");
                  }
                  delete edit.dataset.sceneProgress;
                  window.dispatchEvent(new Event("reelwala:scene-progress"));
                };
              }
              return () => {
                if (hero) {
                  delete hero.dataset.sceneProgress;
                  hero.dataset.heroPhase = "0";
                  const bar = hero.querySelector<HTMLElement>(
                    "[data-hero-progress]",
                  );
                  if (bar) bar.style.removeProperty("transform");
                  window.dispatchEvent(new Event("reelwala:scene-progress"));
                }
              };
            },
            root,
          );
          cleanup = () => media.revert();
          ScrollTrigger.refresh();
          if (!initialized) {
            initialized = true;
            window.dispatchEvent(new Event("reelwala:story-ready"));
          }
        };
        if (document.documentElement.dataset.scrollReady === "true") setup();
      })
      .catch(() => {
        /* All content and static scene posters remain available. */
      });
    return () => {
      disposed = true;
      window.removeEventListener("reelwala:scroll-ready", ready);
      cleanup?.();
    };
  }, []);
  return <div ref={root}>{children}</div>;
}
