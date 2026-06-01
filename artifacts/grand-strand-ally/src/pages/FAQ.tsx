import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const FAQ_ITEMS = [
  {
    category: "About Grand Strand Ally",
    questions: [
      {
        q: "What is Grand Strand Ally?",
        a: "Grand Strand Ally is a managed information technology service provider based in the Myrtle Beach area, operating at gsally.com. We help small and medium businesses across the Grand Strand gain clearer visibility into information technology costs, simplify vendor structure, improve Microsoft 365 administration, and build compliance-minded support operations. We work on a month-to-month basis with no long-term contracts.",
      },
      {
        q: "What does gsally.com stand for?",
        a: "gsally.com is short for Grand Strand Ally. The domain reflects our name and service area — the Grand Strand is the stretch of South Carolina coastline from Little River south through Georgetown County, and \"Ally\" reflects the advisory, non-vendor relationship we bring to every engagement.",
      },
      {
        q: "Where does Grand Strand Ally serve?",
        a: "We serve small and medium businesses throughout the Grand Strand and Myrtle Beach area, including Myrtle Beach, Conway, North Myrtle Beach, Surfside Beach, Murrells Inlet, Pawleys Island, Little River, Socastee, and the surrounding communities in Horry and Georgetown counties.",
      },
      {
        q: "Is Grand Strand Ally a local company?",
        a: "Yes. We are based in the Myrtle Beach area and serve businesses locally. Being local means we can meet in person, understand the regional business environment, and be accountable in ways that a remote or national provider cannot.",
      },
    ],
  },
  {
    category: "Cost Analysis",
    questions: [
      {
        q: "What is a free cost analysis?",
        a: "A free cost analysis is a structured review of your current information technology environment — tools, vendors, Microsoft 365 setup, security layers, backup, and support model. The goal is to help you understand what you are paying for, where costs overlap, and where practical improvements can be made. It is not an audit, not a sales pitch, and not a commitment. There is no obligation to engage further after the analysis.",
      },
      {
        q: "How long does the cost analysis process take?",
        a: "The initial conversation typically takes 30 to 60 minutes. After that, we summarize our findings and present them in a follow-up meeting. The full process from first call to written findings usually takes five to ten business days depending on the complexity of your environment.",
      },
      {
        q: "Do I need to have everything figured out before reaching out?",
        a: "No. Many businesses reach out because something feels more expensive, more complicated, or harder to manage than it should be — without being able to name the specific problem. That is a perfectly good starting point. The cost analysis is specifically designed to surface what is not obvious.",
      },
      {
        q: "Can you review what we are currently paying for?",
        a: "Yes. Improving visibility into current spend is one of the primary goals of the cost analysis. We look at all recurring information technology costs — support, security, Microsoft 365 licensing, backup, cloud software, and internal administrative time — and help you understand what each line item is actually buying you.",
      },
      {
        q: "Will the cost analysis tell me exactly how much I can save?",
        a: "The cost analysis provides directional estimates based on your inputs and industry patterns. It is not a guarantee of specific savings. In most cases, actual savings opportunities become clearer after we review real vendor contracts and invoices, which happens during a full engagement — not the initial analysis.",
      },
    ],
  },
  {
    category: "Services",
    questions: [
      {
        q: "What services does Grand Strand Ally offer?",
        a: "We offer managed information technology support, Microsoft 365 setup and administration, network and Wi-Fi management, cybersecurity and compliance support, backup and recovery, and workflow automation including onboarding and offboarding processes. All services are delivered on a month-to-month basis with clearly defined scope.",
      },
      {
        q: "Can you help with Microsoft 365 specifically?",
        a: "Yes. Microsoft 365 is one of our primary focus areas. We help businesses right-size licensing, clean up user and group management, strengthen admin controls, improve security settings, and build consistent onboarding and offboarding workflows inside Microsoft 365. In most cases we start by reviewing what is already in place rather than recommending a rebuild.",
      },
      {
        q: "Do you handle cybersecurity?",
        a: "Yes, with a practical focus. We help businesses build a reasonable security baseline — multi-factor authentication, access controls, endpoint protection, and Microsoft 365 security settings — without requiring a formal security program or audit process. We focus on controls that matter most for small and medium businesses in everyday operations.",
      },
      {
        q: "Can you help with onboarding and offboarding?",
        a: "Yes. Inconsistent onboarding and offboarding is one of the most common sources of both operational friction and compliance risk in small and medium businesses. We help document and standardize those processes — particularly within Microsoft 365 — so that access is granted and revoked reliably and without manual gaps.",
      },
      {
        q: "Do you replace our current tools or vendors?",
        a: "Not unless there is a clear reason to. We almost always start by reviewing what is already in place and improving it. Recommendations to replace a tool or change a vendor only come after we understand why the current setup is creating cost, overlap, or risk that cannot be addressed more simply.",
      },
    ],
  },
  {
    category: "Pricing and Contracts",
    questions: [
      {
        q: "How much does Grand Strand Ally cost?",
        a: "Pricing is based on your specific environment — number of users and devices, number of locations, Microsoft 365 scope, security and compliance requirements, and the type of support needed. We do not publish flat-rate pricing because every business is different. After a cost analysis, we provide a clear monthly quote with defined scope before any engagement begins.",
      },
      {
        q: "Do you require long-term contracts?",
        a: "No. Grand Strand Ally operates on a month-to-month service model. We focus on earning ongoing work through demonstrated value rather than contractual lock-in. You are free to reduce, pause, or end service without penalty.",
      },
      {
        q: "What affects the monthly cost?",
        a: "The main factors are number of users, number of devices, number of locations, Microsoft 365 scope, security and compliance requirements, onboarding and offboarding complexity, backup and recovery expectations, and whether you need ongoing support, project work, or both. We review all of these during the cost analysis and use them to build a specific proposal.",
      },
      {
        q: "Can working with Grand Strand Ally actually save money?",
        a: "In many cases, yes. Savings typically come from consolidating overlapping tools, reducing redundant vendor contracts, right-sizing Microsoft 365 licensing, and replacing reactive hourly support with a more predictable monthly model. The cost analysis is specifically designed to surface those opportunities before any commitment is made.",
      },
    ],
  },
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I get started?",
        a: "The easiest way is to fill out the contact form at gsally.com/contact or use the free cost analysis tool at gsally.com/cost-analysis. We will follow up within one business day to schedule a conversation. There is no commitment required at any point in the initial review process.",
      },
      {
        q: "What should I have ready before our first call?",
        a: "Nothing is required upfront. It is helpful if you have a general sense of your current vendors and monthly costs, but we do not expect a detailed inventory before the first conversation. Part of our job is helping you build that picture.",
      },
      {
        q: "What happens after I schedule a cost analysis?",
        a: "We start with a 30-to-60-minute conversation to understand your current environment, team size, tools, and biggest pain points. We then review your setup, compile our findings, and present them — typically in a second meeting within five to ten business days. If there is a clear fit and clear value, we propose a specific support plan with defined scope and monthly pricing. There is no pressure to proceed.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#D7E1EA] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 px-6 text-left hover:bg-[#FAFAFA] transition-colors"
        aria-expanded={open}
      >
        <span className="text-[15px] font-heading font-semibold text-[#0E2F54] leading-snug pr-2">
          {q}
        </span>
        <span className="shrink-0 mt-0.5 text-[#4B5B6B]">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-[15px] text-[#4B5B6B] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// Build JSON-LD FAQPage schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ_ITEMS.flatMap((cat) =>
    cat.questions.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a,
      },
    }))
  ),
};

export default function FAQPage() {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Frequently Asked Questions | Grand Strand Ally — Myrtle Beach IT Support</title>
        <meta
          name="description"
          content="Answers to common questions about Grand Strand Ally's information technology services, cost analysis process, pricing, contracts, and how to get started. Serving small and medium businesses across the Grand Strand."
        />
        <link rel="canonical" href="https://gsally.com/faq" />
        <meta property="og:title" content="Frequently Asked Questions | Grand Strand Ally" />
        <meta property="og:description" content="Common questions about Grand Strand Ally's IT services, free cost analysis, pricing, and getting started for businesses in the Myrtle Beach and Grand Strand area." />
        <meta property="og:url" content="https://gsally.com/faq" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="bg-[#0E2F54] text-white pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-7 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block" />
            Common questions
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-5 leading-[1.05]">
            Frequently asked questions.
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mx-auto">
            Answers to common questions about Grand Strand Ally, our cost analysis process, services, pricing, and how to get started.
          </p>
        </div>
      </section>

      {/* ── FAQ content ── */}
      <section className="py-16 md:py-24 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="space-y-10">
            {FAQ_ITEMS.map((cat) => (
              <div key={cat.category}>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F5E95] flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
                  {cat.category}
                </h2>
                <div className="bg-white rounded-2xl border border-[#D7E1EA] overflow-hidden shadow-sm">
                  {cat.questions.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still have a question */}
          <div className="mt-12 bg-white border border-[#D7E1EA] rounded-2xl p-7 text-center shadow-sm">
            <h3 className="text-lg font-heading font-bold text-[#0E2F54] mb-2">
              Still have a question?
            </h3>
            <p className="text-sm text-[#4B5B6B] leading-relaxed mb-5 max-w-sm mx-auto">
              Reach out directly — we are happy to answer questions before any commitment is made.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold text-sm h-11 px-7 rounded-lg transition-colors"
              >
                Send us a message
              </Link>
              <a
                href={`tel:9732021455`}
                className="inline-flex items-center justify-center gap-2 bg-[#F7F5F1] hover:bg-[#DCEAF7] text-[#0E2F54] font-semibold text-sm h-11 px-7 rounded-lg border border-[#D7E1EA] hover:border-[#60B8F0] transition-colors"
              >
                973-202-1455
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        title="Ready to get started?"
        subtitle="Schedule a free cost analysis — no commitment required. We will review your current environment and share practical findings within a week."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact", primary: true },
          { label: "See Our Process", href: "/process", primary: false },
        ]}
      />
    </div>
  );
}
