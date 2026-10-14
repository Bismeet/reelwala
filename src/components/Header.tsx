"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Clapperboard, Menu, X } from "lucide-react";
import s from "./site.module.css";
import { links } from "@/content/navigation";
export function Wordmark({ onClick }: { onClick?: () => void } = {}) {
  return (
    <Link
      href="/#home"
      aria-label="The Reel Wala home"
      className={s.wordmark}
      onClick={onClick}
    >
      <span className={s.logoIcon}>
        <Clapperboard size={23} strokeWidth={1.5} />
      </span>
      <span className={s.logoText}>
        THE REEL WALA<small>MOMENTS IN MOTION</small>
      </span>
    </Link>
  );
}
export default function Header() {
  const [active, setActive] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const header = useRef<HTMLElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const stage = document.querySelector<HTMLElement>("[data-hero-stage]");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const hidden =
        !!stage &&
        stage.dataset.heroPhase !== "3" &&
        !motion.matches &&
        stage.dataset.sceneReady !== "fallback" &&
        !stage.querySelector('[data-scene-ready="fallback"]');
      if (header.current) header.current.inert = hidden;
      if (hidden) dialog.current?.close();
    };
    const observer = new MutationObserver(sync);
    if (stage)
      observer.observe(stage, {
        subtree: true,
        attributes: true,
        attributeFilter: ["data-hero-phase", "data-scene-ready"],
      });
    motion.addEventListener("change", sync);
    sync();
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
    };
  }, [pathname]);
  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        const current = links.find((link) => visible.has(link.id));
        setActive(current?.id ?? "");
      },
      { rootMargin: "-100px 0px -55% 0px" },
    );
    links.forEach((link) => {
      const section = document.getElementById(link.id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <header ref={header} className={s.header} data-site-header>
      <div className={`${s.container} ${s.nav}`}>
        <Wordmark />
        <nav aria-label="Main navigation" className={s.navLinks}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active === l.id ? "location" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className={s.navRight}>
          <Link className={s.button} href="/workflow#enquiry">
            Book a Shoot <ArrowUpRight size={17} />
          </Link>
          <button
            className={s.menuButton}
            aria-label="Open navigation menu"
            onClick={() => dialog.current?.showModal()}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      <dialog ref={dialog} className={s.menu} aria-label="Navigation menu">
        <div className={s.menuTop}>
          <Wordmark onClick={() => dialog.current?.close()} />
          <button
            autoFocus
            className={s.menuClose}
            aria-label="Close navigation menu"
            onClick={() => dialog.current?.close()}
          >
            <X size={22} />
          </button>
        </div>
        <nav className={s.menuLinks} aria-label="Mobile navigation">
          {[{ href: "/#home", id: "home", label: "Home" }, ...links].map(
            (l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => dialog.current?.close()}
                aria-current={active === l.id ? "location" : undefined}
              >
                {l.label}
                <ArrowUpRight size={21} />
              </Link>
            ),
          )}
        </nav>
      </dialog>
    </header>
  );
}
