import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl } from "@/lib/seo/site-url";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  icons: { icon: "/favicon.svg" },
  title: {
    default: "$99 Website Refresh for Service Businesses | Grand Strand Ally",
    template: "%s | GEO",
  },
  description:
    "See a sample homepage mockup for your business, then refresh your homepage and 2–3 key sub pages for a flat $99.",
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
      <body className="antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
