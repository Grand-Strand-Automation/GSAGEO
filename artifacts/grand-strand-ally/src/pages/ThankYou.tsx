import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThankYou() {
  return (
    <>
      <Helmet>
        <title>Message Received | Grand Strand Ally</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
    <div className="flex flex-col min-h-[80vh] bg-[#F7F5F1] items-center justify-center pt-20 pb-16 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-7">
          <CheckCircle2 size={30} />
        </div>

        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#0E2F54] mb-4">
          We received your message.
        </h1>
        <p className="text-[#4B5B6B] text-[15px] leading-relaxed mb-3 max-w-sm mx-auto">
          Thank you for reaching out to Grand Strand Ally. We will follow up within one business day.
        </p>
        <p className="text-[#4B5B6B] text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          In the meantime, you are welcome to review our services or learn more about how our pricing works.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold h-11 px-6 text-sm rounded-lg">
            <Link href="/">Return to Homepage</Link>
          </Button>
          <Button asChild variant="outline" className="border-[#D7E1EA] text-[#0E2F54] hover:bg-[#DCEAF7] font-semibold h-11 px-6 text-sm rounded-lg">
            <Link href="/services">View Services</Link>
          </Button>
          <Button asChild variant="outline" className="border-[#D7E1EA] text-[#0E2F54] hover:bg-[#DCEAF7] font-semibold h-11 px-6 text-sm rounded-lg">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>

        <div className="mt-10 pt-8 border-t border-[#D7E1EA]">
          <p className="text-xs text-[#4B5B6B]">
            Have a quick follow-up question?{" "}
            <a href="mailto:hello@gsally.com" className="text-[#1F5E95] hover:text-[#0E2F54] font-medium transition-colors">
              Email us directly
            </a>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
