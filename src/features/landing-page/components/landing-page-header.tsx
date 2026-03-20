import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { LandingPageCta } from "../types";

type Props = {
  cta: LandingPageCta;
};

export function LandingPageHeader({ cta }: Props) {
  return (
    <header className="sticky top-0 z-20 -mx-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="hidden sm:block">
            <p className="text-lg font-semibold tracking-[0.22em] uppercase text-primary">
              Flowbase
            </p>
            <p className="text-sm text-foreground/80">
              Visual automation for AI workflows
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="#features" className="transition hover:text-foreground">
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="transition hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="#integrations"
            className="transition hover:text-foreground"
          >
            Integrations
          </Link>
          <Link href="#pricing" className="transition hover:text-foreground">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href={cta.secondaryHref}>{cta.secondaryLabel}</Link>
          </Button>
          <Button asChild>
            <Link href={cta.primaryHref}>
              {cta.primaryLabel}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
