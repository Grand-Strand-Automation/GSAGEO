import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
