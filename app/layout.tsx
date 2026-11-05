import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl } from "@/lib/seo/site-url";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  icons: { icon: "/favicon.svg" },
  title: {
    default: "Monthly AI Visibility Support for Service Businesses | GEO",
    template: "%s | GEO",
  },
  description:
    "See how clearly your business appears in AI search. Start with a free assessment, then continue with simple month-to-month support — cancel anytime.",
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
