"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScoreCategory } from "@/lib/results/report-view-model";
import { gradeToneClassesForGrade } from "@/lib/results/score-utils";

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ScoreCategory }[];
}) {
  if (!active || !payload?.[0]) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-brand-border bg-white px-3 py-2 shadow-card-md text-xs">
      <p className="font-semibold text-brand-navy">{item.label}</p>
      <p className="text-brand-muted mt-1">
        {item.score}/100 · {item.grade} · {item.interpretation}
      </p>
    </div>
  );
}

export function CategoryScoreChart({ categories }: { categories: ScoreCategory[] }) {
  const data = categories.map((c) => ({
    ...c,
    shortLabel: c.label.length > 18 ? `${c.label.slice(0, 16)}…` : c.label,
  }));

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4 md:p-6 shadow-card-md">
      <div className="h-[280px] md:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#d7e1ea" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#4b5b6b" }} />
            <YAxis
              type="category"
              dataKey="shortLabel"
              width={110}
              tick={{ fontSize: 11, fill: "#0e2f54" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(31, 94, 149, 0.06)" }} />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={18}>
              {data.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={gradeToneClassesForGrade(entry.grade).fill}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CoverageSummaryChart({
  strengths,
  opportunities,
  cautions,
}: {
  strengths: number;
  opportunities: number;
  cautions: number;
}) {
  const data = [
    { name: "Strengths", value: strengths, fill: "#10b981" },
    { name: "Opportunities", value: opportunities, fill: "#1f5e95" },
    { name: "Needs review", value: cautions, fill: "#f59e0b" },
  ];

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4 md:p-6 shadow-card-md">
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d7e1ea" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#4b5b6b" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#4b5b6b" }} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                borderColor: "#d7e1ea",
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={42}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
