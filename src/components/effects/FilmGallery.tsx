"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import ContainerScroll from "./ContainerScroll";
import s from "./effects.module.css";
const frames = [
  { image: "celebration", label: "01 / YOUR PEOPLE" },
  { image: "corporate", label: "02 / YOUR OCCASION" },
  { image: "festival", label: "03 / YOUR STORY" },
];
export default function FilmGallery() {
  const film = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = film.current;
    const canvas = host.current;
    if (!node || !canvas) return;
    const media = matchMedia(
      "(min-width:901px) and (prefers-reduced-motion:no-preference)",
    );
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    let dispose: (() => void) | undefined;
    let disposed = false;
    let loading = false;
    const mount = async () => {
      if (
        loading ||
        dispose ||
        disposed ||
        !media.matches ||
        connection?.saveData
      )
        return;
      loading = true;
      try {
        const { mountFilmScene } = await import("@/lib/film-scene");
        if (disposed || !media.matches) return;
        const cleanup = mountFilmScene(canvas, () => {
          if (!disposed) node.dataset.ready = "true";
        });
        if (disposed) cleanup();
        else dispose = cleanup;
      } catch {
        node.dataset.ready = "false";
      } finally {
        loading = false;
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) void mount();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    const change = () => {
      if (!media.matches) {
        dispose?.();
        dispose = undefined;
        node.dataset.ready = "false";
      } else if (node.getBoundingClientRect().top < innerHeight + 200)
        void mount();
    };
    media.addEventListener("change", change);
    return () => {
      disposed = true;
      observer.disconnect();
      media.removeEventListener("change", change);
      dispose?.();
    };
  }, []);
  return (
    <ContainerScroll>
      <div className={s.film} ref={film}>
        <div className={s.filmFallback}>
          {frames.map((frame) => (
            <div className={s.frame} key={frame.image}>
              <Image
                src={`/media/${frame.image}.webp`}
                width={400}
                height={450}
                sizes="(max-width:650px) 42vw, 28vw"
                alt={`Illustrative ${frame.image} scene`}
              />
              <span>{frame.label}</span>
            </div>
          ))}
        </div>
        <div ref={host} className={s.canvasHost} aria-hidden="true" />
      </div>
      <div className={s.filmFooter}>
        <span>ILLUSTRATIVE SCENES · A LITTLE OF THE FEELING</span>
        <span>THE REEL WALA / MOMENTS IN MOTION</span>
      </div>
    </ContainerScroll>
  );
}
