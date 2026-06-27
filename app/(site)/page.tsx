import { LandingPage } from "@/components/LandingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { HOME_METADATA } from "@/lib/seo/metadata";
import { homeStructuredData } from "@/lib/seo/structured-data";

export const metadata = HOME_METADATA;

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeStructuredData()} />
      <LandingPage />
    </>
  );
}
