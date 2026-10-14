"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import s from "./site.module.css";
import TiltedCard from "./effects/TiltedCard";
import { visualScrollEvent, visualScrollY } from "@/lib/visual-scroll";
export default function HeroScene() {
  const scene = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (query.matches || innerWidth < 900) {
          el.style.transform = "";
          return;
        }
        const y = Math.min(visualScrollY(), 700);
        el.style.transform = `translateY(${y * 0.045}px)`;
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener(visualScrollEvent, update);
    window.addEventListener("resize", update);
    query.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener(visualScrollEvent, update);
      window.removeEventListener("resize", update);
      query.removeEventListener("change", update);
    };
  }, []);
  return (
    <div className={s.scene} ref={scene}>
      <span className={s.sceneNote}>AN ILLUSTRATIVE MOMENT</span>
      <span className={s.frameCorner} aria-hidden="true" />
      <TiltedCard className={s.sceneFrame}>
        <Image
          src="/media/celebration.webp"
          alt="Illustrative scene of a couple laughing among friends at an amber-lit celebration"
          width={1024}
          height={1024}
          priority
          loading="eager"
          sizes="(max-width:650px) 90vw, 43vw"
        />
        <div className={s.sceneCaption}>
          <span>THE LITTLE THINGS. THE BIG FEELINGS.</span>
          <span>FRAME 001</span>
        </div>
      </TiltedCard>
      <div className={s.sceneDetail} aria-hidden="true">
        <Image
          src="/media/celebration.webp"
          alt=""
          width={300}
          height={400}
          sizes="150px"
        />
      </div>
      <div className={s.sceneStamp} aria-hidden="true">
        BE HERE.
        <br />
        FEEL IT.
        <br />
        REPLAY IT.
      </div>
    </div>
  );
}
