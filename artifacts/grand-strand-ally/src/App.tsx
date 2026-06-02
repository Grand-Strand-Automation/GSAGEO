import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Pricing from "@/pages/Pricing";
import Contact from "@/pages/Contact";
import CostAnalysis from "@/pages/CostAnalysis";
import FAQPage from "@/pages/FAQ";
import Process from "@/pages/Process";
import CaseStudies from "@/pages/CaseStudies";
import FreeITCostAnalysis from "@/pages/FreeITCostAnalysis";
import ThankYou from "@/pages/ThankYou";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

// Educational / SEO pages
import HowMuchItSupport from "@/pages/edu/HowMuchItSupport";
import OverlappingTools from "@/pages/edu/OverlappingTools";
import OffboardingChecklist from "@/pages/edu/OffboardingChecklist";
import CostAnalysisGuide from "@/pages/edu/CostAnalysisGuide";

// Service pages
import ManagedITSupport from "@/pages/services/ManagedITSupport";
import NetworkWifiManagement from "@/pages/services/NetworkWifiManagement";
import Microsoft365SupportPage from "@/pages/services/Microsoft365SupportPage";
import ITCostAnalysisPage from "@/pages/services/ITCostAnalysisPage";
import CybersecurityComplianceSupportPage from "@/pages/services/CybersecurityComplianceSupportPage";
import BackupRecoverySupportPage from "@/pages/services/BackupRecoverySupportPage";
import OnboardingOffboardingAutomation from "@/pages/services/OnboardingOffboardingAutomation";

function RedirectTo({ to }: { to: string }) {
  const [, navigate] = useLocation();
  useEffect(() => { navigate(to, { replace: true }); }, [to]);
  return null;
}

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/contact" component={Contact} />
          <Route path="/cost-analysis" component={CostAnalysis} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/process" component={Process} />
          <Route path="/case-studies" component={CaseStudies} />
          <Route path="/free-it-cost-analysis" component={FreeITCostAnalysis} />
          <Route path="/thank-you" component={ThankYou} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />

          {/* Educational pages */}
          <Route path="/how-much-should-a-small-business-spend-on-it-support" component={HowMuchItSupport} />
          <Route path="/how-to-find-overlapping-it-tools-and-vendors" component={OverlappingTools} />
          <Route path="/small-business-offboarding-checklist" component={OffboardingChecklist} />
          <Route path="/what-an-it-cost-analysis-should-include" component={CostAnalysisGuide} />

          {/* Service pages */}
          <Route path="/managed-it-support-myrtle-beach" component={ManagedITSupport} />
          <Route path="/microsoft-365-support-myrtle-beach" component={() => <RedirectTo to="/microsoft-365-support" />} />
          <Route path="/network-wifi-management-myrtle-beach" component={NetworkWifiManagement} />
          <Route path="/cybersecurity-support-myrtle-beach" component={() => <RedirectTo to="/cybersecurity-compliance-support" />} />
          <Route path="/backup-and-recovery-myrtle-beach" component={() => <RedirectTo to="/backup-recovery-support" />} />
          <Route path="/employee-onboarding-offboarding-it" component={() => <RedirectTo to="/onboarding-offboarding-automation" />} />
          <Route path="/microsoft-365-support" component={Microsoft365SupportPage} />
          <Route path="/it-cost-analysis" component={ITCostAnalysisPage} />
          <Route path="/cybersecurity-compliance-support" component={CybersecurityComplianceSupportPage} />
          <Route path="/backup-recovery-support" component={BackupRecoverySupportPage} />
          <Route path="/onboarding-offboarding-automation" component={OnboardingOffboardingAutomation} />

          <Route component={NotFound} />
        </Switch>
      </main>
      <SiteFooter />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
