"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  INTEREST_OPTIONS,
  IMPROVE_OPTIONS,
  REQUEST_CATEGORY_OPTIONS,
  REQUEST_STYLE_OPTIONS,
  mockupLeadRequestSchema,
  type MockupLeadRequestInput,
} from "@/lib/validation/mockup-request";

const labelClass = "text-sm font-semibold text-brand-navy";
const inputClass =
  "w-full border border-brand-border rounded-lg h-11 px-4 text-sm text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30";
const selectClass = `${inputClass} appearance-none`;

type Props = {
  compact?: boolean;
  className?: string;
};

type ApiResponse = {
  ok: boolean;
  requestId?: string;
  emailSent?: boolean;
  error?: unknown;
};

export function MockupRequestForm({ compact = false, className = "" }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MockupLeadRequestInput>({
    resolver: zodResolver(mockupLeadRequestSchema),
    defaultValues: {
      website_url: "",
      business_name: "",
      business_category: "professional_services",
      improve_goal: "clearer_messaging",
      preferred_style: "",
      interest: "not_sure",
      notes: "",
      phone: "",
      email: "",
      website: "",
    },
  });

  const onSubmit = async (data: MockupLeadRequestInput) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/mockup-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let json: ApiResponse;
      try {
        json = (await res.json()) as ApiResponse;
      } catch {
        setSubmitError("Something went wrong submitting your request. Please try again.");
        return;
      }

      if (!res.ok || !json.ok) {
        const fieldErrors =
          json.error && typeof json.error === "object"
            ? Object.values(json.error as Record<string, string[]>)
                .flat()
                .filter(Boolean)
            : [];
        setSubmitError(
          fieldErrors[0] ||
            "Unable to submit your mockup request. Please try again in a moment.",
        );
        return;
      }

      router.push("/mockup-request/thanks");
    } catch {
      setSubmitError("Unable to reach the server. Please check your connection and try again.");
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
          Custom homepage concept
        </p>
        <h2 className="font-heading font-bold text-xl text-brand-navy leading-snug">
          Request a homepage mockup
        </h2>
        <p className="text-sm text-brand-muted mt-1.5 leading-relaxed">
          Tell us about your business and website. We&apos;ll review whether a homepage refresh or
          full redesign makes the most sense, then follow up by email.
        </p>
      </div>

      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label className={labelClass} htmlFor="website_url">
            Website URL
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
            Company name
          </label>
          <input
            id="business_name"
            type="text"
            placeholder="Acme Co."
            className={`${inputClass} mt-1.5`}
            {...register("business_name")}
          />
          {errors.business_name && (
            <p className="text-xs text-red-600 mt-1">{errors.business_name.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            Work email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@business.com"
            autoComplete="email"
            className={`${inputClass} mt-1.5`}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="business_category">
            Business type / industry
          </label>
          <select
            id="business_category"
            className={`${selectClass} mt-1.5`}
            {...register("business_category")}
          >
            {REQUEST_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="phone">
            Phone <span className="font-normal text-brand-muted">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="(843) 555-0100"
            className={`${inputClass} mt-1.5`}
            {...register("phone")}
          />
        </div>

        <div className={compact ? "" : "sm:col-span-2"}>
          <label className={labelClass} htmlFor="improve_goal">
            What do you want to improve?
          </label>
          <select
            id="improve_goal"
            className={`${selectClass} mt-1.5`}
            {...register("improve_goal")}
          >
            {IMPROVE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="interest">
            Interested in
          </label>
          <select id="interest" className={`${selectClass} mt-1.5`} {...register("interest")}>
            {INTEREST_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="preferred_style">
            Preferred style <span className="font-normal text-brand-muted">(optional)</span>
          </label>
          <select
            id="preferred_style"
            className={`${selectClass} mt-1.5`}
            {...register("preferred_style")}
          >
            <option value="">No preference</option>
            {REQUEST_STYLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={compact ? "" : "sm:col-span-2"}>
          <label className={labelClass} htmlFor="notes">
            Additional notes <span className="font-normal text-brand-muted">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={2}
            placeholder="Anything we should know about your brand, pages, or goals"
            className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 mt-1.5 resize-y min-h-[72px]"
            {...register("notes")}
          />
        </div>
      </div>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("website")}
      />

      {submitError && (
        <p className="text-sm text-red-600 mt-4 leading-relaxed">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-navy text-white font-semibold text-sm h-12 px-5 hover:bg-brand-blue transition-colors disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending your request…
          </>
        ) : (
          "Request My Homepage Mockup →"
        )}
      </button>

      <p className="text-xs text-brand-muted text-center mt-3 leading-relaxed">
        We&apos;ll follow up by email after review — not an instant automated preview.
      </p>
    </form>
  );
}
