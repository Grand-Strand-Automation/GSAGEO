import { siteConfig } from "@/lib/site";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-heading font-bold text-primary mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          
          <h2 className="text-primary font-heading font-bold mt-8 mb-4 text-2xl">1. Acceptance of Terms</h2>
          <p>By accessing and using the website of {siteConfig.name}, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h2 className="text-primary font-heading font-bold mt-8 mb-4 text-2xl">2. Service Description</h2>
          <p>{siteConfig.name} provides IT support, Microsoft 365 management, network administration, cybersecurity, and automation services to businesses in the {siteConfig.serviceArea} area. Specific deliverables and SLAs are governed by individual service agreements.</p>
          
          <h2 className="text-primary font-heading font-bold mt-8 mb-4 text-2xl">3. No Long-Term Commitment</h2>
          <p>Unless explicitly stated in a signed service agreement, our ongoing support services are provided on a month-to-month basis with no long-term lock-in required.</p>
          
          <h2 className="text-primary font-heading font-bold mt-8 mb-4 text-2xl">4. Limitation of Liability</h2>
          <p>In no event shall {siteConfig.name} be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
        </div>
      </div>
    </div>
  );
}
