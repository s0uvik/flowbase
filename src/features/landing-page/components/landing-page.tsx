import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { LandingPageCtaSection } from "./landing-page-cta";
import { LandingPageFeatures } from "./landing-page-features";
import { LandingPageFooter } from "./landing-page-footer";
import { LandingPageHeader } from "./landing-page-header";
import { LandingPageHero } from "./landing-page-hero";
import { LandingPageHowItWorks } from "./landing-page-how-it-works";
import { LandingPageIntegrations } from "./landing-page-integrations";
import { LandingPagePricing } from "./landing-page-pricing";

export async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isAuthenticated = Boolean(session);

  const cta = session
    ? {
        primaryHref: "/workflows",
        primaryLabel: "Open workflows",
        secondaryHref: "/executions",
        secondaryLabel: "View executions",
      }
    : {
        primaryHref: "/signup",
        primaryLabel: "Start building",
        secondaryHref: "/login",
        secondaryLabel: "Sign in",
      };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_left,_rgba(98,188,128,0.26),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(255,151,54,0.2),_transparent_26%),linear-gradient(180deg,_rgba(255,255,255,0.88),_rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-x-0 top-64 -z-10 h-[46rem] bg-[radial-gradient(circle_at_center,_rgba(94,201,134,0.12),_transparent_34%)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <LandingPageHeader cta={cta} />
        <LandingPageHero cta={cta} />
        <LandingPageIntegrations />
        <LandingPageFeatures />
        <LandingPagePricing isAuthenticated={isAuthenticated} />
        <LandingPageHowItWorks />
        <LandingPageCtaSection cta={cta} />
        <LandingPageFooter />
      </div>
    </main>
  );
}
