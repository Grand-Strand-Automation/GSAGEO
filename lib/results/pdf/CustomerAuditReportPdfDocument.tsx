import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { CustomerReportViewModel } from "@/lib/results/customer-report-view-model";

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
  headline: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginTop: 14,
    marginBottom: 8,
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
  bullet: {
    fontSize: 10,
    color: "#4b5b6b",
    marginBottom: 5,
    paddingLeft: 8,
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
      <Text style={styles.footerText}>GSAGEO · Website Clarity Report</Text>
      <Text style={styles.footerText}>{domain}</Text>
    </View>
  );
}

export function CustomerAuditReportPdfDocument({ report }: { report: CustomerReportViewModel }) {
  return (
    <Document
      title={`Website Review — ${report.companyName}`}
      author="GSAGEO"
      subject={`Website clarity report for ${report.domain}`}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.coverBand}>
          <Text style={styles.coverEyebrow}>Website clarity report</Text>
          <Text style={styles.coverTitle}>{report.companyName}</Text>
          <Text style={styles.coverMeta}>{report.websiteUrl}</Text>
          <Text style={styles.coverMeta}>Prepared for {report.preparedFor}</Text>
          <Text style={styles.coverMeta}>{formatDate(report.publishedAt ?? report.auditedAt)}</Text>
          <Text style={styles.headline}>{report.headline}</Text>
          <Text style={[styles.body, { color: "#d7e1ea" }]}>{report.summary}</Text>
          <Text style={[styles.body, { color: "#9aaeb8", marginTop: 8 }]}>
            Overall: {report.overallStatus}
          </Text>
        </View>

        <Text style={styles.sectionEyebrow}>What looks good</Text>
        {report.whatLooksGood.map((item) => (
          <Text key={item} style={styles.bullet}>
            • {item}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>What needs improvement</Text>
        {report.whatNeedsImprovement.map((item) => (
          <Text key={item} style={styles.bullet}>
            • {item}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>What this may affect</Text>
        <Text style={styles.body}>{report.whatThisMayAffect}</Text>

        <PageFooter domain={report.domain} />
      </Page>

      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionEyebrow}>How your site stacks up</Text>
        {report.scorecard.map((row) => (
          <View key={row.key} style={styles.row}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowScore}>{row.statusLabel}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Top priorities</Text>
        {report.topPriorities.map((priority, index) => (
          <View key={priority.title} style={styles.card}>
            <Text style={styles.cardTitle}>
              {index + 1}. {priority.title}
            </Text>
            <Text style={styles.body}>{priority.summary}</Text>
            <Text style={[styles.body, { marginTop: 4 }]}>Why it matters: {priority.whyItMatters}</Text>
            <Text style={[styles.body, { color: "#0e2f54", marginTop: 4 }]}>
              What to do next: {priority.whatToDoNext}
            </Text>
          </View>
        ))}

        {report.fixExamples.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Simple improvement ideas</Text>
            {report.fixExamples.map((example) => (
              <View key={example.title} style={styles.card}>
                <Text style={styles.cardTitle}>{example.title}</Text>
                <Text style={styles.body}>{example.suggestion}</Text>
                <Text style={[styles.body, { marginTop: 4 }]}>{example.explanation}</Text>
              </View>
            ))}
          </>
        ) : null}

        <View style={[styles.card, { marginTop: 16, backgroundColor: "#0e2f54" }]}>
          <Text style={[styles.cardTitle, { color: "#ffffff" }]}>Next best step</Text>
          <Text style={[styles.body, { color: "#d7e1ea" }]}>{report.nextBestStep}</Text>
        </View>

        <Text style={[styles.body, { marginTop: 12, fontSize: 8, color: "#9aaeb8" }]}>
          Confidential client report prepared by GSAGEO. Contact shawn@gsally.com to discuss next steps.
        </Text>

        <PageFooter domain={report.domain} />
      </Page>
    </Document>
  );
}

Font.registerHyphenationCallback((word) => [word]);
