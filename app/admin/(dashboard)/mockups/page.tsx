import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { categoryLabel, goalLabel, styleLabel } from "@/lib/validation/mockup";
import type { GeoMockupLead } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export default async function AdminMockupsPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("geo_mockup_leads")
    .select(
      "id, created_at, website_url, business_name, business_category, preferred_style, homepage_goal, email, status, result_viewed_at, subscription_cta_clicked_at, selected_plan_intent, notes, screenshot_url, screenshot_status, signals_json",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  const leads = (data ?? []) as Array<
    Pick<
      GeoMockupLead,
      | "id"
      | "created_at"
      | "website_url"
      | "business_name"
      | "business_category"
      | "preferred_style"
      | "homepage_goal"
      | "email"
      | "status"
      | "result_viewed_at"
      | "subscription_cta_clicked_at"
      | "selected_plan_intent"
      | "notes"
      | "screenshot_url"
      | "screenshot_status"
      | "signals_json"
    >
  >;

  return (
    <div className="container px-4 md:px-6 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-brand-navy">Mockup leads</h1>
        <p className="text-sm text-brand-muted mt-1">
          Homepage redesign preview submissions from the primary funnel.
        </p>
      </div>

      {error && (
        <div className="card-brand p-6 mb-6 text-sm text-brand-muted">
          Could not load mockup leads. If this is a new environment, apply migrations{" "}
          <code className="text-xs bg-brand-cream px-1.5 py-0.5 rounded">008_geo_mockup_leads.sql</code>{" "}
          and{" "}
          <code className="text-xs bg-brand-cream px-1.5 py-0.5 rounded">009_mockup_screenshot.sql</code>{" "}
          in Supabase.
          <pre className="mt-3 text-xs text-red-600 whitespace-pre-wrap">{error.message}</pre>
        </div>
      )}

      {!error && leads.length === 0 && (
        <div className="card-brand p-8 text-center text-brand-muted text-sm">
          No mockup leads yet.
        </div>
      )}

      {leads.length > 0 && (
        <div className="card-brand overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-cream/60 border-b border-brand-border">
                <tr className="text-left text-[11px] uppercase tracking-wide text-brand-muted">
                  <th className="px-4 py-3 font-bold">Business</th>
                  <th className="px-4 py-3 font-bold">Prefs</th>
                  <th className="px-4 py-3 font-bold">Capture</th>
                  <th className="px-4 py-3 font-bold">Engagement</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {leads.map((lead) => {
                  const signals = (lead.signals_json ?? {}) as {
                    fetchQuality?: string;
                  };
                  const fetchQuality = signals.fetchQuality ?? "—";
                  return (
                    <tr key={lead.id} className="hover:bg-brand-cream/30">
                      <td className="px-4 py-3 align-top">
                        <p className="font-semibold text-brand-navy">{lead.business_name}</p>
                        <a
                          href={lead.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-brand-blue hover:underline break-all"
                        >
                          {lead.website_url}
                        </a>
                        {lead.email && (
                          <p className="text-xs text-brand-muted mt-1">{lead.email}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-brand-muted space-y-0.5">
                        <p>{categoryLabel(lead.business_category)}</p>
                        <p>{styleLabel(lead.preferred_style)}</p>
                        <p>{goalLabel(lead.homepage_goal)}</p>
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-brand-muted space-y-1">
                        <p>
                          Screenshot:{" "}
                          <span className="font-medium text-brand-navy">
                            {lead.screenshot_url || lead.screenshot_status === "ready"
                              ? "Yes"
                              : "No"}
                          </span>
                        </p>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand-cream text-brand-muted border border-brand-border">
                          {String(fetchQuality)}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-brand-muted space-y-0.5">
                        <p>Viewed: {lead.result_viewed_at ? "Yes" : "No"}</p>
                        <p>CTA: {lead.subscription_cta_clicked_at ? "Yes" : "No"}</p>
                        {lead.selected_plan_intent && (
                          <p>Plan intent: {lead.selected_plan_intent}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-brand-blue-light text-brand-blue">
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-brand-muted whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-brand-muted">
        <Link href="/admin/submissions" className="text-brand-blue hover:underline">
          ← Back to GEO submissions
        </Link>
      </p>
    </div>
  );
}
