import { Suspense } from "react";

export default function AdminSubmissionsLoading() {
  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="container px-4 md:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-brand-border rounded" />
          <div className="h-24 bg-white border border-brand-border rounded-xl" />
          <div className="h-64 bg-white border border-brand-border rounded-xl" />
        </div>
        <p className="text-sm text-brand-muted mt-6">Loading submissions…</p>
      </div>
    </div>
  );
}
