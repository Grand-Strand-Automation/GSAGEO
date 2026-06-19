import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="flex flex-col min-h-[80vh] bg-brand-cream items-center justify-center pt-20 pb-16 px-4">
      <div className="max-w-lg w-full text-center card-brand p-10 shadow-card-md">
        <div className="w-16 h-16 bg-brand-blue-light text-brand-blue rounded-full flex items-center justify-center mx-auto mb-7">
          <CheckCircle2 size={30} />
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-brand-navy mb-4">
          We received your request.
        </h1>
        <p className="text-brand-muted text-[15px] leading-relaxed mb-3 max-w-sm mx-auto">
          Thank you for submitting your GEO audit request. We will follow up within two to three
          business days with your results and a clear next-step recommendation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <ButtonLink href="/" size="md">
            Return to GEO Home
          </ButtonLink>
          <ButtonLink href="mailto:shawn@gsally.com" variant="secondaryLight" size="md">
            Email us directly
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
