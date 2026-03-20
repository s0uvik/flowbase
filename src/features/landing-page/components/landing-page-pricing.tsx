"use client";

import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscriptions";
import { authClient } from "@/lib/auth-client";
import { pricingPlans } from "../data";

type Props = {
  isAuthenticated: boolean;
};

export function LandingPagePricing({ isAuthenticated }: Props) {
  const { hasActiveSubscription, isLoading } =
    useHasActiveSubscription(isAuthenticated);

  return (
    <section id="pricing" className="py-16 sm:py-20">
      <div className="flex flex-col gap-10">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Pricing
          </Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Start free, then unlock Pro when your workflows outgrow the first
            build
          </h2>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            Flowbase already enforces a simple split in the product: Starter is
            enough for your first workflow, and Pro opens the paid path for more
            workflows plus saved credentials.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="border-border/70 bg-card/90 py-0 shadow-sm">
            <CardContent className="flex h-full flex-col gap-6 p-6 sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                      {pricingPlans[0].name}
                    </p>
                    <p className="mt-2 text-4xl font-semibold">
                      {pricingPlans[0].price}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                    {pricingPlans[0].summary}
                  </div>
                </div>

                <p className="leading-7 text-muted-foreground">
                  {pricingPlans[0].description}
                </p>
              </div>

              <div className="space-y-3">
                {pricingPlans[0].features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-2">
                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link href={isAuthenticated ? "/workflows" : "/signup"}>
                    {isAuthenticated
                      ? "Open Starter Workspace"
                      : "Start for Free"}
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-primary/30 bg-[linear-gradient(180deg,rgba(94,201,134,0.12),rgba(255,255,255,0.98))] py-0 shadow-xl shadow-primary/10">
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
            <CardContent className="relative flex h-full flex-col gap-6 p-6 sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary">
                        {pricingPlans[1].name}
                      </p>
                      <Badge className="rounded-full">Most popular</Badge>
                    </div>
                    <p className="mt-2 text-4xl font-semibold">
                      {pricingPlans[1].price}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-primary/15 bg-background/80 px-3 py-2 text-sm text-muted-foreground">
                    {pricingPlans[1].summary}
                  </div>
                </div>

                <p className="leading-7 text-muted-foreground">
                  {pricingPlans[1].description}
                </p>
              </div>

              <div className="space-y-3">
                {pricingPlans[1].features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
                Starter includes your first workflow. Pro is the upgrade path
                when you need additional workflows and reusable credentials.
              </div>

              <div className="mt-auto pt-2">
                {renderProAction({
                  isAuthenticated,
                  hasActiveSubscription: Boolean(hasActiveSubscription),
                  isLoading,
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function renderProAction({
  isAuthenticated,
  hasActiveSubscription,
  isLoading,
}: {
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  isLoading: boolean;
}) {
  if (!isAuthenticated) {
    return (
      <Button asChild size="lg" className="w-full">
        <Link href="/signup">
          Create Account to Upgrade
          <ArrowRight />
        </Link>
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Button size="lg" className="w-full" disabled>
        Checking subscription...
      </Button>
    );
  }

  if (hasActiveSubscription) {
    return (
      <Button
        size="lg"
        className="w-full"
        onClick={() => authClient.customer.portal()}
      >
        Manage Billing
        <ArrowRight />
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={() => authClient.checkout({ slug: "pro" })}
    >
      Upgrade to Pro
      <ArrowRight />
    </Button>
  );
}
