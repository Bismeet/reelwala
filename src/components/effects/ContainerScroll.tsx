"use client";
// Adapted from Aceternity UI Container Scroll Animation, Manu Arora.
// https://ui.aceternity.com/components/container-scroll-animation
// Brand CSS replaces template chrome; small rotations preserve readability and reduced motion gets a static frame.
import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "motion/react";
import s from "./effects.module.css";
import { visualScrollEvent } from "@/lib/visual-scroll";
export default function ContainerScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const scrollYProgress = useMotionValue(0);
  useEffect(() => {
    // Measure the displayed frame so GSAP smoothing and native scroll share the same timing.
    const update = () => {
      if (!ref.current) return;
      const bounds = ref.current.getBoundingClientRect();
      const distance = innerHeight / 2 + bounds.height / 2;
      scrollYProgress.set(
        Math.max(0, Math.min(1, (innerHeight - bounds.top) / distance)),
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener(visualScrollEvent, update);
    window.addEventListener("resize", update);
    const resize = new ResizeObserver(update);
    if (ref.current) resize.observe(ref.current);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener(visualScrollEvent, update);
      window.removeEventListener("resize", update);
      resize.disconnect();
    };
  }, [scrollYProgress]);
  const rotate = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);
  return (
    <div ref={ref} className={s.scrollContainer}>
      <motion.div
        className={s.scrollCard}
        style={{ rotateX: reduced ? 0 : rotate, scale: reduced ? 1 : scale }}
      >
        {children}
      </motion.div>
    </div>
  );
}
