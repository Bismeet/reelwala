"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { publishVisualScroll } from "@/lib/visual-scroll";
import { shouldRevealScrollFocus } from "@/lib/scroll-focus";

// GSAP owns only the scrolling transform. Header, dialog and preview badge stay outside it.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const outer = wrapper.current;
    const inner = content.current;
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!outer || !inner || !header) return;

    const media = matchMedia(
      "(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
    );
    let closed = false;
    let generation = 0;
    let cleanup: (() => void) | undefined;
    const signalReady = () => {
      document.documentElement.dataset.scrollReady = "true";
      window.dispatchEvent(new Event("reelwala:scroll-ready"));
    };

    const update = async () => {
      const version = ++generation;
      cleanup?.();
      cleanup = undefined;
      if (closed) return;
      // The image sequence uses native sticky positioning and native scroll progress.
      if (!media.matches || inner.querySelector("[data-image-sequence]")) {
        signalReady();
        return;
      }
      try {
        const [{ gsap }, { ScrollTrigger }, { ScrollSmoother }] =
          await Promise.all([
            import("gsap"),
            import("gsap/ScrollTrigger"),
            import("gsap/ScrollSmoother"),
            document.fonts.ready,
          ]);
        if (closed || version !== generation || !media.matches) return;
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

        const root = document.documentElement;
        const initialY = window.scrollY;
        let headerHeight = header.offsetHeight;
        let anchorFocus = false;
        const htmlBehaviour = root.style.scrollBehavior;
        const bodyBehaviour = document.body.style.scrollBehavior;
        root.style.setProperty("--scroll-header-height", `${headerHeight}px`);
        root.dataset.smoothScroll = "true";

        const smoother = ScrollSmoother.create({
          wrapper: outer,
          content: inner,
          smooth: 1.2,
          ease: "expo",
          smoothTouch: false,
          normalizeScroll: { allowNestedScroll: true },
          effects: false,
          onUpdate: (self) => publishVisualScroll(self.scrollTop()),
          onFocusIn: (self, event) => {
            if (anchorFocus) return false;
            const target = event.target;
            if (
              target instanceof HTMLElement &&
              inner.contains(target) &&
              shouldRevealScrollFocus(target)
            ) {
              const bounds = target.getBoundingClientRect();
              if (
                bounds.top < headerHeight + 12 ||
                bounds.bottom > innerHeight - 24
              )
                self.scrollTo(target, false, "center center");
            }
            return false;
          },
        });

        // Publish cleanup immediately, including if later setup fails or the route changes.
        let alive = true;
        const dispose: (() => void)[] = [];
        cleanup = () => {
          alive = false;
          dispose.forEach((fn) => fn());
          smoother.kill();
          delete root.dataset.smoothScroll;
          root.style.removeProperty("--scroll-header-height");
          root.style.scrollBehavior = htmlBehaviour;
          document.body.style.scrollBehavior = bodyBehaviour;
          publishVisualScroll(null);
        };

        const headerResize = new ResizeObserver(() => {
          const nextHeight = header.offsetHeight;
          if (nextHeight === headerHeight) return;
          headerHeight = nextHeight;
          root.style.setProperty("--scroll-header-height", `${headerHeight}px`);
          ScrollTrigger.refresh();
        });
        headerResize.observe(header);
        dispose.push(() => headerResize.disconnect());

        function hashTarget(hash: string) {
          try {
            return document.getElementById(decodeURIComponent(hash.slice(1)));
          } catch {
            return null;
          }
        }
        function goTo(target: HTMLElement, smooth: boolean) {
          if (target instanceof HTMLDetailsElement && !target.open) {
            target.open = true;
            ScrollTrigger.refresh();
          }
          smoother.scrollTo(target, smooth, `top ${headerHeight + 12}px`);
        }
        const hashChanged = () => {
          const target = hashTarget(location.hash);
          if (target) goTo(target, false);
        };
        // The browser may still be resolving its native hash while the story adds
        // pin spacing. Reconcile the first destination after layout settles, but
        // stop as soon as the visitor takes control of scrolling/navigation.
        let initialHash = location.hash;
        let initialFrame = 0;
        let settleTimer: ReturnType<typeof setTimeout> | undefined;
        const cancelInitialHash = () => {
          initialHash = "";
          cancelAnimationFrame(initialFrame);
          clearTimeout(settleTimer);
        };
        const settleInitialHash = () => {
          if (!initialHash || location.hash !== initialHash) return;
          cancelAnimationFrame(initialFrame);
          initialFrame = requestAnimationFrame(() => {
            if (alive && initialHash && location.hash === initialHash)
              hashChanged();
          });
          clearTimeout(settleTimer);
          settleTimer = setTimeout(cancelInitialHash, 1000);
        };
        ScrollTrigger.addEventListener("refresh", settleInitialHash);
        window.addEventListener("reelwala:story-ready", settleInitialHash);
        window.addEventListener("load", settleInitialHash);
        for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) {
          window.addEventListener(event, cancelInitialHash, { passive: true });
          dispose.push(() =>
            window.removeEventListener(event, cancelInitialHash),
          );
        }
        dispose.push(() => {
          cancelInitialHash();
          ScrollTrigger.removeEventListener("refresh", settleInitialHash);
          window.removeEventListener("reelwala:story-ready", settleInitialHash);
          window.removeEventListener("load", settleInitialHash);
        });
        const click = (event: MouseEvent) => {
          if (
            event.button ||
            event.metaKey ||
            event.ctrlKey ||
            event.altKey ||
            event.shiftKey
          )
            return;
          const link =
            event.target instanceof Element ? event.target.closest("a") : null;
          if (
            !link ||
            link.hasAttribute("download") ||
            (link.target && link.target !== "_self")
          )
            return;
          const url = new URL(link.href, location.href);
          if (
            url.origin !== location.origin ||
            url.pathname !== location.pathname ||
            (url.search && url.search !== location.search) ||
            !url.hash
          )
            return;
          const target = hashTarget(url.hash);
          if (!target || !inner.contains(target)) return;
          event.preventDefault();
          const menu = link.closest("dialog");
          if (menu instanceof HTMLDialogElement && menu.open) {
            menu.close();
            smoother.paused(false);
          }
          // Retain Next's history state for Back/Forward and let cross-route links use its router.
          if (url.hash !== location.hash)
            history.pushState(history.state, "", url.href);
          goTo(target, true);
          const hadTabindex = target.hasAttribute("tabindex");
          if (!hadTabindex) target.setAttribute("tabindex", "-1");
          anchorFocus = true;
          target.focus({ preventScroll: true });
          anchorFocus = false;
          if (!hadTabindex) target.removeAttribute("tabindex");
        };
        document.addEventListener("click", click, true);
        window.addEventListener("hashchange", hashChanged);
        dispose.push(() => document.removeEventListener("click", click, true));
        dispose.push(() =>
          window.removeEventListener("hashchange", hashChanged),
        );

        const modalChanged = () =>
          smoother.paused(!!document.querySelector("dialog[open]"));
        const dialogs = new MutationObserver(modalChanged);
        dialogs.observe(header, {
          subtree: true,
          attributes: true,
          attributeFilter: ["open"],
        });
        modalChanged();
        dispose.push(() => dialogs.disconnect());

        ScrollTrigger.refresh();
        smoother.scrollTop(initialY);
        signalReady();
        hashChanged();
        void document.fonts.ready.then(() => {
          if (alive) ScrollTrigger.refresh();
        });
      } catch {
        if (closed || version !== generation) return;
        // Failed loading/setup leaves the entire server-rendered page natively scrollable.
        cleanup?.();
        cleanup = undefined;
        delete document.documentElement.dataset.smoothScroll;
        document.documentElement.style.removeProperty("--scroll-header-height");
        publishVisualScroll(null);
        signalReady();
      }
    };
    void update();
    media.addEventListener("change", update);
    return () => {
      closed = true;
      generation++;
      media.removeEventListener("change", update);
      cleanup?.();
      delete document.documentElement.dataset.scrollReady;
    };
  }, [pathname]);

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content" ref={content}>
        {children}
      </div>
    </div>
  );
}
