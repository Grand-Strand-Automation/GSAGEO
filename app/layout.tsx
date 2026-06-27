import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl } from "@/lib/seo/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  icons: { icon: "/favicon.svg" },
  title: {
    default: "GEO / AI Visibility Assessments for Service Businesses | GEO",
    template: "%s | GEO",
  },
  description:
    "See how clearly your business is positioned for ChatGPT, Google AI Overviews, and AI-driven search. GEO assessments for service businesses with clear deliverables and practical next steps.",
  openGraph: {
    siteName: "GEO",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
