"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { HeroOverlay } from "@/components/HeroOverlay";
import { TrustBar } from "@/components/TrustBar";
import { normalizeAuditTier } from "@/lib/brand/plans";

const startSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  work_email: z.string().email("Enter a valid email"),
  company_name: z.string().min(1, "Business name is required"),
  website_url: z.string().min(1, "Website URL is required"),
  phone: z.string().optional(),
  notes: z.string().optional(),
  website: z.string().optional(),
  selected_plan: z.string().optional(),
});

type StartInput = z.infer<typeof startSchema>;

const labelClass = "text-sm font-semibold text-brand-navy";
const inputClass =
  "w-full border border-brand-border rounded-lg h-11 px-4 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

export function StartRedesignForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTier = normalizeAuditTier(searchParams.get("tier")) || "monitor";
  const mockupToken = searchParams.get("mockup") ?? "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StartInput>({
    resolver: zodResolver(startSchema),
    defaultValues: {
      full_name: "",
      work_email: "",
      company_name: "",
      website_url: "",
      phone: "",
      notes: mockupToken ? `Came from homepage mockup token: ${mockupToken}` : "",
      website: "",
      selected_plan: initialTier,
    },
  });

  useEffect(() => {
    if (!mockupToken) return;
    try {
      const raw = sessionStorage.getItem(`mockup:${mockupToken}`);
      if (!raw) return;
      const cached = JSON.parse(raw) as { business_name?: string; website_url?: string };
      if (cached.business_name) setValue("company_name", cached.business_name);
      if (cached.website_url) setValue("website_url", cached.website_url);
    } catch {
      /* ignore */
    }
  }, [mockupToken, setValue]);

  const onSubmit = async (data: StartInput) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      if (mockupToken) {
        await fetch(`/api/mockups/${mockupToken}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "subscription_cta",
            selected_plan: data.selected_plan || initialTier,
          }),
        }).catch(() => null);
      }

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          primary_service: "Website refresh",
          main_goal: "Refresh homepage and 2-3 key sub pages",
          industry: "Website refresh",
          current_challenges: [],
          access_available: [],
          selected_plan: data.selected_plan || initialTier,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setSubmitError("Something went wrong. Please try again or email us directly.");
        return;
      }
      router.push(json.resultsToken ? `/thank-you?t=${json.resultsToken}` : "/thank-you");
    } catch {
      setSubmitError("Unable to submit right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="bg-brand-hero text-white pt-28 pb-12 md:pt-32 relative overflow-hidden">
        <HeroOverlay />
        <div className="container px-4 md:px-6 relative z-10 max-w-2xl">
          <div className="eyebrow-pill mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-sky inline-block" />
            $99 Website Refresh
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-4 leading-tight">
            Start your homepage + key pages refresh
          </h1>
          <p className="text-white/70 leading-relaxed">
            Share a few details and we&apos;ll follow up to turn your homepage direction into a
            refreshed homepage and 2–3 important sub pages for a flat $99.
          </p>
        </div>
      </section>

      <TrustBar
        items={[
          "Flat $99",
          "Homepage + 2–3 sub pages",
          "Final design refined during onboarding",
        ]}
      />

      <section className="section-pad bg-brand-cream">
        <div className="container px-4 md:px-6 max-w-xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card-brand p-6 md:p-8 shadow-card space-y-4"
            noValidate
          >
            <div>
              <label className={labelClass} htmlFor="full_name">
                Your name
              </label>
              <input id="full_name" className={`${inputClass} mt-1.5`} {...register("full_name")} />
              {errors.full_name && (
                <p className="text-xs text-red-600 mt-1">{errors.full_name.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="work_email">
                Work email
              </label>
              <input
                id="work_email"
                type="email"
                className={`${inputClass} mt-1.5`}
                {...register("work_email")}
              />
              {errors.work_email && (
                <p className="text-xs text-red-600 mt-1">{errors.work_email.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="company_name">
                Business name
              </label>
              <input
                id="company_name"
                className={`${inputClass} mt-1.5`}
                {...register("company_name")}
              />
              {errors.company_name && (
                <p className="text-xs text-red-600 mt-1">{errors.company_name.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="website_url">
                Current website URL
              </label>
              <input
                id="website_url"
                className={`${inputClass} mt-1.5`}
                placeholder="yourbusiness.com"
                {...register("website_url")}
              />
              {errors.website_url && (
                <p className="text-xs text-red-600 mt-1">{errors.website_url.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="phone">
                Phone <span className="font-normal text-brand-muted">(optional)</span>
              </label>
              <input id="phone" className={`${inputClass} mt-1.5`} {...register("phone")} />
            </div>
            <div>
              <label className={labelClass} htmlFor="notes">
                Notes <span className="font-normal text-brand-muted">(optional)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm mt-1.5"
                {...register("notes")}
              />
            </div>
            <input type="hidden" {...register("selected_plan")} />
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
              {...register("website")}
            />

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-navy text-white font-semibold text-sm h-12 hover:bg-brand-blue transition-colors disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting…
                </>
              ) : (
                "Start My $99 Website Refresh →"
              )}
            </button>
            <p className="text-xs text-brand-muted text-center">
              Flat $99 · Homepage + 2–3 sub pages · We&apos;ll confirm details before work begins.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
