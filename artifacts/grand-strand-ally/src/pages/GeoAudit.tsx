import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Helmet } from "react-helmet-async";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const CANONICAL = "https://gsally.com/geo-audit";

const CHALLENGE_OPTIONS = [
  { value: "weak-rankings",        label: "Weak rankings in traditional search" },
  { value: "poor-content",         label: "Poor or thin content structure" },
  { value: "limited-service-pages",label: "Limited or underdeveloped service pages" },
  { value: "no-internal-linking",  label: "No clear internal linking structure" },
  { value: "weak-local",           label: "Weak local or geographic visibility" },
  { value: "no-analytics",         label: "No analytics or reporting in place" },
  { value: "not-sure",             label: "Not sure where the gaps are" },
];

const ACCESS_OPTIONS = [
  { value: "no-access",          label: "No access to analytics yet" },
  { value: "search-console",     label: "Google Search Console" },
  { value: "analytics",          label: "Google Analytics" },
  { value: "cms-access",         label: "CMS / website backend" },
  { value: "bing-webmaster",     label: "Bing Webmaster Tools" },
];

const formSchema = z.object({
  fullName:          z.string().min(2, "Name is required"),
  workEmail:         z.string().email("Please enter a valid email address"),
  companyName:       z.string().min(1, "Company name is required"),
  websiteUrl:        z.string().min(4, "Website URL is required"),
  phone:             z.string().optional(),
  primaryService:    z.string().optional(),
  serviceArea:       z.string().optional(),
  industry:          z.string().optional(),
  businessSize:      z.string().optional(),
  mainGoal:          z.string().optional(),
  topCompetitors:    z.string().optional(),
  cmsPlatform:       z.string().optional(),
  currentChallenges: z.array(z.string()).optional(),
  accessAvailable:   z.array(z.string()).optional(),
  additionalNotes:   z.string().optional(),
  website:           z.string().optional(),
  selectedPlan:      z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function CheckboxGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string[] | undefined;
  onChange: (val: string[]) => void;
}) {
  const current = value ?? [];
  const toggle = (v: string, checked: boolean) => {
    onChange(checked ? [...current, v] : current.filter(x => x !== v));
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
      {options.map(opt => (
        <label
          key={opt.value}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <Checkbox
            checked={current.includes(opt.value)}
            onCheckedChange={(checked) => toggle(opt.value, !!checked)}
            className="mt-0.5"
          />
          <span className="text-sm text-[#4B5B6B] leading-snug group-hover:text-[#0E2F54] transition-colors">
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}

export default function GeoAudit() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialTier] = useState(() =>
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("tier") ?? "")
      : ""
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName:          "",
      workEmail:         "",
      companyName:       "",
      websiteUrl:        "",
      phone:             "",
      primaryService:    "",
      serviceArea:       "",
      industry:          "",
      businessSize:      "",
      mainGoal:          "",
      topCompetitors:    "",
      cmsPlatform:       "",
      currentChallenges: [],
      accessAvailable:   [],
      additionalNotes:   "",
      website:           "",
      selectedPlan:      initialTier,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await fetch("/api/geo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } catch (err) {
      console.error("[GeoAudit] Submission error:", err);
    } finally {
      setIsSubmitting(false);
      setLocation("/thank-you");
    }
  }

  const label = "text-sm font-semibold text-[#0E2F54]";
  const sectionHeading = "text-xs font-bold uppercase tracking-[0.15em] text-[#1F5E95] mb-5 pt-2 border-t border-[#D7E1EA]";

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Request a GEO Audit | Grand Strand Ally — AI Visibility for Your Business</title>
        <meta name="description" content="Submit your business details for a Generative Engine Optimization audit. Grand Strand Ally reviews your site's AI visibility and gives you a prioritized action plan." />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Request a GEO Audit | Grand Strand Ally" />
        <meta property="og:description" content="Get a GEO audit for your business. We review your site's structure, content, and technical readiness for AI search." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:site_name" content="Grand Strand Ally" />
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Hero */}
      <section className="bg-[#0E2F54] text-white pt-28 pb-14 md:pt-36 md:pb-18 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-7 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block" />
            GEO Audit Request
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold mb-5 leading-[1.05]">
            Request a GEO Audit
          </h1>
          <p className="text-base text-white/65 leading-relaxed">
            Fill out the form below and we will review your site's AI visibility, score it across eight GEO-readiness categories, and send you a prioritized action plan within two to three business days.
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-white border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-stretch justify-center divide-y sm:divide-y-0 sm:divide-x divide-[#D7E1EA]">
            {[
              "No commitment required",
              "Results delivered within 2–3 business days",
              "Practical, no-pressure approach",
            ].map(label => (
              <div key={label} className="flex items-center justify-center gap-2.5 py-4 sm:px-8 text-sm text-[#4B5B6B] font-medium">
                <CheckCircle2 size={14} className="text-[#1F5E95] flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <section className="py-16 md:py-24 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="bg-white rounded-2xl border border-[#D7E1EA] p-8 md:p-10 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Honeypot */}
                <input
                  type="text"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  {...form.register("website")}
                />

                {/* Selected Plan */}
                <FormField
                  control={form.control}
                  name="selectedPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={label}>Interested in (optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select a plan or leave blank" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="audit">AI Search Visibility Audit — $1,950 one-time</SelectItem>
                          <SelectItem value="foundation">AI Search Foundation — Starting at $5,500</SelectItem>
                          <SelectItem value="growth">AI Search Growth — Starting at $2,500/mo</SelectItem>
                          <SelectItem value="custom">Custom scope / not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Section 1: Contact Info */}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={label}>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="workEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={label}>Work Email *</FormLabel>
                          <FormControl>
                            <Input placeholder="jane@company.com" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={label}>Company Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Co." className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="websiteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={label}>Website URL *</FormLabel>
                          <FormControl>
                            <Input placeholder="https://yourcompany.com" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={label}>Phone (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="843-555-0100" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 2: Business Context */}
                <div className="space-y-5">
                  <p className={sectionHeading}>Business Context</p>
                  <FormField
                    control={form.control}
                    name="primaryService"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={label}>Primary service or offering</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Commercial HVAC, IT managed services, family law" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="serviceArea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={label}>Service area or target locations</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Myrtle Beach, SC / Southeast US" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={label}>Industry</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Healthcare, Legal, Construction, IT" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="businessSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={label}>Approximate business size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select employee count" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-5">1–5 employees</SelectItem>
                            <SelectItem value="6-20">6–20 employees</SelectItem>
                            <SelectItem value="21-50">21–50 employees</SelectItem>
                            <SelectItem value="51-200">51–200 employees</SelectItem>
                            <SelectItem value="200+">200+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 3: Goals */}
                <div className="space-y-5">
                  <p className={sectionHeading}>Goals and Current Setup</p>
                  <FormField
                    control={form.control}
                    name="mainGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={label}>Main goal for this engagement</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select your primary goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="more-qualified-leads">More qualified inbound leads</SelectItem>
                            <SelectItem value="ai-search-visibility">Stronger visibility in AI search</SelectItem>
                            <SelectItem value="service-page-performance">Better service-page performance</SelectItem>
                            <SelectItem value="local-visibility">More local visibility</SelectItem>
                            <SelectItem value="technical-cleanup">Technical cleanup and structure</SelectItem>
                            <SelectItem value="monthly-optimization">Ongoing monthly optimization</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="topCompetitors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={label}>Top competitors (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. CompanyA.com, CompanyB.com" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cmsPlatform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={label}>CMS or website platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select your platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="wordpress">WordPress</SelectItem>
                            <SelectItem value="webflow">Webflow</SelectItem>
                            <SelectItem value="shopify">Shopify</SelectItem>
                            <SelectItem value="squarespace">Squarespace</SelectItem>
                            <SelectItem value="wix">Wix</SelectItem>
                            <SelectItem value="custom-react">Custom / React</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 4: Current State */}
                <div className="space-y-5">
                  <p className={sectionHeading}>Current Challenges and Access</p>
                  <FormField
                    control={form.control}
                    name="currentChallenges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={label}>Current challenges (select all that apply)</FormLabel>
                        <CheckboxGroup
                          options={CHALLENGE_OPTIONS}
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accessAvailable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={label}>Access currently available (select all that apply)</FormLabel>
                        <CheckboxGroup
                          options={ACCESS_OPTIONS}
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 5: Notes */}
                <div className="space-y-5">
                  <p className={sectionHeading}>Additional Notes</p>
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={label}>Anything else we should know?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Current SEO work, past audits, specific concerns, timeline, or context that would help us prioritize the review."
                            className="min-h-[120px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1F5E95] hover:bg-[#1a5080] text-white h-12 text-base font-semibold rounded-lg mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting…</>
                  ) : (
                    "Submit GEO Audit Request →"
                  )}
                </Button>

                <p className="text-xs text-[#9AAEBB] text-center leading-relaxed">
                  No commitment required. We will follow up within two to three business days with your audit results and a clear next-step recommendation.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
