# Results page design notes

Premium customer-facing audit report UI for `/results/[token]`.

## Section structure

1. **Report hero** — executive header, circular score badge, CTAs, audit metadata
2. **Quick visual summary** — stat cards + coverage chart + audit snapshot
3. **Readiness scorecard** — category meters, strongest/weakest highlights, horizontal bar chart
4. **Fix first** — top priority recommendation cards
5. **Detailed findings** — strengths grid + expandable finding cards by category
6. **Page analysis** — expandable page cards with signal indicators
7. **Fix previews** — before/after style premium preview cards
8. **Priority roadmap** — Fix first / Improve next / Nice to add columns
9. **Final CTA** — implementation conversion band

## Components

Located in `components/results/report/`:

| Component | Purpose |
|-----------|---------|
| `ReportHero` | Executive header + score badge |
| `StatCard` | Quick metric cards |
| `ScoreBadge` / `ScoreMeter` | Circular and bar score visuals |
| `ScorecardGrid` | Category score layout |
| `CategoryScoreChart` | Recharts horizontal bar chart |
| `CoverageSummaryChart` | Strengths vs opportunities bar chart |
| `FindingCard` | Expandable finding detail |
| `RecommendationCard` | Priority action cards |
| `PageAnalysisCard` | Page-by-page review |
| `FixPreviewCard` | Example improvement previews |
| `RoadmapSection` | Tiered implementation plan |
| `ResultsCTA` | Bottom conversion section |
| `SectionShell` | Consistent section headers |
| `ReportNav` | Desktop sticky jump nav + mobile pills |

Shared orchestrator: `components/results/AuditReportView.tsx`

## Data layer

- `lib/results/report-view-model.ts` — transforms `ResultsBundle` into presentation model
- `lib/results/page-analysis.ts` — builds page review cards from sitemap URLs
- `lib/results/score-utils.ts` — score tone, interpretation, badge colors

## Charts

Uses **Recharts** (`recharts`) with brand-aligned colors:

- Horizontal category score bar chart
- Coverage summary bar chart (strengths / opportunities / cautions)

Charts are client components only; the page shell remains server-rendered.

## Admin preview

`/admin/submissions/[id]` embeds the same `AuditReportView` below admin controls with an “Admin preview” banner.

## Pending states

`ResultsPendingView` uses the same report visual language (gradient accent, premium card, icons).

## Follow-up polish opportunities

- Radar chart for category scores (only if readability tests well on mobile)
- PDF export of report layout
- Auto-refresh polling on pending state
- Render `html_preview` for CTA and schema preview types consistently
