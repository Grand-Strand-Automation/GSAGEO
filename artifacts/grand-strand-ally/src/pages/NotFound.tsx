import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center pt-20">
      <div className="max-w-md w-full px-4 text-center">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <AlertCircle size={48} />
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-primary mb-4">Page not found</h1>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 h-14 px-8 w-full sm:w-auto">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
