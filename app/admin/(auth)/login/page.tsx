import { Suspense } from "react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

function AdminLoginFallback() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-12">
      <div className="card-brand rounded-2xl p-8 w-full max-w-sm text-center shadow-card">
        <p className="text-sm font-semibold text-brand-navy">Preparing secure admin sign-in…</p>
        <p className="text-sm text-brand-muted mt-2">
          This area is restricted to authorized Grand Strand Ally admins.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<AdminLoginFallback />}>
      <AdminLoginForm />
    </Suspense>
  );
}
