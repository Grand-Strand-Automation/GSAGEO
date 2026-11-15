"use client";

import { useState } from "react";
import Link from "next/link";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ButtonLink } from "@/components/ui/Button";
import { SAMPLE_REPORT } from "@/lib/content/sample-report";
import {
  scoreBadgeClass,
  scoreBarClass,
  scoreStatusLabel,
  scoreTone,
} from "@/lib/ui/score-status";
import { cn } from "@/lib/utils";

export function SampleReportPage() {
  const [selectedId, setSelectedId] = useState(SAMPLE_REPORT.defaultSignalId);
  const selected =
    SAMPLE_REPORT.signals.find((s) => s.id === selectedId) ?? SAMPLE_REPORT.signals[0];
  const selectedTone = scoreTone(selected.score);

  return (
    <div className="flex flex-col">
      <div className="bg-highlight px-5 py-3 text-center">
        <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.06em] text-ink">
          Sample report · fictional business, illustrative values
        </p>
      </div>

      <section className="section-pad bg-surface-alt">
        <div className="container-site">
          <div className="card-surface grid grid-cols-1 items-center gap-8 p-7 md:grid-cols-[auto_1fr] md:p-10">
            <ScoreRing score={SAMPLE_REPORT.score} size={140} />
            <div>
              <p className="eyebrow mb-3">
                AI Visibility Report · {SAMPLE_REPORT.domain}
              </p>
              <h1 className="heading-1 mb-4">{SAMPLE_REPORT.headline}</h1>
              <p className="body-lg mb-5 max-w-2xl">{SAMPLE_REPORT.summary}</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_REPORT.pills.map((pill) => (
                  <span
                    key={pill.label}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-semibold",
                      scoreBadgeClass(pill.tone),
                    )}
                  >
                    {pill.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface">
        <div className="container-site">
          <h2 className="heading-2 mb-3">How each AI tool sees you</h2>
          <p className="mb-8 font-mono text-sm text-muted">
            Query: &ldquo;{SAMPLE_REPORT.query}&rdquo;
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SAMPLE_REPORT.engines.map((engine) => (
              <div key={engine.name} className="card-surface p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-heading text-lg font-semibold text-ink">{engine.name}</h3>
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs font-semibold",
                      scoreBadgeClass(engine.tone),
                    )}
                  >
                    {engine.status}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-body">{engine.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface-alt">
        <div className="container-site">
          <h2 className="heading-2 mb-8">Signal breakdown</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="card-surface divide-y divide-border overflow-hidden">
              {SAMPLE_REPORT.signals.map((signal) => {
                const active = signal.id === selected.id;
                return (
                  <button
                    key={signal.id}
                    type="button"
                    onClick={() => setSelectedId(signal.id)}
                    className={cn(
                      "flex w-full items-center gap-4 px-5 py-4 text-left transition-colors",
                      active ? "bg-accent-tint" : "hover:bg-surface-alt",
                    )}
                    aria-pressed={active}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-sm font-semibold text-ink">{signal.name}</p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                        <div
                          className={cn("h-full rounded-full", scoreBarClass(signal.score))}
                          style={{ width: `${signal.score}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-mono text-sm font-semibold text-ink">{signal.score}</span>
                  </button>
                );
              })}
            </div>

            <div className="card-surface p-6 md:p-7" aria-live="polite">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="font-heading text-xl font-semibold text-ink">{selected.name}</h3>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-xs font-semibold",
                    scoreBadgeClass(selectedTone),
                  )}
                >
                  {scoreStatusLabel(selected.score)}
                </span>
                <span className="font-mono text-sm font-semibold text-muted">
                  {selected.score}/100
                </span>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-body">{selected.description}</p>
              <ul className="mb-6 space-y-2.5">
                {selected.findings.map((finding) => (
                  <li key={finding} className="flex gap-2 text-sm text-body">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" aria-hidden />
                    {finding}
                  </li>
                ))}
              </ul>
              <p className="rounded-control border border-border bg-surface-alt px-4 py-3 text-sm text-muted">
                Step-by-step fixes are included in monthly plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface">
        <div className="container-site max-w-3xl">
          <h2 className="heading-2 mb-8">Top priorities</h2>

          {SAMPLE_REPORT.priorities
            .filter((p) => !p.locked)
            .map((priority) => (
              <div
                key={priority.num}
                className="mb-5 rounded-card border-2 border-accent bg-surface p-6 md:p-7"
              >
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-accent">
                    #{priority.num}
                  </span>
                  {priority.tag ? (
                    <span className="rounded-md bg-accent-tint px-2 py-0.5 text-xs font-semibold text-accent">
                      {priority.tag}
                    </span>
                  ) : null}
                </div>
                <h3 className="heading-3 mb-3">{priority.title}</h3>
                <p className="text-sm leading-relaxed text-body md:text-base">{priority.body}</p>
              </div>
            ))}

          <div className="relative overflow-hidden rounded-card border border-border">
            <div className="space-y-0 blur-[5px]" aria-hidden="true">
              {SAMPLE_REPORT.priorities
                .filter((p) => p.locked)
                .map((priority) => (
                  <div key={priority.num} className="border-b border-border p-6 last:border-0">
                    <p className="mb-2 font-mono text-sm font-semibold text-muted">
                      #{priority.num}
                    </p>
                    <h3 className="font-heading text-lg font-semibold text-ink">{priority.title}</h3>
                    <p className="mt-2 text-sm text-body">{priority.body}</p>
                  </div>
                ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-surface/70 p-6">
              <div className="max-w-sm rounded-card border border-border bg-surface p-6 text-center shadow-card-md">
                <p className="mb-4 text-sm leading-relaxed text-body">
                  Priorities 2 and 3, plus how to fix them, are in your monthly plan
                </p>
                <ButtonLink href="/#pricing" variant="primary" size="md" className="w-full">
                  See plans from $199/mo
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-ink text-white">
        <div className="container-site max-w-2xl text-center">
          <h2 className="heading-2 mb-4 text-white">Want this for your business?</h2>
          <p className="mb-8 text-base leading-relaxed text-on-dark">
            Free, takes about two minutes, results usually within minutes.
          </p>
          <ButtonLink href="/audit" variant="primary">
            Start my free assessment
          </ButtonLink>
          <p className="mt-6">
            <Link href="/" className="text-sm text-accent-on-dark hover:text-white">
              ← Back to home
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
