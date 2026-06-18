import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://geo.gsally.com"),
  icons: { icon: "/favicon.svg" },
  title: {
    default: "GEO / AI Visibility | Grand Strand Ally",
    template: "%s | Grand Strand Ally",
  },
  description:
    "Generative Engine Optimization for service businesses. Practical audits, clear deliverables, and a no-pressure approach from the Grand Strand.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
