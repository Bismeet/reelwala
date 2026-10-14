import type { Metadata } from "next";
import Header from "@/components/Header";
import { Footer, PreviewBadge } from "@/components/Shared";
import { preview, isReleaseApproved } from "@/content/site";
import SmoothScroll from "@/components/effects/SmoothScroll";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "The Reel Wala | Event Reel Shoots",
    template: "%s | The Reel Wala",
  },
  description:
    "Reel shoots for private celebrations, corporate events, and cultural gatherings.",
  robots: preview ? { index: false, follow: false } : undefined,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!preview && !isReleaseApproved)
    throw new Error(
      "Production release is gated. Resolve docs/11-DECISIONS.md and configure production providers before setting RELEASE_APPROVED.",
    );
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {/* Share navigation across the cinematic homepage and the document's pages. */}
        <Header />
        <SmoothScroll>
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </SmoothScroll>
        <PreviewBadge />
      </body>
    </html>
  );
}
