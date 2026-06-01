import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/lib/site";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Grand Strand Ally</title>
        <meta name="description" content="Privacy policy for Grand Strand Ally (gsally.com). How we collect, use, and protect information submitted through our website." />
        <link rel="canonical" href="https://gsally.com/privacy" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-heading font-bold text-primary mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          
          <h2 className="text-primary font-heading font-bold mt-8 mb-4 text-2xl">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you fill out a contact form, request a quote, or communicate with us. This may include your name, email address, phone number, company name, and details about your IT needs.</p>
          
          <h2 className="text-primary font-heading font-bold mt-8 mb-4 text-2xl">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and respond to your requests. We do not sell your personal information to third parties.</p>
          
          <h2 className="text-primary font-heading font-bold mt-8 mb-4 text-2xl">3. Data Security</h2>
          <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
          
          <h2 className="text-primary font-heading font-bold mt-8 mb-4 text-2xl">4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">{siteConfig.email}</a>.</p>
        </div>
      </div>
    </div>
    </>
  );
}
