import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { featureCards } from "../data";

export function LandingPageFeatures() {
  return (
    <section id="features" className="py-16 sm:py-20">
      <div className="max-w-2xl">
        <Badge variant="outline" className="rounded-full px-3 py-1">
          Product highlights
        </Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          A workflow app that is built for operators, not only developers
        </h2>
        <p className="mt-4 text-lg leading-7 text-muted-foreground">
          The codebase already centers around workflows, credentials,
          executions, and AI-enabled nodes. The landing page now reflects that
          core product story.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map(({ title, description, icon: Icon }) => (
          <Card
            key={title}
            className="h-full border-border/70 bg-card/90 py-0 shadow-sm transition-transform duration-200 hover:-translate-y-1"
          >
            <CardContent className="flex h-full flex-col gap-5 p-6">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="leading-7 text-muted-foreground">{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
