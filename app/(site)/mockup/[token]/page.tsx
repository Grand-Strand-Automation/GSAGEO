import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { HeroOverlay } from "@/components/HeroOverlay";

export const metadata: Metadata = {
  title: { absolute: "Instant Preview Unavailable | Grand Strand Ally" },
  robots: { index: false, follow: false },
};

export default async function MockupResultPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  await params;

  return (
    <div className="flex flex-col min-h-[70vh]">
      <section className="bg-brand-hero text-white pt-28 pb-12 md:pt-32 md:pb-16 relative overflow-hidden">
        <HeroOverlay />
        <div className="container px-4 md:px-6 relative z-10 max-w-2xl">
          <div className="eyebrow-pill mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-sky inline-block" />
            Preview update
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-4 leading-[1.1]">
            Instant previews are no longer available
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            We now prepare custom homepage concepts after reviewing your business details — a
            higher-trust process without automated on-page generation.
          </p>
        </div>
      </section>

      <section className="section-pad bg-brand-cream flex-1">
        <div className="container px-4 md:px-6 max-w-xl text-center">
          <p className="text-brand-muted leading-relaxed mb-8">
            Request a homepage mockup with your company name, website, and email. We&apos;ll follow
            up directly and help you choose between a $99 homepage refresh and a full website
            redesign.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <ButtonLink href="/#mockup">Request a Homepage Mockup →</ButtonLink>
            <ButtonLink href="/#examples" variant="secondaryLight">
              See Before &amp; After Examples
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-brand-muted">
            Looking for GEO next?{" "}
            <Link href="/audit" className="text-brand-blue hover:underline font-medium">
              Start a free GEO assessment
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
