"use client";

import { useEffect, useState } from "react";
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

/** Client-side abort before typical Vercel/proxy hard kill. */
const CLIENT_TIMEOUT_MS = 55_000;

const WAIT_MESSAGES = [
  "Reviewing your website…",
  "Drafting a homepage concept for your business…",
  "Almost ready — polishing the preview…",
] as const;

type Props = {
  compact?: boolean;
  className?: string;
};

type MockupApiResponse = {
  ok: boolean;
  token?: string;
  concept?: MockupConcept;
  screenshotUrl?: string | null;
  persisted?: boolean;
  emailSent?: boolean;
  emailSkippedReason?: string | null;
  warning?: string;
  generation?: {
    source?: string;
    openAiConfigured?: boolean;
    usedFallback?: boolean;
    fallbackReason?: string | null;
  };
  error?: unknown;
};

export function MockupRequestForm({ compact = false, className = "" }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [waitIndex, setWaitIndex] = useState(0);

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

  useEffect(() => {
    if (!isSubmitting) {
      setWaitIndex(0);
      return;
    }
    const id = window.setInterval(() => {
      setWaitIndex((i) => (i + 1) % WAIT_MESSAGES.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [isSubmitting]);

  const onSubmit = async (data: MockupRequestInput) => {
    setIsSubmitting(true);
    setSubmitError("");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

    try {
      const res = await fetch("/api/mockups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      let json: MockupApiResponse;
      try {
        json = (await res.json()) as MockupApiResponse;
      } catch {
        setSubmitError(
          "The preview took too long or returned an incomplete response. Please try again — we will also email the link when generation succeeds.",
        );
        return;
      }

      if (!res.ok || !json.ok || !json.token || !json.concept) {
        const fieldErrors =
          json.error && typeof json.error === "object"
            ? Object.values(json.error as Record<string, string[]>)
                .flat()
                .filter(Boolean)
            : [];
        setSubmitError(
          fieldErrors[0] ||
            "Something went wrong generating your preview. Please try again in a moment.",
        );
        return;
      }

      let cached = false;
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
            email: data.email,
            screenshot_url:
              json.screenshotUrl ?? json.concept.currentSnapshot?.screenshotUrl ?? null,
            generation: json.generation ?? null,
            emailSent: json.emailSent ?? false,
            persisted: json.persisted ?? false,
          }),
        );
        cached = true;
      } catch {
        cached = false;
      }

      // Need at least one durable delivery path before navigating away
      if (!json.persisted && !cached) {
        setSubmitError(
          "Your preview was generated, but we could not save it for this browser or email a permanent link. Please try again.",
        );
        return;
      }

      if (!json.persisted && cached) {
        // Still show preview from this session — warn via query flag
        router.push(`/mockup/${json.token}?delivery=session`);
        return;
      }

      const delivery = json.emailSent ? "emailed" : "saved";
      router.push(`/mockup/${json.token}?delivery=${delivery}`);
    } catch (err) {
      const aborted = err instanceof Error && err.name === "AbortError";
      setSubmitError(
        aborted
          ? "This is taking longer than expected. Please try again — when it succeeds, we email you a lasting preview link."
          : "Unable to reach the server. Please check your connection and try again.",
      );
    } finally {
      window.clearTimeout(timeoutId);
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
          Preview on this page, and we&apos;ll email you the link so you can reopen it later.
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
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
          )}
          <p className="text-[11px] text-brand-muted mt-1">
            Required — we send your preview link here.
          </p>
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
            {WAIT_MESSAGES[waitIndex]}
          </>
        ) : (
          "Create My Homepage Mockup →"
        )}
      </button>

      <p className="text-xs text-brand-muted text-center mt-3 leading-relaxed">
        {isSubmitting
          ? "Usually under a minute. Keep this tab open — we also email the preview link."
          : "Sample concept only — not a finished website. You’ll get the link by email too."}
      </p>
    </form>
  );
}
