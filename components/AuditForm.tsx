"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ButtonLink } from "@/components/ui/Button";
import { IconCheck } from "@/components/icons/StrokeIcons";
import {
  ACCESS_OPTIONS,
  AUDIT_STORAGE_KEY,
  BOOKING_URL,
  BUSINESS_SIZE_OPTIONS,
  CHALLENGE_OPTIONS,
  CMS_OPTIONS,
  GOAL_OPTIONS,
  PLAN_CHIP_LABELS,
  SCAN_CHECKLIST,
  STEP_LABELS,
} from "@/lib/content/audit-form";
import type { SubmissionInput } from "@/lib/validation/submission";
import { cn } from "@/lib/utils";

type FormState = {
  website_url: string;
  full_name: string;
  work_email: string;
  company_name: string;
  phone: string;
  primary_service: string;
  service_area: string;
  industry: string;
  business_size: string;
  competitors: string;
  main_goal: string;
  current_challenges: string[];
  cms_platform: string;
  access_available: string[];
  notes: string;
  selected_plan: string;
  website: string; // honeypot
};

type Phase = "form" | "scanning" | "scoring" | "results" | "error";

type SubmitResult = {
  score?: number | null;
  resultsToken?: string;
};

const SCORE_POLL_MS = 2000;
const SCORE_POLL_MAX_ATTEMPTS = 90; // ~3 minutes

const EMPTY_FORM: FormState = {
  website_url: "",
  full_name: "",
  work_email: "",
  company_name: "",
  phone: "",
  primary_service: "",
  service_area: "",
  industry: "",
  business_size: "",
  competitors: "",
  main_goal: "",
  current_challenges: [],
  cms_platform: "",
  access_available: [],
  notes: "",
  selected_plan: "",
  website: "",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function firstNameFrom(fullName: string) {
  const part = fullName.trim().split(/\s+/)[0];
  return part || "there";
}

function readStorage(): Partial<FormState> | null {
  try {
    const raw = sessionStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<FormState>;
  } catch {
    return null;
  }
}

function writeStorage(state: FormState) {
  try {
    sessionStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private mode */
  }
}

function clearStorage() {
  try {
    sessionStorage.removeItem(AUDIT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function ToggleChip({
  label,
  pressed,
  onToggle,
}: {
  label: string;
  pressed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      className={cn(
        "rounded-control border px-3.5 py-2.5 text-left text-sm font-medium transition-colors",
        pressed
          ? "border-accent bg-accent-tint text-ink"
          : "border-border bg-surface text-body hover:border-input-border",
      )}
    >
      {label}
    </button>
  );
}

function GoalCard({
  label,
  pressed,
  onSelect,
}: {
  label: string;
  pressed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onSelect}
      className={cn(
        "rounded-card border p-4 text-left text-sm font-semibold transition-colors",
        pressed
          ? "border-accent bg-accent-tint text-ink"
          : "border-border bg-surface text-body hover:border-input-border",
      )}
    >
      {label}
    </button>
  );
}

export function AuditForm({
  initialPlan = "",
  initialUrl = "",
}: {
  initialPlan?: string;
  initialUrl?: string;
}) {
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState<Phase>("form");
  const [form, setForm] = useState<FormState>(() => ({
    ...EMPTY_FORM,
    website_url: initialUrl,
    selected_plan: initialPlan,
  }));
  const [stepError, setStepError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [scanIndex, setScanIndex] = useState(0);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const hydrated = useRef(false);
  const requestDone = useRef(false);
  const requestOk = useRef(false);
  const requestPayload = useRef<SubmitResult | null>(null);
  const requestError = useRef("");

  useEffect(() => {
    const stored = readStorage();
    if (stored) {
      setForm((prev) => ({
        ...prev,
        ...stored,
        website_url: initialUrl || stored.website_url || prev.website_url,
        selected_plan: initialPlan || stored.selected_plan || prev.selected_plan,
        current_challenges: Array.isArray(stored.current_challenges)
          ? stored.current_challenges
          : prev.current_challenges,
        access_available: Array.isArray(stored.access_available)
          ? stored.access_available
          : prev.access_available,
        website: "",
      }));
    } else if (initialUrl || initialPlan) {
      setForm((prev) => ({
        ...prev,
        website_url: initialUrl || prev.website_url,
        selected_plan: initialPlan || prev.selected_plan,
      }));
    }
    hydrated.current = true;
  }, [initialPlan, initialUrl]);

  useEffect(() => {
    if (!hydrated.current || phase !== "form") return;
    writeStorage(form);
  }, [form, phase]);

  // Form is tall; after submit the browser keeps scrollY near the bottom, so
  // scanning / results appear "below the fold" until the user scrolls up.
  const skipInitialStepScroll = useRef(true);
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (phase === "form" && skipInitialStepScroll.current) {
      skipInitialStepScroll.current = false;
      return;
    }
    const jump = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.getElementById("audit-flow-top")?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    };
    jump();
    // Second pass after paint in case layout shifts (score ring, fonts).
    const t = window.setTimeout(jump, 50);
    return () => window.clearTimeout(t);
  }, [phase, step]);

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleArray = useCallback((key: "current_challenges" | "access_available", value: string) => {
    setForm((prev) => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      };
    });
  }, []);

  function validateStep1(): string | null {
    if (!form.website_url.trim() || !form.website_url.includes(".")) {
      return "Please enter a valid website address (it should include a dot, like yourbusiness.com).";
    }
    if (form.full_name.trim().length < 2) {
      return "Please enter your full name.";
    }
    if (!isValidEmail(form.work_email)) {
      return "Please enter a valid work email.";
    }
    if (!form.company_name.trim()) {
      return "Please enter your company name.";
    }
    return null;
  }

  function goNext() {
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setStepError(err);
        return;
      }
    }
    setStepError("");
    setStep((s) => Math.min(4, s + 1));
  }

  function goBack() {
    setStepError("");
    setStep((s) => Math.max(1, s - 1));
  }

  async function waitForScore(token: string): Promise<number | null> {
    for (let attempt = 0; attempt < SCORE_POLL_MAX_ATTEMPTS; attempt += 1) {
      try {
        const resp = await fetch(`/api/results/${encodeURIComponent(token)}/status`);
        const data = await resp.json();
        if (!resp.ok || !data.ok) {
          await new Promise((r) => window.setTimeout(r, SCORE_POLL_MS));
          continue;
        }
        if (data.state === "failed") {
          throw new Error(
            "We could not finish scoring this site. Please try again from the free assessment page.",
          );
        }
        if (data.state === "revoked" || data.state === "expired") {
          throw new Error(
            "Your results link is no longer valid. Please submit a new free assessment.",
          );
        }
        if (typeof data.overallScore === "number") {
          return data.overallScore;
        }
        if (data.ready) {
          // Published but score missing from payload — stop waiting.
          return null;
        }
      } catch (err) {
        if (err instanceof Error && /could not finish|no longer valid/i.test(err.message)) {
          throw err;
        }
      }
      await new Promise((r) => window.setTimeout(r, SCORE_POLL_MS));
    }
    return null;
  }

  async function submitAssessment() {
    setSubmitError("");
    setPhase("scanning");
    setScanIndex(0);
    requestDone.current = false;
    requestOk.current = false;
    requestPayload.current = null;
    requestError.current = "";

    const payload: SubmissionInput = {
      full_name: form.full_name.trim(),
      work_email: form.work_email.trim(),
      company_name: form.company_name.trim(),
      website_url: form.website_url.trim(),
      phone: form.phone.trim() || undefined,
      primary_service: form.primary_service.trim() || undefined,
      service_area: form.service_area.trim() || undefined,
      industry: form.industry.trim() || undefined,
      business_size: form.business_size || undefined,
      main_goal: form.main_goal || undefined,
      competitors: form.competitors.trim() || undefined,
      cms_platform: form.cms_platform || undefined,
      current_challenges: form.current_challenges,
      access_available: form.access_available,
      selected_plan: form.selected_plan || undefined,
      notes: form.notes.trim() || undefined,
      website: form.website || "",
    };

    const requestPromise = (async () => {
      try {
        const resp = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(
            typeof data.error === "string"
              ? data.error
              : "Something went wrong submitting your request.",
          );
        }
        requestOk.current = true;
        requestPayload.current = {
          resultsToken: data.resultsToken,
          score: typeof data.score === "number" ? data.score : null,
        };
      } catch (err) {
        requestOk.current = false;
        requestError.current =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
      } finally {
        requestDone.current = true;
      }
    })();

    let i = 0;
    const tick = () => {
      i += 1;
      setScanIndex(i);
      if (i < SCAN_CHECKLIST.length) {
        window.setTimeout(tick, 650);
        return;
      }
      const finish = () => {
        if (!requestDone.current) {
          window.setTimeout(finish, 150);
          return;
        }
        void requestPromise.then(async () => {
          if (!requestOk.current) {
            setSubmitError(requestError.current);
            setPhase("error");
            return;
          }

          const base = requestPayload.current ?? {};
          clearStorage();

          // Prefer an immediate score if the API ever returns one; otherwise poll status.
          if (typeof base.score === "number") {
            setSubmitResult(base);
            setPhase("results");
            return;
          }

          const token = typeof base.resultsToken === "string" ? base.resultsToken : "";
          if (!token) {
            setSubmitResult(base);
            setPhase("results");
            return;
          }

          setSubmitResult(base);
          setPhase("scoring");
          try {
            const score = await waitForScore(token);
            setSubmitResult({ ...base, score });
            setPhase("results");
          } catch (err) {
            setSubmitError(
              err instanceof Error
                ? err.message
                : "Something went wrong finishing your score.",
            );
            setPhase("error");
          }
        });
      };
      finish();
    };
    window.setTimeout(tick, 650);
  }

  function resetFlow() {
    clearStorage();
    setForm({
      ...EMPTY_FORM,
      selected_plan: form.selected_plan,
    });
    setStep(1);
    setPhase("form");
    setStepError("");
    setSubmitError("");
    setSubmitResult(null);
    setScanIndex(0);
  }

  const planLabel = form.selected_plan
    ? PLAN_CHIP_LABELS[form.selected_plan] || form.selected_plan
    : "";

  const progressPct = useMemo(() => (step / 4) * 100, [step]);

  if (phase === "scanning" || phase === "scoring") {
    const scoring = phase === "scoring";
    return (
      <section id="audit-flow-top" className="section-pad bg-surface-alt scroll-mt-24">
        <div className="container-site max-w-xl">
          <div className="card-surface p-8 shadow-card-md" aria-live="polite">
            <p className="eyebrow mb-3">{scoring ? "Scoring" : "Scanning"}</p>
            <h1 className="heading-3 mb-2">
              {scoring
                ? "Calculating your AI Visibility Score…"
                : `Reviewing ${form.website_url || "your site"}…`}
            </h1>
            <p className="mb-6 text-sm text-muted">
              {scoring
                ? "Your assessment is running now. Your score will appear on this page as soon as it's ready — no need to wait for email."
                : "This usually takes just a moment."}
            </p>
            <div className="mb-6 h-2 overflow-hidden rounded-full bg-border">
              <div
                className={cn(
                  "h-full rounded-full bg-accent transition-all duration-500",
                  scoring && "animate-pulse",
                )}
                style={{
                  width: scoring
                    ? "100%"
                    : `${Math.min(100, (scanIndex / SCAN_CHECKLIST.length) * 100)}%`,
                }}
              />
            </div>
            <ul className="space-y-3">
              {SCAN_CHECKLIST.map((item, idx) => {
                const done = scoring || idx < scanIndex;
                const active = !scoring && idx === scanIndex;
                return (
                  <li
                    key={item}
                    className={cn(
                      "flex items-center gap-3 text-sm",
                      done ? "text-ink" : active ? "text-accent" : "text-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border",
                        done
                          ? "border-accent bg-accent text-white"
                          : active
                            ? "border-accent"
                            : "border-border",
                      )}
                    >
                      {done ? <IconCheck className="h-3 w-3" /> : null}
                    </span>
                    {item}
                  </li>
                );
              })}
              <li
                className={cn(
                  "flex items-center gap-3 text-sm",
                  scoring ? "text-accent" : "text-muted",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border",
                    scoring ? "border-accent" : "border-border",
                  )}
                />
                Calculating your AI Visibility Score
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (phase === "results") {
    const score =
      submitResult && typeof submitResult.score === "number" ? submitResult.score : null;
    const resultsHref = submitResult?.resultsToken
      ? `/results/${encodeURIComponent(submitResult.resultsToken)}`
      : "";
    return (
      <section id="audit-flow-top" className="section-pad bg-surface-alt scroll-mt-24">
        <div className="container-site">
          <p className="eyebrow mb-3">
            Assessment ready · {form.website_url}
          </p>
          <h1 className="heading-1 mb-4 max-w-3xl">
            {score != null
              ? `Here's your starting point, ${firstNameFrom(form.full_name)}.`
              : `We're still finishing your score, ${firstNameFrom(form.full_name)}.`}
          </h1>
          <p className="body-lg mb-10 max-w-2xl">
            {score != null
              ? "Your AI Visibility Score is ready below. Open the full report for what's helping, what's hurting, and what to fix first."
              : `Your assessment was submitted. Open the report link below for live status — we'll also email ${form.work_email} when the full write-up is ready.`}
          </p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card-surface flex flex-col items-center justify-center p-8">
              {score != null ? (
                <ScoreRing score={score} size={140} label="AI Visibility Score" />
              ) : (
                <>
                  <ScoreRing score={null} size={140} placeholder="Score pending" />
                  <p className="mt-4 max-w-xs text-center text-sm text-muted">
                    {resultsHref
                      ? "Your report link is ready — open it to see the score as soon as publishing finishes."
                      : "We're finishing your score. Check your inbox shortly, or try again."}
                  </p>
                </>
              )}
              {resultsHref ? (
                <ButtonLink href={resultsHref} variant="primary" size="md" className="mt-6">
                  {score != null ? "Open full report →" : "Open report status →"}
                </ButtonLink>
              ) : null}
            </div>
            <div className="card-surface p-8">
              <h2 className="heading-3 mb-5">What happens next</h2>
              <ol className="mb-8 space-y-4">
                {[
                  score != null
                    ? "Review your score and full report"
                    : "Open your report link for live status",
                  "Fix your top priority",
                  "Want help with the rest?",
                ].map((item, i) => (
                  <li key={item} className="flex gap-3 text-sm text-body">
                    <span className="font-mono text-sm font-semibold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
              <p className="mb-6 text-sm text-muted">
                A copy of the full write-up is also sent to {form.work_email}.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/#pricing" variant="primary" size="md">
                  See monthly plans
                </ButtonLink>
                {BOOKING_URL ? (
                  <ButtonLink href={BOOKING_URL} variant="secondaryLight" size="md">
                    Book a 15-min walkthrough
                  </ButtonLink>
                ) : null}
              </div>
              <button
                type="button"
                onClick={resetFlow}
                className="mt-6 text-sm font-semibold text-accent hover:text-accent-hover"
              >
                Check another site
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (phase === "error") {
    return (
      <section id="audit-flow-top" className="section-pad bg-surface-alt scroll-mt-24">
        <div className="container-site max-w-xl">
          <div className="card-surface p-8" role="alert">
            <p className="eyebrow mb-3 text-bad">Something went wrong</p>
            <h1 className="heading-3 mb-3">We couldn&apos;t submit your assessment</h1>
            <p className="mb-6 text-sm text-body">{submitError}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" className="btn-primary" onClick={() => void submitAssessment()}>
                Try again
              </button>
            </div>
            <button
              type="button"
              className="mt-6 text-sm font-semibold text-accent"
              onClick={() => setPhase("form")}
            >
              ← Back to form
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div id="audit-flow-top" className="flex flex-col scroll-mt-24">
      <section className="bg-surface-alt pb-8 pt-12 md:pb-10 md:pt-16">
        <div className="container-site">
          <p className="eyebrow mb-3">Free assessment</p>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h1 className="heading-1 max-w-3xl">See how AI tools see your business</h1>
            {planLabel ? (
              <span className="rounded-md bg-accent-tint px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-accent">
                Selected plan: {planLabel}
              </span>
            ) : null}
          </div>
          <p className="body-lg max-w-2xl">
            Four short steps. Only the first is required. The more you share, the sharper your
            priorities.
          </p>

          <div className="mt-8">
            <div className="mb-3 flex flex-wrap gap-2">
              {STEP_LABELS.map((label, i) => {
                const n = i + 1;
                const active = n === step;
                const done = n < step;
                return (
                  <div
                    key={label}
                    className={cn(
                      "flex items-center gap-2 rounded-control px-3 py-1.5 text-xs font-semibold",
                      active
                        ? "bg-ink text-white"
                        : done
                          ? "bg-accent-tint text-accent"
                          : "bg-surface text-muted",
                    )}
                  >
                    <span className="font-mono">{n}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                );
              })}
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-alt pb-16 md:pb-24">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="card-surface p-6 shadow-card md:p-8">
              {/* honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                aria-hidden="true"
              />

              {stepError ? (
                <div className="mb-5 rounded-control border border-bad/20 bg-bad-bg px-4 py-3 text-sm text-bad" role="alert">
                  {stepError}
                </div>
              ) : null}

              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label htmlFor="website_url" className="label-field">
                      Website URL *
                    </label>
                    <input
                      id="website_url"
                      className="input-field"
                      placeholder="yourbusiness.com"
                      value={form.website_url}
                      onChange={(e) => update("website_url", e.target.value)}
                      autoComplete="url"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="full_name" className="label-field">
                        Full name *
                      </label>
                      <input
                        id="full_name"
                        className="input-field"
                        value={form.full_name}
                        onChange={(e) => update("full_name", e.target.value)}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label htmlFor="work_email" className="label-field">
                        Work email *
                      </label>
                      <input
                        id="work_email"
                        type="email"
                        className="input-field"
                        value={form.work_email}
                        onChange={(e) => update("work_email", e.target.value)}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="company_name" className="label-field">
                        Company name *
                      </label>
                      <input
                        id="company_name"
                        className="input-field"
                        value={form.company_name}
                        onChange={(e) => update("company_name", e.target.value)}
                        autoComplete="organization"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="label-field">
                        Phone <span className="font-normal text-muted">(optional)</span>
                      </label>
                      <input
                        id="phone"
                        className="input-field"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <p className="text-sm text-muted">Optional — skip anytime.</p>
                  <div>
                    <label htmlFor="primary_service" className="label-field">
                      Primary service
                    </label>
                    <input
                      id="primary_service"
                      className="input-field"
                      value={form.primary_service}
                      onChange={(e) => update("primary_service", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="service_area" className="label-field">
                        Service area
                      </label>
                      <input
                        id="service_area"
                        className="input-field"
                        value={form.service_area}
                        onChange={(e) => update("service_area", e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="industry" className="label-field">
                        Industry
                      </label>
                      <input
                        id="industry"
                        className="input-field"
                        value={form.industry}
                        onChange={(e) => update("industry", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="business_size" className="label-field">
                      Team size
                    </label>
                    <select
                      id="business_size"
                      className="input-field"
                      value={form.business_size}
                      onChange={(e) => update("business_size", e.target.value)}
                    >
                      <option value="">Select team size</option>
                      {BUSINESS_SIZE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="competitors" className="label-field">
                      Top competitors
                    </label>
                    <input
                      id="competitors"
                      className="input-field"
                      value={form.competitors}
                      onChange={(e) => update("competitors", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <p className="text-sm text-muted">Optional — skip anytime.</p>
                  <div>
                    <p className="label-field">Main goal</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {GOAL_OPTIONS.map((opt) => (
                        <GoalCard
                          key={opt.value}
                          label={opt.label}
                          pressed={form.main_goal === opt.value}
                          onSelect={() =>
                            update("main_goal", form.main_goal === opt.value ? "" : opt.value)
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="label-field">Current challenges</p>
                    <div className="flex flex-wrap gap-2">
                      {CHALLENGE_OPTIONS.map((opt) => (
                        <ToggleChip
                          key={opt.value}
                          label={opt.label}
                          pressed={form.current_challenges.includes(opt.value)}
                          onToggle={() => toggleArray("current_challenges", opt.value)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cms_platform" className="label-field">
                      Website platform
                    </label>
                    <select
                      id="cms_platform"
                      className="input-field"
                      value={form.cms_platform}
                      onChange={(e) => update("cms_platform", e.target.value)}
                    >
                      <option value="">Select platform</option>
                      {CMS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <p className="text-sm text-muted">Optional — submit whenever you&apos;re ready.</p>
                  <div>
                    <p className="label-field">Access available</p>
                    <div className="flex flex-wrap gap-2">
                      {ACCESS_OPTIONS.map((opt) => (
                        <ToggleChip
                          key={opt.value}
                          label={opt.label}
                          pressed={form.access_available.includes(opt.value)}
                          onToggle={() => toggleArray("access_available", opt.value)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="notes" className="label-field">
                      Anything else we should know?
                    </label>
                    <textarea
                      id="notes"
                      className="input-field min-h-[120px] py-3"
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                    />
                  </div>
                  <div className="rounded-card border border-border bg-surface-alt p-4 text-sm text-body">
                    We&apos;ll scan <span className="font-semibold text-ink">{form.website_url || "your site"}</span>.
                    Results go to{" "}
                    <span className="font-semibold text-ink">{form.work_email || "your email"}</span>.
                    Most reviews finish within minutes.
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  {step > 1 ? (
                    <button type="button" className="btn-outline" onClick={goBack}>
                      ← Back
                    </button>
                  ) : (
                    <span />
                  )}
                  {step >= 2 && step <= 3 ? (
                    <button
                      type="button"
                      className="text-sm font-semibold text-muted hover:text-ink"
                      onClick={() => void submitAssessment()}
                    >
                      Skip &amp; submit now
                    </button>
                  ) : null}
                </div>
                {step < 4 ? (
                  <button type="button" className="btn-primary" onClick={goNext}>
                    {step === 1 ? "Continue →" : "Next →"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => void submitAssessment()}
                  >
                    Run my free assessment →
                  </button>
                )}
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="card-surface p-6">
                <p className="eyebrow mb-4">What you&apos;ll get</p>
                <ol className="space-y-4">
                  {[
                    "Your AI Visibility Score (1–100)",
                    "How ChatGPT, Google AI, Perplexity and Copilot see you",
                    "What's helping and what's hurting",
                    "Your top priority to fix first",
                  ].map((item, i) => (
                    <li key={item} className="flex gap-3 text-sm leading-snug text-body">
                      <span className="font-mono text-xs font-semibold text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
                <Link
                  href="/sample-report"
                  className="mt-5 inline-block text-sm font-semibold text-accent hover:text-accent-hover"
                >
                  Preview a sample report →
                </Link>
              </div>
              <div className="rounded-card border border-accent/20 bg-accent-tint p-5 text-sm leading-relaxed text-body">
                No sales pressure. The assessment is free and yours to keep. Monthly plans are
                optional, month-to-month and cancel anytime.
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
