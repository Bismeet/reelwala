import test from "node:test";
import assert from "node:assert/strict";
import { shouldRevealScrollFocus } from "../src/lib/scroll-focus";

function target(tagName: string, attributes: Record<string, string> = {}) {
  return {
    tagName,
    tabIndex: attributes.tabindex ? Number(attributes.tabindex) : -1,
    isContentEditable: attributes.contenteditable === "true",
    getAttribute: (name: string) => attributes[name] ?? null,
  };
}

test("clicking hero content must not centre its focusable main landmark", () => {
  assert.equal(
    shouldRevealScrollFocus(target("MAIN", { tabindex: "-1" })),
    false,
  );
  assert.equal(
    shouldRevealScrollFocus(target("MAIN", { tabindex: "0" })),
    false,
  );
  for (const tag of ["H1", "SPAN", "IMG", "DIV", "SECTION"])
    assert.equal(shouldRevealScrollFocus(target(tag)), false);
});

test("keyboard controls and deliberate form feedback can still be revealed", () => {
  for (const tag of ["INPUT", "SELECT", "TEXTAREA", "BUTTON"])
    assert.equal(shouldRevealScrollFocus(target(tag)), true);
  assert.equal(
    shouldRevealScrollFocus(target("A", { href: "/services" })),
    true,
  );
  assert.equal(shouldRevealScrollFocus(target("DIV", { tabindex: "0" })), true);
  assert.equal(
    shouldRevealScrollFocus(target("DIV", { contenteditable: "true" })),
    true,
  );
  assert.equal(
    shouldRevealScrollFocus(target("INPUT", { type: "hidden" })),
    false,
  );
  assert.equal(
    shouldRevealScrollFocus(
      target("H2", {
        tabindex: "-1",
        "data-scroll-focus": "true",
      }),
    ),
    true,
  );
});
