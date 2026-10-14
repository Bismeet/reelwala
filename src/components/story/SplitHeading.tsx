"use client";

import { useEffect, useRef } from "react";

// Adapted from React Bits Split Text: font-ready GSAP splitting and staggered reveal.
// Source and license are recorded in docs/licences and docs/14-COMPONENT-PROVENANCE.md.
export default function SplitHeading({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void Promise.all([
      import("gsap"),
      import("gsap/SplitText"),
      document.fonts.ready,
    ])
      .then(([{ gsap }, { SplitText }]) => {
        if (disposed || !ref.current) return;
        gsap.registerPlugin(SplitText);
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          if (!ref.current) return;
          const split = SplitText.create(ref.current, {
            type: "chars,words",
            aria: "auto",
            smartWrap: true,
          });
          const tween = gsap.from(split.chars, {
            yPercent: 85,
            rotation: 5,
            opacity: 0,
            stagger: 0.035,
            duration: 0.85,
            ease: "power3.out",
          });
          return () => {
            tween.kill();
            split.revert();
          };
        });
        cleanup = () => media.revert();
      })
      .catch(() => {
        /* Server-rendered heading stays readable. */
      });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [text]);
  return <span ref={ref}>{text}</span>;
}
