import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { ReportViewModel } from "@/lib/results/report-view-model";
import { priorityLabel, effortLabel } from "@/lib/results/score-utils";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#0e2f54",
    lineHeight: 1.45,
  },
  coverBand: {
    backgroundColor: "#0e2f54",
    marginHorizontal: -48,
    marginTop: -48,
    paddingHorizontal: 48,
    paddingVertical: 32,
    marginBottom: 24,
  },
  coverEyebrow: {
    fontSize: 8,
    letterSpacing: 1.2,
    color: "#9aaeb8",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  coverTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  coverMeta: {
    fontSize: 10,
    color: "#d7e1ea",
    marginBottom: 4,
  },
  scoreBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  scoreValue: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#0e2f54",
  },
  scoreLabel: {
    fontSize: 9,
    color: "#4b5b6b",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#0e2f54",
    marginBottom: 8,
    marginTop: 18,
  },
  sectionEyebrow: {
    fontSize: 8,
    letterSpacing: 1,
    color: "#1f5e95",
    textTransform: "uppercase",
    marginBottom: 4,
    marginTop: 14,
  },
  body: {
    fontSize: 10,
    color: "#4b5b6b",
    marginBottom: 6,
  },
  card: {
    borderWidth: 1,
    borderColor: "#d7e1ea",
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#0e2f54",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eae8e4",
    paddingVertical: 5,
  },
  rowLabel: { fontSize: 9, color: "#0e2f54", flex: 1 },
  rowScore: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1f5e95" },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: "#d7e1ea",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 8, color: "#9aaeb8" },
  previewBlock: {
    backgroundColor: "#f7f5f1",
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
});

function formatDate(iso: string | null): string {
  if (!iso) return new Date().toLocaleDateString("en-US");
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function PageFooter({ domain }: { domain: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>GSAGEO · GEO / AI Visibility Assessment</Text>
      <Text style={styles.footerText}>{domain}</Text>
    </View>
  );
}

export function AuditReportPdfDocument({ report }: { report: ReportViewModel }) {
  return (
    <Document
      title={`GEO Assessment — ${report.companyName}`}
      author="GSAGEO"
      subject={`AI Visibility Assessment for ${report.domain}`}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.coverBand}>
          <Text style={styles.coverEyebrow}>GEO Assessment Report</Text>
          <Text style={styles.coverTitle}>{report.companyName}</Text>
          <Text style={styles.coverMeta}>{report.websiteUrl}</Text>
          <Text style={styles.coverMeta}>Prepared for {report.preparedFor}</Text>
          <Text style={styles.coverMeta}>{formatDate(report.publishedAt ?? report.auditedAt)}</Text>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreValue}>
              {report.overallScore}/100 · {report.overallGrade}
            </Text>
            <Text style={styles.scoreLabel}>
              AI Visibility Readiness — {report.overallInterpretation}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionEyebrow}>Executive summary</Text>
        <Text style={styles.body}>{report.executiveSummary}</Text>

        <Text style={styles.sectionTitle}>Readiness scorecard</Text>
        {report.categories.map((cat) => (
          <View key={cat.key} style={styles.row}>
            <Text style={styles.rowLabel}>{cat.label}</Text>
            <Text style={styles.rowScore}>
              {cat.score}/100 ({cat.grade}) — {cat.interpretation}
            </Text>
          </View>
        ))}

        {report.strongestCategory ? (
          <Text style={[styles.body, { marginTop: 8 }]}>
            Strongest: {report.strongestCategory.label}. Needs attention:{" "}
            {report.weakestCategory?.label ?? "—"}.
          </Text>
        ) : null}

        <PageFooter domain={report.domain} />
      </Page>

      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionEyebrow}>Strengths detected</Text>
        {report.strengths.length === 0 ? (
          <Text style={styles.body}>No major strengths were highlighted in this assessment snapshot.</Text>
        ) : (
          report.strengths.slice(0, 8).map((s) => (
            <View key={s.title} style={styles.card} wrap={false}>
              <Text style={styles.cardTitle}>{s.title}</Text>
              <Text style={styles.body}>{s.summary}</Text>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Priority opportunities</Text>
        {report.opportunities.map((o, i) => (
          <View key={o.label} style={styles.card}>
            <Text style={styles.cardTitle}>
              {i + 1}. {o.label} ({o.status})
            </Text>
            <Text style={styles.body}>{o.summary}</Text>
            <Text style={[styles.body, { color: "#0e2f54", marginTop: 4 }]}>{o.recommendation}</Text>
          </View>
        ))}

        <PageFooter domain={report.domain} />
      </Page>

      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionEyebrow}>Example fix previews</Text>
        <Text style={styles.body}>
          Sample implementation previews — practical examples, not guaranteed final copy.
        </Text>
        {report.previews.map((p) => (
          <View key={p.id} style={styles.card} wrap={false}>
            <Text style={styles.cardTitle}>{p.title}</Text>
            <Text style={styles.body}>
              {priorityLabel(p.priority)} · {effortLabel(p.implementation_effort)}
            </Text>
            <Text style={[styles.body, { marginTop: 4 }]}>Issue: {p.issue_summary}</Text>
            <Text style={styles.body}>Why it matters: {p.why_it_matters}</Text>
            {p.before_text ? (
              <Text style={[styles.body, { fontStyle: "italic" }]}>Before: {p.before_text}</Text>
            ) : null}
            <View style={styles.previewBlock}>
              <Text style={styles.body}>{p.after_text.slice(0, 1200)}</Text>
            </View>
          </View>
        ))}

        <PageFooter domain={report.domain} />
      </Page>

      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>Implementation roadmap</Text>
        {report.roadmap.map((bucket) => (
          <View key={bucket.title}>
            <Text style={[styles.cardTitle, { marginTop: 10 }]}>{bucket.title}</Text>
            <Text style={styles.body}>{bucket.subtitle}</Text>
            {bucket.items.map((item) => (
              <View key={item.title} style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.body}>{item.summary}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={[styles.card, { marginTop: 16, backgroundColor: "#0e2f54" }]}>
          <Text style={[styles.cardTitle, { color: "#ffffff" }]}>Recommended next step</Text>
          <Text style={[styles.body, { color: "#d7e1ea" }]}>
            {report.suggestedTier
              ? `Based on this review, ${report.suggestedTier} may be a practical fit. Contact shawn@gsally.com to discuss implementation.`
              : "Contact shawn@gsally.com to discuss implementing these improvements or ongoing GEO support."}
          </Text>
        </View>

        <Text style={[styles.body, { marginTop: 12, fontSize: 8, color: "#9aaeb8" }]}>
          Confidential client report prepared by GSAGEO. Do not distribute publicly without permission.
        </Text>

        <PageFooter domain={report.domain} />
      </Page>
    </Document>
  );
}

// Helvetica-Bold is built into react-pdf
Font.registerHyphenationCallback((word) => [word]);
