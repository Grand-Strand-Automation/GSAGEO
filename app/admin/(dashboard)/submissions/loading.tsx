export default function AdminSubmissionsLoading() {
  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="container px-4 md:px-6">
        <div className="mb-6 rounded-xl border border-brand-border bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-blue">
            Protected admin area
          </p>
          <p className="text-sm text-brand-muted mt-2">
            Checking admin access and preparing submissions. If you are not signed in, you will be
            redirected to the admin login screen.
          </p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-brand-border rounded" />
          <div className="h-24 bg-white border border-brand-border rounded-xl" />
          <div className="h-64 bg-white border border-brand-border rounded-xl" />
        </div>
      </div>
    </div>
  );
}
