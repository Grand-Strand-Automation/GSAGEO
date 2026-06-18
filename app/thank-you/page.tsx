import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="flex flex-col min-h-[80vh] bg-[#F7F5F1] items-center justify-center pt-20 pb-16 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-7">
          <CheckCircle2 size={30} />
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#0E2F54] mb-4">
          We received your request.
        </h1>
        <p className="text-[#4B5B6B] text-[15px] leading-relaxed mb-3 max-w-sm mx-auto">
          Thank you for submitting your GEO audit request. We will follow up within two to three business days with your results and a clear next-step recommendation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <Link
            href="/"
            className="bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold h-11 px-6 text-sm rounded-lg inline-flex items-center justify-center"
          >
            Return to GEO Home
          </Link>
          <a
            href="mailto:shawn@gsally.com"
            className="border border-[#D7E1EA] text-[#0E2F54] hover:bg-white font-semibold h-11 px-6 text-sm rounded-lg inline-flex items-center justify-center"
          >
            Email us directly
          </a>
        </div>
      </div>
    </div>
  );
}
