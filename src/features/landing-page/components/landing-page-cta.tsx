import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LandingPageCta } from "../types";

type Props = {
  cta: LandingPageCta;
};

export function LandingPageCtaSection({ cta }: Props) {
  return (
    <section className="pb-16 sm:pb-20">
      <div className="rounded-[2rem] border border-primary/15 bg-[linear-gradient(135deg,rgba(94,201,134,0.14),rgba(255,151,54,0.08),rgba(255,255,255,0.96))] p-6 shadow-xl shadow-primary/10 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Badge className="rounded-full px-3 py-1">Ready when you are</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Launch your first workflow, then expand into a real automation
              system
            </h2>
            <p className="mt-4 text-lg leading-7 text-muted-foreground">
              Start with a manual trigger, connect a live webhook next, then add
              AI and team notifications when the flow proves itself.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={cta.primaryHref}>
                {cta.primaryLabel}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={cta.secondaryHref}>{cta.secondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
