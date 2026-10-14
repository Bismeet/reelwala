// Share the rendered position without importing GSAP into each visual component.
export const visualScrollEvent = "reelwala:visual-scroll";
let position: number | null = null;

export function visualScrollY() {
  return position ?? window.scrollY;
}

export function publishVisualScroll(value: number | null) {
  position = value;
  window.dispatchEvent(new Event(visualScrollEvent));
}
