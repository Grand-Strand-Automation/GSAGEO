"use client";

import { useState } from "react";
import Link from "next/link";
import { GEO_ONE_LINER } from "@/components/GeoAbbr";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { StatusChip } from "@/components/ui/StatusChip";
import { ButtonLink } from "@/components/ui/Button";
import { SAMPLE_REPORT } from "@/lib/content/sample-report";
import { SIGNAL_GLOSSARY } from "@/lib/content/geo-explain";
import { scoreBarClass, scoreStatusLabel, scoreTone } from "@/lib/ui/score-status";
import { cn } from "@/lib/utils";

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 7V5a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InfoTip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-[11px] font-semibold text-muted hover:border-accent hover:text-accent"
        aria-label={text}
        title={text}
      >
        i
      </button>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-56 -translate-x-1/2 rounded-control border border-border bg-surface p-2 text-left text-xs font-normal leading-relaxed text-body shadow-card-md group-hover:block group-focus-within:block">
        {text}
      </span>
    </span>
  );
}

export function SampleReportPage() {
  const [selectedId, setSelectedId] = useState<string>(SAMPLE_REPORT.defaultSignalId);
  const selected =
    SAMPLE_REPORT.signals.find((s) => s.id === selectedId) ?? SAMPLE_REPORT.signals[0];
  const selectedTone = scoreTone(selected.score);
  const glossaryById = Object.fromEntries(SIGNAL_GLOSSARY.map((g) => [g.id, g]));

  return (
    <div className="flex flex-col">
      <div className="bg-highlight px-5 py-3 text-center">
        <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.06em] text-ink">
          Sample report · fictional business · {SAMPLE_REPORT.domain}
        </p>
      </div>

      <div className="border-b border-border bg-surface-alt px-5 py-3 text-center">
        <p className="text-sm text-body">{GEO_ONE_LINER}</p>
      </div>

      <section className="section-pad bg-surface-alt">
        <div className="container-site">
          <div className="card-surface grid grid-cols-1 items-center gap-8 p-7 md:grid-cols-[auto_1fr] md:p-10">
            <ScoreRing score={SAMPLE_REPORT.score} size={140} />
            <div>
              <p className="eyebrow mb-3">AI Visibility Report · {SAMPLE_REPORT.domain}</p>
              <h1 className="heading-1 mb-4">{SAMPLE_REPORT.headline}</h1>
              <p className="body-lg mb-4 max-w-2xl">{SAMPLE_REPORT.summary}</p>
              <p className="mb-5 text-sm leading-relaxed text-muted">{SAMPLE_REPORT.scoreNote}</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_REPORT.pills.map((pill) => (
                  <StatusChip key={pill.label} tone={pill.tone} label={pill.label} />
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_REPORT.engines.map((engine) => (
              <div key={engine.name} className="card-surface p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-heading text-lg font-semibold text-ink">{engine.name}</h3>
                  <StatusChip tone={engine.tone} label={engine.status} />
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
                const tip = glossaryById[signal.id]?.plain ?? signal.description;
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
                      <p className="flex items-center gap-2 font-heading text-sm font-semibold text-ink">
                        {signal.name}
                        <InfoTip text={tip} />
                      </p>
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
                <StatusChip tone={selectedTone} label={scoreStatusLabel(selected.score)} />
                <span className="font-mono text-sm font-semibold text-muted">
                  {selected.score}/100
                </span>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-body">
                {glossaryById[selected.id]?.plain ?? selected.description}
              </p>
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

          <details className="mt-8 card-surface group p-5 md:p-6">
            <summary className="cursor-pointer list-none font-heading text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                What do these scores mean?
                <span className="font-mono text-xs font-medium text-muted group-open:hidden">
                  Show
                </span>
                <span className="hidden font-mono text-xs font-medium text-muted group-open:inline">
                  Hide
                </span>
              </span>
            </summary>
            <ul className="mt-5 space-y-4 border-t border-border pt-5">
              {SIGNAL_GLOSSARY.map((item) => (
                <li key={item.id}>
                  <p className="font-heading text-sm font-semibold text-ink">{item.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-body">{item.plain}</p>
                </li>
              ))}
            </ul>
          </details>
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
                  <span className="font-mono text-sm font-semibold text-accent">#{priority.num}</span>
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

          <div className="space-y-4">
            {SAMPLE_REPORT.priorities
              .filter((p) => p.locked)
              .map((priority) => (
                <div
                  key={priority.num}
                  className="relative overflow-hidden rounded-card border border-border bg-surface"
                >
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2 text-muted">
                      <LockIcon />
                      <span className="font-mono text-sm font-semibold">#{priority.num}</span>
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-ink">{priority.title}</h3>
                    <p className="mt-3 select-none blur-[5px] text-sm text-body" aria-hidden="true">
                      {priority.body}
                    </p>
                  </div>
                  <div className="border-t border-border bg-surface-alt px-6 py-4">
                    <p className="mb-3 text-sm text-body">
                      Unlock with any monthly plan — Monitor starts at $199/mo.
                    </p>
                    <ButtonLink href="/#pricing" variant="primary" size="md">
                      Unlock with any monthly plan
                    </ButtonLink>
                  </div>
                </div>
              ))}
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
