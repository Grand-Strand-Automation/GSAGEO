import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-area min-h-screen bg-brand-cream">
      <header className="border-b border-brand-border bg-white">
        <div className="container px-4 md:px-6 h-14 flex items-center justify-between">
          <Link href="/admin/submissions" className="flex items-center gap-3">
            <BrandLogo onDark={false} href="/admin/submissions" />
            <span className="text-xs font-bold uppercase tracking-wide text-brand-muted hidden sm:inline">
              Admin
            </span>
          </Link>
          <Link href="/" className="text-xs text-brand-muted hover:text-brand-navy">
            Public site →
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
