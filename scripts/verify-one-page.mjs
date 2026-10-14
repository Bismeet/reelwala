import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const origin = "http://127.0.0.1:3000";
const response = await fetch(origin);
assert.equal(response.status, 200);
const html = await response.text();
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "duplicate IDs on combined page");
for (const id of [
  "home",
  "services",
  "pricing",
  "testimonials",
  "how-it-works",
  "enquiry",
  "become-a-creator",
  "application",
  "privacy",
  "terms",
  "preview-status",
  "enquiry-name",
  "creator-name",
  "enquiry-phone",
  "creator-phone",
])
  assert.ok(ids.includes(id), `missing section/control ${id}`);
assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1);
assert.equal([...html.matchAll(/<form(?:\s|>)/g)].length, 2);
for (const match of html.matchAll(/<label\b[^>]*\sfor="([^"]+)"/g))
  assert.ok(ids.includes(match[1]), `label without field ${match[1]}`);
const hrefs = [...html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)].map(
  (match) => match[1],
);
for (const href of hrefs) {
  assert.ok(
    href.startsWith("/#") || href.startsWith("#"),
    `page-leaving link ${href}`,
  );
  assert.ok(ids.includes(href.split("#")[1]), `missing link target ${href}`);
}
const inventory = JSON.parse(await readFile("docs/data/services.json", "utf8"));
const services = inventory.categories.flatMap((category) => category.items);
const serviceLinks = [...html.matchAll(/data-enquiry-service="([^"]+)"/g)].map(
  (match) => match[1],
);
assert.deepEqual(
  serviceLinks.sort(),
  services.map((service) => service.id).sort(),
);
assert.equal(serviceLinks.length, 24);
const packages = [...html.matchAll(/data-enquiry-package="([^"]+)"/g)].map(
  (match) => match[1],
);
assert.deepEqual(
  packages.sort(),
  ["standard", "extended-session", "premium"].sort(),
);
for (const [path, target] of Object.entries({
  "/services": "services",
  "/pricing": "pricing",
  "/testimonials": "testimonials",
  "/become-a-creator": "become-a-creator",
  "/privacy": "privacy",
  "/terms": "terms",
  "/preview-status": "preview-status",
  "/workflow": "enquiry",
})) {
  const redirect = await fetch(origin + path, { redirect: "manual" });
  assert.equal(redirect.status, 307);
  assert.equal(redirect.headers.get("location"), `/#${target}`);
}
const preset = await fetch(
  origin + "/workflow?package=standard&service=" + services[0].id,
  { redirect: "manual" },
);
const destination = new URL(preset.headers.get("location"), origin);
assert.equal(destination.pathname, "/");
assert.equal(destination.hash, "#enquiry");
assert.equal(destination.searchParams.get("package"), "standard");
assert.equal(destination.searchParams.get("service"), services[0].id);

const key = randomUUID();
const input = {
  name: "Single Page Preview Tester",
  phone: "9876543210",
  serviceId: services[0].id,
  eventDate: new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()),
  eventLocation: "Test venue",
  packageId: "standard",
  sourceRoute: "/",
  noticeVersion: "local-preview-v1",
};
async function submit() {
  const result = await fetch(origin + "/api/enquiries", {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "Idempotency-Key": key,
    },
    body: JSON.stringify(input),
  });
  return { status: result.status, data: await result.json() };
}
const saved = await submit();
assert.equal(saved.status, 201);
const replay = await submit();
assert.equal(replay.status, 200);
assert.equal(replay.data.reference, saved.data.reference);
console.log(
  JSON.stringify(
    {
      passed: true,
      checks: [
        "all sections on root",
        "one h1 and two forms",
        "unique field IDs and valid labels",
        "all links stay on root and resolve",
        "24 service choices and 3 package presets",
        "legacy routes redirect to homepage",
        "legacy enquiry query preserved",
        "homepage enquiry saved and safely replayed",
      ],
    },
    null,
    2,
  ),
);
