"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { HeroOverlay } from "@/components/HeroOverlay";
import { TrustBar } from "@/components/TrustBar";
import { submissionSchema, type SubmissionInput } from "@/lib/validation/submission";

const labelClass = "text-sm font-semibold text-brand-navy";
const inputClass =
  "w-full border border-brand-border rounded-lg h-11 px-4 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/30";
const sectionHeading =
  "text-xs font-bold uppercase tracking-[0.15em] text-brand-blue mb-5 pt-2 border-t border-brand-border";

const CHALLENGE_OPTIONS = [
  { value: "weak-rankings", label: "Weak rankings in traditional search" },
  { value: "poor-content", label: "Poor or thin content structure" },
  { value: "limited-service-pages", label: "Limited or underdeveloped service pages" },
  { value: "no-internal-linking", label: "No clear internal linking structure" },
  { value: "weak-local", label: "Weak local or geographic visibility" },
  { value: "no-analytics", label: "No analytics or reporting in place" },
  { value: "not-sure", label: "Not sure where the gaps are" },
];

const ACCESS_OPTIONS = [
  { value: "no-access", label: "No access to analytics yet" },
  { value: "search-console", label: "Google Search Console" },
  { value: "analytics", label: "Google Analytics" },
  { value: "cms-access", label: "CMS / website backend" },
  { value: "bing-webmaster", label: "Bing Webmaster Tools" },
];

function CheckboxGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (v: string, checked: boolean) => {
    onChange(checked ? [...value, v] : value.filter((x) => x !== v));
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value.includes(opt.value)}
            onChange={(e) => toggle(opt.value, e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-brand-muted leading-snug">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export function AuditForm({ initialPlan = "" }: { initialPlan?: string }) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubmissionInput>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      full_name: "",
      work_email: "",
      company_name: "",
      website_url: "",
      phone: "",
      primary_service: "",
      service_area: "",
      industry: "",
      business_size: "",
      main_goal: "",
      competitors: "",
      cms_platform: "",
      current_challenges: [],
      access_available: [],
      notes: "",
      website: "",
      selected_plan: initialPlan,
    },
  });

  const challenges = watch("current_challenges") ?? [];
  const access = watch("access_available") ?? [];

  async function onSubmit(values: SubmissionInput) {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const resp = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Something went wrong submitting your request.",
        );
      }
      router.push(`/thank-you?t=${encodeURIComponent(data.resultsToken ?? "")}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or email shawn@gsally.com.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col">
      <section className="bg-brand-hero text-white pt-28 pb-14 md:pt-36 relative overflow-hidden">
        <HeroOverlay />
        <div className="container px-4 md:px-6 text-center max-w-2xl relative z-10">
          <div className="eyebrow-pill-gold mb-6 mx-auto w-fit">Free assessment</div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold mb-5">
            Start with your free assessment
          </h1>
          <p className="text-base md:text-lg text-white/70 leading-relaxed">
            This free assessment gives you a starting point — what looks strong, what needs work, and
            what to improve first. If you want help improving over time, month-to-month support is
            available with simple cancel-anytime plans.
          </p>
        </div>
      </section>

      <TrustBar
        items={[
          "Free assessment · no obligation",
          "Month-to-month support available",
          "Cancel anytime on monthly plans",
        ]}
      />

      <section className="py-16 md:py-24 bg-brand-cream">
        <div className="container px-4 md:px-6 max-w-2xl">
          <div className="rounded-2xl border border-brand-border bg-white p-6 md:p-8 shadow-card mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue mb-4">
              What happens after you submit
            </p>
            <p className="text-sm text-brand-muted leading-relaxed mb-5">
              Once you send the form below, we save your request and begin reviewing your website
              automatically. You&apos;ll receive clear findings and recommended next steps — including
              monthly support options if you want ongoing help.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-left">
              <div className="rounded-xl bg-brand-cream p-4">
                <p className="text-xs font-bold uppercase text-brand-subtle mb-1">What you receive</p>
                <p className="text-sm text-brand-muted">A clear assessment of what looks good and what to improve first — plus a path to monthly support if you want it.</p>
              </div>
              <div className="rounded-xl bg-brand-cream p-4">
                <p className="text-xs font-bold uppercase text-brand-subtle mb-1">What happens next</p>
                <p className="text-sm text-brand-muted">Your review begins right after you hit submit on the form below.</p>
              </div>
              <div className="rounded-xl bg-brand-cream p-4">
                <p className="text-xs font-bold uppercase text-brand-subtle mb-1">Turnaround</p>
                <p className="text-sm text-brand-muted">Most reviews finish within minutes. We&apos;ll reach out within 2–3 business days only if we need more info.</p>
              </div>
            </div>
          </div>

          <div className="card-brand rounded-2xl p-8 md:p-10 shadow-card-md">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-heading font-extrabold text-brand-navy">
                Fill out the form below
              </h2>
              <p className="mt-2 text-sm text-brand-muted leading-relaxed">
                Share your business details so we can review your site and prepare your assessment.
                Fields marked with * are required.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} />
              <input type="hidden" {...register("selected_plan")} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input className={`${inputClass} mt-1`} placeholder="Jane Doe" {...register("full_name")} />
                  {errors.full_name && <p className="text-red-600 text-xs mt-1">{errors.full_name.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Work Email *</label>
                  <input className={`${inputClass} mt-1`} placeholder="jane@company.com" {...register("work_email")} />
                  {errors.work_email && <p className="text-red-600 text-xs mt-1">{errors.work_email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Company Name *</label>
                  <input className={`${inputClass} mt-1`} {...register("company_name")} />
                  {errors.company_name && <p className="text-red-600 text-xs mt-1">{errors.company_name.message}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="website_url">
                    Company website URL *
                  </label>
                  <input
                    id="website_url"
                    className={`${inputClass} mt-1`}
                    placeholder="https://yourcompany.com"
                    inputMode="url"
                    autoCapitalize="none"
                    autoCorrect="off"
                    aria-describedby="website_url_help"
                    {...register("website_url")}
                  />
                  <p id="website_url_help" className="text-xs text-brand-subtle mt-1">
                    We will confirm the site is reachable before starting the assessment.
                  </p>
                  {errors.website_url && <p className="text-red-600 text-xs mt-1">{errors.website_url.message}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}>Phone (optional)</label>
                <input className={`${inputClass} mt-1`} {...register("phone")} />
              </div>

              <p className={sectionHeading}>Business Context</p>

              <div>
                <label className={labelClass}>Primary service or offering</label>
                <input className={`${inputClass} mt-1`} {...register("primary_service")} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Service area</label>
                  <input className={`${inputClass} mt-1`} {...register("service_area")} />
                </div>
                <div>
                  <label className={labelClass}>Industry</label>
                  <input className={`${inputClass} mt-1`} {...register("industry")} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Approximate business size</label>
                <select className={`${inputClass} mt-1`} {...register("business_size")}>
                  <option value="">Select employee count</option>
                  <option value="1-5">1–5 employees</option>
                  <option value="6-20">6–20 employees</option>
                  <option value="21-50">21–50 employees</option>
                  <option value="51-200">51–200 employees</option>
                  <option value="200+">200+ employees</option>
                </select>
              </div>

              <p className={sectionHeading}>Goals and Current Setup</p>

              <div>
                <label className={labelClass}>Main goal</label>
                <select className={`${inputClass} mt-1`} {...register("main_goal")}>
                  <option value="">Select your primary goal</option>
                  <option value="more-qualified-leads">More qualified inbound leads</option>
                  <option value="ai-search-visibility">Stronger visibility in AI search</option>
                  <option value="service-page-performance">Better service-page performance</option>
                  <option value="local-visibility">More local visibility</option>
                  <option value="technical-cleanup">Technical cleanup and structure</option>
                  <option value="monthly-optimization">Ongoing monthly optimization</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Top competitors (optional)</label>
                <input className={`${inputClass} mt-1`} {...register("competitors")} />
              </div>

              <div>
                <label className={labelClass}>CMS or website platform</label>
                <select className={`${inputClass} mt-1`} {...register("cms_platform")}>
                  <option value="">Select your platform</option>
                  <option value="wordpress">WordPress</option>
                  <option value="webflow">Webflow</option>
                  <option value="shopify">Shopify</option>
                  <option value="squarespace">Squarespace</option>
                  <option value="wix">Wix</option>
                  <option value="custom-react">Custom / React</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <p className={sectionHeading}>Current Challenges and Access</p>

              <div>
                <label className={labelClass}>Current challenges</label>
                <CheckboxGroup
                  options={CHALLENGE_OPTIONS}
                  value={Array.isArray(challenges) ? challenges : []}
                  onChange={(v) => setValue("current_challenges", v)}
                />
              </div>

              <div>
                <label className={labelClass}>Access currently available</label>
                <CheckboxGroup
                  options={ACCESS_OPTIONS}
                  value={Array.isArray(access) ? access : []}
                  onChange={(v) => setValue("access_available", v)}
                />
              </div>

              <div>
                <label className={labelClass}>Anything else we should know?</label>
                <textarea
                  className="w-full border border-brand-border rounded-lg min-h-[120px] p-4 text-sm mt-1 resize-y focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  {...register("notes")}
                />
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{submitError}</div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-blue hover:bg-brand-blue-hover disabled:opacity-60 text-white h-12 text-base font-heading font-semibold rounded-lg flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Checking site…
                  </>
                ) : (
                  "Submit my free assessment →"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
