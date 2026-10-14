type FocusTarget = Pick<
  HTMLElement,
  "tagName" | "tabIndex" | "isContentEditable" | "getAttribute"
>;

// Clicking non-interactive content can focus its tabindex=-1 ancestor (the main landmark).
// Only reveal controls, keyboard stops and explicitly managed feedback, never a page container.
export function shouldRevealScrollFocus(target: FocusTarget) {
  const tag = target.tagName.toLowerCase();
  if (["main", "body", "html"].includes(tag)) return false;
  if (target.getAttribute("data-scroll-focus") === "true") return true;
  if (tag === "input") return target.getAttribute("type") !== "hidden";
  if (["button", "select", "textarea"].includes(tag)) return true;
  if (tag === "a") return target.getAttribute("href") !== null;
  return target.isContentEditable || target.tabIndex >= 0;
}
