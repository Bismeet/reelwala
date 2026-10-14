import inventory from "../../docs/data/services.json";

const normalized: Record<string, string> = {
  "private-013": "New Car Delivery",
  "private-017": "Pet Shoots",
  "corporate-023": "Team Outing, Team Lunch / Dinner",
  "corporate-030": "Store / Product Launches",
  "social-cultural-035":
    "Festivals: Diwali, Holi, Eid, Christmas, Gudi Padwa & more",
  "social-cultural-036": "Community / Society Events",
};
export const categories = inventory.categories.map((c) => ({
  ...c,
  items: c.items.map((i) => ({
    ...i,
    displayLabel: normalized[i.id] ?? i.displayLabel,
  })),
}));
export const serviceItems = categories.flatMap((c) => c.items);
export const packageIds = ["standard", "extended-session", "premium"];
export const preview = process.env.APP_ENV !== "production";
export const isReleaseApproved = process.env.RELEASE_APPROVED === "true";
export const customerSteps = [
  {
    number: "01",
    title: "Tell us your story.",
    label: "Booking",
    body: "Tell us where, what & when.",
  },
  {
    number: "02",
    title: "Meet your reeler.",
    label: "Reeler Assigned",
    body: "A professional reel creator will be assigned to your event, and their details will be shared with you.",
  },
  {
    number: "03",
    title: "Feel it all again.",
    label: "Delivery",
    body: "Reels and pictures will be shared within 24 hours via a secure download link.",
  },
];
export const creatorSteps = [
  {
    number: "01",
    title: "Register",
    body: "Introduce yourself and share your creative work.",
  },
  {
    number: "02",
    title: "Attend the Workshop",
    body: "Our team will share the workshop details and next steps.",
  },
  {
    number: "03",
    title: "Receive Shoots",
    body: "Capture the occasions assigned to you by our team.",
  },
  {
    number: "04",
    title: "Get Paid After Shoots",
    body: "Payments follow your completed shoots.",
  },
];
// Verified model names: Apple support https://support.apple.com/en-in/108044, 2026-10-14.
// Preview includes the 15 family; owner eligibility approval remains DEC-06.
export const devices = [
  "iPhone 15",
  "iPhone 15 Plus",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
  "iPhone 16",
  "iPhone 16 Plus",
  "iPhone 16 Pro",
  "iPhone 16 Pro Max",
  "iPhone 16e",
  "iPhone 17",
  "iPhone 17 Pro",
  "iPhone 17 Pro Max",
  "iPhone 17e",
  "iPhone Air",
  "iPhone 18 Pro",
  "iPhone 18 Pro Max",
].map((label) => ({ id: label.toLowerCase().replaceAll(" ", "-"), label }));
export const genders = [
  "Woman",
  "Man",
  "Non-binary",
  "Self-describe",
  "Prefer not to say",
];
export const uploadLimits = {
  video: { count: 2, bytes: 100 * 1024 * 1024 },
  photo: { count: 5, bytes: 10 * 1024 * 1024 },
  total: 250 * 1024 * 1024,
};
