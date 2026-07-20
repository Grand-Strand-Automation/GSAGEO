import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl } from "@/lib/seo/site-url";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  icons: { icon: "/favicon.svg" },
  title: {
    default: "Website Design & Redesign | Grand Strand Ally",
    template: "%s | GEO",
  },
  description:
    "Request a custom homepage mockup, then choose a $99 homepage refresh or full website redesign. GEO support available after launch.",
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
