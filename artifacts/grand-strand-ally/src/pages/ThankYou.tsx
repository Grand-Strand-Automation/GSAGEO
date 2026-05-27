import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThankYou() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center pt-20">
      <div className="max-w-md w-full px-4 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-primary mb-4">Message received!</h1>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          Thanks for reaching out to Grand Strand Ally. We've received your request and will be in touch within 1 business day.
        </p>
        <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 h-14 px-8 w-full sm:w-auto">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
