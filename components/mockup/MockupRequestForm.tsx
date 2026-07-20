"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  CATEGORY_OPTIONS,
  GOAL_OPTIONS,
  STYLE_OPTIONS,
  mockupRequestSchema,
  type MockupRequestInput,
} from "@/lib/validation/mockup";
import type { MockupConcept } from "@/lib/mockup/generator";

const labelClass = "text-sm font-semibold text-brand-navy";
const inputClass =
  "w-full border border-brand-border rounded-lg h-11 px-4 text-sm text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30";
const selectClass = `${inputClass} appearance-none`;

type Props = {
  compact?: boolean;
  className?: string;
};

export function MockupRequestForm({ compact = false, className = "" }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MockupRequestInput>({
    resolver: zodResolver(mockupRequestSchema),
    defaultValues: {
      website_url: "",
      business_name: "",
      business_category: "professional_services",
      preferred_style: "clean_modern",
      homepage_goal: "modernize",
      notes: "",
      email: "",
      website: "",
    },
  });

  const onSubmit = async (data: MockupRequestInput) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/mockups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as {
        ok: boolean;
        token?: string;
        concept?: MockupConcept;
        screenshotUrl?: string | null;
        generation?: {
          source?: string;
          openAiConfigured?: boolean;
          usedFallback?: boolean;
          fallbackReason?: string | null;
        };
        error?: unknown;
      };

      if (!res.ok || !json.ok || !json.token || !json.concept) {
        setSubmitError("Something went wrong generating your preview. Please try again.");
        return;
      }

      try {
        sessionStorage.setItem(
          `mockup:${json.token}`,
          JSON.stringify({
            concept: json.concept,
            website_url: data.website_url,
            business_name: data.business_name,
            preferred_style: data.preferred_style,
            homepage_goal: data.homepage_goal,
            notes: data.notes ?? "",
            screenshot_url: json.screenshotUrl ?? json.concept.currentSnapshot?.screenshotUrl ?? null,
            generation: json.generation ?? null,
          }),
        );
      } catch {
        /* sessionStorage may be unavailable */
      }

      router.push(`/mockup/${json.token}`);
    } catch {
      setSubmitError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`rounded-2xl border border-brand-border bg-white p-5 md:p-6 shadow-card-md ${className}`}
      noValidate
    >
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue mb-2">
          Instant homepage preview
        </p>
        <h2 className="font-heading font-bold text-xl text-brand-navy leading-snug">
          Create your homepage mockup
        </h2>
        <p className="text-sm text-brand-muted mt-1.5 leading-relaxed">
          A quick generator — not a long intake form. Preview only; final design is refined later.
        </p>
      </div>

      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label className={labelClass} htmlFor="website_url">
            Current website URL
          </label>
          <input
            id="website_url"
            type="text"
            placeholder="yourbusiness.com"
            className={`${inputClass} mt-1.5`}
            {...register("website_url")}
          />
          {errors.website_url && (
            <p className="text-xs text-red-600 mt-1">{errors.website_url.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="business_name">
            Business name
          </label>
          <input
            id="business_name"
            type="text"
            placeholder="Acme Services"
            className={`${inputClass} mt-1.5`}
            {...register("business_name")}
          />
          {errors.business_name && (
            <p className="text-xs text-red-600 mt-1">{errors.business_name.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="business_category">
            Business type
          </label>
          <select
            id="business_category"
            className={`${selectClass} mt-1.5`}
            {...register("business_category")}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="preferred_style">
            Preferred style
          </label>
          <select
            id="preferred_style"
            className={`${selectClass} mt-1.5`}
            {...register("preferred_style")}
          >
            {STYLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="homepage_goal">
            Primary homepage goal
          </label>
          <select
            id="homepage_goal"
            className={`${selectClass} mt-1.5`}
            {...register("homepage_goal")}
          >
            {GOAL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={compact ? "" : "sm:col-span-2"}>
          <label className={labelClass} htmlFor="notes">
            Optional notes / must-include items
          </label>
          <textarea
            id="notes"
            rows={2}
            placeholder="e.g. show emergency service, highlight financing, keep our phone number prominent"
            className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 mt-1.5 resize-y min-h-[72px]"
            {...register("notes")}
          />
        </div>

        <div className={compact ? "" : "sm:col-span-2"}>
          <label className={labelClass} htmlFor="email">
            Email <span className="font-normal text-brand-muted">(optional — for follow-up)</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@business.com"
            className={`${inputClass} mt-1.5`}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("website")}
      />

      {submitError && (
        <p className="text-sm text-red-600 mt-4">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-navy text-white font-semibold text-sm h-12 px-5 hover:bg-brand-blue transition-colors disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Building a tailored homepage concept…
          </>
        ) : (
          "Create My Homepage Mockup →"
        )}
      </button>

      <p className="text-xs text-brand-muted text-center mt-3 leading-relaxed">
        {isSubmitting
          ? "This usually takes a few seconds while we review your site and draft the concept."
          : "Sample concept only — not a finished website."}
      </p>
    </form>
  );
}
