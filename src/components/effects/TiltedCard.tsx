"use client";
// Adapted from React Bits TiltedCard by David Haz. See docs/licences/react-bits.txt.
// Kept the spring/pointer model; removed image duplication/tooltips and added reduced-motion/touch handling.
import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
export default function TiltedCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const spring = { damping: 30, stiffness: 100, mass: 2 };
  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);
  function reset() {
    rotateX.set(0);
    rotateY.set(0);
  }
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: reduced ? 0 : rotateX,
        rotateY: reduced ? 0 : rotateY,
        rotateZ: 3,
        transformPerspective: 1000,
      }}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        rotateX.set(
          ((event.clientY - rect.top - rect.height / 2) / (rect.height / 2)) *
            -4,
        );
        rotateY.set(
          ((event.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 4,
        );
      }}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
