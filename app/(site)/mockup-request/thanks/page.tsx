import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { HeroOverlay } from "@/components/HeroOverlay";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Mockup Request Received | Grand Strand Ally",
  description:
    "Thanks for requesting a homepage mockup. We’ll review your details and follow up by email.",
  path: "/mockup-request/thanks",
  index: false,
});

export default function MockupRequestThanksPage() {
  return (
    <div className="flex flex-col min-h-[70vh]">
      <section className="bg-brand-hero text-white pt-28 pb-12 md:pt-32 md:pb-16 relative overflow-hidden">
        <HeroOverlay />
        <div className="container px-4 md:px-6 relative z-10 max-w-2xl text-center mx-auto">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-brand-sky/20 text-brand-sky mb-5">
            <CheckCircle2 size={24} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-4 leading-[1.1]">
            Request received
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            Thanks — we&apos;ll review your website and details, then follow up by email with next
            steps for a custom homepage concept.
          </p>
        </div>
      </section>

      <section className="section-pad bg-brand-cream flex-1">
        <div className="container px-4 md:px-6 max-w-xl text-center">
          <ul className="text-left space-y-3 mb-8 max-w-md mx-auto">
            {[
              "Check your inbox for a confirmation (and spam folder if needed)",
              "We’ll help you choose between a $99 refresh and full redesign",
              "GEO support remains available after your site is stronger",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-brand-muted leading-relaxed">
                <CheckCircle2 size={16} className="text-brand-blue shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <ButtonLink href="/#examples">See Before &amp; After Examples</ButtonLink>
            <ButtonLink href="/#pricing" variant="secondaryLight">
              Explore Design Options
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-brand-muted">
            Prefer to start the $99 refresh now?{" "}
            <Link href="/start?tier=monitor" className="text-brand-blue hover:underline font-medium">
              Begin onboarding
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
