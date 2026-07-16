import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-area min-h-screen bg-brand-cream">
      <header className="border-b border-brand-border bg-white">
        <div className="container px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo onDark={false} href="/admin/submissions" />
            <span className="text-xs font-bold uppercase tracking-wide text-brand-muted hidden sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/submissions"
              className="text-xs font-medium text-brand-muted hover:text-brand-navy"
            >
              GEO leads
            </Link>
            <Link
              href="/admin/mockups"
              className="text-xs font-medium text-brand-muted hover:text-brand-navy"
            >
              Mockup leads
            </Link>
            <Link href="/" className="text-xs text-brand-muted hover:text-brand-navy">
              Public site →
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
